import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated : boolean = false;
  authListenerSubs : Subscription;
  constructor(private authService: AuthService, private router : Router) { }

  ngOnInit(): void {

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs
     = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      })

  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }


  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }


}
