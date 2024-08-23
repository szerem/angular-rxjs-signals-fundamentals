import { Injectable, signal, inject } from '@angular/core';
import { catchError, EMPTY, Observable, tap, throwError } from 'rxjs';
import { Product } from './product';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpErrorService } from '../utilities/http-error.service';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';

  private http = inject(HttpClient);
  private errorService = inject(HttpErrorService);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl).pipe(
      tap(() => console.log('in http.get pipeline')),
      catchError(err => this.handlerError(err)),
    );
  }

  getProduct(id: number): Observable<Product> {
    const productsUrl = `${this.productsUrl}/${id}`;
    return this.http.get<Product>(productsUrl).pipe(
      tap(() => console.log('in http.get by id pipeline')),
      catchError(err => this.handlerError(err))
    );
  }

  handlerError(err: HttpErrorResponse): Observable<never> {
    const formattedMessage = this.errorService.formatError(err)
    return throwError(() => formattedMessage);
    //throw formattedMessage;
  }
}
