import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TmdbApiService {

  private readonly baseUrl = environment.tmdb.apiBaseUrl;
  private readonly apiKey = environment.tmdb.apiKey;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, params: any = {}): Observable<T> {

    let httpParams = new HttpParams();

    // 🔹 ADD CUSTOM PARAMS FIRST
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key]);
      }
    });

    // 🔥 CORRECT WAY — ALWAYS ADD api_key PARAM
    httpParams = httpParams.set('api_key', this.apiKey);

    const url = `${this.baseUrl}${endpoint}`;

    console.log('TMDB REQUEST URL:', url);
    console.log('TMDB PARAMS:', httpParams.toString());

    return this.http.get<T>(url, { params: httpParams });
  }
}
