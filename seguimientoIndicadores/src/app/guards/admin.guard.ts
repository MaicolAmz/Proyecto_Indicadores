import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { UsuariosService } from '../services/usuarios.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(public _usuarioService: UsuariosService) {}
  canActivate() {
    if (!this._usuarioService.estaLogueado()) {
      this.alertInvalid(
        'question',
        'Oops...',
        'No esta logueado, inicie sesión por favor'
      );
      return false;
    }
    if (this._usuarioService.usuario.role === 'ADMIN_ROLE') {
      return true;
    } else if (this._usuarioService.usuario.role === 'USER_ROLE') {
      this.alertInvalid(
        'question',
        'Oops...',
        'Su usuario esta pendiente de activación comuniquese con el administrador'
      );
      return false;
    } else if (this._usuarioService.usuario.role === 'RECTOR_ROLE') {
      return true;
    } else if (this._usuarioService.usuario.role === 'PRESUPUESTO_ROLE') {
      return true;
    } else if (this._usuarioService.usuario.role === 'DIRECTOR_UPDI_ROLE') {
      return true;
    } else if (
      this._usuarioService.usuario.role === 'VICERECTOR_ADMINISTRATIVO_ROLE'
    ) {
      return true;
    } else if (
      this._usuarioService.usuario.role === 'VICERECTOR_ACADEMICO__GENERAL_ROLE'
    ) {
      return true;
    } else if (this._usuarioService.usuario.role === 'REQUIRENTE_ROLE') {
      return true;
    } else if (this._usuarioService.usuario.role === 'UPDI_ROLE') {
      return true;
    } else if (this._usuarioService.usuario.role === 'VICERECTOR_ROLE') {
      return true;
    } else if (this._usuarioService.usuario.role === 'DIRECTOR_ROLE') {
      return true;
    } else if (this._usuarioService.usuario.role === 'PLANIFICADOR_ROLE') {
      return true;
    } else {
      this.alertInvalid('error', 'Oops...', 'Su usuario esta Inactivo');
      this._usuarioService.logOut();
      return false;
    }
  }

  alertInvalid(info, title, text) {
    Swal.fire({
      icon: info,
      title: title,
      text: text,
    });
  }
}
