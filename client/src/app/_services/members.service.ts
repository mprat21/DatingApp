import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../_models/member';
import { of, tap } from 'rxjs';


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


}