import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { Observable } from 'rxjs';
import { Page } from '../../models/page.model';
import { FaqService } from './faq.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatCardModule, MatExpansionModule],
  providers: [FaqService],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  faqPage$!: Observable<Page | null>;

  constructor(private faqService: FaqService) {}

  ngOnInit(): void {
    this.faqPage$ = this.faqService.faqPage$;
  }
}
