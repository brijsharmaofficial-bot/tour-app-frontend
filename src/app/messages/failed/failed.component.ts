import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: 'app-failure',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="failed-container">
      <div class="failed-icon">
        <svg class="crossmark" viewBox="0 0 52 52">
          <circle class="crossmark-circle" cx="26" cy="26" r="25" fill="none"/>
          <path class="crossmark-cross" fill="none" d="M16 16 36 36 M36 16 16 36"/>
        </svg>
      </div>
      <h1 class="failed-title">Booking Failed</h1>
      <p class="failed-message">
        Oops! Something went wrong and your booking could not be completed.<br>
        Please try again or contact our support team for assistance.
      </p>
      <div class="failed-details">
        <ul>
          <li><strong>Support:</strong> We're here to help you 24/7.</li>
          <li><strong>Contact:</strong> <a href="tel:+919999999999">+91 99999 99999</a></li>
        </ul>
      </div>
      <a class="failed-btn" routerLink="/">Back to Dashboard</a>
    </div>
  `,
  styles: [`
    .failed-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      background: #fff5f5;
      padding: 32px 16px;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(244,67,54,0.07);
      max-width: 420px;
      margin: 40px auto;
    }
    .failed-icon {
      margin-bottom: 24px;
    }
    .crossmark {
      width: 80px;
      height: 80px;
      display: block;
      stroke-width: 2;
      stroke: #f44336;
      stroke-miterlimit: 10;
      box-shadow: 0 0 10px #f4433640;
      border-radius: 50%;
      background: #fff;
    }
    .crossmark-circle {
      stroke-dasharray: 166;
      stroke-dashoffset: 166;
      stroke-width: 2;
      stroke: #f44336;
      fill: none;
      animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }
    .crossmark-cross {
      stroke-dasharray: 56;
      stroke-dashoffset: 56;
      stroke-width: 2.5;
      stroke: #f44336;
      animation: stroke 0.4s 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }
    @keyframes stroke {
      100% {
        stroke-dashoffset: 0;
      }
    }
    .failed-title {
      font-size: 2rem;
      color: #c62828;
      margin-bottom: 12px;
      font-weight: 700;
      text-align: center;
    }
    .failed-message {
      color: #b71c1c;
      font-size: 1.1rem;
      margin-bottom: 18px;
      text-align: center;
      line-height: 1.6;
    }
    .failed-details {
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 8px #f4433620;
      padding: 16px 20px;
      margin-bottom: 28px;
      width: 100%;
    }
    .failed-details ul {
      list-style: none;
      padding: 0;
      margin: 0;
      color: #b71c1c;
      font-size: 1rem;
    }
    .failed-details li {
      margin-bottom: 8px;
    }
    .failed-details a {
      color: #f44336;
      text-decoration: underline;
    }
    .failed-btn {
      display: inline-block;
      padding: 12px 32px;
      background: linear-gradient(90deg, #f44336 0%, #ff7961 100%);
      color: #fff;
      border-radius: 25px;
      font-weight: 600;
      text-decoration: none;
      font-size: 1rem;
      box-shadow: 0 2px 8px #f4433640;
      transition: background 0.2s;
    }
    .failed-btn:hover {
      background: linear-gradient(90deg, #ff7961 0%, #f44336 100%);
      color: #fff;
    }
  `]       
})
export class FailedComponent {
  constructor() {}
}