import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { InventarioService } from 'src/app/service/inventario.service';
import { Observable } from 'rxjs';
import { Inventario } from 'src/app/interfaces/inventario';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit, OnDestroy {

  productos: Observable<any[]>;
  compras: Observable<any[]>;
  ventas: Observable<any[]>;
  inventario: Inventario[] = [];
  sumatoriaCompras = 0;
  sumatoriaVentas = 0;

  constructor( private _inventario: InventarioService,
               private _auth: AuthService ) { 
    this.productos = _inventario.getProductos();
    this.compras = _inventario.getCompras();
    this.ventas = _inventario.getVentas();
    this.calcularInventario();
  }

  ngOnInit(): void {
    if (this._auth.getStatus() === 'refresh') {
      window.location.reload();
      this._auth.saveStatus('inv-ready');
    }
  }

  ngOnDestroy(): void {
    this._auth.saveStatus('refresh');
  }

  calcularInventario() {
    console.log('calculado inventario');
    
    this.productos.forEach(prod => {
      for (var i = 0; i < prod.length; i++) {
        //this.sumatorias(prod[i].codigo);
        this.sumatorias(prod[i]);
        /*let inv = {} as Inventario;
        inv.codigo = prod[i].codigo;
        inv.generico = prod[i].generico;
        inv.comercial = prod[i].comercial;
        inv.laboratorio = prod[i].laboratorio;
        inv.categoria = prod[i].categoria;
        inv.stock = this.sumatoriaCompras - this.sumatoriaVentas;
        this.sumatoriaCompras = 0;
        this.sumatoriaVentas = 0;
        this.inventario.push(inv);*/
      }
    })
  }

  sumatorias(prod: any) {
    this.sumatoriaCompras = 0;
    this.sumatoriaVentas = 0;

    var scomp = 0;
    var svent = 0;
    this.compras.forEach(comp => {
      for (var i = 0; i<comp.length; i++) {
        if (comp[i].codigo === prod.codigo) {
          scomp += comp[i].cantidad;
        }
      }
    });
    this.ventas.forEach(vent => {
      for (var i = 0; i<vent.length; i++) {
        if (vent[i].codigo === prod.codigo) {
          svent += vent[i].cantidad;
        }
      }
    });

    setTimeout(() => {
        let inv = {} as Inventario;
        inv.codigo = prod.codigo;
        inv.generico = prod.generico;
        inv.comercial = prod.comercial;
        inv.laboratorio = prod.laboratorio;
        inv.categoria = prod.categoria;
        inv.stock = scomp - svent;
        this.inventario.push(inv);
    }, 100);
  }
}
