
// payment-details.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { PaymentService } from '../../services/payment.service';
import { HttpClientModule } from '@angular/common/http';

interface BookingData {
  fromLocation: string;
  toLocation: string;
  pickupDate: string;
  pickupTime: string;
  city:string;
  dropLocation:string;
  pickupAddress:string;
  airportTripType:string;
}

interface CarOption {
  id: number;
  package_id: number;
  vendor_id:number;
  cab_id:number;
  trip_type: string;
  vendor: string;
  cab_name: string;
  cab_type: string;
  capacity: number;
  distance_km: string;
  included_km: string;
  hours:string ;
  base_fare: number | string;
  price_per_km: number;
  discount: any;
  discount_percent: number;
  da: number;
  toll_tax: number;
  extra_price_per_km: number;
  final_fare: number | string;
  original_fare: number | string;
  gst_amount: number | string;
  gst: number;
  image?: string;
  showDetails: boolean;
  activeTab: 'inclusions' | 'exclusions' | 'facilities' | 'tc';
  rating: string;
}

interface TabContentItem {
  icon: string;
  text: string;
}

interface BookingDetails {
  bookingData: BookingData;
  selectedCar: CarOption;
  name: string;
  email: string;
  mobile: string;
  pickup: string;
  drop: string;
  countryCode: string;
  userId:number;
}

@Component({
  selector: 'app-payment-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, NavbarComponent],
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent implements OnInit {
  paymentForm: FormGroup;
  bookingDetails: BookingDetails | null = null;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private paymentService: PaymentService
  ) {
    this.paymentForm = this.fb.group({
      paymentOption: ['0', Validators.required],
      couponCode: [''],
      companyname: [''],
      usergst: ['']
    });

    const navigation = this.router.getCurrentNavigation();
    this.bookingDetails = navigation?.extras?.state?.['bookingDetails'];
    
    if (!this.bookingDetails) {
      console.error('No booking details found');
      this.router.navigate(['/']);
      return;
    }
    
    // Initialize car activeTab and showDetails if not set
    if (this.bookingDetails.selectedCar) {
      if (!this.bookingDetails.selectedCar.activeTab) {
        this.bookingDetails.selectedCar.activeTab = 'inclusions';
      }
      if (this.bookingDetails.selectedCar.showDetails === undefined) {
        this.bookingDetails.selectedCar.showDetails = true;
      }
    }
    
    console.log('payment page Received Booking Details:', this.bookingDetails);

  }

  ngOnInit(): void {
   
  }

  /**
   * Switch between Inclusions, Exclusions, Facilities, T&C
   */
  setActiveTab(car: CarOption, tab: 'inclusions' | 'exclusions' | 'facilities' | 'tc'): void {
    car.activeTab = tab;
    car.showDetails = true;
  }

  /**
   * Tab contents displayed per car
   */
  getTabContent(car: CarOption): TabContentItem[] {
    const content = {
      inclusions: [
        { icon: 'payments', text: `Base Fare for ${car.distance_km} km` },
        { icon: 'person', text: 'Driver Allowance' },
        { icon: 'receipt', text: 'Toll & State Tax included' },
        { icon: 'percent', text: `GST (${car.gst}%) included` }, 
      ],
      exclusions: [
        { icon: 'restaurant', text: 'Food and Beverages' },
        { icon: 'local_gas_station', text: 'Fuel surcharge (if applicable)' },
        { icon: 'local_parking', text: 'Parking or Entry Fees' },
        { icon: 'night_shelter', text: 'Driver night charges' },
        { icon: 'schedule', text: 'Extra waiting charges beyond free waiting time' },
      ],
      facilities: [
        { icon: 'ac_unit', text: 'Air Conditioned Cab' },
        { icon: 'luggage', text: 'Ample Luggage Space' },
        { icon: 'groups', text: `Comfortable ${car.capacity} seater` },
        { icon: 'phone_android', text: 'Mobile Charging Ports' },
        { icon: 'airline_seat_recline_extra', text: 'Comfortable Seating' },
        { icon: 'verified_user', text: 'Professional Verified Driver' }
      ],
      tc: [
        { icon: 'info', text: `Extra km charges: ₹${car.extra_price_per_km}/km beyond ${car.distance_km} km` },
        { icon: 'cancel', text: 'Free cancellation up to 1 hour before pickup' },
        { icon: 'watch_later', text: '15 minutes free waiting time at pickup' },
        { icon: 'badge', text: 'Present valid ID proof at pickup time' },
        { icon: 'payments', text: `${car.discount_percent > 0 ? car.discount_percent + '% discount applied' : 'Best price guaranteed'}` },
        { icon: 'support_agent', text: '24/7 customer support available' }
      ]
    };
    return content[car.activeTab] || [];
  }

  getCarPrice(): number {
    if (!this.bookingDetails?.selectedCar) return 0;
    
    const car = this.bookingDetails.selectedCar;
    if (car.final_fare && typeof car.final_fare === 'number') {
      return car.final_fare;
    }
    
    const baseFare = typeof car.base_fare === 'number' ? car.base_fare : parseFloat(car.base_fare as string) || 0;
    const da = car.da || 0;
    const tollTax = car.toll_tax || 0;
    const gstAmount = typeof car.gst_amount === 'number' ? car.gst_amount : parseFloat(car.gst_amount as string) || 0;
    
    return baseFare + da + tollTax + gstAmount;
  }

  getCarName(): string {
    return this.bookingDetails?.selectedCar?.cab_name || 'Car';
  }

  getDistanceLocalkms():string{
    return this.bookingDetails?.selectedCar?.included_km  || '0';
  }
  getDistanceLocalhr():string{
    return this.bookingDetails?.selectedCar?.hours  || '0';
  }

  getDistanceIncluded(): string {
    return this.bookingDetails?.selectedCar?.distance_km || '0';
  }

  getBaseFare(): number {
    const car = this.bookingDetails?.selectedCar;
    if (!car) return 0;
    return typeof car.base_fare === 'number' ? car.base_fare : parseFloat(car.base_fare as string) || 0;
  }

  getDriverAllowance(): number {
    return this.bookingDetails?.selectedCar?.da || 0;
  }

  getTollTax(): number {
    return this.bookingDetails?.selectedCar?.toll_tax || 0;
  }

  getGstAmount(): number {
    const car = this.bookingDetails?.selectedCar;
    if (!car) return 0;
    return typeof car.gst_amount === 'number' ? car.gst_amount : parseFloat(car.gst_amount as string) || 0;
  }

  getExtraKmPrice(): number {
    return this.bookingDetails?.selectedCar?.extra_price_per_km || 0;
  }

  getPriceWithoutGst() {
    const fare = Number(this.bookingDetails?.selectedCar?.final_fare) || 0;
    const gst  = Number(this.bookingDetails?.selectedCar?.gst_amount) || 0;
    return fare - gst;
  }

  goBack(): void {
    this.router.navigate(['/booking-info'], { 
      state: { bookingDetails: this.bookingDetails } 
    });
  }

  bookNow(): void {
    if (this.paymentForm.valid) {
      const paymentDetails = this.paymentForm.value;
      const mergedDetails = {
        ...paymentDetails,
        bookingDetails: this.bookingDetails
      };
      // console.log('booknaow data',mergedDetails);
      this.paymentService.payWithRazorpay(mergedDetails);
    } else {
      Object.keys(this.paymentForm.controls).forEach(key => {
        const control = this.paymentForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.paymentForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  calculatePaymentAmount(percentage: number): number {
    const totalPrice = this.getCarPrice();
    return Math.round(totalPrice * percentage);
  }

  formatCurrency(amount: number): string {
    return '₹' + amount.toLocaleString('en-IN');
  }

  // Helper to get current car
  getCurrentCar(): CarOption | null {
    return this.bookingDetails?.selectedCar || null;
  }

  /**
 * Get icon color class based on active tab
 */
getIconColorClass(tab: string): string {
  const colorMap: { [key: string]: string } = {
    'inclusions': 'icon-inclusions',
    'exclusions': 'icon-exclusions',
    'facilities': 'icon-facilities',
    'tc': 'icon-tc'
  };
  return colorMap[tab] || 'icon-tc';
}

showGST = false;

addGST() {
  this.showGST = true;

  // Company Name → REQUIRED
  this.paymentForm.get('companyname')?.setValidators([
    Validators.required,
    Validators.minLength(2),
    Validators.pattern('^[a-zA-Z0-9 .,&()-]+$')
  ]);

  // GST → REQUIRED
  this.paymentForm.get('usergst')?.setValidators([
    Validators.required,
    Validators.pattern(
      '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
    )
  ]);

  this.paymentForm.get('companyname')?.updateValueAndValidity();
  this.paymentForm.get('usergst')?.updateValueAndValidity();
}

removeGST() {
  this.showGST = false;

  this.paymentForm.get('companyname')?.clearValidators();
  this.paymentForm.get('companyname')?.setValue('');

  this.paymentForm.get('usergst')?.clearValidators();
  this.paymentForm.get('usergst')?.setValue('');

  this.paymentForm.get('companyname')?.updateValueAndValidity();
  this.paymentForm.get('usergst')?.updateValueAndValidity();
}

onGSTInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  const value = input.value.toUpperCase();

  this.paymentForm.get('usergst')?.setValue(value, { emitEvent: false });
}



}