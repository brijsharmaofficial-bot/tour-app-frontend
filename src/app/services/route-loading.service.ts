// services/route-loading.service.ts
import { Injectable, inject } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class RouteLoadingService {
  private router = inject(Router);
  private loadingService = inject(LoadingService);

  constructor() {
    this.setupRouterEvents();
  }

  private setupRouterEvents(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingService.show();
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        // Add a small delay for better UX
        setTimeout(() => {
          this.loadingService.hide();
        }, 500);
      }
    });
  }
}