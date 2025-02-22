import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../_models/user';
import { LikesService } from './likes.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private likeService = inject(LikesService); //step2: inject like service
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null)

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user); //called setuser
        }
      }
      )
    )
  }


  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);  //called setuser
        }
        return user;
      }
      )
    )
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
    this.likeService.getLikesId();//step3: set the like ids in current user 
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
