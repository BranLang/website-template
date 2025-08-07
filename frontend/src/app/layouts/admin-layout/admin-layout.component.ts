import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [MatToolbarModule, RouterOutlet],
  template: `
    <mat-toolbar color="primary">Admin</mat-toolbar>
    <div class="admin-layout">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AdminLayoutComponent {}


