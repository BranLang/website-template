import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home-about',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, TranslateModule],
  template: `
    <section class="about-section">
      <div class="container">
        <mat-card class="about-card">
          <mat-card-content>
            <h2>{{ 'HOME.ABOUT_US_SHORT' | translate }}</h2>
            <div class="features-grid">
              <div class="feature-item" *ngFor="let featureKey of featuresKeys">
                <mat-icon color="primary">check_circle</mat-icon>
                <span>{{ featureKey | translate }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </section>
  `,
  styles: [`
    .about-section { padding: 4rem 0; background: #f8f9fa; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
    .about-card { background: #fff; border-radius: 8px; padding: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .about-card h2 { font-size: 2rem; color: #333; margin-bottom: 1.5rem; text-align: center; font-weight: 600; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
    .feature-item { display: flex; align-items: center; gap: 1rem; }
    .feature-item mat-icon { color: #673ab7; font-size: 1.5rem; }
  `]
})
export class HomeAboutComponent {
  @Input() featuresKeys: string[] = [];
}



