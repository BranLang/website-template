import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { LanguageService } from '../../services/language.service';
import { SiteService } from '../../services/site.service';
import { AuthService } from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';

class MockLanguageService {
  getCurrentLanguage() { return 'sk'; }
  setLanguage = jasmine.createSpy('setLanguage');
}

class MockSiteService {
  site$ = of({});
  resolveMediaUrl() { return ''; }
  setTheme() {}
}

class MockAuthService {
  isAdmin() { return false; }
}

@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: any): any { return value; }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let languageService: MockLanguageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HeaderComponent],
      providers: [
        { provide: LanguageService, useClass: MockLanguageService },
        { provide: SiteService, useClass: MockSiteService },
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).overrideComponent(HeaderComponent, {
      remove: { imports: [TranslateModule] },
      add: { imports: [MockTranslatePipe] }
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    languageService = TestBed.inject(LanguageService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to Slovak language', () => {
    expect(component.currentLanguage).toBe('sk');
  });

  it('should change language', () => {
    component.onLanguageChange('en');
    expect(languageService.setLanguage).toHaveBeenCalledWith('en');
    expect(component.currentLanguage).toBe('en');
  });

  it('should toggle mobile menu', () => {
    component.toggleMobileMenu();
    expect(component.mobileMenuOpen).toBeTrue();
    component.closeMobileMenu();
    expect(component.mobileMenuOpen).toBeFalse();
  });
});
