import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getCarOptionsByCities(fromCityId: number, toCityId: number, tripType: string) {
    const requestData = {
      from_city_id: fromCityId,  // Match Laravel validation
      to_city_id: toCityId,      // Match Laravel validation  
      trip_type: tripType        // Match Laravel validation
    };
    
    return this.http.post<any[]>(`${this.apiUrl}/search-cabs`, requestData);
  }

  // get oneway cab by from city id and to city id
  getOnewayCab(fromCityId: number, toCityId: number) {
    const requestData = {
      from_city_id: fromCityId,
      to_city_id: toCityId,
    };
    return this.http.post<any[]>(`${this.apiUrl}/cabs/oneway`, requestData);
  }

  getRoundtripCab(fromCityId: number, toCityId: number) {
    const requestData = {
      from_city_id: fromCityId,
      to_city_id: toCityId,
    };
    return this.http.post<any[]>(`${this.apiUrl}/cabs/roundtrip`, requestData);
  }

  getAirportCab(city_id: number, triptype: string, airport_id:number, airport_type:any) {
    const requestData = {
      city_id: city_id,
      triptype: triptype,
      airport_id: airport_id,
      airport_type:airport_type
    };
    return this.http.post<any[]>(`${this.apiUrl}/cabs/airport`, requestData);
  }

  getLocalCab(city_id: number, hours: number, distance: number) {
    const requestData = {
      from_city_id: city_id,
      hours:hours,
      kms: distance
    };
    return this.http.post<any[]>(`${this.apiUrl}/cabs/local`, requestData);
  }

  getLocalCarOptions(city_id: number, hours: number, distance: number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/local-car-options`, {
      params: { city_id, hours: hours.toString(), distance: distance.toString() }
    });
  }

  getCarTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/car-types`);
  }

  getCarOptions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/car-options`);
  }


  calculateFare(payload: {
    trip_type: string,
    car_type_id: number,
    distance: number
  }) {
    return this.http.post<any>('/api/calculate-fare', payload);
  }





}
