import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal,  NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AttendeeService } from '../attendee.service';
import { Observable, Subscription } from 'rxjs';
import { Attendee } from '../attendee.model';




@Component({
  selector: 'app-attendee-list',
  templateUrl: './attendee-list.component.html',
  styleUrls: ['./attendee-list.component.scss'],
})
export class AttendeeListComponent implements OnInit, OnDestroy {

  attendeeList : Attendee[] = [];
  attendeeListListener : Subscription;
  modeEdit : boolean; // true if we are editing false if creating
  currentAttendee: Attendee = null;
  currentAttendeeId;
  formAttendee : FormGroup;
  private modal : NgbModalRef;
  private modaldelete : NgbModalRef;

  constructor(private modalService: NgbModal, private attendeeService: AttendeeService) {
  }


  ngOnInit(): void {
    this.modeEdit = false;
    this.formAttendee = new FormGroup({
      'email': new FormControl(null, {validators:[ Validators.required, Validators.email]}),
      'nom': new FormControl(null, {validators:[ Validators.required, ]}),
      'prenom': new FormControl(null, {validators:[ Validators.required, ]}),
      'occupation': new FormControl(null, {validators:[ ]}),
    });

    this.attendeeList = this.attendeeService.getAttendeeList();
   this.attendeeListListener =
      this.attendeeService.updateAttendeeList()
        .subscribe(attendeeList => {
          this.attendeeList = attendeeList;
    });
  }

  open(content, mode, selcetedAttendee) {
    if( mode ==='create'){
      this.modeEdit = false;
      this.modal = this.modalService.open(content);

    }else {
      this.modeEdit = true;
      this.currentAttendee = selcetedAttendee;
      this.modal = this.modalService.open(content);
      this.formAttendee.setValue({
        email : selcetedAttendee.email,
        nom : selcetedAttendee.nom,
        prenom : selcetedAttendee.prenom,
        occupation : selcetedAttendee.occupation,
      });
    }

  }

  openDelete(content, id) {
    this.currentAttendeeId = id;
    this.modaldelete = this.modalService.open(content);

  }

  onSave(){
    if (this.formAttendee.invalid){
      return;
    }
    this.modal.close();

    if(!this.modeEdit){
      let attendee = {
        id :null,
        email: this.formAttendee.value.email,
        nom: this.formAttendee.value.nom,
        prenom: this.formAttendee.value.prenom,
        occupation: this.formAttendee.value.occupation,
      }
      this.attendeeService.addAttendee(attendee);
    }else{
      let attendee = {
        id :this.currentAttendee.id,
        email: this.formAttendee.value.email,
        nom: this.formAttendee.value.nom,
        prenom: this.formAttendee.value.prenom,
        occupation: this.formAttendee.value.occupation,
      }
      this.attendeeService.editAttendee(attendee);
      this.modeEdit = false;
    }

    this.formAttendee.reset();

  }

  onDelete() {
    this.attendeeService.deleteAttendee(this.currentAttendeeId);
  }

  ngOnDestroy(): void {
    this.attendeeListListener.unsubscribe();
  }

}

