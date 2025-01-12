using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<AppUser> Users { get; set; }

    public DbSet<UserLike> Likes { get; set; }


    //we need to tell entity framework the configuration we have and how the table should be created, so we do it here
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<UserLike>()
        .HasKey(k => new { k.SourceUserId, k.TargetUserId });


        // with this we will inform our entity service, what kind of tables are to be created
        builder.Entity<UserLike>()  //say us as user X
        .HasOne(s => s.SourceUser)
        .WithMany(l => l.LikedUsers) // storing the user we liked
        .HasForeignKey(s => s.SourceUserId)
        .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<UserLike>()
       .HasOne(s => s.TargetUser)    // say user Y
       .WithMany(l => l.LikedByUsers) //different users liking us
       .HasForeignKey(s => s.TargetUserId)
       .OnDelete(DeleteBehavior.Cascade); //in sql server we use NoAction instead of Cascade
    }
}
