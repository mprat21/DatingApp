import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../_models/member';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../_services/likes.service';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'

})
export class MemberCardComponent {
  private likeService = inject(LikesService); //Step5: injecting like service
  member = input.required<Member>()
  hasLiked = computed(() => this.likeService.likeIds().includes(this.member().id));   //step6: idea here is to show heart sign on member who current user has liked

  toggleLike() {
     this.likeService.toggleLike(this.member().id).subscribe({   //we call method from like service
      next: () => {

        if (this.hasLiked()) { //if has liked is set we have to unset the like id in array and vise versa
          this.likeService.likeIds.update(ids =>ids.filter(x => x !== this.member().id));
        }
        else{
          this.likeService.likeIds.update(ids=> [...ids, this.member().id]);
        }
      }

    })
  }
}
