import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Unidad } from '../models/unidad.Models';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UnidadDireccionService {

  private opcionesUrl =  environment.base_url + '/unidades'; 
  constructor(private http: HttpClient) { }

  getUnidades(): Observable<Unidad[]> {
    return this.http.get<Unidad[]>(this.opcionesUrl)
  }

  getUnidad(id: string): Observable<Unidad> {
    const url = `${this.opcionesUrl}/${id}`;
    return this.http.get<Unidad>(url);
  }

  addUnidad (proveedor: Unidad): Observable<Unidad> {
    return this.http.post<Unidad>(this.opcionesUrl, proveedor, httpOptions);
  }

  deleteUnidad(opcion: Unidad | string): Observable<Unidad> {
    const id = typeof opcion === 'string' ? opcion : opcion._id;
    const url = `${this.opcionesUrl}/${id}`;

    return this.http.delete<Unidad>(url, httpOptions);
  }

  updateUnidad (proveedor: Unidad): Observable<any> {
    return this.http.put(this.opcionesUrl, proveedor, httpOptions);
  }

}
