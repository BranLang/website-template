import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatCardModule],
  template: `
    <div class="about-container">
      <div class="container">
        <h1>{{ 'ABOUT.TITLE' | translate }}</h1>
        <p>{{ 'ABOUT.DESCRIPTION' | translate }}</p>
        
        <mat-card class="values-card">
          <h2>{{ 'ABOUT.VALUES.TITLE' | translate }}</h2>
          <ul>
            <li>{{ 'ABOUT.VALUES.QUALITY' | translate }}</li>
            <li>{{ 'ABOUT.VALUES.INNOVATION' | translate }}</li>
            <li>{{ 'ABOUT.VALUES.CUSTOMER_SATISFACTION' | translate }}</li>
            <li>{{ 'ABOUT.VALUES.RESPONSIVE' | translate }}</li>
          </ul>
        </mat-card>

        <mat-card class="contact-card">
          <h2>{{ 'ABOUT.CONTACT_INFO.TITLE' | translate }}</h2>
          <p><strong>{{ 'ABOUT.CONTACT_INFO.COMPANY' | translate }}</strong></p>
          <p>{{ 'ABOUT.CONTACT_INFO.ADDRESS' | translate }}</p>
          <p>{{ 'ABOUT.CONTACT_INFO.CITY' | translate }}</p>
          <p>{{ 'ABOUT.CONTACT_INFO.COUNTRY' | translate }}</p>
          <p>{{ 'ABOUT.CONTACT_INFO.VAT_ID' | translate }}</p>
          <p>{{ 'ABOUT.CONTACT_INFO.TAX_ID' | translate }}</p>
          <p>{{ 'ABOUT.CONTACT_INFO.DIRECTOR' | translate }}</p>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .about-container {
      padding: 80px 0;
      background-color: #f8f9fa;
      min-height: calc(100vh - 64px);
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 20px;
    }

    h1 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 1rem;
      text-align: center;
    }

    p {
      font-size: 1.1rem;
      line-height: 1.6;
      color: #666;
      margin-bottom: 2rem;
    }

    .values-card,
    .contact-card {
      margin: 2rem 0;
      padding: 2rem;
    }

    h2 {
      color: #333;
      margin-bottom: 1rem;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
    }

    li:last-child {
      border-bottom: none;
    }

    strong {
      color: #333;
    }
  `]
})
export class AboutComponent {}
