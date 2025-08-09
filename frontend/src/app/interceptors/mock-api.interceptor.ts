import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { mockProducts, mockCategories, mockPages, mockSite, mockMediaFiles, mockTranslations } from '../mock/mock-data';

@Injectable()
export class MockApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!environment.useMockApi) {
      return next.handle(req);
    }

    const { url, method, params, body } = req;
    const apiPrefix = environment.apiUrl.replace(/\/$/, '');
    if (!url.startsWith(apiPrefix)) {
      return next.handle(req);
    }

    const path = url.substring(apiPrefix.length + 1); // remove ".../api/"
    const segments = path.split('/');

    // Auth (simple pass-through mock)
    if (segments[0] === 'auth') {
      switch (segments[1]) {
        case 'login':
          return of(new HttpResponse({ status: 200, body: { token: 'mock-jwt-token', user: { id: 1, email: body.email } } }));
        case 'register':
          return of(new HttpResponse({ status: 200, body: { id: 2, email: body.email } }));
        case 'profile':
          return of(new HttpResponse({ status: 200, body: { id: 1, email: 'test@example.com' } }));
      }
    }

    // Products
    if (segments[0] === 'products') {
      if (method === 'GET') {
        if (segments.length === 1) {
          return of(new HttpResponse({ status: 200, body: mockProducts }));
        }
        if (segments[1] === 'featured') {
          return of(new HttpResponse({ status: 200, body: mockProducts.filter(p => p.featured) }));
        }
        if (segments[1] === 'slug') {
          const slug = segments[2];
          return of(new HttpResponse({ status: 200, body: mockProducts.find(p => p.slug === slug) }));
        }
        const id = Number(segments[1]);
        return of(new HttpResponse({ status: 200, body: mockProducts.find(p => p.id === id) }));
      }
    }

    // Categories
    if (segments[0] === 'categories' && method === 'GET') {
      if (segments.length === 1) {
        return of(new HttpResponse({ status: 200, body: mockCategories }));
      }
      if (segments[1] === 'slug') {
        const slug = segments[2];
        return of(new HttpResponse({ status: 200, body: mockCategories.find(c => c.slug === slug) }));
      }
      const id = Number(segments[1]);
      return of(new HttpResponse({ status: 200, body: mockCategories.find(c => c.id === id) }));
    }

    // Pages
    if (segments[0] === 'pages' && method === 'GET') {
      if (segments.length === 1) {
        return of(new HttpResponse({ status: 200, body: mockPages }));
      }
      if (segments[1] === 'slug') {
        const slug = segments[2];
        return of(new HttpResponse({ status: 200, body: mockPages.find(p => p.slug === slug) }));
      }
      const id = Number(segments[1]);
      return of(new HttpResponse({ status: 200, body: mockPages.find(p => p.id === id) }));
    }

    // Site
    if (segments[0] === 'sites' && segments[1] === 'slug') {
      return of(new HttpResponse({ status: 200, body: mockSite }));
    }

    // i18n
    if (segments[0] === 'i18n' && method === 'GET') {
      const langParam = params.get('language') || 'sk';
      const namespaces = (params.get('namespaces') || '').split(',').filter(Boolean);
      const dict = mockTranslations[langParam] || {};
      // if namespaces provided, return partial object
      if (namespaces.length) {
        const partial: Record<string, any> = {};
        namespaces.forEach(ns => {
          if (dict[ns]) partial[ns] = dict[ns];
        });
        return of(new HttpResponse({ status: 200, body: partial }));
      }
      return of(new HttpResponse({ status: 200, body: dict }));
    }

    // Media
    if (segments[0] === 'media') {
      if (method === 'GET') {
        return of(new HttpResponse({ status: 200, body: mockMediaFiles }));
      }
      if (method === 'POST') {
        return of(new HttpResponse({ status: 200, body: { filename: 'uploaded.jpg', url: mockMediaFiles[0].url } }));
      }
      if (method === 'DELETE') {
        return of(new HttpResponse({ status: 200 }));
      }
    }

    // pass through unknown requests
    return next.handle(req);
  }
}
