import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventCreateComponent } from './event/event-create/event-create.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { EventListComponent } from './event/event-list/event-list.component';
import { EventsService } from './event/events.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import {ErrorInterceptor} from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { AttendeeListComponent } from './attendee/attendee-list/attendee-list.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AttendeeService } from './attendee/attendee.service';
import { EventStatsComponent } from './event/event-stats/event-stats.component';


import {AccordionModule} from 'primeng/accordion';     //accordion and accordion tab
import {MenuItem} from 'primeng/api';
import { HomeComponent } from './home/home.component';
import { EventConfirmComponent } from './event/event-confirm/event-confirm.component';
import { FooterComponent } from './footer/footer.component';
import { CheckinComponent } from './checkin/checkin/checkin.component';
import { CheckinService } from './checkin/checkin.service';
@NgModule({
  declarations: [
    AppComponent,
    EventCreateComponent,
    HeaderComponent,
    EventListComponent,
    SignupComponent,
    LoginComponent,
    AttendeeListComponent,
    EventStatsComponent,
    HomeComponent,
    EventConfirmComponent,
    FooterComponent,
    CheckinComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AngularMaterialModule,
    NgbModule,
    AccordionModule,

  ],
  providers: [
    EventsService,
    AttendeeService,
    CheckinService, 
     {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
 //    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},

    ],


  bootstrap: [AppComponent],
  entryComponents: [],
})
export class AppModule { }
