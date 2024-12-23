import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  baseURl = environment.apiUrl;

  getMembers() {
    return this.http.get<Member[]>(this.baseURl + 'users');
  }

  getMember(username: string) {
    return this.http.get<Member>(this.baseURl + 'users/' + username);
  }
}
