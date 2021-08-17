import { IndicadoresService } from '../../../services/indicadores.service';
import { MacroProcesoService } from '../../../services/macro-proceso.service';
import { ResponderService } from '../../../services/responder.service';
import { Responsable } from '../../../models/responsable.Models';
import { UnidadDireccionService } from '../../../services/unidad-direccion.service';
import { Component, OnInit } from '@angular/core';
import { Unidad } from 'src/app/models/unidad.Models';
import { Macro } from 'src/app/models/macroProceso.Model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuarios.models';

@Component({
  selector: 'app-indicadores-gestion',
  templateUrl: './indicadores-gestion.component.html',
  styleUrls: ['./indicadores-gestion.component.css'],
})
export class IndicadoresGestionComponent implements OnInit {
  unidades: Unidad[];
  public formSubmitted = false;
  responder: Responsable[];

  macro: Macro[];
  mostrar = false;
  mostrar2 = false;
  mostrar3 = false;
  mostrar4 = false;
  mostrar5 = false;
  selected: FormControl = new FormControl(null);
  opc: any;

  public registerForm = this.fb.group({
    unidad: ['', [Validators.required]],
    responde: ['', [Validators.required]],
    evaluacion: ['', [Validators.required]],
    macroProceso: ['', [Validators.required]],
    producto: ['', [Validators.required]],
    indicador: ['', [Validators.required]],
    formula: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    responsable: ['', [Validators.required]],
    nombreResponsable: ['', [Validators.required]],
    fechaMedicion: ['', [Validators.required]],
    lineaBase: ['', [Validators.required]],
    comportamiento: ['', [Validators.required]],
    unidadMedida: ['', [Validators.required]],
    sentidoMedicion: ['', [Validators.required]],
    meta: ['', [Validators.required]],

    enero: ['0', [Validators.required]],
    febrero: ['0', [Validators.required]],
    marzo: ['0', [Validators.required]],
    abril: ['0', [Validators.required]],
    mayo: ['0', [Validators.required]],
    junio: ['0', [Validators.required]],
    julio: ['0', [Validators.required]],
    agosto: ['0', [Validators.required]],
    septiembre: ['0', [Validators.required]],
    octubre: ['0', [Validators.required]],
    noviembre: ['0', [Validators.required]],
    diciembre: ['0', [Validators.required]],
    trimestre1: ['0', [Validators.required]],
    trimestre2: ['0', [Validators.required]],
    trimestre3: ['0', [Validators.required]],
    trimestre4: ['0', [Validators.required]],
    cuatrimestral1: ['0', [Validators.required]],
    cuatrimestral2: ['0', [Validators.required]],
    cuatrimestral3: ['0', [Validators.required]],
    semestral1: ['0', [Validators.required]],
    semestral2: ['0', [Validators.required]],
    anual: ['0', [Validators.required]],

    /* Avance Indicador */
    periods: this.fb.array(<any>[]),
    resultYear: this.fb.array(<any>[
      {
        result: '',
        compliance: '',
        class: 'bg-secondary',
        color: '',
      },
    ]),
    solicitaAvanceIndicador: [''],

    observaciones: ['', [Validators.required]],
    periodicidad: [''],
  });

  constructor(
    private _unidad: UnidadDireccionService,
    private _responder: ResponderService,
    private _macro: MacroProcesoService,
    private fb: FormBuilder,
    private _indicadores: IndicadoresService
  ) {}

  ngOnInit(): void {
    this.selected.valueChanges.subscribe((changes) => {
      this.Opciones(changes);
    });

    this.getUnidades();

    this.getResponde();
    this.getMacro();
  }

  getUnidades() {
    return this._unidad.getUnidades().subscribe((resp) => {
      this.unidades = resp;
    });
  }

  getResponde() {
    return this._responder.getResponder().subscribe((result) => {
      this.responder = result;
    });
  }

  getMacro() {
    return this._macro.getMacro().subscribe((result) => {
      this.macro = result;
    });
  }

  Opciones(opc) {
    this.opc;
    if (opc == 'MENSUAL') {
      this.opc = opc;
      this.mostrar = !this.mostrar;
      this.mostrar2 = false;
      this.mostrar3 = false;
      this.mostrar4 = false;
      this.mostrar5 = false;
    } else if (opc == 'TRIMESTRAL') {
      this.opc = opc;
      this.mostrar = false;
      this.mostrar2 = true;
      this.mostrar3 = false;
      this.mostrar4 = false;
      this.mostrar5 = false;
    } else if (opc == 'CUATRIMESTRAL') {      
      this.opc = opc;
      this.mostrar = false;
      this.mostrar2 = false;
      this.mostrar3 = true;
      this.mostrar4 = false;
      this.mostrar5 = false;
    } else if (opc == 'SEMESTRAL') {      
      this.opc = opc;
      this.mostrar = false;
      this.mostrar2 = false;
      this.mostrar3 = false;
      this.mostrar4 = true;
      this.mostrar5 = false;
    } else if (opc == 'ANUAL') {
      this.opc = opc;
      this.mostrar = false;
      this.mostrar2 = false;
      this.mostrar3 = false;
      this.mostrar4 = false;
      this.mostrar5 = true;
    }
  }

  crearInidcador() {
    this.formSubmitted = true;    

    if (this.registerForm.invalid) {
      return;
    }

    // Realizar el posteo
    this.registerForm.value.usuario = JSON.parse(
      localStorage.getItem('usuario')
    ) as Usuario;
    this.registerForm.value.periodicidad = this.opc;

    /* Avance Indicadores*/
    this.registerForm.value.periods = [];
    this.registerForm.value.resultYear[0]['class'] = '';
    this.registerForm.value.resultYear[0]['color'] = '';
    this.registerForm.value.resultYear[0]['compliance'] = '';
    this.registerForm.value.resultYear[0]['result'] = '';
    this.registerForm.value.resultYear[0]['enabled'] = true;
    this.registerForm.value.solicitaAvanceIndicador = 'NO REALIZADA';

    this._indicadores.addOpcion(this.registerForm.value).subscribe(
      (resp) => {
        Swal.fire('Registro  existoso', '', 'success');
      },
      (err) => {
        // Si sucede un error
        //  Swal.fire('Error', err['msg'], 'error' );
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }

  campoNoValido(campo: string): boolean {
    if (this.registerForm.get(campo).invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  /* VALIDAR INPUTS META ANUAL */
  validarMetaAnual() {
    // Validar llenar meta anual
    if (this.registerForm.value.meta == '') {
      Swal.fire('Revisar Formulario', 'Ingrese la Meta Anual', 'warning');
      return;
    }
    //Validacion para el Comportamiento
    if (this.registerForm.value.comportamiento == 'DISCRETO ACUMULADO') {
      // Validacion de Periodos
      this.validarPeriodosMeta('DISCRETO ACUMULADO');
    } else if (this.registerForm.value.comportamiento == 'DISCRETO POR PERIODO') {
      this.validarPeriodosMeta('DISCRETO POR PERIODO');
    } else if (this.registerForm.value.comportamiento == 'CONTINUO') {
      this.validarPeriodosMeta('CONTINUO');
    } else {
      // No a selecciona comportamiento
      Swal.fire(
        'Revisar Formulario',
        'Seleccione el Comportamiento del Indicador',
        'warning'
      );
    }
  }

  validarPeriodosMeta(comportamiento: string) {
    // variable se suma totad los periodos
    let total = 0;
    let habilitarPeriodo = false;
    // Validacion de Periodos Mensual, trimestral....
    switch (this.opc) {
      case 'MENSUAL':
        if (comportamiento == 'DISCRETO ACUMULADO') {
          total =
            +this.registerForm.value.enero +
            +this.registerForm.value.febrero +
            +this.registerForm.value.marzo +
            +this.registerForm.value.abril +
            +this.registerForm.value.mayo +
            +this.registerForm.value.junio +
            +this.registerForm.value.julio +
            +this.registerForm.value.agosto +
            +this.registerForm.value.septiembre +
            +this.registerForm.value.octubre +
            +this.registerForm.value.noviembre +
            +this.registerForm.value.diciembre;
        } else if (comportamiento == 'DISCRETO POR PERIODO') {
          total =
            this.registerForm.value.enero +
            +this.registerForm.value.febrero +
            +this.registerForm.value.marzo +
            +this.registerForm.value.abril +
            +this.registerForm.value.mayo +
            +this.registerForm.value.junio +
            +this.registerForm.value.julio +
            +this.registerForm.value.agosto +
            +this.registerForm.value.septiembre +
            +this.registerForm.value.octubre +
            +this.registerForm.value.noviembre +
            +this.registerForm.value.diciembre;
          // Division de Periodo
          total = total / 12;
        } else if (comportamiento == 'CONTINUO') {
          total = +this.registerForm.value.diciembre;
        }
        //ingresar ultimo valor
        if ( +this.registerForm.value.diciembre > 0 ) {
          habilitarPeriodo = true;
        }
        break;
      case 'TRIMESTRAL':
        if (this.registerForm.value.comportamiento == 'DISCRETO ACUMULADO') {
          // Validacion de Periodos
          total =
            this.registerForm.value.trimestre1 +
            +this.registerForm.value.trimestre2 +
            +this.registerForm.value.trimestre3 +
            +this.registerForm.value.trimestre4;
        } else if (
          this.registerForm.value.comportamiento == 'DISCRETO POR PERIODO'
        ) {
          total =
            this.registerForm.value.trimestre1 +
            +this.registerForm.value.trimestre2 +
            +this.registerForm.value.trimestre3 +
            +this.registerForm.value.trimestre4;
          // Division de Periodo
          total = total / 4;
        } else if (this.registerForm.value.comportamiento == 'CONTINUO') {
          total = +this.registerForm.value.trimestre4;
        }
        //ingresar ultimo valor
        if ( +this.registerForm.value.trimestre4 > 0 ) {
          habilitarPeriodo = true;
        }
        break;
      case 'CUATRIMESTRAL':
        if (this.registerForm.value.comportamiento == 'DISCRETO ACUMULADO') {
          // Validacion de Periodos
          total =
            this.registerForm.value.cuatrimestral1 +
            +this.registerForm.value.cuatrimestral2 +
            +this.registerForm.value.cuatrimestral3;
        } else if (
          this.registerForm.value.comportamiento == 'DISCRETO POR PERIODO'
        ) {
          total =
            this.registerForm.value.cuatrimestral1 +
            +this.registerForm.value.cuatrimestral2 +
            +this.registerForm.value.cuatrimestral3;
          // Division de Periodo
          total = total / 3;
        } else if (this.registerForm.value.comportamiento == 'CONTINUO') {
          total = +this.registerForm.value.cuatrimestral3;
        }
        //ingresar ultimo valor
        if ( +this.registerForm.value.cuatrimestral3 > 0 ) {
          habilitarPeriodo = true;
        }
        break;
      case 'SEMESTRAL':
        if (this.registerForm.value.comportamiento == 'DISCRETO ACUMULADO') {
          // Validacion de Periodos
          total =
            this.registerForm.value.semestral1 +
            +this.registerForm.value.semestral2;
        } else if (
          this.registerForm.value.comportamiento == 'DISCRETO POR PERIODO'
        ) {
          total =
            this.registerForm.value.semestral1 +
            +this.registerForm.value.semestral2;
          // Division de Periodo
          total = total / 2;
        } else if (this.registerForm.value.comportamiento == 'CONTINUO') {
          total = +this.registerForm.value.semestral2;
        }
        //ingresar ultimo valor
        if ( +this.registerForm.value.semestral2 > 0 ) {
          habilitarPeriodo = true;
        }
        break;
      case 'ANUAL':
        if (comportamiento == 'DISCRETO ACUMULADO') {
          total = this.registerForm.value.anual;
        } else if (comportamiento == 'DISCRETO POR PERIODO') {
          total = this.registerForm.value.anual;
          // Division de Periodo
          total = total / 1;
        } else if (comportamiento == 'CONTINUO') {
          total = +this.registerForm.value.anual;
        }
        //ingresar ultimo valor
        if ( +this.registerForm.value.anual > 0 ) {
          habilitarPeriodo = true;
        }
        break;
    }

    if (comportamiento == 'CONTINUO' && total > 0) {
      if (
        total != this.registerForm.value.meta && habilitarPeriodo
      ) {
        Swal.fire(
          'Revisar Valores',
          'El ultimo periodo es diferente a la Meta Anual',
          'warning'
        );
      }
    } else {
      if (total > this.registerForm.value.meta) {
        Swal.fire(
          'Revisar Valores',
          `Los periodos han superado a la Meta Anual el resultado actual es <b>${(total.toFixed(2))}</b>`,
          'warning'
        );
      }
      if (
        total < this.registerForm.value.meta && habilitarPeriodo
      ) {
        Swal.fire(
          'Revisar Valores',
          `Los periodos es menor a la Meta Anual el resultado actual es <b>${total.toFixed(2)}</b>`,
          'warning'
        );
      }
    }
  }

}
