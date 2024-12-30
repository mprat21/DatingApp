using System;

namespace API.Helpers;

public class UserParams
{
    //in this we will define the max allowed pagenumber, items per page etc and let the client choose what they want within it.

    private const int MaxPageSize = 50;
    public int PageNumber { get; set; } = 1;
    private int _pageSize = 10;

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        //this means MaxPageSize is the max allowed entries to be displayed, min based on what user has selected
    }

    public string? Gender { get; set; }
    public string? CurrentUsername { get; set; }

    public int MinAge { get; set; } = 18;
    public int MaxAge { get; set; } = 100;
    public string OrderBy { get; set; } = "lastActive"; //so we will order by last active as default otherwise order by newest members



}
