import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

class FakeLoader implements TranslateLoader {
  getTranslation() {
    return of({
      NAVIGATION: { PRODUCTS: 'Products' },
      PRODUCTS: { CATEGORIES: {} },
      CONTACT: { TITLE: 'Contact' },
      ABOUT: { TITLE: 'About Us', DESCRIPTION: 'Description' },
      FOOTER: {
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
      }
    });
  }
}

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FooterComponent,
        NoopAnimationsModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader }
        })
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render footer cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('mat-card');
    expect(cards.length).toBe(3);
    
    const footerCards = fixture.nativeElement.querySelector('.footer-cards');
    expect(footerCards).toBeTruthy();
  });

  it('should not contain any hardcoded text', () => {
    const footerText = fixture.nativeElement.textContent;
    // Check that specific company details are not hardcoded
    expect(footerText).not.toContain('JUST SK, s.r.o.');
    expect(footerText).not.toContain('Viničná 609');
    expect(footerText).not.toContain('36736449');
    expect(footerText).not.toContain('Pavol Just');
  });

  it('should display all footer sections', () => {
    const cards = fixture.nativeElement.querySelectorAll('mat-card');
    expect(cards.length).toBe(3);
    
    // Check specific card classes
    expect(fixture.nativeElement.querySelector('.contact-card')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.about-card')).toBeTruthy();
  });
});
