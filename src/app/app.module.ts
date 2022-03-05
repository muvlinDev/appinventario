import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { HeaderComponent } from './layout/header/header.component';

import { ProductosComponent } from './pages/productos/productos.component';
import { AngularFireModule } from '@angular/fire/compat';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ComprasComponent } from './pages/compras/compras.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { FooterComponent } from './layout/footer/footer.component';
import { KardexComponent } from './pages/kardex/kardex.component';
import { LoginComponent } from './auth/login/login.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { ParametricasComponent } from './pages/parametricas/parametricas.component';

const firebaseConfig = {
  apiKey: "AIzaSyAkI6dae6Ln360lcQiSmIhH5rGkvavkQWM",
  authDomain: "appinventario-muvlin.firebaseapp.com",
  projectId: "appinventario-muvlin",
  storageBucket: "appinventario-muvlin.appspot.com",
  messagingSenderId: "1061489762380",
  appId: "1:1061489762380:web:55c864ca7a05815cb714e9",
  measurementId: "G-8G56N8R3E7"
};

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    UsuarioComponent,
    HeaderComponent,
    ProductosComponent,
    ComprasComponent,
    VentasComponent,
    InventarioComponent,
    FooterComponent,
    KardexComponent,
    LoginComponent,
    ParametricasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    {
      provide: LocationStrategy, 
      useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }