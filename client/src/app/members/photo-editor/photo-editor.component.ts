import { Component, inject, input, OnInit, output } from '@angular/core';
import { Member } from '../../_models/member';
import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { AccountService } from '../../_services/account.service';
import { environment } from '../../../environments/environment';
import { Photo } from '../../_models/photo';
import { MembersService } from '../../_services/members.service';

@Component({
  selector: 'app-photo-editor',
  standalone: true,

  //Step1: for file upload, import below things
  imports: [NgIf, NgFor, NgStyle, NgClass, FileUploadModule, DecimalPipe],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent implements OnInit {
  private accountService = inject(AccountService); //step2:  we need token from user hence we add accountservice

  private memberService = inject(MembersService);
  uploader?: FileUploader; //uploader for file uploads
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  member = input.required<Member>();
  memberChange = output<Member>();

  ngOnInit(): void {

    //step 9:  call initializer method

    this.initializeUploader();

  }

  deletePhoto(photo: Photo) {
    this.memberService.deletePhoto(photo).subscribe({
      next: _ => {
        const updatedMember = { ...this.member() };
        updatedMember.photos = updatedMember.photos.filter(p => p.id !== photo.id)
        this.memberChange.emit(updatedMember);
      }
    })
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({ //when user selects a photo as main, 
      // the request is sent to service which calls endpoint and we get a member in return whose url is set to url in photos
      //so current member has the url updated in the array that is stored
      next: _ => {
        const user = this.accountService.currentUser();
        if (user) {
          user.photoUrl = photo.url;  // so we pass the currently selected url as current photo url of user for immediate effect
          this.accountService.setCurrentUser(user); //then set it as current user so its set at account service level in nav bar
        }
        const updatedUser = { ...this.member() };  //we copy all things from current member into a variable
        updatedUser.photoUrl = photo.url;  //do changes in photo url of user for this new variable
        updatedUser.photos.forEach(p => { //however photo is itself an entity inside user entity, we have iterate and check
          // which id of photos in array matches to one user selected if match is found then set main prop to true

          if (p.isMain) p.isMain = false;
          if (p.id === photo.id) p.isMain = true;
        });

        this.memberChange.emit(updatedUser); //then we pass to child component 

      }
    })

  }

  //step3: create the method that takes event which checks and returns true or false based on file if being uploaded
  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }


  //Step4: initilising  uploader
  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + "users/add-photo",//calling api
      authToken: 'Bearer ' + this.accountService.currentUser()?.token,//passing token as auth is needed
      allowedFileType: ['image'], // only images are allowed
      isHTML5: true,
      removeAfterUpload: true,
      autoUpload: false,//user should select button for upload
      maxFileSize: 10 * 1024 * 1024//max size set here is 10 MB
    })
    this.uploader.onAfterAddingFile = (file) => {//A callback that is invoked after a file is added to the uploader's queue.
      file.withCredentials = false
    }//Step5: in event after adding file, we disable file with credentials


    //Step6: on success of item  being uploaded, we receive the item, response 
    this.uploader.onSuccessItem = (item, response, status, header) => {
      const photo = JSON.parse(response);
      //{ ...this.member() }: The spread operator (...) copies all enumerable own properties of the object returned by this.member() into a new object. 

      const updatedMember = { ...this.member() };       // This ensures that updatedMember is a new object and not a reference to the original.

      updatedMember.photos.push(photo);
      this.memberChange.emit(updatedMember);

      //for step7: because we want original member component to be updated, we must update the parent component which will eventually update child component
    }
  }

}
