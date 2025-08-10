import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CarouselSlide {
  id: string;
  imageUrl: string;
  imageAlt: string;
  titleTranslationId: string;
  subtitleTranslationId: string;
  category: string;
  productType: string;
  sortOrder: number;
  isActive: boolean;
  siteId: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCarouselSlides(): Observable<CarouselSlide[]> {
    return this.http.get<CarouselSlide[]>(`${this.apiUrl}/carousel`);
  }

  getCarouselSlidesBySite(siteId: number): Observable<CarouselSlide[]> {
    return this.http.get<CarouselSlide[]>(`${this.apiUrl}/carousel/site/${siteId}`);
  }
}
