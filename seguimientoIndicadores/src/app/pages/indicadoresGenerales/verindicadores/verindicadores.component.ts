import { IndicadoresService } from '../../../services/indicadores.service';
import { Component, OnInit } from '@angular/core';
import { Indicadores } from 'src/app/models/indicadores';
import { Usuario } from 'src/app/models/usuarios.models';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-verindicadores',
  templateUrl: './verindicadores.component.html',
  styleUrls: ['./verindicadores.component.css'],
})
export class VerindicadoresComponent implements OnInit {
  usuario: Usuario;

  formularios: Indicadores[];

  totalRegistros: number = 0;

  constructor(
    private _usuarioService: UsuariosService,
    private listainforme: IndicadoresService
  ) {}
  ngOnInit() {
    this.usuario = this._usuarioService.usuario;
    this.getFormulariosHoja();
  }

  getFormulariosHoja() {
    const usuario = JSON.parse(localStorage.getItem('usuario')) as Usuario;
    this.listainforme.getIndicadores(usuario._id).subscribe((result) => {
      this.formularios = result;
    });
  }
}
