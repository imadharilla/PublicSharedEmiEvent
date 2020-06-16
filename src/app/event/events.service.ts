import { MyEvent} from './event.model'
import { Subject } from 'rxjs';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment"

const BACKEND_URL = environment.apiUrl + '/events/'
const BACKEND_URL_invite = environment.apiUrl + '/invitation/'
//const BACKEND_URL = '/api/events/'
//const BACKEND_URL_invite = 'api/invitation/'
@Injectable()
export class EventsService {

  private events : MyEvent[] = [];

  private eventsUpdated = new Subject<{events :MyEvent[] ,  maxEvents:number}>();


  constructor(private http : HttpClient, private router : Router){

  }
  getPosts(eventsPerPage:number, currentPage: number) {

    const queryParams = `?pagesize=${eventsPerPage} &page=${currentPage}`;
    this.http.get<{message, events: any[] , maxEvents:number} >(  BACKEND_URL + queryParams)
    .pipe(map((eventData) => {
      return {events : eventData.events.map(event => {
        return {
          id : event._id,
          title: event.title,
          imageUrl : event.imagePath,
          description : event.description,
          startDate : event.startDate,
          endDate : event.endDate,
          location : event.location,
          attendeelist : event.attendeeList,
          invitations : event.invitations
        };
      })
      , maxEvents : eventData.maxEvents
      };
    }))
    .subscribe((transformedEvent) => {
      try {
        this.events = transformedEvent.events;
        this.eventsUpdated.next({events : [...this.events] , maxEvents: transformedEvent.maxEvents});
      } catch (error) {
        alert("Hona Error" + error);
      }

    }, error=> {
      this.router.navigate(['/login']);
    });

    return [...this.events];
  }

  addPost(event: MyEvent , image: File){

    const postData = new FormData();
    postData.append("image", image, event.title);
    const jsonEvent = JSON.stringify(event);
    postData.append("jsonEvent", jsonEvent );
    this.http.post<{message : string, eventId: string, url:string}>(BACKEND_URL, postData)
      .subscribe((responseData) => {
        this.router.navigate(['/events']);
      });

  }

   getEvent(id: string){
     return this.http.get<{_id:string, title:string, imagePath:string ,description: string, startDate:Date, endDate:Date, location:string, attendeeList:any, invitations:any}>(BACKEND_URL+id);
   }


   updateEvent(id : string, event: MyEvent, image: any){

      if (typeof(image) ==='string'){
        this.http.put<{message:string , imagePath:string}>(BACKEND_URL+ id, event)
        .subscribe((response)=> {

          this.router.navigate(['/events']);
        });
      }
      else {
        const postData = new FormData();
        postData.append("image", image, event.title);
        postData.append("jsonEvent", JSON.stringify(event));

        this.http.put<{message:string , imagePath:string}>(BACKEND_URL+id, postData)
          .subscribe((response)=> {

            this.router.navigate(['/events']);
          });
      }

   }

   sendInvitations(id, attendeeList, event){
     let url = window.location.host;
     let data = {
       event : event,
       attendeeList : attendeeList,
       hostUrl: url
     }
    return this.http.put(BACKEND_URL + 'invite/' + id, data);
   }

  deletePost(eventId : string) {
    return this.http
    .delete(BACKEND_URL + eventId);

  }

  getPostUpdateListener() {
    return this.eventsUpdated.asObservable();
  }


  confirmEvent(attendeeId, eventId, image: File, detection: any) {  
    const postData = new FormData();
    postData.append('image', image, attendeeId);
    const jsonAttendee = JSON.stringify({'attendeeId': attendeeId, 'eventId': eventId, 'detection': detection});
    postData.append('jsonAttendee', jsonAttendee)
    return this.http.post(BACKEND_URL_invite  + 'confirm' , postData).subscribe(result=>  this.getEventInvitations(eventId));
  }
  checkinEvent(attendeeId, eventId) {  

    const data = {'attendeeId': attendeeId, 'eventId': eventId}
    
    return this.http.post(BACKEND_URL_invite  + 'checkin' , data).subscribe(result=>  this.getEventInvitations(eventId));
  }

  getEventInvitations(eventId) {
    return this.http.get<{invitations: any[]}>(BACKEND_URL_invite + eventId);
  }
 



} 
 