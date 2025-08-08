import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '../../components/header/header.component';
import { SiteService } from '../../services/site.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, TranslateModule, HeaderComponent],
  template: `
    <app-header></app-header>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .main-content {
      margin-top: 64px; /* Height of the fixed header */
      min-height: calc(100vh - 64px);
    }
  `]
})
export class PublicLayoutComponent implements OnInit {
  constructor(private siteService: SiteService) {}

  ngOnInit(): void {
    this.siteService.loadSite();
  }
}


