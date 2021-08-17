import { GeneralService } from 'src/app/services/general.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Unidad } from 'src/app/models/unidad.Models';
import { Indicadores } from 'src/app/models/indicadores';

import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DatePipe } from '@angular/common';

import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-indicador-reportes',
  templateUrl: './indicador-reportes.component.html',
  styleUrls: ['./indicador-reportes.component.css'],
})
export class IndicadorReportesComponent implements OnInit {
  unidades = new Array<Unidad>();
  indicadores = new Array<Indicadores>();

  cumplimientoGlobal: number = 0;
  resultadoGlobal: number = 0;
  metaGlobal: number = 0;

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };

  public barChartLabels: Label[] = ['Global'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [0], label: 'Meta' },
    { data: [0], label: 'Resultado' },
    { data: [0], label: 'Cumplimiento' },
  ];

  public filtroForm = this.fb.group({
    unidad: ['TODOS', [Validators.required]],
    desde: ['', [Validators.required]],
    hasta: ['', [Validators.required]],
  });

  img: string = '';
  cargarReporte: boolean = false;

  constructor(
    private _filtroIndicador: GeneralService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getUnidades();
  }

  getUnidades() {
    this._filtroIndicador.get('unidades').subscribe((resp) => {
      this.unidades = resp;
    });
  }

  filtroIndicadorLoading() {
    let timerInterval;
    Swal.fire({
      title: 'Buscando Indicadores :)',
      timer: 3500,
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      willOpen: () => {
        Swal.showLoading();
        //Cargar Indicadores
        this.filtroIndicador();
        Swal.stopTimer();
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        if (this.indicadores.length == 0) {
          Swal.fire(
            'Ningún Indicador Encontrado',
            'No pudimos encontra ningún indicador con este filtro',
            'success'
          );
        }
      }
    });
  }

  filtroIndicador() {
    this.indicadores = [];
    const element = $('#demo-foo-accordion');
    const elementPage = $('#demo-show-entries');
    const elementFiltro = $('#demo-input-search');
    this._filtroIndicador
      .get(
        `indicadores/filtros?desde=${this.filtroForm.value.desde}&hasta=${this.filtroForm.value.hasta}&unidad=${this.filtroForm.value.unidad}`
      )
      .subscribe(
        async (res) => {
          this.indicadores = res['data'];
          setTimeout(() => {
            this.footableIniciar(element, elementPage, elementFiltro);
          }, 500);
          await this.calcularTotalIndicador();
          this.cargarReporte = false;
        },
        (err) => {
          console.error(err);
          this.cargarReporte = false;
        }
      );
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

  calcularTotalIndicador() {
    this.cumplimientoGlobal = 0;
    this.resultadoGlobal = 0;
    this.metaGlobal = 0;

    //Graficas
    this.barChartData = [];
    //Calcular Cumplimiento Global
    this.indicadores.forEach((element) => {
      this.cumplimientoGlobal += +element.resultYear[0].compliance;
      this.metaGlobal += +element.meta;
      this.resultadoGlobal += +element.resultYear[0].result;
    });

    this.cumplimientoGlobal = this.cumplimientoGlobal / this.indicadores.length;
    this.resultadoGlobal = this.resultadoGlobal / this.indicadores.length;
    this.metaGlobal = this.metaGlobal / this.indicadores.length;

    //Gráfica
    this.barChartData.push({
      data: [+(+this.metaGlobal.toFixed(2))],
      label: 'Meta',
    });
    this.barChartData.push({
      data: [+(+this.resultadoGlobal.toFixed(2))],
      label: 'Resultado',
    });
    this.barChartData.push({
      data: [+(+(this.cumplimientoGlobal * 100).toFixed(2))],
      label: 'Cumplimiento',
    });
  }

  colorCumplimiento(cumplimiento: number) {
    return cumplimiento * 100 > 85 && cumplimiento * 100 < 114
      ? 'green'
      : cumplimiento * 100 < 84 && cumplimiento * 100 > 70
      ? 'yellow'
      : cumplimiento * 100 < 70
      ? 'red'
      : cumplimiento * 100 > 114
      ? 'blue'
      : null;
  }

  dataArchivo() {
    let data = [];
    for (let i = 0; i < this.indicadores.length; i++) {
      const element = this.indicadores[i];
      data.push({
        indicador: element.indicador,
        unidad: element.unidad.unidad,
        responsable: element.responsable,
        fechaReporte: element.fechaReporte,
        periodicidad: element.periodicidad,
        comportamiento: element.comportamiento,
        sentidoMedicion: element.sentidoMedicion,
        metaIndicador: element.meta,
        resultIndicador: element.resultYear[0].result,
        cumplimientoIndicador: element.resultYear[0].compliance,
      });
    }
    const cumplimientoColor = this.colorCumplimiento(this.cumplimientoGlobal);

    const total = {
      numero: this.cumplimientoGlobal,
      color: cumplimientoColor,
    };

    if (this.img != '') {
      this.generatePDF(data, total);
    } else {
      Swal.fire('Error', 'Algo esta mal, vuelve a intentar porfavor', 'error');
    }
  }

  generateImg() {
    window.scrollTo(0, 0);
    html2canvas(document.getElementById('screenPPP')).then((canvas) => {
      this.img = canvas.toDataURL();
    });
    this.cargarReporte = true;
  }

  getProfilePicObject() {
    if (this.img) {
      return {
        image: this.img,
        width: 500,
        alignment: 'center',
      };
    }
  }

  buscarUnidadById(array: Unidad[], id: string): string {
    let unidad: string = '';
    array.forEach((element) => {
      if (element._id === id) {
        unidad = element.unidad;
      }
    });
    if (id == 'TODOS') {
      return 'TODOS';
    }
    return unidad;
  }

  async generatePDF(data, total) {
    let docDefinition = {
      content: [
        {
          text: `${this.datePipe.transform(new Date(), 'mediumDate')}`,
          style: ['quote', 'small'],
          alignment: 'right',
        },
        {
          text: '\nREPORTE',
          fontSize: 16,
          alignment: 'center',
          color: '#047886',
        },
        {
          text: `Especificaciones`,
          style: ['quote', 'small', 'sectionHeader'],
        },
        {
          ul: [
            `Unidad: ${await this.buscarUnidadById(
              this.unidades,
              this.filtroForm.value.unidad
            )}`,
            `Desde: ${this.filtroForm.value.desde}`,
            `Hasta: ${this.filtroForm.value.hasta}`,
          ],
        },
        {
          text: 'Cumplimiento Global',
          style: 'sectionHeader',
        },
        {
          table: {
            headerRows: 1,
            widths: ['*'],
            body: [
              [
                {
                  text: 'Cumplimiento',
                  alignment: 'center',
                  fillOpacity: 0.6,
                  fillColor: total.color,
                },
              ],
              [
                {
                  text: (+total.numero * 100).toFixed(2) + '%',
                  alignment: 'center',
                },
              ],
            ],
          },
        },
        {
          text: 'Gráfica de Indicadores',
          style: 'sectionHeader',
        },
        {
          columns: [[this.getProfilePicObject()]],
        },
        {
          text: 'Detalles Indicador',
          style: 'sectionHeader',
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                'Indicador',
                'unidad',
                'Fecha',
                'Comportamiento',
                'Meta',
                'Resultado',
                'Cumplimiento',
              ],

              ...data.map((p) => [
                p.indicador,
                p.unidad,
                this.datePipe.transform(p.fechaReporte, 'mediumDate'),
                p.comportamiento,
                p.metaIndicador,
                p.resultIndicador,
                {
                  text: (p.cumplimientoIndicador * 100).toFixed(2) + '%',
                  fillOpacity: 0.6,
                  fillColor: this.colorCumplimiento(p.cumplimientoIndicador),
                },
              ]),
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex % 2 === 0 ? '#CCCCCC' : null;
            },
          },
        },
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15],
        },
        tableHeader: {
          fontSize: 10,
          margin: [0, 15, 0, 15],
          alignment: 'center',
        },
      },
    };
    pdfMake.createPdf(docDefinition).open();
  }

  async generateExcel() {
    // Excel Title, Header, Data
    const title = 'Reporte';
    const header = [
      'Indicador',
      'unidad',
      'Responsable',
      'Fecha',
      'Periodicidad',
      'Comportamiento',
      'Sentido de Medicion',
      'Meta',
      'Resultado',
      'Cumplimiento',
    ];
    let data = [];

    for (let i = 0; i < this.indicadores.length; i++) {
      const element = this.indicadores[i];

      data.push([
        element.indicador,
        element.unidad.unidad,
        element.responsable,
        this.datePipe.transform(element.fechaReporte, 'mediumDate'),
        element.periodicidad,
        element.comportamiento,
        element.sentidoMedicion,
        element.meta,
        element.resultYear[0].result,
        (element.resultYear[0].compliance * 100).toFixed(2),
      ]);
    }

    // Create workbook and worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Indicador Data');

    // Add Row and formatting
    const titleRow = worksheet.addRow([title]);
    titleRow.font = {
      name: 'Times New Roman',
      family: 4,
      size: 16,
      underline: 'double',
      bold: true,
    };
    worksheet.addRow([]);
    const subTitleRow = worksheet.addRow([
      'Fecha : ' + this.datePipe.transform(new Date(), 'medium'),
    ]);

    worksheet.mergeCells('A1:J2');

    // Blank Row
    worksheet.addRow([]);

    // Add Header Row
    const headerRow = worksheet.addRow(header);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCFFE5' },
        bgColor: { argb: 'FFCCFFE5' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
    // worksheet.addRows(data);

    // Add Data and Conditional Formatting
    data.forEach((d) => {
      const row = worksheet.addRow(d);
      const qty = row.getCell(10);

      let color = '';

      if (+qty.value <= 114 && +qty.value >= 85) {
        color = '00A641';
      } else if (+qty.value <= 84 && +qty.value >= 70) {
        color = 'FFFF00';
      } else if (+qty.value < 70) {
        color = 'e51a4c';
      } else if (+qty.value > 114) {
        color = '3BB9FE';
      }

      qty.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      };
    });

    worksheet.autoFilter = {
      from: 'A5',
      to: 'J5',
    };
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(2).width = 25;
    worksheet.getColumn(3).width = 35;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 25;
    worksheet.getColumn(7).width = 21;
    worksheet.getColumn(9).width = 14;
    worksheet.getColumn(10).width = 15;
    worksheet.addRow([]);

    // Footer Row
    const footerRow = worksheet.addRow([
      `Los Indicadores son según ( Departamento: ${this.buscarUnidadById(
        this.unidades,
        this.filtroForm.value.unidad
      )} & Desde: ${this.filtroForm.value.desde} - Hasta: ${
        this.filtroForm.value.hasta
      }  )`,
    ]);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFCCFFE5' },
    };
    footerRow.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    // Merge Cells
    worksheet.mergeCells(`A${footerRow.number}+:L${footerRow.number}`);

    /* Generate Excel File with given name */
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(
        blob,
        `Reporte-${this.buscarUnidadById(
          this.unidades,
          this.filtroForm.value.unidad
        )}(${this.filtroForm.value.desde})-(${
          this.filtroForm.value.hasta
        }).xlsx`
      );
    });
  }
}
