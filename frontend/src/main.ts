import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, HttpClient } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from './environments/environment';
import { MockApiInterceptor } from './app/interceptors/mock-api.interceptor';
import { provideToastr } from 'ngx-toastr';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CustomTranslateLoader } from './app/services/custom-translate.loader';
import { ApiService } from './app/services/api.service';
import { TranslateHttpLoader, TRANSLATE_HTTP_LOADER_CONFIG } from '@ngx-translate/http-loader';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { AppInitializerProvider } from './app/app-initializer.provider';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    AppInitializerProvider,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ...(environment.useMockApi ? [{ provide: HTTP_INTERCEPTORS, useClass: MockApiInterceptor, multi: true }] : []),
    provideToastr({ timeOut: 3000, positionClass: 'toast-top-right', preventDuplicates: true }),
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: {
        prefix: './assets/i18n/',
        suffix: '.json'
      }
    },
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [ApiService]
      }
    }).providers!
  ]
}).catch(err => console.error(err));
