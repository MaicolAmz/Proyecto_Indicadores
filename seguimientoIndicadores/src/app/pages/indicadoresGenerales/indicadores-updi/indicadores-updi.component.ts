import { Component, OnInit } from '@angular/core';
import { Indicadores } from 'src/app/models/indicadores';
import { GeneralService } from 'src/app/services/general.service';
import { IndicadoresService } from 'src/app/services/indicadores.service';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-indicadores-updi',
  templateUrl: './indicadores-updi.component.html',
  styleUrls: ['./indicadores-updi.component.css'],
})
export class IndicadoresUpdiComponent implements OnInit {
  formularios: Indicadores[] = [];

  totalRegistros: number = 0;

  cargando: boolean = true;

  //Borrar Array Indicadores
  deleteIndicadores: Array<string> = new Array();
  checkAll: boolean = false;

  constructor(
    private listainforme: IndicadoresService,
    private _indicadorService: GeneralService
  ) {}
  ngOnInit() {
    this.getFormulariosHoja();
  }

  getFormulariosHoja() {
    this.formularios = [];
    this.listainforme.getOpciones().subscribe((result) => {
      result.forEach((element) => {
        element.check = this.checkAll;
        this.formularios.push(element);
      });
      this.cargando = false;
      //  localStorage.setItem("Hojavida",JSON.stringify(this.formularios) )
    });
  }

  buscarIndicador(termino: string) {
    if (termino.length <= 0) {
      this.getFormulariosHoja();
      return;
    }

    this.cargando = true;

    this.listainforme
      .buscarIndicadoresUPDI(termino)
      .subscribe((indicadores: Indicadores[]) => {
        this.formularios = [];
        indicadores.forEach((element) => {
          element.check = this.checkAll;
          this.formularios.push(element);
        });
        this.cargando = false;
      });
  }

  deleteIndicador(indicador: Indicadores) {
    Swal.fire({
      title: 'Eliminar',
      text: 'Quieres elimina este indicador para siempre?!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '',
      confirmButtonText: 'Si, borralo!',
      cancelButtonText: 'Cancelar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.listainforme.deleteOpcion(indicador).subscribe(
          (res) => {
            this.formularios.splice(this.formularios.indexOf(indicador), 1);
            Swal.fire('Eliminado!', 'Eliminastes el indicador', 'success');
          },
          (err) => {
            Swal.fire(
              'Error!',
              'Algo Salió Mal, Vuelve a intentar, por favor',
              'error'
            );
          }
        );
      }
    });
  }

  selectIndicador(indicador: Indicadores) {
    indicador.check ? (indicador.check = false) : (indicador.check = true);
    if (indicador.check) {
      this.deleteIndicadores.push(indicador._id);
    } else {
      this.deleteIndicadores.splice(
        this.deleteIndicadores.indexOf(indicador._id),
        1
      );
    }
    if (this.deleteIndicadores.length < this.formularios.length) {
      this.checkAll = false;
    } else {
      this.checkAll = true;
    }
  }

  allDeleteIndicadores() {
    this.checkAll ? (this.checkAll = false) : (this.checkAll = true);
    if (this.checkAll) {
      this.deleteIndicadores = [];
      this.formularios.forEach((element, i) => {
        element.check = true;
        this.deleteIndicadores.push(element._id);
      });
    } else {
      this.deleteIndicadores = [];
      this.formularios.forEach((element, i) => {
        element.check = false;
      });
    }
  }

  deleteAllService() {
    Swal.fire({
      title: 'Eliminar',
      text: 'Quieres elimina todos los indicadores seleccionados?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '',
      confirmButtonText: 'Si, borrar todo!',
      cancelButtonText: 'Cancelar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this._indicadorService
          .deleteAll('indicadores/deleteAll', this.deleteIndicadores)
          .subscribe(
            (res) => {
              this.getFormulariosHoja();
              Swal.fire(
                'Eliminado!',
                'Eliminastes los indicadores seleccionados',
                'success'
              );
            },
            (err) => {
              Swal.fire(
                'Error!',
                'Algo Salió Mal, Vuelve a intentar, por favor',
                'error'
              );
            }
          );
      }
    });
  }
}
