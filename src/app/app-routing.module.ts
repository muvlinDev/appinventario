import { ParametricasComponent } from './pages/parametricas/parametricas.component';
import { LoginComponent } from './auth/login/login.component';
import { KardexComponent } from './pages/kardex/kardex.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { ComprasComponent } from './pages/compras/compras.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { InventarioComponent } from './pages/inventario/inventario.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'inicio',
    component: InicioComponent
  },
  {
    path: 'productos',
    component: ProductosComponent
  },
  {
    path: 'usuarios',
    component: UsuarioComponent
  },
  {
    path: 'compras',
    component: ComprasComponent
  },
  {
    path: 'ventas',
    component: VentasComponent
  },
  {
    path: 'inventario',
    component: InventarioComponent
  },
  {
    path: 'kardex',
    component: KardexComponent
  },
  {
    path: 'parametricas',
    component: ParametricasComponent
  },
  {
    path: '**', pathMatch: 'full', redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
