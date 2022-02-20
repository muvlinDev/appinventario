import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor( private af: AngularFirestore ) { }

  getUsuarioPorEmail(email: string): Observable<any[]> {
    return this.af.collection('usuarios', ref => ref.where('email', '==', email)).valueChanges({idField: 'id'});
  }
}
