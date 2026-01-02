import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  payWithRazorpay(paymentDetails: any) {
    const amount = Number(paymentDetails.paymentOption);
  
    // 🔥 1. IF PAYMENT = 0 → NO RAZORPAY → DIRECT BOOKING DONE
    if (amount === 0) {
      const payload = {  
        payment_mode: paymentDetails.paymentOption == 0 ? 'pay_later' : 'online',
        advancedAmount: paymentDetails.paymentOption,
        companyname: paymentDetails.companyname,
        usergst: paymentDetails.usergst,
        bookingDetails: {
          bookingData: paymentDetails.bookingDetails.bookingData,
          selectedCar: paymentDetails.bookingDetails.selectedCar,
          pickup: paymentDetails.bookingDetails.pickup,
          drop: paymentDetails.bookingDetails.drop,
          name: paymentDetails.bookingDetails.name,
          mobile: paymentDetails.bookingDetails.mobile,
          email: paymentDetails.bookingDetails.email,
          countryCode: paymentDetails.bookingDetails.countryCode,
          userId:paymentDetails.bookingDetails.userId
        }
       
      };

      // console.log("FINAL PAYLOAD:", payload);
  
      // ---- Your backend URL ----
      this.http.post(`${this.apiUrl}/booking`, payload)
        .subscribe({
          next: (data: any) => {
            if (data.status === 'success') {
              this.router.navigate(['/payment-success'],
               {
                queryParams: {
                  booking_id: data.booking_id,
                  payment_id: 'PAY_LATER'
                }
              });
            } else {
              this.router.navigate(['/payment-failed']);
            }
          }
        });
  
      return; // 🔥 STOP HERE → DO NOT OPEN RAZORPAY
    }
  
    // 🔥 2. IF PAYMENT > 0 → RAZORPAY OPEN
    const options: any = {
      key: 'rzp_test_KeDyTQ5cOTo6ko',
      amount: amount * 100,
      currency: 'INR',
      name: 'Car Rental Kolkata',
      description: 'Payment for Cab Booking',
      handler: (response: any) => {
  
        const payload = {
          razorpay_payment_id: response.razorpay_payment_id,
          advancedAmount: amount,
          ...paymentDetails.bookingDetails
        };
  
        this.http.post(`${this.apiUrl}/booking`, payload)
          .subscribe({
            next: (data: any) => {
              if (data.status === 'success') {
                this.router.navigate(['/payment-success'], {
                  queryParams: {
                    booking_id: data.booking_id,
                    payment_id: data.payment_id
                  }
                });
              } else {
                this.router.navigate(['/payment-failed']);
              }
            }
          });
      }
    };
  
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  }
  
}