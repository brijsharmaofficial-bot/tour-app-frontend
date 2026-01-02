import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUserProfile(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }

  getUserBookings(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}/bookings`);
  }

  updateUserProfile(userId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/${userId}`, data);
  }

  cancelBooking(bookingId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/booking/${bookingId}/cancel`, {});
  }

  payRemainingAmount(bookingId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/booking/${bookingId}/pay-remaining`, {});
  }
}