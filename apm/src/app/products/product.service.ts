import { Injectable, signal, inject } from '@angular/core';
import { catchError, concatMap, EMPTY, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Product } from './product';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpErrorService } from '../utilities/http-error.service';
import { Review } from '../reviews/review';
import { ReviewService } from '../reviews/review.service';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';

  private http = inject(HttpClient);
  private reviewService = inject(ReviewService);
  private errorService = inject(HttpErrorService);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl).pipe(
      tap(() => console.log('in http.get pipeline')),
      catchError(err => this.handlerError(err)),
    );
  }

  getProduct(id: number): Observable<Product> {
    const productsUrl = `${this.productsUrl}/${id}`;
    return this.http.get<Product>(productsUrl)
      .pipe(
        // tap(_ => console.log('in http.get by id pipeline 1')),
        switchMap(product => this.getProductWithReview(product)),
        catchError(err => this.handlerError(err)),
        // tap(_ => console.log('in http.get by id pipeline 2')),
      );
  }

  getProductWithReview(product: Product): Observable<Product> {
    if (product.hasReviews) {
      return this.http.get<Review[]>(this.reviewService.getReviewUrl(product.id))
        .pipe(
          // tap(_ => console.log('in http.get with review pipeline 1')),
          map(reviews => ({ ...product, reviews } as Product)),
          catchError(err => this.handlerError(err)),
          // tap(_ => console.log('in http.get with review pipeline 2')),
        );
    } else {
      return of(product);
    }
  }

  handlerError(err: HttpErrorResponse): Observable<never> {
    const formattedMessage = this.errorService.formatError(err)
    return throwError(() => formattedMessage);
    //throw formattedMessage;
  }
}
