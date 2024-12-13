using System;
using System.ComponentModel.DataAnnotations;

namespace API;

public class RegisterDto
{
    [Required]
    [MaxLength(100)]     // both required annotation in [] and required keyword does same thing
    public required string Username { get; set; }

    [Required]
    public required string Password { get; set; }

}
