import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { InventarioService } from 'src/app/service/inventario.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  @ViewChild('closeButtonForm') closeButtonForm;
  
  productos: Observable<any[]>;
  laboratorios: Observable<any[]>;
  categorias: Observable<any[]>;
  producto: any;
  productoForm: FormGroup;
  edicion = false;
  idEdicion = '';

  constructor(private _inventario: InventarioService,
              private formBuilder: FormBuilder,
              private toastr: ToastrService) { 
    this.productoForm = this.formBuilder.group({
      codigo: ['', Validators.required],
      generico: ['', Validators.required],
      comercial: ['', Validators.required],
      laboratorio: ['', Validators.required],
      categoria: ['', Validators.required],
      composicion: ['', Validators.required],
      contenido: ['', Validators.required],
      presentacion: ['', Validators.required],
      cliente: ['', Validators.required]
    })
    this.productos = _inventario.getProductos();
    this.laboratorios = _inventario.getLaboratorios();
    this.categorias = _inventario.getCategorias();
  }

  ngOnInit(): void {
  }

  newModal() {
    this.productoForm.reset();
    document.getElementById('codigo').removeAttribute('readonly');
  }

  openModal(id: string) {
    this.edicion = true;
    this.idEdicion = id;
    const pords = this._inventario.getProducto(id);
    setTimeout(() => {
      pords.forEach(element => {
        this.producto = element;
        document.getElementById('codigo').setAttribute('readonly', 'true');
        if(this.producto != null) {
          this.productoForm = this.formBuilder.group({
            codigo: [this.producto.codigo, Validators.required],
            generico: [this.producto.generico, Validators.required],
            comercial: [this.producto.comercial, Validators.required],
            laboratorio: [this.producto.laboratorio, Validators.required],
            categoria: [this.producto.categoria, Validators.required],
            composicion: [this.producto.composicion, Validators.required],
            contenido: [this.producto.contenido, Validators.required],
            presentacion: [this.producto.contenido, Validators.required],
            cliente: [this.producto.cliente, Validators.required]
          })
        }
      })
    }, 500);
  }

  saveProducto() {
    if (this.productoForm.invalid) {
      this.toastr.error('Todos los campos son requeridos', 'Ha ocurrido un error');
      return;
    }
    //Guardar en Firebase
    if (this.edicion) {
    this._inventario.updateProducto(this.idEdicion, this.productoForm.value);
      this.toastr.success('Producto modificado correctamente', 'Operación exitosa');
      this.productoForm.reset();
      this.edicion = false;
      this.idEdicion = '';
      this.producto = null;
      document.getElementById('codigo').removeAttribute('readonly');
      this.closeButtonForm.nativeElement.click();
    }
    else {
      this._inventario.saveProducto(this.productoForm.value);
      this.toastr.success('Producto guardado correctamente', 'Operación exitosa');
      this.productoForm.reset();
      this.edicion = false;
      this.idEdicion = '';
      this.producto = null;
      document.getElementById('codigo').removeAttribute('readonly');
      this.closeButtonForm.nativeElement.click();
    }
  }

  deleteProducto(id: string) {
    this._inventario.deleteProducto(id);
    this.toastr.success('Producto eliminado correctamente', 'Operación exitosa');
  }
}
