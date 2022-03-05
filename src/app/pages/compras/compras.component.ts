import { UtilsService } from './../../service/utils.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { InventarioService } from 'src/app/service/inventario.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Addedprod } from 'src/app/interfaces/addedprod';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {
  @ViewChild('closeButtonForm') closeButtonForm;
  compras: Observable<any[]>;
  productos: Observable<any[]>;
  comprasCabecera: Observable<any[]>;
  nuevasCompras: Addedprod[] = [];
  productoSeleccionado = '';
  compraForm: FormGroup;
  productoForm: FormGroup;
  correlativo = 'OC-1';
  saving = false;

  constructor( private _inventario: InventarioService,
               private _utils: UtilsService,
               private fb: FormBuilder,
               private toastr: ToastrService ) { 
    this.productoForm = this.fb.group({
    });
    this.compraForm = this.fb.group({
      id: ['', Validators.required],
      costo: ['', Validators.required],
      cantidad: ['', Validators.required],
      precio: ['', Validators.required],
      saldo: false
    });
    this.compras = _inventario.getCompras();
    this.productos = _inventario.getProductos();
    this.comprasCabecera = _inventario.getComprasCabecera();
  }

  ngOnInit(): void {
  }

  seleccionarProducto(event: any) {
    this.productoSeleccionado = event?.target.value;
  }

  agregar() {
    if (this.compraForm.invalid) {
      this.toastr.error('Debe completar todos los campos', 'Ocurrió un error');
      return
    }
    const prod = this._inventario.getProducto(this.compraForm.value.id);
    var one = true;
    prod.forEach(element => {
      if (one) {
        let np = {} as Addedprod;
        np.id = element.id;
        np.codigo = element.codigo;
        np.comercial = element.comercial;
        np.generico = element.generico;
        np.laboratorio = element.laboratorio;
        np.categoria = element.categoria;
        np.costo = this.compraForm.value.costo;
        np.cantidad = this.compraForm.value.cantidad;
        np.precio = this.compraForm.value.precio;
        np.total = Math.round(((this.compraForm.value.costo)*(this.compraForm.value.cantidad)) * 100) / 100;
        np.fecha = this._utils.getTodayTimestamp();
        if (this.compraForm.value.saldo === true) {
          np.saldo = true;
        }
        else {
          np.saldo = false;
        }
        this.nuevasCompras.push(np);
        this.compraForm.reset();
        one = false;
      }
    });
  }

  guardarCompras() {
    this.saving = true;
    this._inventario.saveCompraCabecera({orden: this.correlativo});
    this.generateOrdenCompra();
    setTimeout(() => {
      this.nuevasCompras.forEach( data => {
        data.orden = this.correlativo;
        this._inventario.saveCompra(data);
        this.productoForm.value.precio = data.precio;
        this._inventario.updateProducto(data.id, this.productoForm.value);
      });
      setTimeout(() => {
        this.nuevasCompras = [];
        this.toastr.success('Registros almacenados correctamente', 'Operación exitosa');
        this.closeButtonForm.nativeElement.click();
        this.saving = false;
      }, 800);
    }, 500)
  }

  generateOrdenCompra() {
    this.comprasCabecera.forEach(res => {
      this.correlativo = 'OC-' + (res.length);
    })
  }

  quitarProducto(i: number) {
    this.nuevasCompras.splice(i,1);
  }

  getFecha(timestamp: any){
    return this._utils.getDateFromTimestamp(timestamp);
  }

  deleteCompra(id: string) {
    this._inventario.deleteCompra(id);
    this.toastr.success('Compra eliminada correctamente', 'Operación exitosa');
  }
}
