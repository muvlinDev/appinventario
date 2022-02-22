import { Producto } from './../../interfaces/producto';
import { UtilsService } from './../../service/utils.service';
import { Kardex } from './../../interfaces/kardex';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InventarioService } from 'src/app/service/inventario.service';
import { Observable, combineLatest } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.component.html',
  styleUrls: ['./kardex.component.css']
})
export class KardexComponent implements OnInit {

  kardexForm: FormGroup;
  productos: Observable<any[]>;
  compras: Observable<any[]>;
  ventas: Observable<any[]>;
  kardex: Kardex[] = [];
  producto: Producto  = {} as any;
  buscando = false;

  constructor( private _inventario: InventarioService,
               private _utils: UtilsService,
               private fb: FormBuilder,
               private toastr: ToastrService ) { 
    this.kardexForm = this.fb.group({
      producto: ['', Validators.required]
    });
    this.productos = _inventario.getProductos();
  }

  ngOnInit(): void {
  }

  generarKardex() {
    this.kardex = [];
    this.buscando = true;
    if (this.kardexForm.invalid) {
      this.toastr.error('Para generar el kardex debe seleccionar un producto', 'Error');
      this.buscando = false;
      return;
    }
    this.getProducto();
    this.getCompras();
    this.getVentas();
    setTimeout(() => {
      this.kardex.sort((a: Kardex, b: Kardex) => {
        return a.timest - b.timest;
      });
      setTimeout(() => {
        var acumulado = 0;
        for (let i = 0; i < this.kardex.length; i++) {
          this.kardex[i].saldo = acumulado + this.kardex[i].entrada - this.kardex[i].salida;
          acumulado = this.kardex[i].saldo;
        }
        this.buscando = false;
      }, 300);
    }, 400);
  }

  getProducto() {
    this._inventario.getProducto(this.kardexForm.value.producto).subscribe( p => {
      this.producto = {codigo: p.codigo, categoria: p.categoria, comercial: p.comercial, generico: p.generico, laboratorio: p.laboratorio, presentacion: p.presentacion, contenido: p.contenido};
    });
  }

  getCompras() {
    this._inventario.getComprasProducto(this.kardexForm.value.producto).subscribe( c => {
      c.map( com => {
        if (com.type == "added") {
          const data = com.payload.doc.data();
          this.kardex.push({timest: data.fecha, fecha: this._utils.getDateFromTimestamp(data.fecha), descripcion: data.saldo ? 'Saldo' : 'Compra', entrada: data.cantidad, salida: 0, saldo: 0});
        }
      })
    });
  }

  getVentas() {
    this._inventario.getVentasProducto(this.kardexForm.value.producto).subscribe( c => {
      c.map( ven => {
        if (ven.type == "added") {
          const data = ven.payload.doc.data();
          this.kardex.push({timest: data.fecha, fecha: this._utils.getDateFromTimestamp(data.fecha), descripcion: 'Venta', entrada: 0, salida: data.cantidad, saldo: 0});
        }
      })
    })
  }
}
