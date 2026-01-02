import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';


interface TripTypes {
  OUTSTATION: string;
  LOCAL: string;
  AIRPORT: string;
}
interface Airport {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
  state:string;
  country:string;
}
@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css'
})
export class BookingFormComponent implements OnInit {

  @Input() prefillData: any;
  @Input() isModal: boolean = false;
  @Output() formSubmitted = new EventEmitter<any>();

  bookingForm!: FormGroup;
  selectedTripType: string = 'ONE WAY';
  selectedMainType: string = 'OUTSTATION';
  selectedSubType: string = 'ONE WAY';
  timeSlots: string[] = [];
  today: string = new Date().toISOString().split('T')[0];

  readonly TRIP_TYPES: TripTypes = {
    OUTSTATION: 'OUTSTATION',
    LOCAL: 'LOCAL',
    AIRPORT: 'AIRPORT'
  };

  popularCities: City[] = [];
  popularLocalCities: City[] = [];
  
  showFromDropdown = false;
  showToDropdown = false;
  showLocalCityDropdown = false;
  showDropLocationDropdown = false;
  showPickupAddressDropdown = false;
  filteredFromCities: City[] = [];
  filteredToCities: City[] = [];
  filteredLocalCities: City[] = [];

  allAirports:Airport[] = [];
  airportcities:City[] = [];

  filteredDropLocations: Airport[] = [];
  filterPickupLocation: City[] = [];  

  selectedFromCity: City | null = null;
  selectedToCity: City | null = null;
  selectedLocalCity: City | null = null;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.initializeForm();
    this.generateTimeSlots();
  }

  ngOnInit(): void {
    // Fetch cities from Laravel API
    this.http.get<City[]>(`${environment.apiUrl}/cities`).subscribe({
      next: (cities) => {
        this.popularCities = cities;
        this.popularLocalCities = cities; // Or filter for local if needed
        this.filteredFromCities = cities;
        this.filteredToCities = cities;
        this.filteredLocalCities = cities;
        // console.log('Cities fetched:', this.popularCities);
      },
      error: (err) => {
        console.error('Failed to fetch cities', err);
      }
    });

    // Fetch airport cities and cities
    this.http.get<{ airports: Airport[], cities: City[] }>(`${environment.apiUrl}/airport-cities`).subscribe({
      next: (data) => {
        this.allAirports = data.airports;
        this.airportcities = data.cities;
        this.filteredDropLocations =  data.airports;
        this.filterPickupLocation = data.cities;
      //  console.log('airport cities',this.airportcities);
      },
      error: (err) => {
        console.error('Failed to fetch airport cities', err);
      }
    });
    

    this.updateFormValidation();
    this.setMinDates();
    this.handleAirportTripTypeChanges();


    if (this.prefillData) {
      this.bookingForm.patchValue(this.prefillData);
    
      this.selectedTripType = this.prefillData.tripType;
      this.selectedMainType = this.prefillData.mainType;
      this.selectedSubType = this.prefillData.subType;
    
      this.updateFormValidation();
    }
    
  }

  private initializeForm(): void {
    this.bookingForm = this.fb.group({
      fromLocation: ['', [Validators.required]],
      toLocation: ['', [Validators.required]],
      from_city_id: [null, [Validators.required]],
      to_city_id: [null, [Validators.required]],
      city: [''],
      city_id: [null],
      airport_id:[null],
      airportTripType: ['dropToAirport'],
      pickupAddress: [''],
      dropLocation: [''],
      pickupDate: [this.today, [Validators.required]],
      returnDate: [this.today],
      pickupTime: ['7:00 AM', [Validators.required]]
    });
  }

  private handleAirportTripTypeChanges(): void {
    this.bookingForm.get('airportTripType')?.valueChanges.subscribe(value => {
      this.bookingForm.patchValue({
        pickupAddress: '',
        dropLocation: ''
      });
    });
  }

  private setMinDates(): void {
    const dateInputs = ['pickupDate', 'returnDate'];
    dateInputs.forEach(id => {
      const element = document.getElementById(id) as HTMLInputElement;
      if (element) {
        element.min = this.today;
      }
    });
  }

  selectTripType(type: string): void {
    this.selectedTripType = type;
    this.selectedMainType = type === 'ONE WAY' || type === 'ROUND TRIP' ? 'OUTSTATION' : type;
    this.selectedSubType = type === 'ROUND TRIP' ? 'ROUND TRIP' : 'ONE WAY';
    this.updateFormValidation();
    this.resetFormFields();
  }

  selectMainType(type: string): void {
    this.selectedMainType = type;
    if (type === this.TRIP_TYPES.OUTSTATION) {
      this.selectedSubType = 'ONE WAY';
      this.selectedTripType = 'ONE WAY';
    } else {
      this.selectedTripType = type;
    }
    this.updateFormValidation();
    this.resetFormFields();
  }

  selectSubType(type: string): void {
    this.selectedSubType = type;
    this.selectedTripType = type;
    this.updateFormValidation();
    this.resetFormFields();
  }

  private resetFormFields(): void {
    const currentValues = {
      pickupDate: this.bookingForm.get('pickupDate')?.value,
      pickupTime: this.bookingForm.get('pickupTime')?.value,
      airportTripType: this.bookingForm.get('airportTripType')?.value
    };

    this.bookingForm.reset(currentValues);
  }

  private updateFormValidation(): void {
    const controls = this.bookingForm.controls;
    
    // Reset all validators
    Object.keys(controls).forEach(key => {
      controls[key].clearValidators();
      controls[key].updateValueAndValidity();
    });

    // Set common validators
    controls['pickupDate'].setValidators([Validators.required]);
    controls['pickupTime'].setValidators([Validators.required]);

    // Set specific validators based on trip type
    switch (this.selectedTripType) {
      case 'LOCAL':
        controls['city'].setValidators([Validators.required]);
        controls['city_id'].setValidators([Validators.required]);
        break;
      case 'AIRPORT':
        controls['pickupAddress'].setValidators([Validators.required]);
        controls['dropLocation'].setValidators([Validators.required]);
        break;
      case 'ROUND TRIP':
        controls['fromLocation'].setValidators([Validators.required]);
        controls['toLocation'].setValidators([Validators.required]);
        controls['from_city_id'].setValidators([Validators.required]);
        controls['to_city_id'].setValidators([Validators.required]);
        controls['returnDate'].setValidators([Validators.required]);
        break;
      default: // ONE WAY
        controls['fromLocation'].setValidators([Validators.required]);
        controls['toLocation'].setValidators([Validators.required]);
        controls['from_city_id'].setValidators([Validators.required]);
        controls['to_city_id'].setValidators([Validators.required]);
    }

    Object.keys(controls).forEach(key => {
      controls[key].updateValueAndValidity();
    });
  }

  private generateTimeSlots(): void {
    this.timeSlots = [];
    for (let i = 0; i < 24; i++) {
      const hour = i === 0 ? 12 : i > 12 ? i - 12 : i;
      const period = i < 12 ? 'AM' : 'PM';
      ['00', '30'].forEach(minutes => {
        this.timeSlots.push(`${hour}:${minutes} ${period}`);
      });
    }
  }

  swapLocations(): void {
    const fromLocation = this.bookingForm.get('fromLocation')?.value;
    const toLocation = this.bookingForm.get('toLocation')?.value;
    const from_city_id = this.bookingForm.get('from_city_id')?.value;
    const to_city_id = this.bookingForm.get('to_city_id')?.value;
    this.bookingForm.patchValue({
      fromLocation: toLocation,
      toLocation: fromLocation,
      from_city_id: to_city_id,
      to_city_id: from_city_id
    });
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      const formData = {
        ...this.bookingForm.value,
        tripType: this.selectedTripType,
        mainType: this.selectedMainType,
        subType: this.selectedSubType
      };
      this.formSubmitted.emit(formData); // 🔥 IMPORTANT
      // Use city IDs for backend/API
      switch (this.selectedTripType) {
        case 'ONE WAY':
          this.router.navigate(['/oneway'], { state: { bookingData: formData }});
          break;
        case 'LOCAL':
          this.router.navigate(['/local'], { state: { bookingData: formData }});
          break;
        case 'ROUND TRIP':
          this.router.navigate(['/round-trip'], { state: { bookingData: formData }});
          break;
        case 'AIRPORT':
          this.router.navigate(['/airport'], { state: { bookingData: formData }});
          break;
      }

    } else {
      Object.keys(this.bookingForm.controls).forEach(key => {
        const control = this.bookingForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  filterFromCities(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    // this.filteredFromCities = this.popularCities.filter(city =>
    //   city.name.toLowerCase().includes(value.toLowerCase())
    // );
    this.filteredFromCities = this.popularCities.filter(city => {
      const searchValue = value.toLowerCase();
      return (
        city.name.toLowerCase().includes(searchValue) ||
        (city.state && city.state.toLowerCase().includes(searchValue))
      );
    });
    
    this.showFromDropdown = true;
  }

  filterToCities(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filteredToCities = this.popularCities.filter(city =>
      city.name.toLowerCase().includes(value.toLowerCase())
    );
    this.showToDropdown = true;
  }

  filterLocalCities(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filteredLocalCities = this.popularLocalCities.filter(city =>
      city.name.toLowerCase().includes(value.toLowerCase())
    );
    this.showLocalCityDropdown = true;
  }

  filterDropLocations(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filteredDropLocations = this.allAirports.filter(airport =>
      airport.name.toLowerCase().includes(value.toLowerCase())
    );
    this.showDropLocationDropdown = true;
  }

  filterPickupAddresses(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.filterPickupLocation = this.airportcities.filter(address =>
      address.name.toLowerCase().includes(value.toLowerCase()) ||
      address.state && address.state.toLowerCase().includes(value.toLowerCase())
    );
    this.showPickupAddressDropdown = true;
  }

  selectFromCity(city: City) {
    this.selectedFromCity = city;
    this.bookingForm.get('fromLocation')?.setValue(`${city.name}, ${city.state}`);
    this.bookingForm.get('from_city_id')?.setValue(city.id);
    this.showFromDropdown = false;
  }

  selectToCity(city: City) {
    this.selectedToCity = city;
    this.bookingForm.get('toLocation')?.setValue(`${city.name}, ${city.state}`);
    this.bookingForm.get('to_city_id')?.setValue(city.id);
    this.showToDropdown = false;
  }

  selectLocalCity(city: City) {
    this.selectedLocalCity = city;
    this.bookingForm.get('city')?.setValue(`${city.name}, ${city.state}`);
    this.bookingForm.get('city_id')?.setValue(city.id);
    this.showLocalCityDropdown = false;
  }

  selectDropLocation(airport: Airport) {
    this.bookingForm.get('dropLocation')?.setValue(`${airport.name}`);
    this.bookingForm.get('airport_id')?.setValue(airport.id);
    this.showDropLocationDropdown = false;

  }

  selectPickupAddress(address: City) {
    this.bookingForm.get('pickupAddress')?.setValue(`${address.name}, ${address.state}`);
    this.bookingForm.get('city_id')?.setValue(address.id);
    this.showPickupAddressDropdown = false;
  }

  // Optional: Hide dropdown after blur with delay to allow click
  hideDropdownWithDelay(type: 'local' | 'from' | 'to' | 'dropLocation' | 'pickupAddress') {
    setTimeout(() => {
      if (type === 'local') this.showLocalCityDropdown = false;
      if (type === 'from') this.showFromDropdown = false;
      if (type === 'to') this.showToDropdown = false;
      if (type === 'dropLocation') this.showDropLocationDropdown = false;
      if (type === 'pickupAddress') this.showPickupAddressDropdown = false;
    }, 200);
  }
}