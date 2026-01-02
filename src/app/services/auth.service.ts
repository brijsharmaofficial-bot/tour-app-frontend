import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Msg91Service } from './msg91.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  user$ = this.userSubject.asObservable();

  constructor(private msg91: Msg91Service) {}

  // Send OTP
  sendOtp(phone: string) {
    return this.msg91.sendOtp(phone);
  }

  // Verify OTP
  verifyOtp(phone: string, otp: string) {
    return this.msg91.verifyOtp(phone, otp).then(result => {
      if (result.success) {
        const userData = { phoneNumber: phone };
        localStorage.setItem('user', JSON.stringify(userData));
        this.userSubject.next(userData);
      }
      return result;
    });
  }

  // Resend OTP
  resendOtp(phone: string) {
    return this.msg91.resendOtp(phone);
  }

  // Logout
  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  private getUserFromStorage() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
