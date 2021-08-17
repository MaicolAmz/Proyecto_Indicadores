import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuarios.models';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  desde: number = 0;

  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(public _usuarioService: UsuariosService,) { }

  ngOnInit() {
    this.cargarUsuarios()

  }
  cargarUsuarios() {

    this.cargando = true;

    this._usuarioService.cargarUsuarios1( this.desde )
              .subscribe( (resp: any) => {

                this.totalRegistros = resp.total;
               
                this.usuarios = resp.usuarios;
                this.cargando = false;

              });
            

  }


  cambiarDesde( valor: number ) {

    let desde = this.desde + valor;

    if ( desde >= this.totalRegistros ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();

  }



  buscarUsuario( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this._usuarioService.buscarUsuarios( termino )
            .subscribe( (usuarios: Usuario[]) => {

              this.usuarios = usuarios;
              this.cargando = false;
            });

  }

  borrarUsuario( usuario: Usuario ) {

    if ( usuario._id === this._usuarioService.usuario._id ) {
      Swal.fire('No puede borrar usuario', 'No se puede borrar a si mismo', 'error');
      return;
    }

    Swal.fire(
     '¿Esta seguro?',
      'Esta a punto de borrar a ' + usuario.nombre,
       'warning',

    )
    .then( borrar => {

      if (borrar) {

        this._usuarioService.borrarUsuario( usuario._id )
                  .subscribe( borrado => {
                      this.cargarUsuarios();
                  });

      }

    });

  }

  guardarUsuario( usuario: Usuario ) {

    this._usuarioService.actualizarUsuario( usuario )
            .subscribe();

  }
}

