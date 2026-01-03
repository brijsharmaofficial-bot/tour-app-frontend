
// booking-confirmation.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';


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
  included_km: string | number;
  hours:string  | number;
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

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.css']
})
export class BookingConfirmationComponent implements OnInit {

  private apiUrl = environment.apiUrl;
  
  airports = [
    { name: 'Kempegowda International Airport Bengaluru (BLR)', location: 'Karnataka' },
    { name: 'Kempegowda International Airport', location: 'Kempegowda International Airport Bengaluru (BLR), Bengaluru, Karnataka' }
  ];

  showAirportDropdown = false;
  bookingForm: FormGroup;
  bookingData: BookingData | null = null;
  selectedCar: CarOption | null = null;
  isMobile = false;
  isLoggedIn = false;
  loggedUser: any = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.bookingData = navigation?.extras?.state?.['bookingData'];
    this.selectedCar = navigation?.extras?.state?.['selectedCar'];

    this.bookingForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      sendToAlternate: [false],
      countryCode: ['+91'],
      usergst: ['',[Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')]],      
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      pickup: ['', Validators.required],
      drop: ['', Validators.required]
    });

    this.checkScreenSize();
    console.log('all type  booking Data carr',this.selectedCar);
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  ngOnInit(): void {

    const user = localStorage.getItem('user');
    if (user) {
      this.isLoggedIn = true;
      this.loggedUser = JSON.parse(user);
  
      // Auto-fill user info
      this.bookingForm.patchValue({
        name: this.loggedUser.name,
        email: this.loggedUser.email,
        phone: this.loggedUser.phone,
        countryCode: '+91'
      });
  
      // Disable non-editable fields
      this.bookingForm.get('name')?.disable();
      this.bookingForm.get('email')?.disable();
      this.bookingForm.get('mobile')?.disable();
      this.bookingForm.get('countryCode')?.disable();
    }

    if (!this.bookingData || !this.selectedCar) {
      this.router.navigate(['/']);
    }
    
    // Initialize car activeTab and showDetails if not set
    if (this.selectedCar) {
      if (!this.selectedCar.activeTab) {
        this.selectedCar.activeTab = 'inclusions';
      }
      if (this.selectedCar.showDetails === undefined) {
        this.selectedCar.showDetails = true;
      }
    }
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

  
    generateRandomPassword(length: number = 8): string {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%!";
      let pass = "";
      for (let i = 0; i < length; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return pass;
    }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }
  
    let formData = this.bookingForm.getRawValue();
  
    // Logged-in user
    if (this.isLoggedIn) {
      formData.name = this.loggedUser.name;
      formData.email = this.loggedUser.email;
      formData.phone = this.loggedUser.phone;
  
      const bookingDetails = {
        ...formData,
        bookingData: this.bookingData,
        selectedCar: this.selectedCar,
        userId: this.loggedUser.id
      };
  
      this.router.navigate(['/payment-details'], { state: { bookingDetails } });
      return;
    }
  
    // -------------------------------
    // 🟩 USER NOT LOGGED-IN → REGISTER
    // -------------------------------
    const randomPassword = this.generateRandomPassword(6);
    const registerPayload = {
      name: formData.name,
      email: formData.email,
      phone: formData.mobile,
      password: randomPassword  // default password
    };
  
    this.http.post(`${this.apiUrl}/register`, registerPayload)
      .subscribe({
        next: (response: any) => {
          
          // Store Login Session
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('user', JSON.stringify(response.user));
  
          // Create bookingDetails with new user ID
          const bookingDetails = {
            ...formData,
            bookingData: this.bookingData,
            selectedCar: this.selectedCar,
            userId: response.user.id
          };
  
          this.router.navigate(['/payment-details'], { state: { bookingDetails } });
        },
  
        error: (error) => {
          console.error('Registration failed', error);
          alert('Registration failed. Maybe email/number already registered.');
        }
      });
  
  }
  

  selectAirport(airport: { name: string; location: string }): void {
    this.bookingForm.get('pickup')?.setValue(airport.name);
    this.showAirportDropdown = false;
  }

  toggleAirportDropdown(): void {
    this.showAirportDropdown = !this.showAirportDropdown;
  }

  addAlternateEmail(): void {
    console.log('Add alternate email clicked');
  }

  onPickupInput(event: any): void {
    console.log('Pickup input:', event.target.value);
  }

  onDropInput(event: any): void {
    console.log('Drop input:', event.target.value);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.bookingForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.position-relative')) {
      this.showAirportDropdown = false;
    }
  }

  // Get tab display text for responsive design
  getTabText(tab: string): string {
    if (!this.isMobile) return tab.toUpperCase();
    
    const shortMap: { [key: string]: string } = {
      'inclusions': 'INC',
      'exclusions': 'EXC',
      'facilities': 'FAC',
      'tc': 'T&C'
    };
    return shortMap[tab] || tab.toUpperCase();
  }

  getPriceWithoutGst() {
    const fare = Number(this.selectedCar?.final_fare) || 0;
    const gst  = Number(this.selectedCar?.gst_amount) || 0;
    return fare - gst;
  }
 
}