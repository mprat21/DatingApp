
using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;

namespace API.Controllers;

[Authorize]
public class UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery] UserParams userParams) //added userparams for passing query for page
    {
        userParams.CurrentUsername = User.GetUsername(); //we add code to set current username in userparam
        var users = await userRepository.GetMembersAsync(userParams);
        Response.AddPaginationHeader(users);//we add pagination header and pass users to it to have the pagination for it
        return Ok(users);
    }


    [HttpGet("{username}")]
    public async Task<ActionResult<MemberDto>> GetUser(string username)
    {
        var user = await userRepository.GetMemberAsync(username);

        if (user == null) return NotFound();
        return user;
    }


    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
    {

        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("No user found with the username");

        mapper.Map(memberUpdateDto, user);

        if (await userRepository.SaveAllAsync())
            return NoContent();

        return BadRequest("Failed to update the user");
    }

    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("No user found with the username");

        var result = await photoService.AddPhotoAsync(file);
        if (result.Error != null) return BadRequest(result.Error.Message);

        var photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId

        };
        if (user.Photos.Count == 0) photo.IsMain = true; // step11: if there are no photos and user is going to add a photo, make it teh main photo

        user.Photos.Add(photo);
        if (await userRepository.SaveAllAsync())
            //return mapper.Map<PhotoDto>(photo);
            return CreatedAtAction(nameof(GetUser), new { username = user.UserName }, mapper.Map<PhotoDto>(photo));

        //this returns 201 response and along with it header of location say https://localhost:5001/api/User/lisa is added

        return BadRequest("Problem adding photos");

    }

    [HttpPut("set-main-photo/{photoId:int}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");
        var photo = user.Photos.FirstOrDefault(x => x.Id == photoId); //here we find photos that has id provided in param and that object is stored on LHS
        if (photo == null || photo.IsMain) return BadRequest("Cannot user this as main photo"); //check if it is null or already main
        var currentMain = user.Photos.FirstOrDefault(x => x.IsMain); //look for current main and store it on LHS
        if (currentMain != null) //if current main photo is retrived we set main to false as we want to set some other as main
            currentMain.IsMain = false;
        photo.IsMain = true;   //set the other one that is requested as main
        if (await userRepository.SaveAllAsync()) return NoContent();  //save changes in db and return no content

        return BadRequest("Cannot set main photo");
    }

    [HttpDelete("delete-photo/{photoId:int}")]
    public async Task<ActionResult> DeletePhoto(int photoId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername()); //retrieve user object
        if (user == null) return BadRequest("user not found");
        var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);   //get photo what requester has asked to be deleted if id matches to the one in db
        if (photo == null || photo.IsMain) return BadRequest("This photo cannot be deleted"); //cant delete main photo
        if (photo.PublicId != null) //if photo has public id means its present in cloudinary
        {
            var result = await photoService.DeletePhotoAsync(photo.PublicId); //try deleting it from cloudinary
            if (result.Error != null) return BadRequest(result.Error.Message);
        }
        user.Photos.Remove(photo); //remove it from db
        if (await userRepository.SaveAllAsync()) return Ok(); //save db changes
        return BadRequest("Probelem deleting photo");
    }

}
