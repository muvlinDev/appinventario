import { AuthService } from './../../auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor( private _auth: AuthService ) { 
  }

  ngOnInit(): void {
    this.saveStatus();
  }

  saveStatus() {
    this._auth.saveStatus('refresh');
  }
}
