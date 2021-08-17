import { Validators, FormBuilder, FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Indicadores } from 'src/app/models/indicadores';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { GeneralService } from 'src/app/services/general.service';
import { Usuario } from 'src/app/models/usuarios.models';
import { Unidad } from 'src/app/models/unidad.Models';
import { Responsable } from 'src/app/models/responsable.Models';
import { Macro } from 'src/app/models/macroProceso.Model';

declare var $: any;

@Component({
  selector: 'app-subir-excel',
  templateUrl: './subir-excel.component.html',
  styleUrls: ['./subir-excel.component.css'],
})
export class SubirExcelComponent implements OnInit {
  excelSubir: Indicadores[];
  excelTemporal: any;
  excelMalIdentificado: any[];
  metas: Array<any>;
  opc: any;
  inputClass: string;
  indicadorSelected: any;
  corregirOrEditar: string = '';

  filterPost: string = '';

  //Unidad
  unidades = new Array<Unidad>();
  //Unidad
  responder = new Array<Responsable>();
  //Unidad
  macro = new Array<Macro>();

  indicadoresForm = this.fb.group({
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

    observaciones: [''],
    periodicidad: [''],
  });

  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private _indicadorService: GeneralService
  ) {
    this.excelSubir = new Array<Indicadores>();
    this.excelMalIdentificado = new Array<any>();
  }

  ngOnInit(): void {
    $('.dropify').dropify();
    //Unidades
    this.getUnidades();
    //Responde a
    this.getResponde();
    //Macro Proceso
    this.getMacro();
  }

  getUnidades() {
    this._indicadorService.get('unidades').subscribe((res) => {
      this.unidades = res;
    });
  }

  getResponde() {
    return this._indicadorService.get('respondea').subscribe((result) => {
      this.responder = result;
    });
  }

  getMacro() {
    return this._indicadorService.get('macro').subscribe((result) => {
      this.macro = result;
    });
  }

  footableIniciar(element, elementPage, elementFiltro) {
    $(element).footable();
    $(element).trigger('footable_initialize');
    $(elementPage).change(function (e) {
      e.preventDefault();
      var pageSize = $(this).val();
      $(element).data('page-size', pageSize);
      $(element).trigger('footable_initialized');
    });
    // Search input
    $(elementFiltro).on('input', function (e) {
      e.preventDefault();
      element.trigger('footable_filter', { filter: $(this).val() });
    });
  }

  // SUbir Archivo
  async onFileChange(evt: any) {
    this.excelSubir = [];
    this.excelMalIdentificado = [];

    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      wb.SheetNames.forEach((sheet, i) => {
        if (i == 0) {
          let rowObject = XLSX.utils.sheet_to_json(wb.Sheets[sheet], {
            raw: false,
            blankrows: false,
          });
          this.excelTemporal = rowObject;
          this.excelTemporal.forEach((element) => {
            this.ingresarDatosIndicador(element);
          });
          this.inicializarTables();
        }
      });
    };
    reader.readAsBinaryString(target.files[0]);
  }

  progressAlert(evt: any) {
    let timerInterval;

    Swal.fire({
      title: 'Cargando Indicadores :)',
      timer: 5000,
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      willOpen: () => {
        Swal.showLoading();
        //Cargar Indicadores
        setTimeout(() => {
          this.onFileChange(evt);
        }, 100);

        Swal.stopTimer();
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        if (
          this.excelSubir.length == 0 &&
          this.excelMalIdentificado.length == 0
        ) {
          Swal.fire(
            'Algo esta Mal',
            'No se pudo leer ningun indicador en el Archivo',
            'warning'
          );
        } else if (this.excelMalIdentificado.length > 0) {
          Swal.fire(
            'Problema con Indicadores',
            'Algunos Indicadores no se pudieron leer correctamente',
            'warning'
          );
        }
      }
    });
  }

  inicializarTables() {
    const element = $('#demo-foo-accordion');
    const elementPage = $('#demo-show-entries');
    const elementFiltro = $('#demo-input-search1');
    //Parte dos
    const element1 = $('#demo-foo-accordion1');
    const elementPage1 = $('#demo-show-entries1');
    const elementFiltro1 = $('#demo-input-search2');

    setTimeout(() => {
      this.footableIniciar(element, elementPage, elementFiltro);
    }, 500);
    setTimeout(() => {
      this.footableIniciar(element1, elementPage1, elementFiltro1);
    }, 500);
  }

  headerValidar(element, text) {
    let texts = Object.keys(element)
      .map((header, i) => {
        if (header.toLocaleUpperCase().trim().includes(text)) {
          return header;
        }
      })
      .filter(function (item) {
        return item;
      })[0];

    if (element[texts]) {
      if (
        typeof element[texts] === 'string' ||
        element[texts] instanceof String
      ) {
        if (element[texts].includes('%')) {
          element[texts] = element[texts].replace('%', '');
        }
        return element[texts].toLocaleUpperCase().trim();
      } else {
        return element[texts];
      }
    }
    return '';
  }

  validarExistBddUnidad(texto: string, array: any, tipo: string): any {
    let id: any;
    //Quitarmos los espacios del principio y del final
    texto = texto.replace(/^ /, '');
    texto = texto.replace(/ $/, '');

    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      if (
        (element[tipo] as string).includes(texto) &&
        this.contarPalabras(element[tipo]) == this.contarPalabras(texto)
      ) {
        id = element;
      }
    }
    return id;
  }

  contarPalabras(texto: string): number {
    //Reemplazamos los saltos de linea por espacios
    texto = texto.replace(/\r?\n/g, ' ');
    //Reemplazamos los espacios seguidos por uno solo
    texto = texto.replace(/[ ]+/g, ' ');
    //Quitarmos los espacios del principio y del final
    texto = texto.replace(/^ /, '');
    texto = texto.replace(/ $/, '');
    //Troceamos el texto por los espacios
    var textoTroceado = texto.split(' ');
    //Contamos todos los trozos de cadenas que existen
    return textoTroceado.length;
  }

  async ingresarDatosIndicador(element) {
    let indicador = new Indicadores();

    if (this.headerValidar(element, 'UNIDAD /')) {
      //Validar si Existe en BDD
      if (
        this.validarExistBddUnidad(
          this.headerValidar(element, 'UNIDAD /'),
          this.unidades,
          'unidad'
        )
      ) {
        indicador.unidad = this.validarExistBddUnidad(
          this.headerValidar(element, 'UNIDAD /'),
          this.unidades,
          'unidad'
        );
      }
    }
    if (this.headerValidar(element, 'REPORTA')) {
      //Validar si Existe en BDD
      if (
        this.validarExistBddUnidad(
          this.headerValidar(element, 'REPORTA /'),
          this.responder,
          'responde'
        )
      ) {
        indicador.responde = this.validarExistBddUnidad(
          this.headerValidar(element, 'REPORTA /'),
          this.responder,
          'responde'
        );
      }
    }
    if (this.headerValidar(element, 'EVAL')) {
      indicador.evaluacion = this.headerValidar(element, 'EVAL');
    }
    if (this.headerValidar(element, 'MACRO PROCESO')) {
      //Validar si Existe en BDD
      if (
        this.validarExistBddUnidad(
          this.headerValidar(element, 'MACRO PROCESO'),
          this.macro,
          'macroProceso'
        )
      ) {
        indicador.macroProceso = this.validarExistBddUnidad(
          this.headerValidar(element, 'MACRO PROCESO'),
          this.macro,
          'macroProceso'
        );
      }
    }
    if (this.headerValidar(element, 'PRODUCTO')) {
      indicador.producto = this.headerValidar(element, 'PRODUCTO');
    }
    if (this.headerValidar(element, 'NOMBRE')) {
      indicador.indicador = this.headerValidar(element, 'NOMBRE');
    }
    if (this.headerValidar(element, 'FÓRMULA')) {
      indicador.formula = this.headerValidar(element, 'FÓRMULA');
    }
    if (this.headerValidar(element, 'DESCRIPCIÓN')) {
      indicador.descripcion = this.headerValidar(element, 'DESCRIPCIÓN');
    }
    if (this.headerValidar(element, 'RESPONSABLE')) {
      indicador.responsable = this.headerValidar(element, 'RESPONSABLE');
    }
    if (this.headerValidar(element, 'COMPORTAMIENTO')) {
      indicador.comportamiento = this.headerValidar(element, 'COMPORTAMIENTO');
      if (
        indicador.comportamiento == 'DISCRETO POR PERIODO' ||
        indicador.comportamiento == 'DISCRETO ACUMULADO' ||
        indicador.comportamiento == 'CONTINUO'
      ) {
        indicador.comportamiento = indicador.comportamiento;
      } else {
        indicador.comportamiento = undefined;
      }
    }
    if (this.headerValidar(element, 'FECHA DE INICIO DE MEDICIÓN')) {
      indicador.fechaMedicion = this.datePipe.transform(
        new Date(this.headerValidar(element, 'FECHA DE INICIO DE MEDICIÓN')),
        'd/M/yyyy'
      );
    }

    indicador.nombreResponsable = '';
    if (this.headerValidar(element, 'LÍNEA BASE')) {
      indicador.lineaBase = this.headerValidar(element, 'LÍNEA BASE');
    }
    if (this.headerValidar(element, 'UNIDAD DE MEDIDA')) {
      indicador.unidadMedida = this.headerValidar(element, 'UNIDAD DE MEDIDA');
    }
    if (this.headerValidar(element, 'SENTIDO DE LA MEDICIÓN')) {
      indicador.sentidoMedicion = this.headerValidar(
        element,
        'SENTIDO DE LA MEDICIÓN'
      );
      if (
        indicador.sentidoMedicion == 'ASCENDENTE' ||
        indicador.sentidoMedicion == 'DESCENDENTE'
      ) {
        indicador.sentidoMedicion = indicador.sentidoMedicion;
      } else {
        indicador.sentidoMedicion = undefined;
      }
    }
    indicador.meta = this.headerValidar(element, 'META ANUAL');
    if (indicador.meta && Math.floor(+indicador.meta) == 0) {
      indicador.meta = (+indicador.meta * 100).toFixed(2);
    }

    indicador.solicitaAvanceIndicador = 'NO REALIZADA';
    indicador.observaciones = 'N/A';
    if (this.headerValidar(element, 'PERIODICIDAD')) {
      indicador.periodicidad = this.headerValidar(element, 'PERIODICIDAD');
    }

    //Periodos
    if (
      indicador.unidad &&
      indicador.responde &&
      indicador.evaluacion &&
      indicador.periodicidad &&
      indicador.meta &&
      indicador.macroProceso &&
      indicador.producto &&
      indicador.indicador &&
      indicador.formula &&
      indicador.descripcion &&
      indicador.responsable &&
      indicador.comportamiento &&
      indicador.sentidoMedicion &&
      indicador.fechaMedicion &&
      indicador.lineaBase &&
      indicador.unidadMedida &&
      (indicador.comportamiento.includes('DISCRETO ACUMULADO') ||
        indicador.comportamiento.includes('DISCRETO POR PERIODO') ||
        indicador.comportamiento.includes('CONTINUO')) &&
      (indicador.sentidoMedicion.includes('DESCENDENTE') ||
        indicador.sentidoMedicion.includes('ASCENDENTE'))
    ) {
      this.opcionesAvance(
        (
          element['Periodicidad'] ||
          element['periodicidad'] ||
          element['PERIODICIDAD']
        ).toString(),
        element,
        indicador
      );
    } else {
      if (Object.keys(element).length > 6) {
        this.excelMalIdentificado.push(element);
      }
    }
  }

  async agregarMetaPeriodo(
    indicador,
    periodicidad,
    tipo,
    metas: Array<any>,
    element?
  ) {
    //Periodos
    let periodos: Array<number> = metas;
    if (tipo === 'VERIFICAREXCEL') {
      periodos = [];
      metas.forEach((element) => {
        periodos.push(element.goal);
      });
    }

    if (periodicidad == 'MENSUAL') {
      if (periodos.length == 12) {
        //Metas
        indicador.enero = periodos[0];
        indicador.febrero = periodos[1];
        indicador.marzo = periodos[2];
        indicador.abril = periodos[3];
        indicador.mayo = periodos[4];
        indicador.junio = periodos[5];
        indicador.julio = periodos[6];
        indicador.agosto = periodos[7];
        indicador.septiembre = periodos[8];
        indicador.octubre = periodos[9];
        indicador.noviembre = periodos[10];
        indicador.diciembre = periodos[11];

        if (tipo === 'INICIOSUBIREXCEL') {
          this.addPeriod(periodos.length, indicador);
        } else {
          this.calculatYear(indicador);
        }
      } else if (tipo == 'INICIOSUBIREXCEL') {
        this.excelMalIdentificado.push(element);
      }
    } else if (periodicidad == 'TRIMESTRAL') {
      if (periodos.length == 4) {
        //Metas
        indicador.trimestre1 = periodos[0];
        indicador.trimestre2 = periodos[1];
        indicador.trimestre3 = periodos[2];
        indicador.trimestre4 = periodos[3];
        if (tipo === 'INICIOSUBIREXCEL') {
          this.addPeriod(periodos.length, indicador);
        } else {
          this.calculatYear(indicador);
        }
      } else if (tipo == 'INICIOSUBIREXCEL') {
        this.excelMalIdentificado.push(element);
      }
    } else if (periodicidad == 'CUATRIMESTRAL') {
      if (periodos.length == 3) {
        //Metas
        indicador.cuatrimestral1 = periodos[0];
        indicador.cuatrimestral2 = periodos[1];
        indicador.cuatrimestral3 = periodos[2];
        if (tipo === 'INICIOSUBIREXCEL') {
          this.addPeriod(periodos.length, indicador);
        } else {
          this.calculatYear(indicador);
        }
      } else if (tipo == 'INICIOSUBIREXCEL') {
        this.excelMalIdentificado.push(element);
      }
    } else if (periodicidad == 'SEMESTRAL') {
      if (periodos.length == 2) {
        //Metas
        indicador.semestral1 = periodos[0];
        indicador.semestral2 = periodos[1];
        if (tipo === 'INICIOSUBIREXCEL') {
          this.addPeriod(periodos.length, indicador);
        } else {
          this.calculatYear(indicador);
        }
      } else if (tipo == 'INICIOSUBIREXCEL') {
        this.excelMalIdentificado.push(element);
      }
    } else if (periodicidad == 'ANUAL') {
      if (periodos.length == 1) {
        //Metas
        indicador.anual = periodos[0];
        if (tipo === 'INICIOSUBIREXCEL') {
          this.addPeriod(periodos.length, indicador);
        } else {
          this.calculatYear(indicador);
        }
      } else if (tipo == 'INICIOSUBIREXCEL') {
        this.excelMalIdentificado.push(element);
      }
    }
  }

  addMetasPeriodos(element) {
    if (this.headerValidar(element, 'ENERO')) {
      this.metas.push(this.headerValidar(element, 'ENERO'));
    }
    if (this.headerValidar(element, 'FEBRERO')) {
      this.metas.push(this.headerValidar(element, 'FEBRERO'));
    }
    if (this.headerValidar(element, 'MARZO')) {
      this.metas.push(this.headerValidar(element, 'MARZO'));
    }
    if (this.headerValidar(element, 'ABRIL')) {
      this.metas.push(this.headerValidar(element, 'ABRIL'));
    }
    if (this.headerValidar(element, 'MAYO')) {
      this.metas.push(this.headerValidar(element, 'MAYO'));
    }
    if (this.headerValidar(element, 'JUNIO')) {
      this.metas.push(this.headerValidar(element, 'JUNIO'));
    }
    if (this.headerValidar(element, 'JULIO')) {
      this.metas.push(this.headerValidar(element, 'JULIO'));
    }
    if (this.headerValidar(element, 'AGOSTO')) {
      this.metas.push(this.headerValidar(element, 'AGOSTO'));
    }
    if (this.headerValidar(element, 'SEPTIEMBRE')) {
      this.metas.push(this.headerValidar(element, 'SEPTIEMBRE'));
    }
    if (this.headerValidar(element, 'OCTUBRE')) {
      this.metas.push(this.headerValidar(element, 'OCTUBRE'));
    }
    if (this.headerValidar(element, 'NOVIEMBRE')) {
      this.metas.push(this.headerValidar(element, 'NOVIEMBRE'));
    }
    if (this.headerValidar(element, 'DICIEMBRE')) {
      this.metas.push(this.headerValidar(element, 'DICIEMBRE'));
    }
  }

  async opcionesAvance(opc: string, element, indicador: Indicadores) {
    this.opc = opc.toLocaleUpperCase();
    this.metas = [];

    this.addMetasPeriodos(element);

    //Periodos
    this.agregarMetaPeriodo(
      indicador,
      this.opc,
      'INICIOSUBIREXCEL',
      this.metas,
      element
    );
  }

  // Add Period
  async addPeriod(quantity: number, indicador: Indicadores) {
    indicador.periods = [];

    for (let i = 0; i < quantity; i++) {
      const periodFromGroup = {
        goal: this.metas[i],
        result: '',
        compliance: 0,
        class: 'bg-secondary',
        color: '',
        enabled: false,
        solicitud: 'NO REALIZADA',
      };

      indicador.periods.push(periodFromGroup);
    }

    //Assign Resul Year
    this.calculatYear(indicador);
  }

  async calculatYear(indicador: Indicadores) {
    let resulAnual: number = 0;
    let varCompliance: number = 0;
    let resultYearContinuo: number = 0;
    indicador.resultYear = [
      {
        class: '',
        color: '',
        compliance: '',
        result: '',
        enabled: false,
      },
    ];

    for (let i = 0; i < indicador.periods.length; i++) {
      //Validar que no Pase de 115 el cumplimiento
      if (indicador.periods[i]['compliance'] * 100 > 114) {
        //Compliance Year
        varCompliance = 1.15 + varCompliance;
      } else if (indicador.periods[i]['compliance'] != '') {
        //Compliance Year
        varCompliance =
          Number(indicador.periods[i]['compliance']) + varCompliance;
      }

      //Resultado Year
      if (
        indicador.periods[i]['result'] == null ||
        indicador.periods[i]['result'] == ''
      ) {
        indicador.periods[i]['result'] = 0;
      } else if (indicador.comportamiento == 'CONTINUO') {
        resultYearContinuo = indicador.periods[i]['result'];
      }

      resulAnual = Number(indicador.periods[i]['result']) + resulAnual;
    }

    if (indicador.comportamiento == 'DISCRETO POR PERIODO') {
      //validacion de calculo periodo
      resulAnual = resulAnual / indicador.periods.length;
    } else if (indicador.comportamiento == 'DISCRETO ACUMULADO') {
      //validacion de calculo acumulado
      resulAnual = resulAnual;
    } else if (indicador.comportamiento == 'CONTINUO') {
      //validacion de calculo continuo
      resulAnual = resultYearContinuo;
    }

    const resultYearFromGroup = {
      result: resulAnual.toString(),
      //Complaince Year
      compliance: varCompliance / indicador.periods.length,
      class: 'bg-secondary',
      color: '',
      enabled: indicador.resultYear[0].enabled,
    };

    indicador.resultYear = [];

    indicador.resultYear.push(resultYearFromGroup);

    indicador.usuario = JSON.parse(localStorage.getItem('usuario')) as Usuario;

    indicador.solicitaAvanceIndicador = 'NO REALIZADA';

    if (this.corregirOrEditar === 'EDITAR') {
      this.excelSubir.splice(this.indicadorSelected.indice, 1, indicador);
      Swal.fire('Editado!', 'Indicador Editado Correctamente', 'success');
    } else {
      this.excelSubir.push(indicador);
      if (this.corregirOrEditar === 'CORREGIR') {
        Swal.fire('Corregido!', 'Indicador Corregido Correctamente', 'success');
      }
    }

    //Resetear FOrmulario
    this.indicadoresForm.reset();
  }

  //Corregir Indicador
  corregirIndicador(indicador: any, indice: number, tipo: string) {
    this.metas = [];
    this.corregirOrEditar = tipo;
    this.indicadorSelected = {
      indicador: indicador,
      indice: indice,
    };

    let indicadorValidar = {
      unidad:
        tipo === 'CORREGIR'
          ? this.validarExistBddUnidad(
              this.headerValidar(indicador, 'UNIDAD /'),
              this.unidades,
              'unidad'
            )
          : indicador.unidad,
      responde:
        tipo === 'CORREGIR'
          ? this.validarExistBddUnidad(
              this.headerValidar(indicador, 'REPORTA'),
              this.responder,
              'responde'
            )
          : indicador.responde,
      evaluacion:
        tipo === 'CORREGIR'
          ? this.headerValidar(indicador, 'EVAL')
          : (indicador.evaluacion as string).toLocaleUpperCase().trim(),
      macroProceso:
        tipo === 'CORREGIR'
          ? this.validarExistBddUnidad(
              this.headerValidar(indicador, 'MACRO PROCESO'),
              this.macro,
              'macroProceso'
            )
          : indicador.macroProceso,
      producto:
        tipo === 'CORREGIR'
          ? this.headerValidar(indicador, 'PRODUCTO')
          : (indicador.producto as string).toLocaleUpperCase().trim(),
      indicador:
        tipo === 'CORREGIR'
          ? this.headerValidar(indicador, 'NOMBRE')
          : (indicador.indicador as string).toLocaleUpperCase().trim(),
      formula:
        tipo === 'CORREGIR'
          ? this.headerValidar(indicador, 'FÓRMULA')
          : (indicador.formula as string).toLocaleUpperCase().trim(),
      descripcion:
        tipo === 'CORREGIR'
          ? this.headerValidar(indicador, 'DESCRIPCIÓN')
          : (indicador.descripcion  as string).toLocaleUpperCase().trim(),
      responsable:
        tipo === 'CORREGIR'
          ? this.headerValidar(indicador, 'RESPONSABLE')
          : (indicador.responsable as string).toLocaleUpperCase().trim(),
      nombreResponsable: indicador.nombreResponsable,
      fechaMedicion:
        tipo === 'CORREGIR'
          ? this.headerValidar(indicador, 'FECHA DE INICIO')
          : indicador.fechaMedicion,
      lineaBase:
        tipo === 'CORREGIR'
          ? this.headerValidar(indicador, 'LÍNEA BASE')
          : indicador.lineaBase,
      comportamiento:
        tipo === 'CORREGIR'
          ? this.headerValidar(indicador, 'COMPORTAMIENTO')
          : indicador.comportamiento,
      sentidoMedicion:
        tipo === 'CORREGIR'
          ? this.headerValidar(indicador, 'SENTIDO DE LA MEDICIÓN')
          : indicador.sentidoMedicion,
      unidadMedida:
        tipo === 'CORREGIR'
          ? this.headerValidar(indicador, 'UNIDAD DE MEDIDA')
          : indicador.unidadMedida,
      meta:
        tipo === 'CORREGIR'
          ? this.headerValidar(indicador, 'META ANUAL')
          : indicador.meta,
      periodicidad:
        tipo === 'CORREGIR'
          ? this.headerValidar(indicador, 'PERIODICIDAD')
          : indicador.periodicidad,
      observaciones: (indicador.observaciones  as string),
    };

    if (tipo === 'EDITAR') {
      this.editarFormValidator(indicadorValidar as Indicadores);
    } else if (tipo === 'CORREGIR') {
      if (
        indicadorValidar.comportamiento == 'DISCRETO ACUMULADO' ||
        indicadorValidar.comportamiento == 'DISCRETO POR PERIODO' ||
        indicadorValidar.comportamiento == 'CONTINUO'
      ) {
        indicadorValidar.comportamiento = indicadorValidar.comportamiento;
      } else {
        indicadorValidar.comportamiento = undefined;
      }

      if (
        indicadorValidar.sentidoMedicion == 'ASCENDENTE' ||
        indicadorValidar.sentidoMedicion == 'DESCENDENTE'
      ) {
        indicadorValidar.sentidoMedicion = indicadorValidar.sentidoMedicion;
      } else {
        indicadorValidar.sentidoMedicion = undefined;
      }

      this.editarFormValidator(indicadorValidar as Indicadores);
    }
    this.addMetasPeriodos(indicador);
    this.changePeriodo();
  }

  editarFormValidator(indicador: Indicadores) {
    this.indicadoresForm = this.fb.group({
      unidad: [indicador.unidad, [Validators.required]],
      responde: [indicador.responde, [Validators.required]],
      evaluacion: [indicador.evaluacion, [Validators.required]],
      macroProceso: [indicador.macroProceso, [Validators.required]],
      producto: [indicador.producto, [Validators.required]],
      indicador: [indicador.indicador, [Validators.required]],
      formula: [indicador.formula, [Validators.required]],
      descripcion: [indicador.descripcion, [Validators.required]],
      responsable: [indicador.responsable, [Validators.required]],
      nombreResponsable: [indicador.nombreResponsable, [Validators.required]],
      fechaMedicion: [indicador.fechaMedicion, [Validators.required]],
      lineaBase: [indicador.lineaBase, [Validators.required]],
      comportamiento: [indicador.comportamiento, [Validators.required]],
      unidadMedida: [indicador.unidadMedida, [Validators.required]],
      sentidoMedicion: [indicador.sentidoMedicion, [Validators.required]],
      meta: [indicador.meta, [Validators.required]],

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

      observaciones: [indicador.observaciones],
      periodicidad: [indicador.periodicidad, [Validators.required]],
    });
  }

  changePeriodo() {
    this.deletePeriod();
    if (this.indicadoresForm.value.periodicidad == 'MENSUAL') {
      this.inputClass = 'col-md-3';
      this.addPeriodoNoIdentificado(12);
    } else if (this.indicadoresForm.value.periodicidad == 'TRIMESTRAL') {
      this.inputClass = 'col-md-3';
      this.addPeriodoNoIdentificado(4);
    } else if (this.indicadoresForm.value.periodicidad == 'CUATRIMESTRAL') {
      this.inputClass = 'col-md-4';
      this.addPeriodoNoIdentificado(3);
    } else if (this.indicadoresForm.value.periodicidad == 'SEMESTRAL') {
      this.inputClass = 'col-md-6';
      this.addPeriodoNoIdentificado(2);
    } else if (this.indicadoresForm.value.periodicidad == 'ANUAL') {
      this.inputClass = 'col-md-12';
      this.addPeriodoNoIdentificado(1);
    }
  }

  // Add Period
  addPeriodoNoIdentificado(quantity) {
    for (let i = 0; i < quantity; i++) {
      let periodFromGroup = this.fb.group({
        goal: [this.metas[i], [Validators.required]],
        result: '',
        compliance: 0,
        class: 'bg-secondary',
        color: '',
        enabled: false,
        solicitud: 'NO REALIZADA',
      });

      if (this.corregirOrEditar === 'EDITAR') {
        if (this.indicadorSelected.indicador.periods.length > 0) {
          periodFromGroup.setValue({
            goal: this.indicadorSelected.indicador.periods[i].goal,
            result: '',
            compliance: 0,
            class: 'bg-secondary',
            color: '',
            enabled: false,
            solicitud: 'NO REALIZADA',
          });
        }
        this.periods.push(periodFromGroup);
      } else if (this.corregirOrEditar === 'CORREGIR') {
        if (this.metas.length == quantity) {
          periodFromGroup.setValue({
            goal: this.metas[i],
            result: '',
            compliance: 0,
            class: 'bg-secondary',
            color: '',
            enabled: false,
            solicitud: 'NO REALIZADA',
          });
        }
        this.periods.push(periodFromGroup);
      }
    }
  }

  get periods() {
    return this.indicadoresForm.get('periods') as FormArray;
  }

  deletePeriod() {
    this.periods.controls.splice(0, this.periods.length);
  }

  eliminarExcelSubida(indice: number) {
    const addrow = $('#demo-foo-accordion');
    addrow.footable().on('click', '.delete-row-btn', function () {
      //get the footable object
      var footable = addrow.data('footable');

      //get the row we are wanting to delete
      var row = $(this).parents('tr:first');

      //delete the row
      footable.removeRow(row);
    });
    this.excelSubir.splice(indice, 1);
  }

  eliminarExcelMalIdentificado(indice: number) {
    const addrow = $('#demo-foo-accordion');
    addrow.footable().on('click', '.delete-row-btn', function () {
      //get the footable object
      var footable = addrow.data('footable');

      //get the row we are wanting to delete
      var row = $(this).parents('tr:first');

      //delete the row
      footable.removeRow(row);
    });
    this.excelMalIdentificado.splice(indice, 1);
  }

  verificarByIdCampo(array: any, id: string): any {
    let campo: any;
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      if (element._id == id) {
        campo = element;
      }
    }
    return campo;
  }

  verificarIndicador() {
    if (this.corregirOrEditar == 'CORREGIR') {
      this.excelMalIdentificado.splice(this.indicadorSelected.indice, 1);
    }

    //Unidad
    if (typeof this.indicadoresForm.value.unidad !== 'object') {
      this.indicadoresForm.controls.unidad.setValue(
        this.verificarByIdCampo(
          this.unidades,
          this.indicadoresForm.value.unidad
        )
      );
    }
    //Responsable
    if (typeof this.indicadoresForm.value.responde !== 'object') {
      this.indicadoresForm.controls.responde.setValue(
        this.verificarByIdCampo(
          this.responder,
          this.indicadoresForm.value.responde
        )
      );
    }
    //Macro Proceso
    if (typeof this.indicadoresForm.value.macroProceso !== 'object') {
      this.indicadoresForm.controls.macroProceso.setValue(
        this.verificarByIdCampo(
          this.macro,
          this.indicadoresForm.value.macroProceso
        )
      );
    }

    this.agregarMetaPeriodo(
      this.indicadoresForm.value,
      (this.indicadoresForm.value.periodicidad as string)
        .toLocaleUpperCase()
        .trim(),
      'VERIFICAREXCEL',
      this.indicadoresForm.value.periods
    );
    this.inicializarTables();
    $('#exampleModal').modal('toggle');
  }

  borrarTodoExcelMal() {
    Swal.fire({
      text: 'Quieres eliminar todos los Indicadores mal Identificados?',
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: 'Cancelar',
      denyButtonText: `Si, borrar todo`,
    }).then((result) => {
      if (result.isDenied) {
        this.excelMalIdentificado = [];
        Swal.fire('Borrado!', 'Eliminado Todo con Éxito', 'success');
      }
    });
  }

  guardarIndicadores() {
    Swal.fire({
      title: 'Confirmacion',
      text: 'Quieres guardar todos los Indicadores?',
      icon: 'info',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: `Si, guardar todo`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.guardarServicio();
      }
    });
  }

  guardarServicio() {
    this._indicadorService
      .create(this.excelSubir, 'indicadores/todos')
      .subscribe(
        (res) => {
          Swal.fire('Guardados!', 'Indicadores Guardados con Éxito', 'success');
          this.excelSubir = [];
        },
        (err) => {
          Swal.fire(
            'Error!',
            'Algo esta Mal, Vuelve a intentar por favor',
            'error'
          );
        }
      );
  }

  /* VALIDAR INPUTS META ANUAL */
  validarMetaAnual() {
    // Validar llenar meta anual
    if (this.indicadoresForm.value.meta == '') {
      Swal.fire('Revisar Formulario', 'Ingrese la Meta Anual', 'warning');
      return;
    }
    //Validacion para el Comportamiento
    if (this.indicadoresForm.value.comportamiento == 'DISCRETO ACUMULADO') {
      // Validacion de Periodos
      this.validarPeriodosMeta('DISCRETO ACUMULADO');
    } else if (
      this.indicadoresForm.value.comportamiento == 'DISCRETO POR PERIODO'
    ) {
      this.validarPeriodosMeta('DISCRETO POR PERIODO');
    } else if (this.indicadoresForm.value.comportamiento == 'CONTINUO') {
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
    switch (this.indicadoresForm.value.periodicidad) {
      case 'MENSUAL':
        if (comportamiento == 'DISCRETO ACUMULADO') {
          total =
            +this.indicadoresForm.value.periods[0].goal +
            +this.indicadoresForm.value.periods[1].goal +
            +this.indicadoresForm.value.periods[2].goal +
            +this.indicadoresForm.value.periods[3].goal +
            +this.indicadoresForm.value.periods[4].goal +
            +this.indicadoresForm.value.periods[5].goal +
            +this.indicadoresForm.value.periods[6].goal +
            +this.indicadoresForm.value.periods[7].goal +
            +this.indicadoresForm.value.periods[8].goal +
            +this.indicadoresForm.value.periods[9].goal +
            +this.indicadoresForm.value.periods[10].goal +
            +this.indicadoresForm.value.periods[11].goal;
        } else if (comportamiento == 'DISCRETO POR PERIODO') {
          total =
            +this.indicadoresForm.value.periods[0].goal +
            +this.indicadoresForm.value.periods[1].goal +
            +this.indicadoresForm.value.periods[2].goal +
            +this.indicadoresForm.value.periods[3].goal +
            +this.indicadoresForm.value.periods[4].goal +
            +this.indicadoresForm.value.periods[5].goal +
            +this.indicadoresForm.value.periods[6].goal +
            +this.indicadoresForm.value.periods[7].goal +
            +this.indicadoresForm.value.periods[8].goal +
            +this.indicadoresForm.value.periods[9].goal +
            +this.indicadoresForm.value.periods[10].goal +
            +this.indicadoresForm.value.periods[11].goal;
          // Division de Periodo
          total = total / 12;
        } else if (comportamiento == 'CONTINUO') {
          total = +this.indicadoresForm.value.periods[11].goal;
        }
        //ingresar ultimo valor
        if (+this.indicadoresForm.value.periods[11].goal > 0) {
          habilitarPeriodo = true;
        }
        break;
      case 'TRIMESTRAL':
        if (this.indicadoresForm.value.comportamiento == 'DISCRETO ACUMULADO') {
          // Validacion de Periodos
          total =
            +this.indicadoresForm.value.periods[0].goal +
            +this.indicadoresForm.value.periods[1].goal +
            +this.indicadoresForm.value.periods[2].goal +
            +this.indicadoresForm.value.periods[3].goal;
        } else if (
          this.indicadoresForm.value.comportamiento == 'DISCRETO POR PERIODO'
        ) {
          total =
            +this.indicadoresForm.value.periods[0].goal +
            +this.indicadoresForm.value.periods[1].goal +
            +this.indicadoresForm.value.periods[2].goal +
            +this.indicadoresForm.value.periods[3].goal;
          // Division de Periodo
          total = total / 4;
        } else if (this.indicadoresForm.value.comportamiento == 'CONTINUO') {
          total = +this.indicadoresForm.value.periods[3].goal;
        }
        //ingresar ultimo valor
        if (+this.indicadoresForm.value.periods[3].goal > 0) {
          habilitarPeriodo = true;
        }
        break;
      case 'CUATRIMESTRAL':
        if (this.indicadoresForm.value.comportamiento == 'DISCRETO ACUMULADO') {
          // Validacion de Periodos
          total =
            +this.indicadoresForm.value.periods[0].goal +
            +this.indicadoresForm.value.periods[1].goal +
            +this.indicadoresForm.value.periods[2].goal;
        } else if (
          this.indicadoresForm.value.comportamiento == 'DISCRETO POR PERIODO'
        ) {
          total =
            +this.indicadoresForm.value.periods[0].goal +
            +this.indicadoresForm.value.periods[1].goal +
            +this.indicadoresForm.value.periods[2].goal;
          // Division de Periodo
          total = total / 3;
        } else if (this.indicadoresForm.value.comportamiento == 'CONTINUO') {
          total = +this.indicadoresForm.value.periods[2].goal;
        }
        //ingresar ultimo valor
        if (+this.indicadoresForm.value.periods[2].goal > 0) {
          habilitarPeriodo = true;
        }
        break;
      case 'SEMESTRAL':
        if (this.indicadoresForm.value.comportamiento == 'DISCRETO ACUMULADO') {
          // Validacion de Periodos
          total =
            +this.indicadoresForm.value.periods[0].goal +
            +this.indicadoresForm.value.periods[1].goal;
        } else if (
          this.indicadoresForm.value.comportamiento == 'DISCRETO POR PERIODO'
        ) {
          total =
            +this.indicadoresForm.value.periods[0].goal +
            +this.indicadoresForm.value.periods[1].goal;
          // Division de Periodo
          total = total / 2;
        } else if (this.indicadoresForm.value.comportamiento == 'CONTINUO') {
          total = +this.indicadoresForm.value.periods[1].goal;
        }
        //ingresar ultimo valor
        if (+this.indicadoresForm.value.periods[1].goal > 0) {
          habilitarPeriodo = true;
        }
        break;
      case 'ANUAL':
        if (comportamiento == 'DISCRETO ACUMULADO') {
          total = +this.indicadoresForm.value.periods[0].goal;
        } else if (comportamiento == 'DISCRETO POR PERIODO') {
          total = +this.indicadoresForm.value.periods[0].goal;
          // Division de Periodo
          total = total / 1;
        } else if (comportamiento == 'CONTINUO') {
          total = ++this.indicadoresForm.value.periods[0].goal;
        }
        //ingresar ultimo valor
        if (++this.indicadoresForm.value.periods[0].goal > 0) {
          habilitarPeriodo = true;
        }
        break;
    }

    if (comportamiento == 'CONTINUO' && total > 0) {
      if (total != this.indicadoresForm.value.meta && habilitarPeriodo) {
        Swal.fire(
          'Revisar Valores',
          'El ultimo periodo es diferente a la Meta Anual',
          'warning'
        );
      }
    } else {
      if (total > this.indicadoresForm.value.meta) {
        Swal.fire(
          'Revisar Valores',
          `Los periodos han superado a la Meta Anual el resultado actual es <b>${total.toFixed(
            2
          )}</b>`,
          'warning'
        );
      }
      if (total < this.indicadoresForm.value.meta && habilitarPeriodo) {
        Swal.fire(
          'Revisar Valores',
          `Los periodos es menor a la Meta Anual el resultado actual es <b>${total.toFixed(
            2
          )}</b>`,
          'warning'
        );
      }
    }
  }

  //Descargar
  descargarPlantilla() {
    this._indicadorService
      .descargar(
        `indicadores/descargar?tipo=archivos&file=plantillaIndicadores.xlsx`
      )
      .subscribe(
        (res) => {
          this.manageExcelFile(res);
        },
        (err) => {
          console.error(err);
        }
      );
  }

  manageExcelFile(response: any): void {
    const dataType = response.type;
    const binaryData = [];
    binaryData.push(response);

    const filtePath = window.URL.createObjectURL(
      new Blob(binaryData, { type: dataType })
    );
    const downloadLink = document.createElement('a');
    downloadLink.href = filtePath;
    downloadLink.setAttribute('download', 'plantillaIndicadores.xlsx');
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }
}
