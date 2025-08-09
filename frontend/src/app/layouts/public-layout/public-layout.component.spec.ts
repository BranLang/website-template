import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { PublicLayoutComponent } from './public-layout.component';
import { SiteService } from '../../services/site.service';
import { LanguageService } from '../../services/language.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { MockApiInterceptor } from '../../interceptors/mock-api.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

class FakeLoader implements TranslateLoader {
  getTranslation() {
    return of({
      FOOTER: {
        COMPANY_INFO: 'Company info',
        FOLLOW_US: 'Follow',
        PRIVACY_POLICY: 'Privacy',
        TERMS_OF_SERVICE: 'Terms',
        ALL_RIGHTS_RESERVED: 'All rights reserved'
      }
    });
  }
}

describe('PublicLayoutComponent', () => {
  let fixture: ComponentFixture<PublicLayoutComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: FakeLoader } }),
        PublicLayoutComponent,
        FooterComponent,
        HeaderComponent
      ],
      providers: [
        SiteService,
        LanguageService,
        { provide: HTTP_INTERCEPTORS, useClass: MockApiInterceptor, multi: true }
      ]
    }).compileComponents();
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('sk', {
      FOOTER: {
        COMPANY_INFO: 'Info',
        FOLLOW_US: 'Follow',
        PRIVACY_POLICY: 'Privacy',
        TERMS_OF_SERVICE: 'Terms',
        ALL_RIGHTS_RESERVED: 'All rights reserved',
        COOKIE_NOTICE: 'Cookie Notice',
        CONTACT_INFO: {
          COMPANY: 'Test Company',
          ADDRESS_LINE_1: 'Test Address',
          ADDRESS_LINE_2: 'Test City',
          COUNTRY: 'Test Country',
          ICO_LABEL: 'ICO',
          ICO_VALUE: '123456',
          DIC_LABEL: 'DIC',
          DIC_VALUE: 'SK123456',
          DIRECTOR: 'Test Director'
        }
      },
      NAVIGATION: { PRODUCTS: 'Produkty' },
      PRODUCTS: { CATEGORIES: {} },
      CONTACT: { TITLE: 'Kontakt' },
      ABOUT: { TITLE: 'O nás', DESCRIPTION: 'Popis' }
    }, true);
    translate.use('sk');
    fixture = TestBed.createComponent(PublicLayoutComponent);
    fixture.detectChanges();
  });

  it('should render footer element', () => {
    const footerEl = fixture.nativeElement.querySelector('app-footer');
    expect(footerEl).withContext('Footer element missing in layout').not.toBeNull();
    // ensure translations processed (no raw FOOTER. keys)
    const text = footerEl.textContent as string;
    expect(text).withContext('Raw translation keys found in footer').not.toContain('FOOTER.');
  });
});
