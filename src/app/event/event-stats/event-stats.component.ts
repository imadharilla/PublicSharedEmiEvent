import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { EventsService } from '../events.service';
import { MyEvent } from '../event.model';
import { AttendeeService } from 'src/app/attendee/attendee.service';
import { Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-event-stats',
  templateUrl: './event-stats.component.html',
  styleUrls: ['./event-stats.component.scss'],
  providers: []
})
export class EventStatsComponent implements OnInit, OnDestroy {

  attendeeListListener : Subscription;
  attendeeList : any[] ;
  isLoading : boolean =false;
  data :any;
  confirmedAttendees :number = 0;
  pendingAttendees : any = 0;
  checkedInAttendess :number = 0;
  numberAttendees : number = 0; 
  progressBarValue : number;

  nonInvitedAttendees : any[];
  toInviteAttendees : any[];
  event: MyEvent;
  eventId : string;
  private modal : NgbModalRef;

  constructor( public route: ActivatedRoute,
    private eventsService: EventsService,
    private attendeeService: AttendeeService,
    private _modalService: NgbModal,
    
    ) { }


  ngOnInit(): void {
    this.confirmedAttendees = 0
    this.nonInvitedAttendees = [];
    this.toInviteAttendees = [];
    this.attendeeList = this.attendeeService.getAttendeeList();
    this.attendeeListListener = this.attendeeService.updateAttendeeList().subscribe(attendeeList=>{
      this.attendeeList = attendeeList;
    });

    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if(paramMap.has('eventId')) {
        this.isLoading=true;

        this.eventId = paramMap.get('eventId');
        let request1 = this.eventsService.getEvent(this.eventId)
          .subscribe((event)=>{
            this.isLoading = false;
            this.event = {
              id : event._id,
                title : event.title,
                imageUrl: event.imagePath,
                description : event.description,
                startDate : event.startDate,
                endDate : event.endDate,
                location : event.location,
                attendeelist : event.attendeeList,
                invitations : event.invitations
            }
             

          })

          Promise.all([request1]).then(()=> this.eventsService.getEventInvitations(this.eventId).subscribe(data => {
            let invitedListId = [];
            data.invitations.map( invitation => {
              invitedListId.push(invitation.attendeeId);
              console.log(invitation)
              if(invitation.status === 'confirmed') {
                this.confirmedAttendees += 1;
              }
              if(invitation.status === 'checkedin') {
                this.checkedInAttendess += 1;
              }
              if(invitation.status === 'pending') {
                this.pendingAttendees += 1;
              }
            });
              this.numberAttendees = this.event.attendeelist.length;
              this.progressBarValue = ~~((this.confirmedAttendees/this.numberAttendees)*100);
              this.event.attendeelist.map( attendeeId => {
                if( invitedListId.indexOf(attendeeId)==-1 ){
                  let currentAttendee = this.attendeeList.find(x=> x.id == attendeeId);
                  if (currentAttendee){
                    this.nonInvitedAttendees.push({
                      nom: currentAttendee.nom.concat(' ', currentAttendee.prenom) ,
                      id : attendeeId,
                    });
                  }
                }

              })
              this.renderChart();
          })
          )

      }
    })



  }

renderChart(){
  this.data = {
    labels: ['Pending','Confirmed','Checked in'],
    datasets: [
        {
            data: [this.pendingAttendees, this.confirmedAttendees, this.checkedInAttendess],
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ]
        }]
    };
}



onSendInvitations(){

  if(this.toInviteAttendees.length<1){return}

  let attendeeList = []
  let request1 = this.toInviteAttendees.map(item=>{
    attendeeList.push(item.id);
  })
  /*
  for(var i=0; i< this.event.attendeelist.length; i++) {
    if(attendeeList.indexOf(this.event.attendeelist[i].attendeeId) != -1 ){
      this.event.attendeelist[i] = { attendeelist: this.event.attendeelist[i].attendeelist, status: 'sent' } ;
    }
  } */


  Promise.all(request1).then(()=>{
    console.log(this.event.attendeelist);
    this.eventsService.sendInvitations(this.event.id, attendeeList, this.event)
      .subscribe((result)=>{
        // you have to reload the page !!
        this.ngOnInit();
      })
  })
}


confirm(content) {
  this.modal = this._modalService.open(content)
}

  ngOnDestroy(): void {
    this.attendeeListListener.unsubscribe();
  }
}