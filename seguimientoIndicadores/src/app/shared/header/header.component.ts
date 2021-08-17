import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Notification } from 'src/app/models/notification';
import { Usuario } from 'src/app/models/usuarios.models';
import { GeneralService } from 'src/app/services/general.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

declare function customInitFunctions();
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  usuario: Usuario;

  //Notificacion
  notifications = new Array<Notification>();
  newNotifications: number;

  constructor(
    private _usuarioService: UsuariosService,
    private _notificationService: GeneralService,
    private router: Router
  ) {
    if (_usuarioService.estaLogueado) {
      this.usuario = this._usuarioService.usuario;
    }
  }

  ngOnInit() {
    customInitFunctions();
    //Notificacion
    this.getNotifications();
  }

  logOut() {
    this._usuarioService.logOut();
  }

  activar() {
    customInitFunctions();
  }

  getNotifications() {
    this.newNotifications = 0;
    this._notificationService
      .get(`notification?user_id=${this.usuario._id}`)
      .subscribe(
        (res) => {
          this.notifications = res['data'];
          this.notifications.forEach((element) => {
            if (!element.view) {
              this.newNotifications += 1;
            }
          });
        },
        (err) => {
          console.error(err);
        }
      );
  }

  /* Notification */
  viewNotification(notification: Notification) {
    localStorage.setItem('idNotification', notification._id);
    if (notification.view) {
      this.routerNavigate(notification);
    } else {
      notification.view = true;
      this._notificationService
        .updateOpcion(notification, `notification`)
        .subscribe(
          (res) => {
            this.routerNavigate(notification);
          },
          (err) => {
            console.error(err);
          }
        );
    }
  }

  routerNavigate(notification: Notification) {
    if (notification.receiver.role == 'PLANIFICADOR_ROLE') {
      this.router
        .navigateByUrl(`/`, {
          skipLocationChange: true,
        })
        .then(() => {
          this.router.navigate([`dashboard/indicadores/${notification.uri}`]);
        });
    } else if (notification.receiver.role == 'UPDI_ROLE') {
      this.router
        .navigateByUrl(`/`, {
          skipLocationChange: true,
        })
        .then(() => {
          this.router.navigate([
            `dashboard/indicadoresUpdiId/${notification.uri}`,
          ]);
        });
    }
  }
}
