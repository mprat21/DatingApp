using System;
using API.Data;
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
        services.AddCors();
        services.AddScoped<ITokenService, TokenService>();      // 3 types of lifetime of service: AddSingleton() - once created and applies same instance , AddTransient() - created each time when requested, AddScoped() - created once per client request
        services.AddScoped<IUserRepository, UserRepository>();  //Added for repository User
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        return services;
    }

}