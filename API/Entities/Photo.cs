using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("Photos")]
public class Photo
{
    public int Id { get; set; }
    public required string Url { get; set; }
    public bool IsMain { get; set; }
    public string? PublicId { get; set; }


    //Navigation Properties --- this is how you set up required one to many relationships
    public int AppUserId { get; set; }
    public AppUser AppUser { get; set; } = null!;  // Set null forgiving operator which will set nullable to false
}