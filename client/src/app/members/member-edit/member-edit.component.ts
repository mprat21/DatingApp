import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { MembersService } from '../../_services/members.service';
import { Member } from '../../_models/member';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PhotoEditorComponent } from "../photo-editor/photo-editor.component";

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [TabsModule, FormsModule, PhotoEditorComponent],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {


  /*  Step4: to access the form id from html, as it is child of ts we use @ViewChild decorator and get the id of it using('formid')
 and later add a variable say editForm of type NgForm and set it optional as it wont have value initially when component is loaded 
 
  */
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: any) {
    if (this.editForm?.dirty)
      $event.returnValue = true;
  }
  private accountService = inject(AccountService);
  private memberService = inject(MembersService);
  private toast = inject(ToastrService);
  member?: Member;

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    const user = this.accountService.currentUser();
    if (!user) return;
    this.memberService.getMember(user.username).subscribe({
      next: member => this.member = member
    })
  }


  /*  Step 6: We will define an updateMember method where we will for now show the profile is updated and in the end 
   reset the edit from to the currently set or updated values of members 
   This means that button will be disabled again after update is complete. Similarly we will hide the Info alert as when changed
   */
  updateMember() {
    this.memberService.updateMember(this.editForm?.value).subscribe(
      {
        next: _ => {
          this.toast.success("Profile updated successfully");
          this.editForm?.reset(this.member);
        }
      }
    )

  }


  //step7: of photo upload - we define a method here i.e when member changes, assign it to member
  OnMemberChange(event:Member)
  {
    this.member=event;
  }



}
