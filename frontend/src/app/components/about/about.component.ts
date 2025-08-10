import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { Observable } from 'rxjs';
import { Page } from '../../models/page.model';
import { AboutService } from './about.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatCardModule],
  providers: [AboutService],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  aboutPage$!: Observable<Page | null>;

  constructor(private aboutService: AboutService) {}

  ngOnInit(): void {
    this.aboutPage$ = this.aboutService.aboutPage$;
  }
}
