import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Responsable } from '../models/responsable.Models';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};



@Injectable({
  providedIn: 'root'
})
export class ResponderService {
  private opcionesUrl =  environment.base_url + '/respondea'; 
  constructor(private http: HttpClient) { }

  getResponder(): Observable<Responsable[]> {
    return this.http.get<Responsable[]>(this.opcionesUrl)
  }

  getResponderId(id: string): Observable<Responsable> {
    const url = `${this.opcionesUrl}/${id}`;
    return this.http.get<Responsable>(url);
  }

  addResponder (proveedor: Responsable): Observable<Responsable> {
    return this.http.post<Responsable>(this.opcionesUrl, proveedor, httpOptions);
  }

  deleteResponder(opcion: Responsable | string): Observable<Responsable> {
    const id = typeof opcion === 'string' ? opcion : opcion._id;
    const url = `${this.opcionesUrl}/${id}`;

    return this.http.delete<Responsable>(url, httpOptions);
  }

  updateResponder (proveedor: Responsable): Observable<any> {
    return this.http.put(this.opcionesUrl, proveedor, httpOptions);
  }

}

