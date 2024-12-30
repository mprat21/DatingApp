import { Component, inject, OnInit } from '@angular/core';
import { Member } from '../../_models/member';
import { MembersService } from '../../_services/members.service';
import { MemberCardComponent } from "../member-card/member-card.component";
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AccountService } from '../../_services/account.service';
import { UserParams } from '../../_models/userParams';
import { FormsModule } from '@angular/forms';
//step1: import the buttonsModule
import { ButtonsModule } from 'ngx-bootstrap/buttons';


@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent, PaginationModule, FormsModule, ButtonsModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {
  memberService = inject(MembersService);

  //gender array is added
  genderList = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Females' }];

  //to reset the filters and show the members again
  resetFilters() {
    this.memberService.resetUserParams();
    this.loadMembers();
  }

  pageChanged(event: any) {

    //we check here if the user selected page num is not the previous page it was only then change
    if (this.memberService.userParams().pageNumber !== event.page) {
      this.memberService.userParams().pageNumber = event.page;
      this.loadMembers();
    }
  }

  ngOnInit(): void {
    if (!this.memberService.paginatedResult()) //we will load members when the signal has no data
      this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers(); //we call the getMembers and pass the values
  }

}
