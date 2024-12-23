using System;
using System.Collections.Generic;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
[Authorize]
public class UsersController(IUserRepository userRepository) : BaseApiController //Removed IMApper which is interface of Automapper as we use methods in userRepository
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
    {
        // var users = await userRepository.GetUsersAsync();
        var users = await userRepository.GetMembersAsync();
        //var usersToReturn = mapper.Map<IEnumerable<MemberDto>>(users); //Added this so we make use of this mapper.map and set type the target object and pass the previous object to be converted to it
        return Ok(users);
    }
    [HttpGet("{username}")]
    public async Task<ActionResult<MemberDto>> GetUser(string username)
    {
        //  var user = await userRepository.GetUserByUsernameAsync(username);
        var user = await userRepository.GetMemberAsync(username);

        if (user == null) return NotFound();
        //return mapper.Map<MemberDto>(user); //Added this so we make use of this mapper.map and set type the target object and pass the previous object to be converted to it
        return user;
    }


}
