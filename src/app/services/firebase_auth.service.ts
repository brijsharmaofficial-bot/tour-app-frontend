import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { BehaviorSubject } from 'rxjs';

import { Auth, signInWithPhoneNumber } from '@angular/fire/auth';
import { RecaptchaVerifier } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private userSubject = new BehaviorSubject<any>(this.getStoredUser());
  user$ = this.userSubject.asObservable();

  confirmResult: any;
  recaptchaVerifier!: RecaptchaVerifier;

  constructor(private auth: Auth, private http: HttpClient) {}

  // Generate Invisible Recaptcha
  generateRecaptcha() {
    return new RecaptchaVerifier(
      this.auth,                       // Auth instance
      'recaptcha-container',           // Element ID
      { size: 'invisible' }            // Config
    );
  }
  
  // SEND OTP via Firebase
  async sendOtp(phone: string) {
    try {
      const appVerifier = this.generateRecaptcha();
      const fullPhone = "+91" + phone;

      this.confirmResult = await signInWithPhoneNumber(this.auth, fullPhone, appVerifier);
      return { success: true, message: "OTP sent!" };
    } catch (error) {
      return { success: false, message: "Failed to send OTP", error };
    }
  }

  // VERIFY OTP
  async verifyOtp(otp: string) {
    try {
      const firebaseUser = await this.confirmResult.confirm(otp);

      const phone = firebaseUser.user.phoneNumber;

      const res: any = await this.http.post(environment.apiUrl + '/verify-otp', {
        phone
      }).toPromise();

      localStorage.setItem('user', JSON.stringify(res.user));
      this.userSubject.next(res.user);

      return { success: true, user: res.user };

    } catch (e) {
      return { success: false, message: "Invalid OTP" };
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  private getStoredUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }
}
