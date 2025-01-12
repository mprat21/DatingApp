using System;

namespace API.Helpers;

public class LikesParams : PaginationParams
{
    public int Userid { get; set; }
    public required string Predicate { get; set; } = "liked";

}
