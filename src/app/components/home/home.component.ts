import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { BookingFormComponent } from '../booking-form/booking-form.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { HomeOffersSectionComponent } from '../home-offers-section/home-offers-section.component';
import { HomeOurservicesSectionComponent } from '../../home-ourservices-section/home-ourservices-section.component';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { PageService } from '../../services/page.service';
import { FeaturesSectionComponent } from '../features-section/features-section.component';

Swiper.use([Navigation, Pagination, Autoplay]);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,
    BookingFormComponent,
    FooterComponent,
    CommonModule,
    HomeOffersSectionComponent,
    HomeOurservicesSectionComponent,
    FeaturesSectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  aboutTitle = 'About Car Rental Kolkata';
  content: string = '';
  aboutContent = `Car Rental Kolkata is your trusted partner for safe, reliable, and affordable cab services across India. With a fleet of well-maintained vehicles and experienced drivers, we ensure a comfortable journey for every customer.`;

  testimonialSwiper: Swiper | undefined;
  isSwiperInitialized = false;

  constructor(private pageservice: PageService) { }

  ngOnInit() {
    this.getHomeData();
  }

  ngAfterViewInit() {
    // Initialize Swiper after a small delay to ensure DOM is ready
    setTimeout(() => {
      this.initTestimonialSlider();
    }, 100);
  }

  ngOnDestroy() {
    this.destroySwiper();
  }

  initTestimonialSlider() {
    // Destroy existing swiper instance if exists
    if (this.testimonialSwiper) {
      this.destroySwiper();
    }

    const swiperElement = document.querySelector('.testimonials-swiper');
    
    if (!swiperElement) {
      console.warn('Swiper element not found');
      return;
    }

    try {
      this.testimonialSwiper = new Swiper('.testimonials-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        speed: 800,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true,
        },
        navigation: {
          nextEl: '.next-btn',
          prevEl: '.prev-btn',
        },
        breakpoints: {
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        },
        on: {
          init: () => {
            this.isSwiperInitialized = true;
            this.updateSliderCounter();
          },
          slideChange: () => {
            this.updateSliderCounter();
          },
          destroy: () => {
            this.isSwiperInitialized = false;
          }
        }
      });
    } catch (error) {
      console.error('Error initializing Swiper:', error);
    }
  }

  destroySwiper() {
    if (this.testimonialSwiper) {
      try {
        this.testimonialSwiper.destroy(true, true);
        this.testimonialSwiper = undefined;
        this.isSwiperInitialized = false;
      } catch (error) {
        console.error('Error destroying Swiper:', error);
      }
    }
  }

  updateSliderCounter() {
    if (!this.testimonialSwiper || !this.isSwiperInitialized) return;
    
    try {
      const currentSlide = this.testimonialSwiper.realIndex + 1;
      const totalSlides = this.testimonialSwiper.slides.length;
      
      const currentElement = document.querySelector('.current-slide');
      const totalElement = document.querySelector('.total-slides');
      
      if (currentElement) {
        currentElement.textContent = currentSlide.toString().padStart(2, '0');
      }
      if (totalElement) {
        totalElement.textContent = totalSlides.toString().padStart(2, '0');
      }
    } catch (error) {
      console.error('Error updating slider counter:', error);
    }
  }

  getHomeData() {
    this.pageservice.getPageBySlug('home').subscribe({
      next: data => {
        this.content = data.content;
        // Reinitialize swiper after content is loaded if needed
        if (this.isSwiperInitialized) {
          setTimeout(() => {
            this.testimonialSwiper?.update();
          }, 100);
        }
      },
      error: (error) => {
        console.error('Error fetching home data:', error);
      }
    });
  }

  // Method to reinitialize swiper (can be called from parent if needed)
  reinitializeSwiper() {
    this.destroySwiper();
    setTimeout(() => {
      this.initTestimonialSlider();
    }, 300);
  }
}