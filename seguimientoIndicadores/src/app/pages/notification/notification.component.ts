import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { Notification } from 'src/app/models/notification';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from 'src/app/models/usuarios.models';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  usuario: Usuario;

  //Notificacion
  notifications = new Array<Notification>();  
  totalNotification: number = 0;
  desde: number = 0;


  constructor( private _notificationService: GeneralService, private _usuarioService: UsuariosService, 
    private router: Router) { 
    this.usuario = this._usuarioService.usuario;
  }

  ngOnInit(): void {
    this.getAllNotifications();
  }

  getAllNotifications() {
    this._notificationService.get(`notification?user_id=${this.usuario._id}&desde=${this.desde}`).subscribe(
      res => {
        this.totalNotification = res['total'];
        this.notifications = res['data'];
        this.desde = res['desde'];
      }, err => {
        console.error(err);
      }
    )  
  }

  /* Notification */
  viewNotification( notification: Notification ) {
    localStorage.setItem("idNotification", notification._id);
    if ( notification.view ) {
      if( notification.receiver.role == "PLANIFICADOR_ROLE" ){
        this.router.navigate([`/dashboard/indicadores/${notification.uri}`])
      } else if( notification.receiver.role == "UPDI_ROLE" ){
        this.router.navigate([`/dashboard/indicadoresUpdiId/${notification.uri}`])
      }
        
    } else {
      notification.view = true;
      this._notificationService.updateOpcion(notification, `notification`).subscribe(
        res => {
          if( notification.receiver.role == "PLANIFICADOR_ROLE" ){
            this.router.navigate([`/dashboard/indicadores/${notification.uri}`])
          } else if( notification.receiver.role == "UPDI_ROLE" ){
            this.router.navigate([`/dashboard/indicadoresUpdiId/${notification.uri}`])
          }
        }, err => {
          console.error(err);
        }
      )
    }
  }

  deleteNotification(notification: Notification) {
    if( !notification.view ) {
      Swal.fire({
        title: 'Notificación no Revisada?',
        text: "La Notificación no ha sido revisada, ¿Deseas Eliminarla?",
        icon: 'warning',
        showDenyButton: true,
        showCancelButton: true,
        showConfirmButton: false,
        denyButtonText: `Eliminar`,
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isDenied) {
          this._notificationService.deleteOpcion(`notification/${notification._id}`)
            .subscribe( res => {
              this.desde = 0;
              this.getAllNotifications();
              Swal.fire('Notificación Eliminada Correctamente!', '', 'success')
            }, err => {
              console.error(err);
            } )
        }
      })
    } else {
      this._notificationService.deleteOpcion(`notification/${notification._id}`)
        .subscribe( res => {
          this.desde = 0;
          this.getAllNotifications();
        }, err => {
          console.error(err);
        } )
    }
  }

  nextPagina(valor: number, text: string) {
    let envioDesde = this.desde;
    envioDesde += valor;

    if ( text == "NEXT" ) {
      if ( this.desde >= this.totalNotification ) {
        this.desde = this.desde;
      } else {
        if( envioDesde >= this.totalNotification ) {
          this.desde += this.totalNotification-this.desde-1;
        } else {
          this.desde += valor;
        }
        this.getAllNotifications();
      }
    } else {
      if ( envioDesde <= 0 ) {
        this.desde = this.desde;
      } else {
        if ( envioDesde <= 10 )  {
          this.desde = 0;
        } else {
          this.desde += valor;
        }
        this.getAllNotifications();
      }
    }
  }

}
