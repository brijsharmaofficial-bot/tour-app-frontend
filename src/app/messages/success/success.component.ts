import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterModule, ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Main Container -->
    <!-- Main Container -->
<div class="booking-confirmation container-fluid px-3 px-lg-5">
  <div class="row g-4">
    <!-- Left Column - Booking Details (col-lg-8) -->
    <div class="col-lg-8">
      <!-- Header Section -->
      <div class="confirmation-header">
        <div class="success-animation"> 
          <h2 class="booking-confirmed">Booking Confirmed!</h2>
        </div>
      </div>

      <!-- Customer Greeting -->
      <div class="customer-greeting" *ngIf="bookingData">
        <h4>Thank you, {{ bookingData.user.name }}!</h4>
        <p>Your booking from {{bookingData.city?.name}} {{ bookingData.from_city?.name || bookingData.pickup_address }} to {{ bookingData.to_city?.name || bookingData.drop_address }} has been successfully confirmed.</p>
      </div>

      <!-- Booking Summary Card -->
      <div class="summary-card" *ngIf="bookingData">
        <div class="card-header">
          <h3><i class="icon-calendar"></i> Booking Summary</h3>
          <!-- <span class="status-badge" [ngClass]="bookingData.payment_status">{{ bookingData.payment_status | titlecase }}</span> -->
        </div>
        
        <div class="summary-grid">
          <div class="summary-item">
            <label><i class="icon-location"></i> Pickup Location</label>
            <p>{{ bookingData.pickup_address }}</p>
          </div>
          
          <div class="summary-item">
            <label><i class="icon-location"></i> Drop Location</label>
            <p>{{ bookingData.drop_address }}</p>
          </div>
          
          <div class="summary-item">
            <label><i class="icon-calendar"></i> Pickup Date & Time</label>
            <p>{{ formattedPickupDate }} at {{ formattedPickupTime }}</p>
          </div>
          
          <div class="summary-item">
            <label><i class="icon-car"></i> Car Type</label>
            <p>{{ bookingData.cab?.cab_name || bookingData?.cab.cab_type || 'Standard Sedan' }} or Equivalent</p>
          </div>
          
          <div class="summary-item">
            <label><i class="icon-trip"></i> Trip Type</label>
            <p>{{ bookingData.trip_type}}</p>
          </div>
          
          <div class="summary-item">
            <label><i class="icon-distance"></i> Distance</label>
            <p>{{ bookingData.distance_km || 0 }} km</p>
          </div>
        </div>
      </div>

      <!-- Payment Details Card -->
      <div class="payment-card" *ngIf="bookingData">
        <div class="card-header">
          <h3><i class="icon-payment"></i> Payment Details</h3>
        </div>
        
        <div class="payment-breakdown">
          <div class="payment-row">
            <span>Base Fare</span>
            <span>₹{{ bookingData.fare_without_gst || 0 }}</span>
          </div>
          <div class="payment-row">
            <span>Taxes & Charges</span>
            <span>₹{{ calculateTax() }}</span>
          </div>
          <div class="payment-row total">
            <span><strong>Total Amount</strong></span>
            <span><strong>₹{{ bookingData.total_estimated_fare || 0 }}</strong></span>
          </div>
          <div class="payment-row">
            <span>Payment Method</span>
            <span>{{ bookingData.payment_status === 'paid' ? 'Online Payment' : 'Pay at Ride' }}</span>
          </div>
          <div class="payment-row" *ngIf="bookingData.payment_id">
            <span>Transaction ID</span>
            <span class="transaction-id">{{ bookingData.payment_id }}</span>
          </div>
        </div>
      </div>

      <!-- Important Information -->
      <div class="info-section">
        <h3><i class="icon-info"></i> Important Information</h3>
        
        <div class="info-grid">
          <div class="info-item">
            <div class="info-icon">🚗</div>
            <div class="info-content">
              <h4>Driver Details</h4>
              <p>You'll receive driver contact & vehicle details 1 hour before pickup.</p>
            </div>
          </div>
          
          <div class="info-item">
            <div class="info-icon">📱</div>
            <div class="info-content">
              <h4>Track Your Ride</h4>
              <p>Download our app to track your ride in real-time.</p>
            </div>
          </div>
          
          <div class="info-item">
            <div class="info-icon">⏰</div>
            <div class="info-content">
              <h4>24/7 Support</h4>
              <p>Need help? Call us at <a href="tel:+919073740000">+91 90 7374 0000</a></p>
            </div>
          </div>
          
          <div class="info-item">
            <div class="info-icon">📧</div>
            <div class="info-content">
              <h4>Email Confirmation</h4>
              <p>A detailed itinerary has been sent to {{ bookingData?.customer_email || 'your email' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Terms & Conditions -->
      <div class="terms-section">
        <h3><i class="icon-terms"></i> Terms & Conditions</h3>
        <ul>
          <li>The trip includes a KM limit. Additional charges apply for extra kilometers.</li>
          <li>Toll charges, parking fees, and state taxes are payable directly.</li>
          <li>Cancellation policy: Free cancellation up to 24 hours before pickup.</li>
          <li>Driver details will be shared 1 hour before the scheduled pickup time.</li>
        </ul>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="btn-primary" routerLink="/user-profile">
          <i class="icon-download"></i> Bookings Status
        </button>
        <button class="btn-secondary" routerLink="/user-profile">
          <i class="icon-bookings"></i> View All Bookings
        </button>
        <button class="btn-outline" routerLink="/">
          <i class="icon-home"></i> Book Another Ride
        </button>
      </div>

      <!-- Download App Section -->
      <div class="app-section">
        <h3>Track your ride with our app</h3>
        <div class="app-badges">
          <a href="#" class="">
            <!-- Google Play Store -->
          <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
              alt="Get it on Google Play" 
              style="height: 50px; width: auto;">
            
          </a>
          <a href="#" class="">
            <!-- Apple App Store -->
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
              alt="Download on the App Store" 
              style="height: 50px; width: auto;">
          </a>
        </div>
      </div>

      <!-- Support Footer -->
      <div class="support-footer">
        <p>Need immediate assistance? <a href="tel:+919073740000">Call +91 90 7374 0000</a> or <a href="mailto:info.carrentalkolkata@gmail.com">Email Support</a></p>
        <p class="footer-note">© 2025 Car Rental Kolkata. All rights reserved.</p>
      </div>
    </div>

    <!-- Right Column - Related Content (col-lg-4) -->
    <div class="col-lg-4">
      <!-- Sticky Container -->
      <div class="sticky-sidebar">

        <!-- Why Choose Us -->
        <div class="related-card features-card">
          <div class="card-header">
            <h3><i class="icon-features"></i> Why Choose Us</h3>
          </div>
          
          <div class="features-list">
            <div class="feature-item">
              <div class="feature-icon">✅</div>
              <div class="feature-content">
                <h6>24/7 Customer Support</h6>
                <p>Always available for assistance</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">🕒</div>
              <div class="feature-content">
                <h6>On-Time Guarantee</h6>
                <p>95% on-time pickup rate</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">💰</div>
              <div class="feature-content">
                <h6>No Hidden Charges</h6>
                <p>Transparent pricing</p>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-icon">⭐</div>
              <div class="feature-content">
                <h6>Verified Drivers</h6>
                <p>Background checked professionals</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Special Offer -->
        <div class="related-card offer-card">
          <div class="offer-banner">
            <div class="offer-content">
              <span class="offer-tag">Special Offer</span>
              <h4>Get 10% Off</h4>
              <p>On your next booking</p>
              <small>Use code: <strong>CRKNEXT10</strong></small>
              <button class="btn-offer" routerLink="/">Book Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  `,
  styles: [`

    .booking-confirmation {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%);
  min-height: 100vh;
}

/* Two Column Layout */
.row {
  margin: 0;
}

.col-lg-8 {
  padding-right: 25px;
}

.col-lg-4 {
  padding-left: 25px;
}

/* Sticky Sidebar for Right Column */
.sticky-sidebar {
  position: sticky;
  top: 20px;
}

/* Related Cards in Right Column */
.related-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.destinations-card .card-header,
.cabs-card .card-header,
.features-card .card-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f1f3f5;
}

.card-header h3 {
  margin: 0;
  color: #2d3436;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Destinations List */
.destinations-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.destination-item {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.destination-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.destination-image {
  position: relative;
  height: 150px;
  overflow: hidden;
}

.destination-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.destination-item:hover .destination-image img {
  transform: scale(1.05);
}

.destination-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
}

.destination-label {
  background: #f44336;
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.destination-content {
  padding: 15px;
}

.destination-content h4 {
  margin: 0 0 8px;
  color: #2d3436;
  font-size: 1.1rem;
}

.destination-desc {
  color: #636e72;
  font-size: 0.9rem;
  margin-bottom: 12px;
  line-height: 1.4;
}

.destination-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.destination-meta .price {
  color: #f44336;
  font-weight: 700;
  font-size: 1.1rem;
}

.destination-meta .rating {
  color: #ffc107;
  font-weight: 600;
}

.btn-book {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #f44336 0%, #0d6efd 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-book:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(67, 233, 123, 0.3);
}

/* Cabs List */
.cabs-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cab-type {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.cab-type:hover {
  border-color: #0d6efd;
  background: #f8f9ff;
}

.cab-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.cab-icon.sedan {
  background: #e3f2fd;
  color: #1976d2;
}

.cab-icon.suv {
  background: #f3e5f5;
  color: #7b1fa2;
}

.cab-icon.luxury {
  background: #fff3e0;
  color: #f57c00;
}

.cab-icon.mini {
  background: #e8f5e9;
  color: #388e3c;
}

.cab-details {
  flex: 1;
}

.cab-details h5 {
  margin: 0 0 5px;
  color: #2d3436;
  font-size: 1rem;
}

.cab-desc {
  color: #636e72;
  font-size: 0.85rem;
  margin: 0 0 5px;
}

.cab-price {
  color: #f44336;
  font-weight: 700;
  margin: 0;
}

/* Features List */
.features-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.feature-icon {
  width: 40px;
  height: 40px;
  background: #f8f9fa;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.feature-content h6 {
  margin: 0 0 4px;
  color: #2d3436;
  font-size: 0.95rem;
}

.feature-content p {
  margin: 0;
  color: #636e72;
  font-size: 0.85rem;
}

/* Offer Card */
.offer-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.offer-banner {
  padding: 20px;
}

.offer-tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.offer-content h4 {
  margin: 15px 0 5px;
  font-size: 1.8rem;
  font-weight: 700;
}

.offer-content p {
  margin: 0 0 10px;
  opacity: 0.9;
}

.offer-content small {
  display: block;
  margin-bottom: 15px;
  opacity: 0.8;
}

.btn-offer {
  padding: 10px 25px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 25px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-offer:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* New Icons */
.icon-popular:before { content: "🌟"; }
.icon-cab:before { content: "🚖"; }
.icon-features:before { content: "✅"; }

/* Responsive Design */
@media (max-width: 992px) {
  .col-lg-8,
  .col-lg-4 {
    padding: 0;
  }
  
  .sticky-sidebar {
    position: static;
  }
  
  .related-card {
    margin-top: 25px;
  }
}

@media (max-width: 768px) {
  .booking-confirmed {
    font-size: 1.6rem;
  }
  
  .summary-grid,
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }
  
  .btn-primary,
  .btn-secondary,
  .btn-outline {
    min-width: auto;
  }
  
  .app-badges {
    flex-direction: column;
  }
}

    .confirmation-header {
      text-align: center;
      padding: 10px 2px;
      background: linear-gradient(135deg, #f44336 0%, #0d6efd 100%);
      border-radius: 10px;
      margin-bottom: 10px;
      color: white;
      position: relative;
      overflow: hidden;
    }

    .confirmation-header:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>');
      background-size: cover;
    }

    .success-animation {
      position: relative;
      z-index: 1;
    }

    .checkmark-container {
      margin: 0 auto 20px;
    }

    .checkmark {
      width: 80px;
      height: 80px;
      display: block;
      stroke-width: 2;
      stroke: white;
      stroke-miterlimit: 10;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      padding: 15px;
    }

    .checkmark-circle {
      stroke-dasharray: 166;
      stroke-dashoffset: 166;
      stroke-width: 2;
      fill: none;
      animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }

    .checkmark-check {
      transform-origin: 50% 50%;
      stroke-dasharray: 48;
      stroke-dashoffset: 48;
      animation: stroke 0.4s 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }

    @keyframes stroke {
      100% { stroke-dashoffset: 0; }
    }

    .booking-confirmed {
      font-size: 1.90rem;
      font-weight: 700;
      margin: 0 0 10px;
      letter-spacing: 0.5px;
    }

    .booking-reference {
      font-size: 1.1rem;
      opacity: 0.9;
    }

    .customer-greeting {
      background: white;
      border-radius: 15px;
      padding: 25px;
      margin-bottom: 25px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
      border-left: 5px solid #0d6efd;
    }

    .customer-greeting h2 {
      color: #2d3436;
      margin: 0 0 10px;
      font-size: 1.8rem;
    }

    .customer-greeting p {
      color: #636e72;
      margin: 0;
      line-height: 1.6;
    }

    .summary-card, .payment-card, .info-section, .terms-section {
      background: white;
      border-radius: 15px;
      padding: 25px;
      margin-bottom: 25px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 2px solid #f1f3f5;
    }

    .card-header h3 {
      margin: 0;
      color: #2d3436;
      font-size: 1.3rem;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .status-badge {
      padding: 6px 15px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.paid {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.pending {
      background: #fff3cd;
      color: #856404;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .summary-item {
      padding: 15px;
      background: #f8f9fa;
      border-radius: 10px;
      border-left: 4px solid #0d6efd;
    }

    .summary-item label {
      display: block;
      font-size: 0.9rem;
      color: #6c757d;
      margin-bottom: 8px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .summary-item p {
      margin: 0;
      color: #2d3436;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .payment-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e9ecef;
    }

    .payment-row.total {
      border-top: 2px solid #0d6efd;
      border-bottom: none;
      margin-top: 10px;
      padding-top: 20px;
    }

    .transaction-id {
      font-family: 'Courier New', monospace;
      color: #0d6efd;
      font-weight: 500;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .info-item {
      display: flex;
      gap: 15px;
      align-items: flex-start;
    }

    .info-icon {
      font-size: 1.8rem;
      flex-shrink: 0;
    }

    .info-content h4 {
      margin: 0 0 5px;
      color: #2d3436;
      font-size: 1.1rem;
    }

    .info-content p {
      margin: 0;
      color: #636e72;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .info-content a {
      color: #0d6efd;
      text-decoration: none;
      font-weight: 500;
    }

    .terms-section ul {
      margin: 0;
      padding-left: 20px;
      color: #636e72;
    }

    .terms-section li {
      margin-bottom: 10px;
      line-height: 1.5;
    }

    .action-buttons {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin: 40px 0;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary, .btn-outline {
      padding: 15px 30px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 200px;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #f44336 0%, #0d6efd 100%);
      color: white;
      box-shadow: 0 5px 20px rgba(67, 233, 123, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(67, 233, 123, 0.4);
    }

    .btn-secondary {
      background: #2d3436;
      color: white;
    }

    .btn-secondary:hover {
      background: #212529;
      transform: translateY(-3px);
    }

    .btn-outline {
      background: transparent;
      border: 2px solid #0d6efd;
      color: #0d6efd;
    }

    .btn-outline:hover {
      background: #0d6efd;
      color: white;
      transform: translateY(-3px);
    }

    .app-section {
      text-align: center;
      padding: 40px;
      background: white;
      border-radius: 15px;
      margin: 30px 0;
    }

    .app-section h3 {
      margin: 0 0 30px;
      color: #2d3436;
    }

    .app-badges {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
    }

    .app-badge {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px 25px;
      border-radius: 10px;
      text-decoration: none;
      transition: transform 0.3s ease;
    }

    .app-badge:hover {
      transform: translateY(-5px);
    }

    .app-badge.google-play {
      background: #2d3436;
      color: white;
    }

    .app-badge.app-store {
      background: #f8f9fa;
      color: #2d3436;
      border: 1px solid #dee2e6;
    }

    .app-badge img {
      width: 40px;
      height: 40px;
      border-radius: 8px;
    }

    .app-badge div {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .app-badge span {
      font-size: 0.8rem;
      opacity: 0.8;
    }

    .app-badge strong {
      font-size: 1.1rem;
    }

    .support-footer {
      text-align: center;
      padding: 30px;
      color: #636e72;
      border-top: 1px solid #e9ecef;
      margin-top: 30px;
    }

    .support-footer a {
      color: #0d6efd;
      text-decoration: none;
      font-weight: 500;
    }

    .footer-note {
      margin-top: 20px;
      font-size: 0.9rem;
      opacity: 0.7;
    }

    /* Icons */
    .icon-calendar:before { content: "📅"; }
    .icon-location:before { content: "📍"; }
    .icon-car:before { content: "🚗"; }
    .icon-trip:before { content: "🛣️"; }
    .icon-distance:before { content: "📏"; }
    .icon-payment:before { content: "💳"; }
    .icon-info:before { content: "ℹ️"; }
    .icon-terms:before { content: "📋"; }
    .icon-download:before { content: "📥"; }
    .icon-bookings:before { content: "📋"; }
    .icon-home:before { content: "🏠"; }

    /* Responsive Design */
    @media (max-width: 768px) {
      .booking-confirmed {
        font-size: 1.6rem;
      }
      
      .summary-grid, .info-grid {
        grid-template-columns: 1fr;
      }
      
      .action-buttons {
        flex-direction: column;
        align-items: stretch;
      }
      
      .btn-primary, .btn-secondary, .btn-outline {
        min-width: auto;
      }
      
      .app-badges {
        flex-direction: column;
      }
    }
  `]
})
export class SuccessComponent implements OnInit {
  bookingId: string = '';
  paymentId: string = '';
  bookingData: any = null;
  formattedPickupDate: string = '';
  formattedPickupTime: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.bookingId = params['booking_id'];
      this.paymentId = params['payment_id'];
      
      if (this.bookingId) {
        this.fetchBookingDetails(this.bookingId);
      } else {
        // Redirect if no booking ID
        this.router.navigate(['/']);
      }
    });
  }

  fetchBookingDetails(bookingId: string) {
    this.http.get(`${environment.apiUrl}/booking/${bookingId}`)
      .subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            this.bookingData = response.booking;
            this.formatDates();
            console.log('success',this.bookingData)
          }

        },
        error: (error) => {
          console.error('Error fetching booking:', error);
        }
      });
  }

  formatDates() {
    if (this.bookingData?.pickup_date) {
      const date = new Date(this.bookingData.pickup_date);
      this.formattedPickupDate = date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }

    if (this.bookingData?.pickup_time) {
      const time = new Date(`1970-01-01T${this.bookingData.pickup_time}`);
      this.formattedPickupTime = time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  }

  calculateTax(): number {
    if (!this.bookingData) return 0;
    const baseFare = this.bookingData.fare_without_gst || 0;
    const totalFare = this.bookingData.total_estimated_fare || 0;
    return Math.round(totalFare - baseFare);
  }

  downloadTicket() {
    // Generate and download booking ticket
    const ticketData = {
      ...this.bookingData,
      downloadDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(ticketData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `booking-ticket-${this.bookingId}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  bookingStatus(){

  }
}