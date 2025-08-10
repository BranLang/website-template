import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { SiteService } from '../../services/site.service';
import { CategoriesService, CategoryPageData } from './categories.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, MatCardModule, MatButtonModule, MatIconModule],
  providers: [CategoriesService],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categoryPageData$!: Observable<CategoryPageData | null>;

  constructor(
    private categoriesService: CategoriesService,
    public siteService: SiteService
  ) {}

  ngOnInit(): void {
    this.categoryPageData$ = this.categoriesService.categoryPageData$;
  }
}
