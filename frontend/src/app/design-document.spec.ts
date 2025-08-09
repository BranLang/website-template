import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './components/home/home.component';
import { SiteService } from './services/site.service';
import { DOCUMENT } from '@angular/common';
import { of } from 'rxjs';

class FakeLoader implements TranslateLoader {
  getTranslation(_lang: string) {
    return of({});
  }
}

describe('Design Document Compliance', () => {
  let siteService: SiteService;
  let doc: Document;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: FakeLoader } }),
        HomeComponent
      ],
      providers: [ SiteService ]
    }).compileComponents();

    doc = TestBed.inject(DOCUMENT);
    siteService = TestBed.inject(SiteService);
  });

  it('should inject deep-blue theme link element', () => {
    siteService.setTheme('deep-blue');
    const link = doc.getElementById('site-theme') as HTMLLinkElement;
    expect(link).withContext('Theme link missing').not.toBeNull();
    expect(link.href).withContext('Wrong theme href').toContain('deep-blue.css');
  });
});
