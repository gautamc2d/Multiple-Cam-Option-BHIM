import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { LoaderService } from './Loader.service';


@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

    constructor(private loaderService: LoaderService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const userDetails = localStorage.getItem('userData');
        // if (userDetails) {
        // request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + new Date().getTime) });

        // if (!request.headers.has('Content-Type')) {
        //     request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        // }

        // request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
        this.loaderService.show();
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log(`Status= ${event.status}, StatusText= ${event.statusText}`);
                    this.loaderService.hide();
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                console.log(error);
                this.loaderService.hide();
                return throwError(error);
            }));
    }

    private onEnd(err): void {
        console.log(err);
    }
}
