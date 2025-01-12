using System;

namespace API.Entities;


//create a entity class that will have reference of source user and taget user and
// we store the communication i.e. likes in a list in appuser
public class UserLike
{
    public AppUser SourceUser { get; set; } = null!;
    public int SourceUserId { get; set; }
    public AppUser TargetUser { get; set; } = null!;

    public int TargetUserId { get; set; }


}
