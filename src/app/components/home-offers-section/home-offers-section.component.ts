import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PageService } from '../../services/page.service';
@Component({
  selector: 'app-home-offers-section',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './home-offers-section.component.html',
  styleUrl: './home-offers-section.component.css'
})
export class HomeOffersSectionComponent {

  offers = [
   {
      image: 'assets/images/packages/char-dham-yatra.png',
      title: 'Char Dham Yatra',
      subtitle: 'Spiritual Journey',
      description: 'Experience the divine with our Char Dham Yatra package.',
      buttonText: 'Book Now',
      pageUrl: 'char-dham-yatra-car-rental-package'
    },
    {
      image:'assets/images/packages/goa-tour-package.png',
      title: 'Goa Tour Package',
      subtitle: 'Beach Bliss',
      description: 'Relax and unwind with our Goa tour package.',
      buttonText: 'Book Now',
      pageUrl: 'goa-tour-package'
    },
     {
      image: 'assets/images/packages/himalayan-adventure.png',
      title: 'Himalayan Adventure',
      subtitle: 'Thrilling Experience',
      description: 'Embark on an unforgettable Himalayan adventure.',
      buttonText: 'Book Now',
      pageUrl: 'himalayan-adventure-tour-package'
    }
  ];

  constructor(pageservice:PageService) {
    pageservice.getPageBySlug('char-dham-yatra-car-rental-package').subscribe((data: any) => {
      console.log(data);
      // You can use the data to populate your component if needed
    }, error => {
      console.error('Error fetching page data:', error);
    });
   }
     
}
