using System;
using System.Data;
using API.Helpers;
using API.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace API.Services;

public class PhotoService : IPhotoService
{
    private readonly Cloudinary _Cloudinary;        //create a reference of Cloudinary


//created a constructor and passed IOptions with Cloudinary settings
    public PhotoService(IOptions<CloudinarySettings> config)
    {
        //created reference of account and passed cloudname, apikey,apisecret
        var acc=new Account(config.Value.CloudName,config.Value.ApiKey, config.Value.ApiSecret);
        _Cloudinary=new Cloudinary(acc);  //pass account to cloudinary
          
    }
    public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file)//method to add photo
    {
        var uploadResult = new ImageUploadResult();   //create uploadResult that is to be returned in the end
        if(file.Length>0)
        {
            using var stream=file.OpenReadStream();     //first read file if not empty
            var uploadParams=new ImageUploadParams
            {       
                // image upload params object created and we add three things, 
                //file description where we pass filename and stream, Transformation-height,width,crop and face select is added
                //last param is folder name
                File =new FileDescription(file.FileName,stream),
                Transformation=new Transformation()
                    .Height(500).Width(500).Crop("fill").Gravity("face"),
                Folder="da-net8"
            };
            uploadResult=await _Cloudinary.UploadAsync(uploadParams);//then we pass this params for upload in cloudinary
        }

        return uploadResult;
    }

    public async Task<DeletionResult> DeletePhotoAsync(string publicId) //method to delete photo based on publicId
    {
        var deletParams=new DeletionParams(publicId); //we create deletion params object and pass public id
        return await _Cloudinary.DestroyAsync(deletParams); //later we delete image in cloudinary
    }
}
