import { Routes } from '@angular/router';
import { Products } from './products/products';
import { Login } from './login/login';
import { Usuario } from './usuario/usuario';
import { Admin } from './admin/admin';
import { Panel } from './pagues/panel/panel';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: '', component: Products, pathMatch: 'full' },
  { path: 'login', component: Login },

  // protegida: requiere sesión iniciada
  { path: 'usuario', component: Usuario, canActivate: [authGuard] },

  // protegida: requiere ser administrador
  { path: 'admin', component: Admin, canActivate: [adminGuard] },

  // Nueva ruta panel
  { path: 'panel', component: Panel },

  // compatibilidad con rutas previas
  { path: 'pagues/panel', redirectTo: 'panel', pathMatch: 'full' },
  { path: 'pagues/productos', redirectTo: '', pathMatch: 'full' },
  { path: 'productos', redirectTo: '', pathMatch: 'full' },
  { path: 'pagues/login', redirectTo: 'login', pathMatch: 'full' },
];
