import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BookingFormModalComponent } from '../../booking-form-modal/booking-form-modal.component';
import { CarService } from '../../services/car.service';
import { FooterComponent } from '../../components/footer/footer.component';

interface CarType {
  id: number;
  name: string;
  icon: string;
  price: number;
}


interface CarOption {
  id:number;
  package_id: number;
  vendor_id:number;
  cab_id:number;
  trip_type: string;
  vendor: string;
  cab_name: string;
  cab_type: string;
  capacity: number;
  distance_km: string;
  base_fare: number | string;
  price_per_km: number;
  discount:number;
  discount_percent:number;
  da:number;
  toll_tax:number;
  extra_price_per_km:number;
  final_fare: number | string;
  original_fare:number | string;
  gst_amount:number | string;
  gst: number;
  image?: string;
  showDetails: boolean;
  activeTab: 'inclusions' | 'exclusions' | 'facilities' | 'tc';
  rating: string;
}

@Component({
  selector: 'app-airport',
  standalone: true,
  imports: [CommonModule, NgbModule, NavbarComponent,FooterComponent,BookingFormModalComponent ],
  templateUrl: './airport.component.html',
  styleUrl: './airport.component.css'
})
export class AirportComponent implements OnInit {
  bookingData: any;
  loading = false;
  isLoading = false;
  selectedCarType: string = '';
  filteredCarOptions: CarOption[] = [];
  carTypes: CarType[] = [];
  carOptions: CarOption[] = [];
  triptype: string = 'airport';
   
  noCabsMessage: string = '';
   
  // Add these methods to your component
  blogPosts = [
    {
      id: 1,
      title: 'Top 10 Travel Tips for Long Road Trips',
      excerpt: 'Essential tips to make your long journey comfortable and safe. Learn about packing, rest stops, and more...',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      readTime: '5 min read',
      category: 'Travel Tips'
    },
    {
      id: 2,
      title: 'How to Choose the Perfect Cab for Your Journey',
      excerpt: 'A comprehensive guide to selecting the right vehicle based on passengers, luggage, and distance...',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      readTime: '3 min read',
      category: 'Booking Guide'
    },
    {
      id: 3,
      title: 'Understanding Cab Pricing and Hidden Charges',
      excerpt: 'Learn how cab fares are calculated and what additional charges to watch out for during your ride...',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      readTime: '4 min read',
      category: 'Pricing'
    },
    {
      id: 4,
      title: 'Safety Measures Every Passenger Should Know',
      excerpt: 'Important safety protocols and features to ensure a secure and worry-free cab journey...',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      readTime: '4 min read',
      category: 'Safety'
    },
    {
      id: 5,
      title: 'Best Time to Book Cabs for Maximum Savings',
      excerpt: 'Discover the optimal times to book your rides and save money with smart timing strategies...',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      readTime: '3 min read',
      category: 'Savings'
    },
    {
      id: 6,
      title: 'Luggage Guide: What Fits in Different Cab Types',
      excerpt: 'Complete guide to luggage capacity across hatchbacks, sedans, and SUVs for stress-free packing...',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      readTime: '4 min read',
      category: 'Luggage'
    }
  ];

  // Beautiful places images for the slider
  placesImages = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1524230659092-07f99a75c013?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      title: 'Mountain Routes',
      description: 'Scenic mountain journeys',
      type: 'Adventure'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      title: 'Coastal Drives',
      description: 'Beautiful beachside routes',
      type: 'Coastal'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      title: 'Hill Stations',
      description: 'Cool mountain destinations',
      type: 'Hill Station'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      title: 'Forest Trails',
      description: 'Peaceful forest journeys',
      type: 'Nature'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      title: 'Lakeside Routes',
      description: 'Serene lake destinations',
      type: 'Lakeside'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      title: 'Sunset Drives',
      description: 'Beautiful evening journeys',
      type: 'Scenic'
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      title: 'Countryside',
      description: 'Peaceful rural routes',
      type: 'Countryside'
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      title: 'Forest Roads',
      description: 'Mystical forest pathways',
      type: 'Adventure'
    }
  ];

  // Add these properties to your component
  selectedFilters = {
    cabTypes: [] as string[],
    capacities: [] as number[],
    cabNames: [] as string[],
    vendors: [] as string[],
    minPrice: null as number | null,
    maxPrice: null as number | null,
    sortBy: 'price_low_high'
  };
  
  seatCapacities = [2, 4, 5, 6, 7, 8];
  pricePresets = [
    { min: 0, max: 1000 },
    { min: 1000, max: 2000 },
    { min: 2000, max: 5000 },
    { min: 5000, max: 10000 }
  ];
  
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private carservice: CarService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.bookingData = navigation?.extras?.state?.['bookingData'];
    console.log('🚖 Airport booking data:', this.bookingData);
  }
  
  ngOnInit(): void {
    if (!this.bookingData) {
      this.router.navigate(['/']);
      return;
    }

    // Fetch car options by selected cities
    this.getCarOptionsByCities(
      this.bookingData?.city_id,
      this.triptype,
      this.bookingData?.airport_id,
      this.bookingData?.airportTripType === 'dropToAirport'? 'drop': this.bookingData?.airportTripType === 'pickFromAirport'? 'pickup' : null
    );    

  }

  scrollToCar(carId: number): void {
    const element = document.getElementById('car-' + carId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Add highlight animation
      element.classList.add('car-highlight');
      setTimeout(() => {
        element.classList.remove('car-highlight');
      }, 2000);
    }
  }

  /**
   * Fetch cabs from Laravel API based on city selection
   */
  getCarOptionsByCities(city_id: number, triptype: string, airport_id:number, airport_type:any): void {
    this.loading = true;
    this.noCabsMessage = '';
    
    console.log('🔍 Fetching car options with:', { city_id, triptype, airport_id, airport_type });

    this.carservice.getAirportCab(city_id, triptype, airport_id, airport_type).subscribe({
      next: (response: any) => {
        console.log('✅ Raw API Response:', response);

        if (response && response.data && Array.isArray(response.data)) {
          // Laravel returns data in { message, data } format
          this.carOptions = response.data.map((car: any) => ({
            ...car,
            showDetails: false,
            activeTab: 'inclusions',
            rating: (Math.random() * (4.9 - 4.5) + 4.5).toFixed(1)
          }));
          
          // ONLY CALL selectFirstCarType - DON'T set filteredCarOptions separately
          this.sortCarsByPrice();
          this.selectFirstCarType();
          this.noCabsMessage = '';
          console.log('✅ Car options processed:', this.carOptions);
        } else if (Array.isArray(response)) {
          // If response is directly an array
          this.carOptions = response.map((car: any) => ({
            ...car,
            showDetails: false,
            activeTab: 'inclusions',
            rating: (Math.random() * (4.9 - 4.5) + 4.5).toFixed(1)
          }));
          
          // ONLY CALL selectFirstCarType - DON'T set filteredCarOptions separately
          this.sortCarsByPrice();
          this.selectFirstCarType();
          this.noCabsMessage = '';
          console.log('✅ Car options processed (direct array):', this.carOptions);
        } else {
          // No cabs found
          this.carOptions = [];
          this.filteredCarOptions = [];
          this.noCabsMessage = '🚫 No cabs available for the selected route.';
          console.log('ℹ️ No cabs found in response');
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('❌ API Error:', err);
        this.loading = false;

        // Handle different error scenarios
        if (err.status === 404) {
          this.noCabsMessage = '🚫 No cabs available for the selected route.';
        } else if (err.status === 422) {
          this.noCabsMessage = '⚠️ Invalid search parameters. Please check your selection.';
        } else if (err.status === 500) {
          this.noCabsMessage = '⚠️ Server error. Please try again later.';
        } else {
          this.noCabsMessage = '⚠️ Unable to fetch cab options. Please try again.';
        }

        this.carOptions = [];
        this.filteredCarOptions = [];

        // Log detailed error information
        console.log('🔍 Error details:', {
          status: err.status,
          statusText: err.statusText,
          url: err.url,
          error: err.error
        });
      }
    });
  }

  /**
   * Sort cars by final fare price (low to high)
   */
  sortCarsByPrice(): void {
    this.carOptions.sort((a, b) => {
      // Convert final_fare to number for comparison
      const priceA = this.convertToNumber(a.final_fare);
      const priceB = this.convertToNumber(b.final_fare);
      
      return priceA - priceB; // Ascending order (low to high)
    });
    
    console.log('📊 Cars sorted by price (low to high)');
  }

  /**
   * Convert final_fare to number (handle string with commas)
   */
  private convertToNumber(price: number | string): number {
    if (typeof price === 'number') {
      return price;
    }
    
    if (typeof price === 'string') {
      // Remove commas and convert to number
      const cleanPrice = price.replace(/,/g, '');
      return parseFloat(cleanPrice) || 0;
    }
    
    return 0;
  }
  /**
   * Auto-select first car type by default
   */
  selectFirstCarType(): void {
    if (this.carOptions.length > 0) {
      const firstCarType = this.carOptions[0].cab_type;
      this.selectedCarType = firstCarType;
      this.filteredCarOptions = this.carOptions.filter(car => 
        car.cab_type === firstCarType
      );
      console.log('🎯 Auto-selected first car type:', firstCarType);
      console.log('📊 Filtered cars count:', this.filteredCarOptions.length);
    } else {
      this.filteredCarOptions = [...this.carOptions];
    }
  }

  /**
   * Get unique car types for the filter selector
   */
  getUniqueCarTypes(): CarOption[] {
    const uniqueTypes = new Map();
    this.carOptions.forEach(car => {
      if (!uniqueTypes.has(car.cab_type)) {
        uniqueTypes.set(car.cab_type, car);
      }
    });
    return Array.from(uniqueTypes.values());
  }

  /**
   * Filter cars by type
   */
  selectCarType(cabType: string): void {
    this.selectedCarType = cabType;
    
    if (cabType) {
      this.filteredCarOptions = this.carOptions.filter(car => 
        car.cab_type === cabType
      );
    } else {
      this.filteredCarOptions = [...this.carOptions];
    }
    console.log('🔍 Filtered cars by type:', cabType, this.filteredCarOptions.length);
  }

  /**
   * Toggle details section
   */
  showDetails(car: CarOption): void {
    car.showDetails = !car.showDetails;
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
  getTabContent(car: CarOption): { icon: string; text: string }[] {
    const content = {
      inclusions: [
        { icon: 'fas fa-rupee-sign text-primary', text: `Base Fare for ${car.distance_km} km` },
        { icon: 'fas fa-user-tie text-primary', text: 'Driver Allowance' },
        { icon: 'fas fa-road text-primary', text: 'Toll & State Tax included' },
        { icon: 'fas fa-receipt text-primary', text: `GST (${car.gst}%)` }
      ],
      exclusions: [
        {icon:'fas fa-rupee-sign text-primary',text:`Base Fare for ${car.distance_km} km. ₹${car.extra_price_per_km}/km will be charged beyond that`},
        { icon: 'fas fa-gas-pump text-secondary', text: 'Fuel surcharge (if applicable)' },
        { icon: 'fas fa-parking text-secondary', text: 'Parking or Entry Fees' }
      ],
      facilities: [
        { icon: 'fas fa-snowflake text-info', text: 'Air Conditioned Cab' },
        { icon: 'fas fa-luggage-cart text-info', text: 'Luggage Space Available' }
      ],
      tc: [
        { icon: 'fas fa-info-circle text-muted', text: 'Trip charges may vary depending on route conditions.' }
      ]
    };
    return content[car.activeTab] || [];
  }

  /**
   * Open Modify Booking Modal
   */
  openBookingForm(): void {
    const modalEl = document.getElementById('bookingModal');
    if (!modalEl) return;
  
    let modal = (window as any).bootstrap.Modal.getInstance(modalEl);
    if (!modal) {
      modal = new (window as any).bootstrap.Modal(modalEl, {
        backdrop: true,
        keyboard: true
      });
    }
    modal.show();
  }

  onBookingUpdated(formData: any) {
    console.log('✈️ Airport booking updated:', formData);
  
    // 1️⃣ Update booking data
    this.bookingData = formData;
  
    // 2️⃣ Reset state
    this.carOptions = [];
    this.filteredCarOptions = [];
    this.selectedCarType = '';
    this.noCabsMessage = '';
  
    // 3️⃣ Resolve airport type
    const airportType =
      formData.airportTripType === 'dropToAirport'
        ? 'drop'
        : formData.airportTripType === 'pickFromAirport'
        ? 'pickup'
        : null;
  
    // 4️⃣ Re-call API with NEW data ✅
    this.getCarOptionsByCities(
      formData.city_id,
      this.triptype,
      formData.airport_id,
      airportType
    );
  }
  

  /**
   * Proceed to Booking Info Page
   */
  async selectCar(car: CarOption): Promise<void> {
    try {
      this.isLoading = true;
      await this.router.navigate(['/booking-info'], {
        state: {
          bookingData: this.bookingData,
          selectedCar: car
        }
      });
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      this.isLoading = false;
    }
  }




// Filter Methods
getUniqueCabTypes(): string[] {
  return [...new Set(this.carOptions.map(car => car.cab_type))];
}

getUniqueCabNames(): string[] {
  return [...new Set(this.carOptions.map(car => car.cab_name))];
}

getUniqueVendors(): string[] {
  return [...new Set(this.carOptions.map(car => car.vendor))];
}

// Filter Toggle Methods
toggleCabTypeFilter(type: string): void {
  const index = this.selectedFilters.cabTypes.indexOf(type);
  if (index > -1) {
    this.selectedFilters.cabTypes.splice(index, 1);
  } else {
    this.selectedFilters.cabTypes.push(type);
  }
  this.applyFilters();
}

toggleCapacityFilter(capacity: number): void {
  const index = this.selectedFilters.capacities.indexOf(capacity);
  if (index > -1) {
    this.selectedFilters.capacities.splice(index, 1);
  } else {
    this.selectedFilters.capacities.push(capacity);
  }
  this.applyFilters();
}

toggleCabNameFilter(name: string): void {
  const index = this.selectedFilters.cabNames.indexOf(name);
  if (index > -1) {
    this.selectedFilters.cabNames.splice(index, 1);
  } else {
    this.selectedFilters.cabNames.push(name);
  }
  this.applyFilters();
}

toggleVendorFilter(vendor: string): void {
  const index = this.selectedFilters.vendors.indexOf(vendor);
  if (index > -1) {
    this.selectedFilters.vendors.splice(index, 1);
  } else {
    this.selectedFilters.vendors.push(vendor);
  }
  this.applyFilters();
}

// Price Filter Methods
applyPriceFilter(): void {
  this.applyFilters();
}

applyPricePreset(preset: any): void {
  this.selectedFilters.minPrice = preset.min;
  this.selectedFilters.maxPrice = preset.max;
  this.applyFilters();
}

isPricePresetActive(preset: any): boolean {
  return this.selectedFilters.minPrice === preset.min && 
         this.selectedFilters.maxPrice === preset.max;
}

// Sort Method
onSortChange(event: any): void {
  this.selectedFilters.sortBy = event.target.value;
  this.applyFilters();
}

// Main Filter Application
applyFilters(): void {
  let filteredCars = [...this.carOptions];

  // Apply Cab Type Filter
  if (this.selectedFilters.cabTypes.length > 0) {
    filteredCars = filteredCars.filter(car => 
      this.selectedFilters.cabTypes.includes(car.cab_type)
    );
  }

  // Apply Capacity Filter
  if (this.selectedFilters.capacities.length > 0) {
    filteredCars = filteredCars.filter(car => 
      this.selectedFilters.capacities.some(capacity => car.capacity >= capacity)
    );
  }

  // Apply Cab Name Filter
  if (this.selectedFilters.cabNames.length > 0) {
    filteredCars = filteredCars.filter(car => 
      this.selectedFilters.cabNames.includes(car.cab_name)
    );
  }

  // Apply Vendor Filter
  if (this.selectedFilters.vendors.length > 0) {
    filteredCars = filteredCars.filter(car => 
      this.selectedFilters.vendors.includes(car.vendor)
    );
  }

  // Apply Price Filter
  if (this.selectedFilters.minPrice !== null) {
    filteredCars = filteredCars.filter(car => {
      const price = this.convertToNumber(car.final_fare);
      return price >= this.selectedFilters.minPrice!;
    });
  }

  if (this.selectedFilters.maxPrice !== null) {
    filteredCars = filteredCars.filter(car => {
      const price = this.convertToNumber(car.final_fare);
      return price <= this.selectedFilters.maxPrice!;
    });
  }

  // Apply Sorting
  filteredCars = this.sortCars(filteredCars);

  this.filteredCarOptions = filteredCars;
}

// Sorting Logic
sortCars(cars: CarOption[]): CarOption[] {
  switch (this.selectedFilters.sortBy) {
    case 'price_low_high':
      return cars.sort((a, b) => this.convertToNumber(a.final_fare) - this.convertToNumber(b.final_fare));
    
    case 'price_high_low':
      return cars.sort((a, b) => this.convertToNumber(b.final_fare) - this.convertToNumber(a.final_fare));
    
    case 'seats_low_high':
      return cars.sort((a, b) => a.capacity - b.capacity);
    
    case 'seats_high_low':
      return cars.sort((a, b) => b.capacity - a.capacity);
    
    case 'name_a_z':
      return cars.sort((a, b) => a.cab_name.localeCompare(b.cab_name));
    
    case 'name_z_a':
      return cars.sort((a, b) => b.cab_name.localeCompare(a.cab_name));
    
    default:
      return cars;
  }
}

// Utility Methods
clearAllFilters(): void {
  this.selectedFilters = {
    cabTypes: [],
    capacities: [],
    cabNames: [],
    vendors: [],
    minPrice: null,
    maxPrice: null,
    sortBy: 'price_low_high'
  };
  this.applyFilters();
}

hasActiveFilters(): boolean {
  return this.selectedFilters.cabTypes.length > 0 ||
         this.selectedFilters.capacities.length > 0 ||
         this.selectedFilters.cabNames.length > 0 ||
         this.selectedFilters.vendors.length > 0 ||
         this.selectedFilters.minPrice !== null ||
         this.selectedFilters.maxPrice !== null;
}

getActiveFilters(): string[] {
  const filters: string[] = [];
  
  this.selectedFilters.cabTypes.forEach(type => filters.push(`Type: ${type}`));
  this.selectedFilters.capacities.forEach(cap => filters.push(`Seats: ${cap}+`));
  this.selectedFilters.cabNames.forEach(name => filters.push(`Name: ${name}`));
  this.selectedFilters.vendors.forEach(vendor => filters.push(`Vendor: ${vendor}`));
  
  if (this.selectedFilters.minPrice !== null) {
    filters.push(`Min: ₹${this.selectedFilters.minPrice}`);
  }
  
  if (this.selectedFilters.maxPrice !== null) {
    filters.push(`Max: ₹${this.selectedFilters.maxPrice}`);
  }
  
  return filters;
}

removeFilter(filterString: string): void {
  // Implement logic to remove specific filter based on filterString
  // This is a simplified version - you might want to implement more specific removal
  this.clearAllFilters();
}

// Helper method to convert price to number
// private convertToNumber(price: number | string): number {
//   if (typeof price === 'number') return price;
//   if (typeof price === 'string') {
//     const cleanPrice = price.replace(/,/g, '');
//     return parseFloat(cleanPrice) || 0;
//   }
//   return 0;
// }
}
