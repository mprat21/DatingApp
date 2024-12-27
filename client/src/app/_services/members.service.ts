import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../_models/member';
import { of, tap } from 'rxjs';
import { Photo } from '../_models/photo';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  baseURl = environment.apiUrl;
  members = signal<Member[]>([]);

  getMembers() {
    return this.http.get<Member[]>(this.baseURl + 'users').subscribe({
      next: members => {
        this.members.set(members)          //we will store the members so the state is stored
      }
    })
  }

  getMember(username: string) {

    //to get store the state for objects based on username we will find first if the member exists using find and 
    // then if its not undefined we will return as observable using of(member) 

    const member = this.members().find(x => (x.userName === username));

    if (member !== undefined)
      return of(member);

    return this.http.get<Member>(this.baseURl + 'users/' + username);
  }


  //here we add the pipe as we work on observables and then using tap which is RxJS operator 
  // we can use it if we want to use a side effect with our observable, but we don't want to change or transform its value in any way, 
  // as we can use the tap from RxJS. Then we make use of update method and then .map helps to iterate over and modify the one that is changed based on username
  updateMember(member: Member) {
    return this.http.put(this.baseURl + 'users', member)
      .pipe(
        tap(() => {
          this.members.update(mem => mem.map(m => m.userName === member.userName ? member : m))
        })
      )
  }

  deletePhoto(photo: Photo) {
    return this.http.delete(this.baseURl + 'users/delete-photo/' + photo.id).pipe(
      tap(() => {
        this.members.update(mem => mem.map(m => {
          if (m.photos.includes(photo)) { //includes checks if array has the photo in it
           m.photos = m.photos.filter(x => x.id !== photo.id)  
            //filter method just keeps the remaining photos that must be 
            // there in the array and updates and returns the member accordingly so the one photo to be deleted is excluded
          }
          return m;
        }))
      })
    )
  }


  setMainPhoto(photo: Photo) {
    /* setMainPhoto
    Update the Member's Data Locally:
    
    It updates the members array to reflect the change as array is shown when you click on other components, so the array here must also be updated.
    Here's what happens:
    It goes through the members array.
    For each member(m), it checks if the new photo is part of that member's photos.
    If it is, it sets that photo's url as the member's main photoUrl.
    UI Updates:
    
    By updating the photoUrl of the relevant member, the application ensures that the user's main photo is updated on the screen without 
    needing a full refresh.
    In short, this function communicates the new main photo to the server and updates the app's state to show the new photo immediately.
    
     */
    return this.http.put(this.baseURl + 'users/set-main-photo/' + photo.id, {}).pipe(
      tap(() => {
        this.members.update(mem => mem.map(m => {
          if (m.photos.includes(photo)) {
            m.photoUrl = photo.url
          }
          return m;
        }))
      }
      )
    )
  }



}