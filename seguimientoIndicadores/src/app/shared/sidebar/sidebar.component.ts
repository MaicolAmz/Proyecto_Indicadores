import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuarios.models';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

declare function customInitFunctions();

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  usuario: Usuario;

  constructor(
    private _usuarioService: UsuariosService,
    public _sidebar: SidebarService
  ) {}

  ngOnInit() {
    this.usuario = this._usuarioService.usuario;
    this._sidebar.cargarMenu();
    customInitFunctions();
  }

  cerrarSesion() {
    this._usuarioService.logOut();
  }
}
