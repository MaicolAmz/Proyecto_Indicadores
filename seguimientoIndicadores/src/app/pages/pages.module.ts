import { PipesModule } from './../pipes/pipes.module';
import { AppRoutingModule } from './../app-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PerfilComponent } from './perfil/perfil.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AdminUsuariosComponent } from './administrador/admin-usuarios/admin-usuarios.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { IndicadoresGestionComponent } from './indicadoresGenerales/indicadores-gestion/indicadores-gestion.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { IdIndicadoresComponent } from './indicadoresGenerales/id-indicadores/id-indicadores.component';
import { IndicadoresUpdiComponent } from './indicadoresGenerales/indicadores-updi/indicadores-updi.component';
import { VerindicadoresComponent } from './indicadoresGenerales/verindicadores/verindicadores.component';
import { IdindicadoresUpdiComponent } from './indicadoresGenerales/idindicadores-updi/idindicadores-updi.component';

import { NotificationComponent } from './notification/notification.component';
import { ChartsModule } from 'ng2-charts';
import { IndicadorReportesComponent } from './indicadoresGenerales/indicador-reportes/indicador-reportes.component';
import { AuthInterceptorService } from '../interceptor/auth-interceptor.service';

@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    PerfilComponent,

    AdminUsuariosComponent,
    AccountSettingsComponent,
    IndicadoresGestionComponent,
    VerindicadoresComponent,
    IdIndicadoresComponent,
    IndicadoresUpdiComponent,
    IdindicadoresUpdiComponent,
    NotificationComponent,
    IndicadorReportesComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  exports: [PagesComponent, DashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
    PagesRoutingModule,
    PipesModule,
    NgxPaginationModule,
    ChartsModule,
  ],
})
export class PagesModule {}
