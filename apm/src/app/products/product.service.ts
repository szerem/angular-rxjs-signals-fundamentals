import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop'
import { catchError, filter, map, Observable, of, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { Product, Result } from './product';
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

  selectedProductId = signal<number>(undefined!);
  effectSelectedProductId = effect(() => console.log(`selectedProductId=${this.selectedProductId()}`))


  private productsResult$ = this.http.get<Product[]>(this.productsUrl).pipe(
    map(p => ({ data: p } as Result<Product[]>)),
    tap(p => console.log(JSON.stringify(p))),
    shareReplay(1),
    catchError(err => of({ data: [], error: this.errorService.formatError(err) } as Result<Product[]>)),
  );
  private productsResult = toSignal(this.productsResult$, { initialValue: { data: [] } as Result<Product[]> });
  products = computed(() => this.productsResult()?.data)
  productsError = computed(() => this.productsResult()?.error)
  effectProductError = effect(() => console.log(this.productsError()))

  private productResult$ = toObservable(this.selectedProductId).pipe(
    filter(Boolean),
    switchMap(id => {
      const productsUrl = `${this.productsUrl}/${id}`;
      return this.http.get<Product>(productsUrl)
        .pipe(
          switchMap(product => this.getProductWithReview(product)),
          catchError(err => of({
            data: undefined,
            error: this.errorService.formatError(err)
          } as Result<Product>)),
        );
    }),
    map(p => ({ data: p } as Result<Product>))
  );
  private productResult = toSignal(this.productResult$, { initialValue: { data: undefined } as Result<Product> });
  product = computed(() => this.productResult()?.data);
  productError = computed(() => this.productResult()?.error);

  productSelected(selectedProductId: number): void {
    this.selectedProductId.set(selectedProductId);
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
