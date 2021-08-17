import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumsComponent } from './breadcrums/breadcrums.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
/* Avance de Indicadores */
import { CalculoDiscretoAcumuladoComponent } from './calculo-discreto-acumulado/calculo-discreto-acumulado.component';

import { PipesModule } from '../pipes/pipes.module';
import { ExportarExcelComponent } from './exportar-excel/exportar-excel.component';
import { SubirExcelComponent } from './subir-excel/subir-excel.component';


@NgModule({
  declarations: [

    BreadcrumsComponent,
    SidebarComponent,
    HeaderComponent,
    /* Avance de Indicadores */
    CalculoDiscretoAcumuladoComponent,
    ExportarExcelComponent,
    SubirExcelComponent
  ],

  exports: [

    BreadcrumsComponent,
    SidebarComponent,
    HeaderComponent,
    /* Avance de Indicadores */
    CalculoDiscretoAcumuladoComponent,
    ExportarExcelComponent,
    SubirExcelComponent
  ],
  providers: [
    DatePipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    PipesModule,
    /* Avance de Indicadores */
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
