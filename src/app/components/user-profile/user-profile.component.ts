import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: any = null;
  bookings: any[] = [];
  stats: any = {};
  isLoading: boolean = true;
  activeTab: string = 'profile';
  apiUrl = environment.apiUrl;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.isLoading = true;
    
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      
      // Get auth token
      const token = localStorage.getItem('access_token');
      
      // Fetch user details from API
      this.http.get(`${this.apiUrl}/user/${this.user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            this.user = { ...this.user, ...response.user };
            this.loadUserBookings();
          }
        },
        error: (error) => {
          console.error('Error fetching user:', error);
          this.loadUserBookings();
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadUserBookings() {
    if (!this.user?.id) return;

    const token = localStorage.getItem('access_token');
    
    this.http.get(`${this.apiUrl}/user/${this.user.id}/bookings`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.bookings = response.bookings.map((booking: any) => ({
            id: booking.id,
            booking_reference: booking.booking_reference,
            car: booking.cab?.cab_name || 'Standard Car',
            car_type: booking.cab?.cab_type || 'Sedan',
            type: this.formatTripType(booking.trip_type),
            package: booking.package?.name || 'Standard Package',
            hours:booking.package?.hours,
            kms:booking.package?.kms,
            from: booking.from_city?.name || 'N/A',
            to: booking.to_city?.name || 'N/A',
            fromstate:booking.from_city?.state || 'N/A',
            tostate:booking.to_city?.state || 'N/A',
            pickup_date: this.formatDate(booking.pickup_date),
            pickup_time: this.formatTime(booking.pickup_time),
            pickup_location: booking.pickup_address,
            drop_location: booking.drop_address,
            distance_km: booking.distance_km || 0,

            price: booking.total_estimated_fare || 0,
            booking_status: this.formatStatus(booking.booking_status),
            payment_status: this.formatPaymentStatus(booking.payment_status),
            advanced_amount: booking.advanced_amount || 0,
            payment_id: booking.payment_id,
            created_at: booking.created_at,
            extra_km_rate: booking.extra_km_rate || 17,
            included_km: booking.included_km || booking.distance_km || 0,
            trip_type:booking.trip_type
          }));

          console.log('user booking data',response)

          if (response.stats) {
            this.stats = response.stats;
          } else {
            this.calculateStats();
          }
          
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error fetching bookings:', error);
        this.isLoading = false;
      }
    });
  }

  formatTripType(tripType: string): string {
    const tripTypes: {[key: string]: string} = {
      'oneway': 'One Way',
      'one-way': 'One Way',
      'roundtrip': 'Round Trip',
      'round-trip': 'Round Trip',
      'local': 'Local',
      'airport': 'Airport Transfer',
      'hourly': 'Hourly Rental',
      'outstation': 'Outstation'
    };
    return tripTypes[tripType?.toLowerCase()] || tripType || 'Standard';
  }

  formatStatus(status: string): string {
    const statusMap: {[key: string]: string} = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'assigned': 'Driver Assigned',
      'ongoing': 'Ongoing',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status || 'Pending';
  }

  formatPaymentStatus(status: string): string {
    const paymentStatusMap: {[key: string]: string} = {
      'pending': 'Pending',
      'paid': 'Paid',
      'partial': 'Partial',
      'failed': 'Failed'
    };
    return paymentStatusMap[status] || status || 'Pending';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  formatTime(timeString: string): string {
    if (!timeString) return 'N/A';
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  calculateStats() {
    this.stats = {
      total_bookings: this.bookings.length,
      completed_bookings: this.bookings.filter(b => b.booking_status === 'Completed').length,
      upcoming_bookings: this.bookings.filter(b => ['Pending', 'Confirmed', 'Driver Assigned'].includes(b.booking_status)).length,
      total_paid: this.bookings.reduce((sum, b) => {
        if (b.payment_status === 'Paid') return sum + b.price;
        if (b.payment_status === 'Partial') return sum + (b.advanced_amount || 0);
        return sum;
      }, 0),
      total_remaining: this.bookings.reduce((sum, b) => {
        if (b.payment_status === 'Paid') return sum;
        if (b.payment_status === 'Partial') return sum + (b.price - (b.advanced_amount || 0));
        return sum + b.price;
      }, 0)
    };
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  cancelBooking(booking: any) {
    if (!booking.id) return;
    
    const token = localStorage.getItem('access_token');
    
    if (confirm('Are you sure you want to cancel this booking? Cancellation charges may apply.')) {
      this.http.post(`${this.apiUrl}/booking/${booking.id}/cancel`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            alert('Booking cancelled successfully!');
            this.loadUserBookings();
          } else {
            alert(response.message || 'Failed to cancel booking');
          }
        },
        error: (error) => {
          console.error('Cancellation error:', error);
          alert('Failed to cancel booking. Please try again.');
        }
      });
    }
  }

  payRemaining(booking: any) {
    if (!booking.id) return;
    
    const token = localStorage.getItem('access_token');
    const remainingAmount = booking.price - booking.advanced_amount;
    
    if (confirm(`Pay remaining amount of ₹${remainingAmount}?`)) {
      this.http.post(`${this.apiUrl}/booking/${booking.id}/pay-remaining`, {
        amount: remainingAmount
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            alert('Payment initiated successfully!');
            // Handle payment gateway redirect if needed
            if (response.payment_gateway_url) {
              window.open(response.payment_gateway_url, '_blank');
            }
            this.loadUserBookings();
          }
        },
        error: (error) => {
          console.error('Payment error:', error);
          alert('Failed to initiate payment. Please try again.');
        }
      });
    }
  }

  generateInvoiceNumber(bookingRef: string) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const seq = bookingRef.replace(/\D/g, '').slice(-5) || '00001';
  
    return `CRK/INV/${year}/${month}/${seq}`;
  }

  downloadInvoice(booking: any) {
    if (!booking.id) return;
    
    const token = localStorage.getItem('access_token');
    
    // Create invoice data
    const invoiceData = {
      booking_id: booking.booking_reference,
      customer_name: this.user.name,
      customer_email: this.user.email,
      customer_phone: this.user.phone,
      car: booking.car,
      car_type: booking.car_type,
      trip_type: booking.type,
      from: booking.from,
      to: booking.to,
      distance: booking.distance_km,
      pickup_date: booking.pickup_date,
      pickup_time: booking.pickup_time,
      pickup_location: booking.pickup_location,
      drop_location: booking.drop_location,
      base_fare: booking.price * 0.95, // Assuming 5% GST
      gst: booking.price * 0.05,
      total_amount: booking.price,
      advanced_paid: booking.advanced_amount,
      remaining_amount: booking.price - booking.advanced_amount,
      payment_status: booking.payment_status,
      booking_status: booking.booking_status,
      invoice_date: new Date().toLocaleDateString(),
      invoice_number: this.generateInvoiceNumber(booking.booking_reference)
    };
    
    // Generate PDF or open in new tab
    const invoiceWindow = window.open('', '_blank');
    if (invoiceWindow) {
      invoiceWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice - ${booking.booking_reference}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 40px; 
              color: #333333;
              line-height: 1.6;
            }
            
            /* Savaari color scheme */
            .savaari-primary { color: #2c5aa0; } /* Blue from Savaari logo */
            .savaari-secondary { color: #4CAF50; } /* Green from PDF content */
            .savaari-dark { color: #1a237e; } /* Dark blue for emphasis */
            
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              padding: 30px;
              background: #ffffff;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            
            .invoice-header { 
              border-bottom: 2px solid #2c5aa0;
              padding-bottom: 20px;
              margin-bottom: 30px;
              text-align: center;
            }
            
            .company-name { 
              font-size: 28px; 
              font-weight: bold; 
              color: #2c5aa0;
              margin-bottom: 5px;
            }
            
            .company-tagline {
              color: #4CAF50;
              font-size: 14px;
              margin-bottom: 10px;
            }
            
            .invoice-title { 
              font-size: 22px; 
              color: #1a237e; 
              margin-top: 15px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .invoice-number {
              background: #f0f7ff;
              padding: 8px 15px;
              border-radius: 4px;
              display: inline-block;
              margin-top: 10px;
              color: #2c5aa0;
              font-weight: bold;
            }
            
            .details-section {
              margin: 25px 0;
            }
            
            .section-title {
              background: #2c5aa0;
              color: white;
              padding: 10px 15px;
              font-weight: bold;
              border-radius: 4px;
              margin-bottom: 15px;
            }
            
            .details-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 15px 0; 
            }
            
            .details-table td { 
              padding: 12px 15px; 
              border: 1px solid #e0e0e0; 
              vertical-align: top;
            }
            
            .details-table .label { 
              font-weight: bold; 
              background: #f8f9fa; 
              color: #2c5aa0;
              width: 35%;
            }
            
            .details-table .value {
              color: #555555;
            }
            
            .amount-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 30px 0; 
            }
            
            .amount-table th, .amount-table td { 
              padding: 14px; 
              border: 1px solid #e0e0e0; 
              text-align: right; 
            }
            
            .amount-table th { 
              background: #2c5aa0; 
              color: white; 
              text-align: center;
              font-weight: bold;
            }
            
            .amount-table td {
              color: #333333;
            }
            
            .total-row { 
              background: #e8f5e9; 
              font-weight: bold; 
              color: #1a237e;
            }
            
            .payment-info {
              background: #f0f7ff;
              padding: 15px;
              border-radius: 6px;
              margin: 25px 0;
              border-left: 4px solid #4CAF50;
            }
            
            .payment-info strong {
              color: #2c5aa0;
            }
            
            .footer { 
              margin-top: 50px; 
              text-align: center; 
              color: #666666; 
              font-size: 13px;
              border-top: 1px solid #e0e0e0;
              padding-top: 20px;
            }
            
            .contact-info {
              color: #2c5aa0;
              font-weight: bold;
              margin: 10px 0;
            }
            
            .highlight-box {
              background: #e8f5e9;
              border: 1px solid #4CAF50;
              border-radius: 6px;
              padding: 15px;
              margin: 20px 0;
              color: #1a237e;
            }
            
            .highlight-box strong {
              color: #2c5aa0;
            }
            
            .print-btn {
              background: #2c5aa0;
              color: white;
              border: none;
              padding: 12px 25px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 16px;
              margin: 20px 0;
              display: inline-block;
            }
            
            .print-btn:hover {
              background: #1a237e;
            }
            
            @media print {
              body { margin: 0; }
              .print-btn { display: none; }
              .invoice-container { box-shadow: none; border: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <div class="company-name">CAR RENTAL KOLKATA</div>
              <div class="company-tagline">Your Trusted Travel Partner</div>
              <div class="invoice-title">TAX INVOICE & TRIP DETAILS</div>
              <div class="invoice-number">Invoice No: ${invoiceData.invoice_number}</div>
            </div>
            
            <div class="details-section">
              <div class="section-title">Booking & Customer Details</div>
              <table class="details-table">
                <tr>
                  <td class="label">Booking ID</td>
                  <td class="value">${invoiceData.booking_id}</td>
                </tr>
                <tr>
                  <td class="label">Customer Name</td>
                  <td class="value">${invoiceData.customer_name}</td>
                </tr>
                <tr>
                  <td class="label">Customer Contact</td>
                  <td class="value">${invoiceData.customer_phone} | ${invoiceData.customer_email}</td>
                </tr>
                <tr>
                  <td class="label">Invoice Date</td>
                  <td class="value">${invoiceData.invoice_date}</td>
                </tr>
              </table>
            </div>
            
            <div class="details-section">
              <div class="section-title">Trip & Vehicle Details</div>
              <table class="details-table">
                <tr>
                  <td class="label">Trip Details</td>
                  <td class="value">${invoiceData.from} to ${invoiceData.to}<br>
                  Distance: ${invoiceData.distance} km | Type: ${invoiceData.trip_type}</td>
                </tr>
                <tr>
                  <td class="label">Car Details</td>
                  <td class="value">${invoiceData.car} (${invoiceData.car_type})</td>
                </tr>
                <tr>
                  <td class="label">Pickup Details</td>
                  <td class="value">
                    <strong>Date & Time:</strong> ${invoiceData.pickup_date} at ${invoiceData.pickup_time}<br>
                    <strong>Location:</strong> ${invoiceData.pickup_location}
                  </td>
                </tr>
                <tr>
                  <td class="label">Drop Details</td>
                  <td class="value">
                    <strong>Location:</strong> ${invoiceData.drop_location}
                  </td>
                </tr>
              </table>
            </div>
            
            <div class="highlight-box">
              <strong>Important Note:</strong> This fare includes inter-state tax and toll charges. Parking charges are additional and to be paid directly to the driver if applicable.
            </div>
            
            <div class="details-section">
              <div class="section-title">Payment Details</div>
              <table class="amount-table">
                <thead>
                  <tr>
                    <th style="width: 70%; text-align: left;">Description</th>
                    <th style="width: 30%;">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="text-align: left;">Base Fare</td>
                    <td>₹${this.formatCurrency(invoiceData.base_fare)}</td>
                  </tr>
                  <tr>
                    <td style="text-align: left;">GST (5%)</td>
                    <td>₹${this.formatCurrency(invoiceData.gst)}</td>
                  </tr>
                  <tr class="total-row">
                    <td style="text-align: left;">Total Amount</td>
                    <td>₹${this.formatCurrency(invoiceData.total_amount)}</td>
                  </tr>
                  <tr>
                    <td style="text-align: left;">Advanced Paid</td>
                    <td>₹${this.formatCurrency(invoiceData.advanced_paid)}</td>
                  </tr>
                  <tr class="total-row">
                    <td style="text-align: left;">Remaining Amount to Pay</td>
                    <td>₹${this.formatCurrency(invoiceData.remaining_amount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="payment-info">
              <strong>Payment Status:</strong> ${invoiceData.payment_status}<br>
              <strong>Booking Status:</strong> ${invoiceData.booking_status}<br>
              <strong>Payment Method:</strong> Pay remaining amount to driver during the trip
            </div>
            
            <div class="footer">
              <button class="print-btn" onclick="window.print()">Print Invoice</button>
              <p>This is a computer-generated invoice. No signature required.</p>
              <div class="contact-info">
                CAR RENTAL KOLKATA | Phone: 9073740000 | Email: info.carrentalkolkata@gmail.com
              </div>
              <p>Thank you for choosing Car Rental Kolkata! Have a safe journey!</p>
              <p style="font-size: 11px; color: #999; margin-top: 15px;">
                Terms & Conditions apply. For detailed T&C, please visit www.carrentalkolkata.com<br>
                Any discrepancies regarding bill amount will be considered within 24 hrs of Invoice generation.
              </p>
            </div>
          </div>
          
          <script>
            // Auto-print functionality (optional)
            setTimeout(function() {
              window.print();
            }, 1000);
          </script>
        </body>
        </html>
      `);
      invoiceWindow.document.close();
    }
  }

  getStatusBadgeClass(status: string): string {
    switch(status.toLowerCase()) {
      case 'completed': return 'badge bg-success';
      case 'confirmed': case 'assigned': return 'badge bg-primary';
      case 'pending': return 'badge bg-warning text-dark';
      case 'cancelled': return 'badge bg-danger';
      case 'ongoing': return 'badge bg-info';
      default: return 'badge bg-secondary';
    }
  }

  getPaymentBadgeClass(status: string): string {
    switch(status.toLowerCase()) {
      case 'paid': return 'badge bg-success';
      case 'partial': return 'badge bg-warning text-dark';
      case 'pending': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  formatCurrency(amount: number): string {
    return amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  
}