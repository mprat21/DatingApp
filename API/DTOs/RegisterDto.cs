using System;
using System.ComponentModel.DataAnnotations;

namespace API;

public class RegisterDto
{
    [Required]
    [MaxLength(100)]     // both required annotation in [] and required keyword does same thing
    public string Username { get; set; } = String.Empty;

    [Required]
    [StringLength(8, MinimumLength = 4)]
    public string Password { get; set; } = String.Empty;

}
