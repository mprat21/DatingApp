using System;
using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddControllers();
        services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            }
        );
        services.AddScoped<ITokenService, TokenService>();      
        services.AddScoped<IUserRepository, UserRepository>(); 
        services.AddScoped<IPhotoService, PhotoService>(); 
        services.AddScoped<ILikesRepository, LikesRepository>(); //added likes repo
        services.AddScoped<LogUserActivity>();
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings")); //add this to get the configs from appsettings.json
        services.AddCors();

        return services;
    }

}