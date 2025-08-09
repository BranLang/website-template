import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatGridListModule,
    MatCardModule
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  cols$: Observable<number> = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(
      map(result => result.matches ? 1 : 3)
    );

  constructor(private breakpointObserver: BreakpointObserver) {}
}
