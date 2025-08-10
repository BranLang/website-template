import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { Observable } from 'rxjs';
import { Page } from '../../models/page.model';
import { RealizationsService } from './realizations.service';

@Component({
  selector: 'app-realizations',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatCardModule],
  providers: [RealizationsService],
  templateUrl: './realizations.component.html',
  styleUrls: ['./realizations.component.scss']
})
export class RealizationsComponent implements OnInit {
  realizationsPage$!: Observable<Page | null>;

  constructor(private realizationsService: RealizationsService) {}

  ngOnInit(): void {
    this.realizationsPage$ = this.realizationsService.realizationsPage$;
  }
}
