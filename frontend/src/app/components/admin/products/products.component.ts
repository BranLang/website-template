import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatCardModule],
  template: `
    <div class="admin-products-container">
      <div class="container">
        <h1>Admin Products</h1>
        <p>Admin products management coming soon...</p>
      </div>
    </div>
  `,
  styles: [`
    .admin-products-container {
      padding: 80px 0;
      min-height: calc(100vh - 64px);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    h1 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 1rem;
      text-align: center;
    }
  `]
})
export class ProductsComponent {}


