import { Router } from '@angular/router';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  usuario = "";
  email = "";

  constructor( private _auth: AuthService,
               private router: Router ) { 
    this.usuario = _auth.getLocalData("names") + " " + _auth.getLocalData("lastnames");
    this.email = _auth.getLocalData("email");
  }

  ngOnInit(): void {
  }

  logout() {
    this._auth.clearLocalStorage();
    this.router.navigateByUrl("/login");
  }
}
