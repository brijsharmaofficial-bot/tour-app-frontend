// interceptors/loading.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Show loader for API calls except certain endpoints
  if (!req.url.includes('assets/') && !req.url.includes('i18n')) {
    loadingService.show();
  }

  return next(req).pipe(
    finalize(() => {
      loadingService.hide();
    })
  );
};