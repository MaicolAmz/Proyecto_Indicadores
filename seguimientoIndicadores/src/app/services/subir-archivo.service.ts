import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable()
export class SubirArchivoService {

  constructor() { }


  subirArchivo( archivo: File, tipo: string, id: string ) {

    return new Promise( (resolve, reject ) => {

      let formData = new FormData();
      let xhr = new XMLHttpRequest();

      formData.append( 'imagen', archivo, archivo.name );

      xhr.onreadystatechange = function() {

        if ( xhr.readyState === 4 ) {

          if ( xhr.status === 200 ) {
            console.log( 'Imagen subida' );
            resolve( JSON.parse( xhr.response ) );
          } else {
            console.error( 'Fallo la subida' );
            reject( xhr.response );
          }

        }
      };

      let url = environment.base_url + '/upload/' + tipo + '/' + id;

      xhr.open('PUT', url, true );
      xhr.send( formData );

    });
  }
}
