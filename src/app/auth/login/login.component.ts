import { Router } from '@angular/router';
import { UsuarioService } from './../../service/usuario.service';
import { AuthService } from './../auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  entrando = false;

  constructor( private fb: FormBuilder,
               private _auth: AuthService,
               private _usuario: UsuarioService,
               private toastr: ToastrService,
               private router: Router) { 
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      pass: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  login() {
    this.entrando = true;
    if (this.loginForm.invalid) {
      this.toastr.error('Ingrese sus credenciales', 'Ha ocurrido un error');
      this.entrando = false;
      return;
    }
    else {
      this._auth.signInWithEmail(this.loginForm.value.email, this.loginForm.value.pass).then(userData => {
        userData.user.getIdTokenResult().then(dat => { 
          this._usuario.getUsuarioPorEmail(this.loginForm.value.email).subscribe( p => {
            if (p.length > 0) {
              this._auth.saveLocalData("email", this.loginForm.value.email);
              this._auth.saveLocalData("names", p[0].nombres);
              this._auth.saveLocalData("lastnames", p[0].apellidos);
              this._auth.saveLocalData("administrador", p[0].admin);
              this.router.navigateByUrl("/inicio");
            }
            else {
              this.toastr.error('Verifique las credenciales ingresadas', 'Acceso denegado');
              this.entrando = false;
            }
          });
        });
        this.entrando = false
      })
      .catch(err => {
        this.toastr.error('Verifique las credenciales ingresadas', 'Acceso denegado');
        this.entrando = false;
      });
    }
  }
}
