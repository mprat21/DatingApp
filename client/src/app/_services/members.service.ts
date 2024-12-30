import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Member } from '../_models/member';
import { of, tap } from 'rxjs';
import { Photo } from '../_models/photo';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  baseURl = environment.apiUrl;
  memberCache = new Map();
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);

  //step1: use account service and get current user 
  private accountService = inject(AccountService);
  user = this.accountService.currentUser();

  //step2: then we create userparam a signal of type userparams and then pass current user object to it
  userParams = signal<UserParams>(new UserParams(this.user))


  //step3: we now create a new method to reset userParams 
  resetUserParams() {
    this.userParams.set(new UserParams(this.user));
  }



  private setPaginatedResponse(response: HttpResponse<Member[]>) {
    this.paginatedResult.set({
      items: response.body as Member[],
      pagination: JSON.parse(response.headers.get('Pagination')!)
    })
  }

  getMembers() {
    const response = this.memberCache.get(Object.values(this.userParams()).join('-'))

    if (response) return this.setPaginatedResponse(response); //if memberCache is already having members then just return those values

    let params = this.setPaginationHeaders(this.userParams().pageNumber, this.userParams().pageSize);
    params = params.append('minAge', this.userParams().minAge);
    params = params.append('maxAge', this.userParams().maxAge);
    params = params.append('gender', this.userParams().gender);
    params = params.append('orderBy', this.userParams().orderBy); //added this to order by last active or latest created

    return this.http.get<Member[]>(this.baseURl + 'users', { observe: 'response', params }).subscribe({
      next: response => {
        this.setPaginatedResponse(response);
        this.memberCache.set(Object.values(this.userParams()).join('-'), response);
        //we are setting the cache so when we move back and forth we dont need to call API
      }
    })
  }


  private setPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    //here we are creating query params to pass pagenumber and pasgesize

    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }
    return params;
  }




  //so first we shallow copy members.values in array and then with help of reduce just try making an array within array to flat array kind of
  // so second array say elem's body will concat first array arr on empty array and then we iterate over 
  // and find member whose username matches to what username is passed
  getMember(username: string) {

    const member: Member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.body), [])
      .find((m: Member) => m.userName === username);
    if (member) return of(member);
    return this.http.get<Member>(this.baseURl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseURl + 'users', member)
      .pipe(
      /* tap(() => {
        this.members.update(mem => mem.map(m => m.userName === member.userName ? member : m))
      })*/
    )
  }

  deletePhoto(photo: Photo) {
    return this.http.delete(this.baseURl + 'users/delete-photo/' + photo.id).pipe(
      /*  tap(() => {
         this.members.update(mem => mem.map(m => {
           if (m.photos.includes(photo)) { //includes checks if array has the photo in it
            m.photos = m.photos.filter(x => x.id !== photo.id)  
             //filter method just keeps the remaining photos that must be 
             // there in the array and updates and returns the member accordingly so the one photo to be deleted is excluded
           }
           return m;
         }))
       }) */
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
      /* tap(() => {
        this.members.update(mem => mem.map(m => {
          if (m.photos.includes(photo)) {
            m.photoUrl = photo.url
          }
          return m;
        }))
      }
      ) */
    )
  }



}