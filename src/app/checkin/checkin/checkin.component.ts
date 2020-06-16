import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CheckinService } from '../checkin.service';

import * as faceapi from '../../../assets/face/face-api.js';
import { AttendeeService } from 'src/app/attendee/attendee.service';
import { Subscription } from 'rxjs';
import { Attendee } from 'src/app/attendee/attendee.model';
import { EventsService } from 'src/app/event/events.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss']
})
export class CheckinComponent implements OnInit, OnDestroy {
  eventId
  isFaceDetected = false
  video : any
  imageURL : string
  isLoading : boolean = false
  private timerID ;
  private attendeeList = []
  private attendeeListListener: Subscription;
  attendee : Attendee
  constructor(private checkinService: CheckinService,  
    private attendeeService: AttendeeService,
    private route: ActivatedRoute,
    private eventService: EventsService,) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get("eventId")
    })
    this.isFaceDetected = false
    this.isLoading = true
    this.attendeeList = this.attendeeService.getAttendeeList()
    this.attendeeListListener 
      this.attendeeService.updateAttendeeList()
        .subscribe(attendeeList => {
          this.attendeeList = attendeeList;
          console.log(attendeeList)
    }); 
Promise.all([
  
  faceapi.nets.tinyFaceDetector.loadFromUri('assets/weights'),
  faceapi.nets.faceLandmark68Net.loadFromUri('assets/weights'),
  faceapi.nets.faceRecognitionNet.loadFromUri('assets/weights'),
  faceapi.nets.faceExpressionNet.loadFromUri('assets/weights'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('assets/weights')
]).then(x=>this.startVideo())
    this.video = document.getElementById('video') as HTMLVideoElement;
    this.video.addEventListener('play', this.timerID = setInterval(async () => {
      const detections = await faceapi.detectSingleFace(this.video, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceExpressions().withFaceDescriptor()
      this.attendeeList.map(attendee => {
        
        if(attendee.detection && detections) {
          //const faceMatcher = new faceapi.FaceMatcher(attendee.detection)
          //const bestMatch = faceMatcher.findBestMatch(detections.descriptor)
          const hehe = Object.values(attendee.detection.descriptor)
          const distance = faceapi.euclideanDistance(hehe, detections.descriptor)
          console.log(distance)
          if (distance<0.58) {
            this.attendee = attendee
            this.isFaceDetected = true
          }
        }
        
      })
    }, 6000))
  }

 
 async startVideo() {
    this.isLoading = false
    let video = document.getElementById('video') as HTMLVideoElement;
    //this.video.srcObject = await navigator.mediaDevices.getUserMedia({video: {}})
    var facingMode = "user";
    var constraints = {
      audio: false,
      video: {
       facingMode: facingMode
      }
    };
    
    /* Stream it to video element */
    navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
      console.log('hhhhhhhh')
      console.log(video)
      video.srcObject = stream;
    });
  
  }
 

  checkin() {
    this.isFaceDetected = false
    const index  = this.attendeeList.indexOf(this.attendee)
    this.attendeeList.splice(index, 1)
    this.eventService.checkinEvent(this.attendee.id, this.eventId)
  }

  ngOnDestroy(): void {
    clearInterval(this.timerID)
    navigator.getUserMedia(
      { video: {} },
      stream => this.video.srcObject = stream.getTracks().forEach( track => {
        track.stop()
      }),
      err => console.log(err)
    )
      this.video.pause()
    }
  
}
 