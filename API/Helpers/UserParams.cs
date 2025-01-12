using System;

namespace API.Helpers;

public class UserParams: PaginationParams
{
    //in this we will define the max allowed pagenumber, items per page etc and let the client choose what they want within it.

    public string? Gender { get; set; }
    public string? CurrentUsername { get; set; }

    public int MinAge { get; set; } = 18;
    public int MaxAge { get; set; } = 100;
    public string OrderBy { get; set; } = "lastActive"; //so we will order by last active as default otherwise order by newest members



}
