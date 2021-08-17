import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UnidadesRectorado } from '../models/unidadesRectorado';
import { Departamento } from '../models/departamento';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  @Injectable({
    providedIn: 'root'
  })

export class UnidadesRectoradoService {

  private opcionesUrl1 =  environment.base_url + '/unidadesRectorado';

  constructor(private http: HttpClient) { }

  getOpciones(): Observable<UnidadesRectorado[]> {
    return this.http.get<UnidadesRectorado[]>(`${this.opcionesUrl1}/todos`);
  }
  getDepartamentos(campus: string): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(`${this.opcionesUrl1}/departamento?campus=${campus}`);
  }
  getUnidadesRectoradoId(id: string): Observable<UnidadesRectorado> {
    const url = `${this.opcionesUrl1}/${id}`;
    return this.http.get<UnidadesRectorado>(url);
  }
  addOpcion (unidadesRectorado: UnidadesRectorado): Observable<UnidadesRectorado> {
    return this.http.post<UnidadesRectorado>(this.opcionesUrl1, unidadesRectorado, httpOptions);
  }

  updateOpcion (unidadesRectorado: UnidadesRectorado): Observable<any> {
    return this.http.put(this.opcionesUrl1, unidadesRectorado, httpOptions);
  }

  deleteOpcion (id: string): Observable<UnidadesRectorado> {
    return this.http.delete<UnidadesRectorado>(this.opcionesUrl1+id, httpOptions);
  }
}