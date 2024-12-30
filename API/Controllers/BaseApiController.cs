using System;
using API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ServiceFilter(typeof(LogUserActivity))] //added so this monitors user activity and updates the field last active in db
[ApiController]
[Route("api/[controller]")]
public class BaseApiController : ControllerBase
{

}
