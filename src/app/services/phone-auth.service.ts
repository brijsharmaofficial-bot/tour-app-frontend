import { Injectable, inject } from '@angular/core';
import { Auth, signInWithPhoneNumber, ConfirmationResult } from '@angular/fire/auth';
import { RecaptchaVerifier } from 'firebase/auth'; // <-- Import from firebase/auth
import { from, Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class PhoneAuthService {
  private auth: Auth = inject(Auth);
  private confirmationResult!: ConfirmationResult;
  private recaptchaVerifier!: RecaptchaVerifier;

initRecaptchaVerifier(): void {
  if (!environment.production && environment.disableRecaptcha) {
    // Bypass for testing
    (this.auth.settings as any).appVerificationDisabledForTesting = true;
    return;
  }
}
// // Modified initialization
// initRecaptchaVerifier(): void {
//   if (!environment.production && environment.disableRecaptcha) {
//     // Bypass for testing
//     (this.auth.settings as any).appVerificationDisabledForTesting = true;
//     return;
//   }
  
//   // Production reCAPTCHA
//   this.recaptchaVerifier = new RecaptchaVerifier(
//     this.auth,
//     'recaptcha-container',
//     { 'size': 'invisible' }
//   );
// }

  // Send verification code
  sendVerificationCode(phoneNumber: string): Observable<any> {
    return from(signInWithPhoneNumber(this.auth, phoneNumber, this.recaptchaVerifier)
      .then((confirmationResult) => {
        this.confirmationResult = confirmationResult;
        return { success: true };
      })
      .catch((error) => {
        console.error('Error sending verification code:', error);
        return { success: false, error };
      })
    );
  }

 // Verify OTP code
  verifyOtpCode(otp: string): Observable<any> {
    return from(this.confirmationResult.confirm(otp)
      .then((userCredential) => {
        return { success: true, user: userCredential.user };
      })
      .catch((error) => {
        console.error('Error verifying OTP:', error);
        return { success: false, error };
      }));
  }
}