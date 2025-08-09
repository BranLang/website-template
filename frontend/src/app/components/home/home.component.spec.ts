import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { mockSite, mockCategories, mockProducts, mockPages } from '../../mock/mock-data';
import * as en from '../../../assets/i18n/en.json';
import { environment } from '../../../environments/environment';

class FakeLoader implements TranslateLoader {
  getTranslation() {
    return of(en);
  }
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        NoopAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader }
        })
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  function flushAndDetectChanges() {
    const siteReq = httpMock.expectOne(`${environment.apiUrl}/sites/slug/${environment.defaultSiteSlug}`);
    siteReq.flush(mockSite);

    const i18nReq = httpMock.expectOne(`${environment.apiUrl}/i18n?language=sk`);
    i18nReq.flush(en);
    
    const pageReq = httpMock.expectOne(`${environment.apiUrl}/pages/slug/home?language=sk`);
    pageReq.flush(mockPages[0]);
    
    const productsReq = httpMock.expectOne(`${environment.apiUrl}/products/featured?language=sk`);
    productsReq.flush(mockProducts);
    
    const categoriesReq = httpMock.expectOne(`${environment.apiUrl}/categories?language=sk`);
    categoriesReq.flush(mockCategories);

    tick();
    fixture.detectChanges();
  }

  it('should create', fakeAsync(() => {
    flushAndDetectChanges();
    expect(component).toBeTruthy();
  }));

  it('should display translated category titles', fakeAsync(() => {
    flushAndDetectChanges();
    const cardTitles = fixture.nativeElement.querySelectorAll('mat-card-title');
    expect(cardTitles.length).toBeGreaterThan(0);
    expect(cardTitles[0].textContent).toContain(en.NAVIGATION.WINDOWS);
  }));
});
