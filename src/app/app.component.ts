import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { NavbarService } from './header/navbar.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  router : string;
  showHeader : boolean;
  constructor(private authService: AuthService, private _router: Router,  public nav: NavbarService) {

  }
  ngOnInit(): void {
    this.authService.autoAuthUser();
    this.router = this._router.url;
  }

}
