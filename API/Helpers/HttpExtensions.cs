using System;
using System.Text.Json;

namespace API.Helpers;

public static class HttpExtensions
{

    //extension method for httpresponse
    public static void AddPaginationHeader<T>(this HttpResponse response, PagedList<T> data)
    {
        var paginationHeader = new PaginationHeader(data.CurrentPage, data.PageSize, data.TotalCount, data.TotalPages);

        var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        /* Now, even though we'll be using this calling pagination in header inside a controller, what we're doing here is going to happen
        outside the context of a controller.So we can't rely on the API controller to serialize the data in CamelCase, just as it would do for
any other HTTP response. We need to instruct it or define this inside here, because we don't have the API controller functionality
where we're working on this code here. So we're going to make sure our response is in CamelCase because we want to return it as JSON. */

        response.Headers.Append("Pagination", JsonSerializer.Serialize(paginationHeader, jsonOptions));

        //now we pass the key as Pagination to Append function and then another param as Serialize paginationHeader with json Options
        //However we need another Headers as bydefault the client has no access to headerand hence we will have to 
        //explicitly give access to client to Cors header. Remember to put case exactly same as mentioned.
        response.Headers.Append("Access-Control-Expose-Headers", "Pagination");
    }

}


