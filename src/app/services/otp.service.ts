import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class OtpService {
  private apiUrl = environment.apiUrl; // from Angular environment

  constructor(private http: HttpClient) {}

  sendOtp(phone: string) {
    return this.http.post<any>(`${this.apiUrl}/send-otp`, { phone }).toPromise();
  }

  verifyOtp(phone: string, otp: string) {
    return this.http.post<any>(`${this.apiUrl}/verify-otp`, { phone, otp }).toPromise();
  }

  resendOtp(phone: string) {
    return this.http.post<any>(`${this.apiUrl}/resend-otp`, { phone }).toPromise();
  }

  checkBalance() {
    return this.http.get<any>(`${this.apiUrl}/check-balance`).toPromise(); // optional if you expose this
  }
}
