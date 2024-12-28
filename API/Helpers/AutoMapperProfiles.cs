using System;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AppUser, MemberDto>()
        .ForMember(d => d.Age, o => o.MapFrom(s => s.DateOfBirth.CalculateAge()))
        .ForMember(d => d.PhotoUrl, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain)!.Url));

        CreateMap<Photo, PhotoDto>();
        CreateMap<MemberUpdateDto, AppUser>();
        CreateMap<RegisterDto, AppUser>();    // we pass this to copy registerdto fields into apuser
        CreateMap<String, DateOnly>().ConvertUsing(s => DateOnly.Parse(s)); //we pass this to convert & copy string to date type

    }
}
