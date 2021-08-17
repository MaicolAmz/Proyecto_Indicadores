import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Reforma } from '../models/reforma.models';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ReformaService {

  private opcionesUrl1 =  environment.base_url + '/reforma/todos'; 
  private opcionesUrl =  environment.base_url + '/reforma'; 
  constructor(private http: HttpClient) { }



  getOpciones(): Observable<Reforma[]> {
    return this.http.get<Reforma[]>(this.opcionesUrl1)
  }  

  getReformaId(id: string): Observable<Reforma> {
    const url = `${this.opcionesUrl}/${id}`;
    return this.http.get<Reforma>(url);
  }

  getReforma (usuario_id:string): Observable<Reforma[]> {
    return this.http.get<Reforma[]>(this.opcionesUrl+'?usuario_id='+usuario_id)
  }


  addOpcion (proveedor: Reforma): Observable<Reforma> {
    return this.http.post<Reforma>(this.opcionesUrl, proveedor, httpOptions);
  }

  addOpcion2 (proveedor: Reforma): Observable<Reforma> {
    return this.http.post<Reforma>(this.opcionesUrl, proveedor, httpOptions);
  }

  deleteOpcion (opcion: Reforma | string): Observable<Reforma> {
    const id = typeof opcion === 'string' ? opcion : opcion._id;
    const url = `${this.opcionesUrl}/${id}`;

    return this.http.delete<Reforma>(url, httpOptions);
  }

  updateOpcion (proveedor: Reforma): Observable<any> {
    return this.http.put(this.opcionesUrl, proveedor, httpOptions);
  }


  buscarReforma( termino: string ) {
    let url = `${ environment.base_url }/busqueda/coleccion/reforma/${ termino }`;

    return this.http.get( url ).pipe(map((resp: any) => resp.indicadores ));
   
  }
}
