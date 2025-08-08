import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SiteService {
  private siteSubject = new BehaviorSubject<any>(null);
  site$ = this.siteSubject.asObservable();

  constructor(private api: ApiService) {}

  loadSite(): void {
    this.api.getSiteBySlug(environment.defaultSiteSlug).subscribe(site => {
      this.siteSubject.next(site);
      if (site?.theme) {
        this.applyTheme(site.theme);
      }
    });
  }

  private applyTheme(theme: string) {
    const href = `assets/themes/${theme}.css`;
    let link = document.getElementById('site-theme') as HTMLLinkElement;
    if (link) {
      link.href = href;
    } else {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.id = 'site-theme';
      link.href = href;
      document.head.appendChild(link);
    }
  }

  resolveMediaUrl(path: string): string {
    if (!path) return '';
    const base = environment.apiUrl.replace(/\/api$/, '');
    return path.startsWith('http') ? path : `${base}${path}`;
  }
}
