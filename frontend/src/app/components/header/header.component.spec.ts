import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { LanguageService } from '../../services/language.service';
import { SiteService } from '../../services/site.service';
import { of } from 'rxjs';

class MockLanguageService {
  getCurrentLanguage() { return 'sk'; }
  setLanguage = jasmine.createSpy('setLanguage');
}

class MockSiteService {
  site$ = of({});
  resolveMediaUrl() { return ''; }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: LanguageService, useClass: MockLanguageService },
        { provide: SiteService, useClass: MockSiteService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to Slovak language', () => {
    expect(component.currentLanguage).toBe('sk');
  });
});
