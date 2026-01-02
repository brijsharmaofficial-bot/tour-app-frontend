import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeOffersSectionComponent } from './home-offers-section.component';

describe('HomeOffersSectionComponent', () => {
  let component: HomeOffersSectionComponent;
  let fixture: ComponentFixture<HomeOffersSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeOffersSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeOffersSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
