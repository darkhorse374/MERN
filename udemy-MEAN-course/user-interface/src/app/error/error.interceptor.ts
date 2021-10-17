import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorComponent } from './error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        let errorMessage = 'An unexpected error!\nPlease try again';
        if (error.error.message) {
          errorMessage = error.error.message;
        } else if (error.error.error.message) {
          errorMessage = error.error.error.message;
        }
        this.dialog.open(ErrorComponent, { data: { errorMessage: errorMessage } });
        return throwError(error);
      })
    );
  }
}
