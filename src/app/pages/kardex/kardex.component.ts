import { Producto } from './../../interfaces/producto';
import { UtilsService } from './../../service/utils.service';
import { Kardex } from './../../interfaces/kardex';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InventarioService } from 'src/app/service/inventario.service';
import { Observable } from 'rxjs';
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
    this.buscando = true;
    if (this.kardexForm.invalid) {
      this.toastr.error('Para generar el kardex debe seleccionar un producto', 'Error');
      this.buscando = false;
      return;
    }
    this.getProducto();
    this.compras = this._inventario.getComprasProducto(this.kardexForm.value.producto);
    this.ventas = this._inventario.getVentasProducto(this.kardexForm.value.producto);

    setTimeout(() => {
      this.kardex = [];
      this.compras.forEach( element => {
        for (let i = 0; i < element.length; i++) {
          this.kardex.push({timest: element[i].fecha, fecha: this._utils.getDateFromTimestamp(element[i].fecha), descripcion: element[i].saldo ? 'Saldo' : 'Compra', entrada: element[i].cantidad, salida: 0, saldo: 0});
        }
      });
      this.ventas.forEach( element => {
        for (let i = 0; i < element.length; i++) {
          this.kardex.push({timest: element[i].fecha, fecha: this._utils.getDateFromTimestamp(element[i].fecha), descripcion: 'Venta', entrada: 0, salida: element[i].cantidad, saldo: 0})
        }
      });
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
      }, 500);
    }, 400);
  }

  getProducto() {
    this._inventario.getProducto(this.kardexForm.value.producto).subscribe( p => {
      this.producto = {codigo: p.codigo, categoria: p.categoria, comercial: p.comercial, generico: p.generico, laboratorio: p.laboratorio, presentacion: p.presentacion, contenido: p.contenido};
    });
  }

}
