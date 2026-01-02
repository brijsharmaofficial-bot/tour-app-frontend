import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTestimonialsSectionComponent } from './home-testimonials-section.component';

describe('HomeTestimonialsSectionComponent', () => {
  let component: HomeTestimonialsSectionComponent;
  let fixture: ComponentFixture<HomeTestimonialsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeTestimonialsSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeTestimonialsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
