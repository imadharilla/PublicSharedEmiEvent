import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventListComponent } from './event/event-list/event-list.component';
import { EventCreateComponent } from './event/event-create/event-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { AttendeeListComponent } from './attendee/attendee-list/attendee-list.component';
import { EventStatsComponent } from './event/event-stats/event-stats.component';
import { HomeComponent } from './home/home.component';
import { EventConfirmComponent } from './event/event-confirm/event-confirm.component';
import { CheckinComponent } from './checkin/checkin/checkin.component';


const routes: Routes = [
  { path:'', component: HomeComponent },
  { path:'events', component: EventListComponent },
  { path:'create', component: EventCreateComponent , canActivate : [AuthGuard]},
  { path:'edit/:eventId', component: EventCreateComponent, canActivate : [AuthGuard] },
  { path:'stats/:eventId', component: EventStatsComponent, canActivate : [AuthGuard] },
  { path:'attendees', component: AttendeeListComponent, canActivate : [AuthGuard] },
  { path: 'login', component : LoginComponent },
  { path: 'signup', component : SignupComponent },
  { path: 'confirm/:eventId/:attendeeId', component: EventConfirmComponent },
  {path: 'checkin/:eventId', component: CheckinComponent}

];


// forRoot(routes, {useHash:true})
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule],
  providers : [AuthGuard]
})
export class AppRoutingModule { }
