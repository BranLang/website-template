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
      const preferredTheme = localStorage.getItem('theme');
      const themeToApply = preferredTheme || site?.theme || 'light';
      if (themeToApply) this.applyTheme(themeToApply);
      if (site?.backgroundImageUrl) {
        this.applyBackground(site.backgroundImageUrl);
      } else {
        this.clearBackground();
      }
      if (site?.faviconUrl) {
        this.applyFavicon(site.faviconUrl);
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

  setTheme(theme: string) {
    // persist preference
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
    // update site BehaviorSubject with new theme if site already loaded
    const current = this.siteSubject.value || {};
    this.siteSubject.next({ ...current, theme });
  }

  getThemes(): { light?: any; dark?: any } {
    const site = this.siteSubject.value;
    return site?.settings?.themes || {};
  }

  resolveMediaUrl(path: string): string {
    if (!path) return '';
    const base = environment.apiUrl.replace(/\/api$/, '');
    return path.startsWith('http') ? path : `${base}${path}`;
  }

  private applyBackground(imagePath: string) {
    const url = this.resolveMediaUrl(imagePath);
    document.body.style.backgroundImage = `url('${url}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
  }

  private clearBackground() {
    document.body.style.backgroundImage = '';
    document.body.style.backgroundSize = '';
    document.body.style.backgroundRepeat = '';
    document.body.style.backgroundAttachment = '';
  }

  private applyFavicon(path: string) {
    const href = this.resolveMediaUrl(path);
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/png';
    link.href = href;
  }
}
