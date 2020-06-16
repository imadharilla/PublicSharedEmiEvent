import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Attendee } from './attendee.model';
import { environment } from "../../environments/environment"
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl + '/attendee/'
// const BACKEND_URL = '/api/attendee/'


@Injectable()
export class AttendeeService {

  private attendeeList : Attendee[] = [];
  private attendeeListUpdated = new Subject<Attendee[]>();

  constructor(private http : HttpClient,private router : Router) { }

  getAttendeeList() {
    let requests = this.http.get<{attendeeList:any[], message}>(BACKEND_URL).subscribe(result=>{
      this.attendeeList = [];
      result.attendeeList.map(attendee=>{
        this.attendeeList.push({
          id: attendee._id,
          email : attendee.email,
          nom : attendee.nom,
          prenom : attendee.prenom,
          occupation : attendee.occupation,
          detection : attendee.detection,
          imagePath : attendee.imagePath
        })
      })
      this.attendeeListUpdated.next([...this.attendeeList]);
    })
    return [...this.attendeeList] ;

  }

  addAttendee(attendee) {
    this.http.post<{message:string, attendee:any}>(BACKEND_URL, attendee ).subscribe(response => {
      this.getAttendeeList()
    })
  }

  editAttendee(attendee) {
    this.http.put(BACKEND_URL, attendee).subscribe(response => {
      this.getAttendeeList();
    })
  }

  updateAttendeeList(){
    return this.attendeeListUpdated.asObservable();
  }

  deleteAttendee(id) {
    this.http.delete(BACKEND_URL + id).subscribe(()=>{
      this.getAttendeeList();
    })
  }

}
