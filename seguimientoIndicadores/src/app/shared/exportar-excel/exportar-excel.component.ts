import { Component, Input, OnInit } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DatePipe } from '@angular/common';
import { Indicadores } from 'src/app/models/indicadores';

@Component({
  selector: 'app-exportar-excel',
  templateUrl: './exportar-excel.component.html',
  styleUrls: ['./exportar-excel.component.css'],
})
export class ExportarExcelComponent implements OnInit {
  @Input('indicadores') indicadores: Indicadores;

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {}

  async generateExcel() {
    // Excel Title, Header, Data
    const title = 'Reporte Indicador';
    const header = [
      'INDICADOR',
      'PERIODICIDAD',
      'COMPORTAMIENTO',
      'SENTIDO DE LA MEDICIÓN',
      'LÍNEA BASE',
      'META',
      'PERIODO',
      '',
      '',
      'ANUAL',
      '',
      '',
    ];
    const data = [
      [
        this.indicadores.indicador,
        this.indicadores.periodicidad,
        this.indicadores.comportamiento,
        this.indicadores.sentidoMedicion,
        this.indicadores.lineaBase,
        this.indicadores.meta,
        'META',
        'RESULTADO',
        'CUMPLIMIENTO',
        'META',
        'RESULTADO',
        'CUMPLIMIENTO',
      ],
    ];

    //filas
    for (let i = 0; i < this.indicadores.periods.length; i++) {
      const element = this.indicadores.periods[i];
      if (i == 0) {
        data.push([
          '',
          '',
          '',
          '',
          '',
          '',
          element.goal,
          element.result,
          (element.compliance * 100).toFixed(2),
          this.indicadores.meta,
          this.indicadores.resultYear[0].result,
          (this.indicadores.resultYear[0].compliance * 100).toFixed(2),
        ]);
      } else {
        data.push([
          '',
          '',
          '',
          '',
          '',
          '',
          element.goal,
          element.result,
          (element.compliance * 100).toFixed(2),
          '',
          '',
          '',
        ]);
      }
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

    worksheet.mergeCells('A1:L2');

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

    headerRow.font = { bold: true };

    worksheet.mergeCells('G5:I5');
    worksheet.mergeCells('J5:L5');
    // worksheet.addRows(data);

    // Add Data and Conditional Formatting
    data.forEach((d, i) => {
      const row = worksheet.addRow(d);
      const qty = row.getCell(9);
      const qty2 = row.getCell(12);

      let color = '';
      let color2 = '';

      if (+qty.value <= 114 && +qty.value >= 85) {
        color = '00A641';
      } else if (+qty.value <= 84 && +qty.value >= 70) {
        color = 'FFFF00';
      } else if (+qty.value < 70) {
        color = 'e51a4c';
      } else if (+qty.value > 114) {
        color = '3BB9FE';
      }

      if (+qty2.value <= 114 && +qty2.value >= 85 && i == 1) {
        color2 = '00A641';
      } else if (+qty2.value <= 84 && +qty2.value >= 70 && i == 1) {
        color2 = 'FFFF00';
      } else if (+qty2.value < 70 && i == 1) {
        color2 = 'e51a4c';
      } else if (+qty2.value > 114 && i == 1) {
        color2 = '3BB9FE';
      }

      qty.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      };

      qty2.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color2 },
      };
    });

    worksheet.getColumn(1).width = 12;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 25;
    worksheet.getColumn(5).width = 12;
    worksheet.getColumn(8).width = 12;
    worksheet.getColumn(9).width = 16;
    worksheet.getColumn(11).width = 12;
    worksheet.getColumn(12).width = 15;
    worksheet.addRow([]);

    //Color
    worksheet.getRow(6).eachCell((cell, number) => {
      if (number >= 7) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFCCFFE5' },
          bgColor: { argb: 'FFCCFFE5' },
        };
        cell.font = { bold: true }
      }
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Footer Row
    const footerRow = worksheet.addRow([
      'LOS VALORES DEL INDICADOR SON LOS ENVIADOS A LA BDD',
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
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'ReportesIndicador.xlsx');
    });
  }
}
