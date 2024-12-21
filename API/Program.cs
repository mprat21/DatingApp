using API.Extensions;
using API.Middleware;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
ApplicationServiceExtensions.AddApplicationServices(builder.Services, builder.Configuration);
IdentityServiceExtension.AddIdentityServices(builder.Services, builder.Configuration);
var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();
// Configure the HTTP request pipeline.
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200", "https://localhost:4200"));
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
