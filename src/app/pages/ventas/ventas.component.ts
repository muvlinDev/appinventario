import { UtilsService } from './../../service/utils.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { InventarioService } from 'src/app/service/inventario.service';
import { ToastrService } from 'ngx-toastr';
import { Soldprod } from 'src/app/interfaces/soldprod';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  @ViewChild('closeButtonForm') closeButtonForm;
  ventas: Observable<any[]>;
  productos: Observable<any[]>;
  ventasCabecera: Observable<any[]>;
  nuevasVentas: Soldprod[] = [];
  ventaForm: FormGroup;
  correlativo = 'OV-1';
  saving = false;
  precioVenta = 0;

  constructor( private _inventario: InventarioService,
               private _utils: UtilsService,
               private fb: FormBuilder,
               private toastr: ToastrService ) { 
    this.ventaForm = this.fb.group({
      id: ['', Validators.required],
      cantidad: ['', Validators.required]
    });
    this.ventas = _inventario.getVentas();
    this.productos = _inventario.getProductos();
    this.ventasCabecera = _inventario.getVentasCabecera();
  }

  ngOnInit(): void {
  }

  seleccionarProducto(event: any) {
    const id = event?.target.value;
    console.log(id);
    
    const prod = this._inventario.getProducto(id);
    var one = true;
    prod.forEach(element => {
      if (one) {
        this.precioVenta = element.precio;
        one = false;
      }
    });
  }

  agregar() {
    if (this.ventaForm.invalid) {
      this.toastr.error('Debe completar todos los campos', 'Ocurrió un error');
      return
    }
    const prod = this._inventario.getProducto(this.ventaForm.value.id);
    var one = true;
    prod.forEach(element => {
      if (one) {
        let np = {} as Soldprod;
        np.codigo = element.codigo;
        np.id = element.id;
        np.comercial = element.comercial;
        np.generico = element.generico;
        np.laboratorio = element.laboratorio;
        np.categoria = element.categoria;
        np.precio = this.precioVenta;
        np.cantidad = this.ventaForm.value.cantidad;
        np.total = Math.round(((this.precioVenta)*(this.ventaForm.value.cantidad)) * 100) / 100;
        np.fecha = this._utils.getTodayTimestamp();
        this.nuevasVentas.push(np);
        this.ventaForm.reset();
        this.precioVenta = 0;
        one = false;
      }
    });
  }

  guardarCompras() {
    this.saving = true;
    this._inventario.saveVentaCabecera({orden: this.correlativo});
    this.generateOrdenCompra();
    setTimeout(() => {
      this.nuevasVentas.forEach( data => {
        data.orden = this.correlativo;
        this._inventario.saveVenta(data);
      });
      setTimeout(() => {
        this.nuevasVentas = [];
        this.toastr.success('Registros almacenados correctamente', 'Venta exitosa');
        this.closeButtonForm.nativeElement.click();
        this.saving = false;
      }, 800);
    }, 500)
  }

  generateOrdenCompra() {
    this.ventasCabecera.forEach(res => {
      this.correlativo = 'OV-' + (res.length);
    })
  }

  quitarProducto(i: number) {
    console.log(i);
    this.nuevasVentas.splice(i,1);
  }

  getFecha(timestamp: any){
    return this._utils.getDateFromTimestamp(timestamp);
  }

  deleteVenta(id: string) {
    this._inventario.deleteVenta(id);
    this.toastr.success('Venta eliminada correctamente', 'Operación exitosa');
  }
}
