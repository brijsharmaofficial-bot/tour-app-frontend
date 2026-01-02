import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class CityService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // getCities(): Observable<string[]> {
  //   return this.http.get<string[]>(this.apiUrl);
  // }

  // city.service.ts
  getCities(): Observable<{ id: number, name: string }[]> {
    return this.http.get<{ id: number, name: string }[]>(`${this.apiUrl}/cities`);
  }

   getAirportCities(): Observable<{ id: number, name: string }[]> {
    return this.http.get<{ id: number, name: string }[]>(`${this.apiUrl}/airport-cities`);
  }
 
}