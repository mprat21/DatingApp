import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { Member } from '../../_models/member';
import { ActivatedRoute } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule],   //needed to add GalleryModule for accessing ngx Image gallery
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit {
  private memberService = inject(MembersService);    //needed to call get members by username method
  private route = inject(ActivatedRoute);    //needed to get the username which is currently logged in from path
  member?: Member;
  images: GalleryItem[] = [];   //Add array for images to be stored


  ngOnInit(): void {
    this.loadMember(); //load member method is called in oninit so the profile should be displayed as soon as when this component is called

  }


  loadMember() {
    const username = this.route.snapshot.paramMap.get('username'); //first we get username from route
    if (!username) return;                                   //then we check if member exists or not
    this.memberService.getMember(username).subscribe({         //then we call getmember by username method and pass username to it
      next: member => {
        this.member = member;                    //the member object is assigned to member object having all properties
        this.member.photos.map(p => {
          this.images.push(
            new ImageItem({ src: p.url, thumb: p.url }))
        });
      }
    })

  }
}
