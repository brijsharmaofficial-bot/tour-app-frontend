import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeOurservicesSectionComponent } from './home-ourservices-section.component';

describe('HomeOurservicesSectionComponent', () => {
  let component: HomeOurservicesSectionComponent;
  let fixture: ComponentFixture<HomeOurservicesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeOurservicesSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeOurservicesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
