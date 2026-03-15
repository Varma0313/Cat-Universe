import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, CatRaw, CatPayload } from '../models/cat.model';

@Injectable({ providedIn: 'root' })
export class CatApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';
  private readonly jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  getCats(): Observable<ApiResponse<CatRaw[]>> {
    return this.http.get<ApiResponse<CatRaw[]>>(`${this.baseUrl}/list`);
  }

  getCatById(id: string): Observable<ApiResponse<CatRaw[]>> {
    return this.http.get<ApiResponse<CatRaw[]>>(`${this.baseUrl}/list?id=${id}`);
  }

  createCat(payload: CatPayload): Observable<ApiResponse<CatRaw>> {
    return this.http.post<ApiResponse<CatRaw>>(`${this.baseUrl}/create`, payload, { headers: this.jsonHeaders });
  }

  updateCat(id: string, payload: CatPayload): Observable<ApiResponse<CatPayload>> {
    return this.http.put<ApiResponse<CatPayload>>(`${this.baseUrl}/update?id=${id}`, payload, { headers: this.jsonHeaders });
  }

  deleteCat(id: string): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/delete?id=${id}`);
  }
}
