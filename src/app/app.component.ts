// app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './components/loader/loader.component';
import { RouteLoadingService } from './services/route-loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoaderComponent],
  template: `
    <app-loader></app-loader>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Tour & Travel';

  constructor(private routeLoadingService: RouteLoadingService) {}

  ngOnInit(): void {
    // Service is automatically initialized in constructor
  }
}