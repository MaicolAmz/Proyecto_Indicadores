import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Macro } from '../models/macroProceso.Model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}; 

@Injectable({
  providedIn: 'root'
})
export class MacroProcesoService {

  private opcionesUrl =  environment.base_url + '/macro'; 
  constructor(private http: HttpClient) { }

  getMacro(): Observable<Macro[]> {
    return this.http.get<Macro[]>(this.opcionesUrl)
  }

  getMacroId(id: string): Observable<Macro> {
    const url = `${this.opcionesUrl}/${id}`;
    return this.http.get<Macro>(url);
  }

  addMacro (proveedor: Macro): Observable<Macro> {
    return this.http.post<Macro>(this.opcionesUrl, proveedor, httpOptions);
  }

  deleteMacro(opcion: Macro | string): Observable<Macro> {
    const id = typeof opcion === 'string' ? opcion : opcion._id;
    const url = `${this.opcionesUrl}/${id}`;

    return this.http.delete<Macro>(url, httpOptions);
  }

  updateMacro (proveedor: Macro): Observable<any> {
    return this.http.put(this.opcionesUrl, proveedor, httpOptions);
  }

}

