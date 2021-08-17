import { SidebarService } from './services/sidebar.service';
import { SubirArchivoService } from './services/subir-archivo.service';
import { UsuariosService } from './services/usuarios.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { PipesModule } from './pipes/pipes.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [AppComponent, NopagefoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    AuthModule,
    PipesModule,
    NgxPaginationModule,
    ChartsModule,
  ],
  providers: [
    SubirArchivoService,
    SidebarService,
    UsuariosService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
