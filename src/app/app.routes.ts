import { Routes } from '@angular/router';
import { pageSlugMatcher } from '../matchers/page-slug.matcher';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './auth.guard';
import { PageViewerComponent } from './pages/page-viewer/page-viewer.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    pathMatch: 'full'  // Add this to ensure exact path matching
  },
  {
     path:'about-us',
      loadComponent: () => import('./pages/about-us/about-us.component').then(c => c.AboutUsComponent)
  },
  { 
    path: 'oneway',
    loadComponent: () => import('./pages/one-way/one-way.component').then(c => c.OneWayComponent)
  },
  { 
    path: 'local',
    loadComponent: () => import('./pages/local/local.component').then(c => c.LocalComponent)
  },
  { 
    path: 'round-trip',
    loadComponent: () => import('./pages/round-trip/round-trip.component').then(c => c.RoundTripComponent)
  },
  { 
    path: 'airport',
    loadComponent: () => import('./pages/airport/airport.component').then(c => c.AirportComponent)
  },
  {
    path: 'booking-info',
    loadComponent: () => import('./pages/booking-confirmation/booking-confirmation.component').then(c => c.BookingConfirmationComponent),
  },
  { 
    path: 'payment-details',
    loadComponent: () => import('./pages/payment-details/payment-details.component').then(c => c.PaymentDetailsComponent)
  },
  { 
    path: 'booking-confirm',
    loadComponent: () => import('./pages/payment-details/payment-details.component').then(c => c.PaymentDetailsComponent)
  },
  {
    path: 'payment-success',
    loadComponent: () => import('./messages/success/success.component').then(c => c.SuccessComponent)
  },
  {
    path: 'payment-failed',
    loadComponent: () => import('./messages/failed/failed.component').then(c => c.FailedComponent)
  },
  {
    path: 'user-profile',
    loadComponent: () => import('./components/user-profile/user-profile.component').then(c => c.UserProfileComponent),
    canActivate: [AuthGuard]
  },
    {
    matcher: pageSlugMatcher,
    component: PageViewerComponent
  },
  { path: '**', redirectTo: '' }
];
