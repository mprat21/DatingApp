using System;
using System.Security.Claims;

namespace API.Extensions;

public static class ClaimsPrincipleExtensions
{

    public static string GetUsername(this ClaimsPrincipal user)
    {
        var username = user.FindFirstValue(ClaimTypes.Name)
        ?? throw new Exception("Cannot get username from the token");

        return username;
    }

    //this method would return the userId needed 
    public static int GetUserId(this ClaimsPrincipal user)
    {

        //we first parse the value to int and then return
        var userId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new Exception("Cannot get username from the token"));

        return userId;
    }
}
