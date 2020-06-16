import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { EventsService } from '../events.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { mimeTypeImage } from '../event-create/mime-type.validator';
import * as faceapi from '../../../assets/face/face-api.js';
import { NavbarService } from 'src/app/header/navbar.service';

@Component({
  selector: 'app-event-confirm',
  templateUrl: './event-confirm.component.html',
  styleUrls: ['./event-confirm.component.scss']
})
export class EventConfirmComponent implements OnInit {
  isFaceThere = true
  isConfirmed = false
  isLoading=false
  eventId;
  eventTitle = 'Event Title'
  eventDescription = 'Event Description'
  eventDate ;
  eventLocation;
  public eventImage = 'event Image'
  attendeeId;
  private modal : NgbModalRef;
  form: FormGroup;
  imagePreview : string;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventsService,
    private _modalService: NgbModal,
    public nav: NavbarService
    ) { }

  ngOnInit(): void {
    this.nav.hide()
    faceapi.nets.tinyFaceDetector.loadFromUri('assets/weights')
    faceapi.nets.faceLandmark68Net.loadFromUri('assets/weights'); 
    faceapi.nets.faceRecognitionNet.loadFromUri('assets/weights')
    faceapi.nets.faceExpressionNet.loadFromUri('assets/weights')
    faceapi.nets.ssdMobilenetv1.loadFromUri('assets/weights')
    this.form = new FormGroup({
      'image' : new FormControl(null,
       { validators:[],
      asyncValidators:[mimeTypeImage]})
    });


    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has('eventId')) {
        this.eventId = paramMap.get('eventId');
        this.eventService.getEvent(this.eventId).subscribe(event=>{
          var date = new Date(event.startDate);
          this.eventTitle = event.title;
          this.eventDescription = event.description;
          this.eventLocation = event.location;
          this.eventDate = date.toDateString() ;
          this.eventImage = event.imagePath
        })
      }
      if(paramMap.has('attendeeId')) {
        this.attendeeId = paramMap.get('attendeeId')
      } 
    })
  }


  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({'image' : file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }

  openForm(content) {
    this.modal = this._modalService.open(content)
  }

  async onSaveForm(){

    if( this.form.invalid ) {
      return
    }
    this.isLoading = true;
    let image = document.getElementById('imageFace') as HTMLImageElement;
    let detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor()
    console.log(detection)
    if (detection == undefined) {
      this.isLoading =false
      this.isFaceThere = false;
      return 
    }
    this.modal.close('Ok click');
    this.eventService.confirmEvent(this.attendeeId, this.eventId, this.form.value.image, detection)
    this.isConfirmed = true
  }

}
   