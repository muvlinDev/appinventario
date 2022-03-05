import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private firestore: AngularFirestore) { }

  getLaboratorios(): Observable<any[]> {
    return this.firestore.collection('laboratorios', ref => ref.orderBy('nombre')).valueChanges({idField: 'id'});
  }
  getCategorias(): Observable<any[]> {
    return this.firestore.collection('categoria', ref => ref.orderBy('descripcion')).valueChanges({idField: 'id'});
  }
  getProductos(): Observable<any[]> {
    return this.firestore.collection('productos', ref => ref.orderBy('generico')).valueChanges({idField: 'id'});
  }
  getComprasCabecera(): Observable<any[]> {
    return this.firestore.collection('compras-cabecera').valueChanges();
  }
  getCompras(): Observable<any[]> {
    return this.firestore.collection('compras', ref => ref.orderBy('orden', 'desc')).valueChanges({idField: 'id'});
  }
  getVentasCabecera(): Observable<any[]> {
    return this.firestore.collection('ventas-cabecera').valueChanges();
  }
  getVentas(): Observable<any[]> {
    return this.firestore.collection('ventas', ref => ref.orderBy('orden', 'desc')).valueChanges({idField: 'id'});
  }
  getComprasProducto(id: string): Observable<any[]> {
    return this.firestore.collection('compras', ref => ref.where('id', '==', id).orderBy('fecha', 'desc')).snapshotChanges();
  }
  getVentasProducto(id: string): Observable<any[]> {
    return this.firestore.collection('ventas', ref => ref.where('id', '==', id).orderBy('fecha', 'desc')).snapshotChanges();
  }


  getProducto(id: string): Observable<any> {
    return this.firestore.collection('productos').doc(id).valueChanges({idField: 'id'});
  }

  saveProducto(form: any) {
    this.firestore.collection('productos').add(form);
  }
  saveCompraCabecera(form: any) {
    this.firestore.collection('compras-cabecera').add(form);
  }
  saveCompra(form: any) {
    this.firestore.collection('compras').add(form);
  }
  saveVentaCabecera(form: any) {
    this.firestore.collection('ventas-cabecera').add(form);
  }
  saveVenta(form: any) {
    this.firestore.collection('ventas').add(form);
  }
  saveCategoria(form: any) {
    this.firestore.collection('categoria').add(form);
  }
  saveLaboratorio(form: any) {
    this.firestore.collection('laboratorios').add(form);
  }

  updateProducto(id: string, form:any) {
    this.firestore.collection('productos').doc(id).update(form);
  }

  deleteProducto(id: string) {
    this.firestore.collection('productos').doc(id).delete();
  }
  deleteCompra(id: string) {
    this.firestore.collection('compras').doc(id).delete();
  }
  deleteVenta(id: string) {
    this.firestore.collection('ventas').doc(id).delete();
  }
  deleteCategoria(id: string) {
    this.firestore.collection('categoria').doc(id).delete();
  }
  deleteLaboratorio(id: string) {
    this.firestore.collection('laboratorios').doc(id).delete();
  }
}
