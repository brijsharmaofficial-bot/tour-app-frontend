import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class Msg91Service {
  private apiUrl = environment.apiUrl;

  async sendOtp(phone: string): Promise<any> {
    return fetch(`${this.apiUrl}/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    }).then(res => res.json());
  }

  async verifyOtp(phone: string, otp: string): Promise<any> {
    return fetch(`${this.apiUrl}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp })
    }).then(res => res.json());
  }

  async resendOtp(phone: string): Promise<any> {
    return fetch(`${this.apiUrl}/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    }).then(res => res.json());
  }
}
