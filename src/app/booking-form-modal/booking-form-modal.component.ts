import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { BookingFormComponent } from '../components/booking-form/booking-form.component';

@Component({
  selector: 'app-booking-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbNavModule,BookingFormComponent],
  templateUrl: 'booking-form-modal.component.html',
})
export class BookingFormModalComponent implements OnInit {
  @Input() prefillData: any;
  @Output() bookingUpdated = new EventEmitter<any>();
  
  constructor(private router: Router) {}

  ngOnInit(): void {
      
  }

  onFormSubmit(formData: any) {
    const modal = document.getElementById('bookingModal');
    if (modal) {
      const bsModal = (window as any).bootstrap.Modal.getInstance(modal);
      bsModal.hide();
    }
  
    // 🔥 parent ko updated data bhejo
    this.bookingUpdated.emit(formData);
  }
  
}
