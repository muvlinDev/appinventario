import { ToastrService } from 'ngx-toastr';
import { InventarioService } from 'src/app/service/inventario.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parametricas',
  templateUrl: './parametricas.component.html',
  styleUrls: ['./parametricas.component.css']
})
export class ParametricasComponent implements OnInit {

  categorias: Observable<any[]>;
  categoriaForm: FormGroup;
  laboratorios: Observable<any[]>;
  laboratorioForm: FormGroup;
  labelAccion = 'Agregar categoría';
  labelLaboratorio = 'Agregar laboratorio';

  constructor(private _inventario: InventarioService,
              private formBuilder: FormBuilder,
              private toastr: ToastrService) { 
    this.categoriaForm = this.formBuilder.group({
      descripcion: ['', Validators.required]
    });
    this.laboratorioForm = this.formBuilder.group({
      nombre: ['', Validators.required]
    })
    this.categorias = _inventario.getCategorias();
    this.laboratorios = _inventario.getLaboratorios();
  }

  ngOnInit(): void {
  }

  saveCategoria() {
    if (this.categoriaForm.invalid) {
      this.toastr.error('Todos los campos son requeridos', 'Ha ocurrido un error');
      return;
    }
    this._inventario.saveCategoria(this.categoriaForm.value);
    this.toastr.success('Categoría guardada correctamente', 'Operación exitosa');
    this.categoriaForm.reset();
  }

  deleteCategoria(id: string) {
      this._inventario.deleteCategoria(id);
      this.toastr.success('Categoria eliminada', 'Operación exitosa',);
  }

  saveLaboratorio() {
    if (this.laboratorioForm.invalid) {
      this.toastr.error('Todos los campos son requeridos', 'Ha ocurrido un error');
      return;
    }
    this._inventario.saveLaboratorio(this.laboratorioForm.value);
    this.toastr.success('Laboratorio guardado correctamente', 'Operación exitosa');
    this.laboratorioForm.reset();
  }

  deleteLaboratorio(id: string) {
    this._inventario.deleteLaboratorio(id);
    this.toastr.success('Laboratorio eliminado', 'Operación exitosa');
  }
}
