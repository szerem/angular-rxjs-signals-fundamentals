import { Injectable, signal, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Product } from './product';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';

  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl).pipe(tap(() => console.log('in http.get pipeline')));
  }

  getProduct(id: number): Observable<Product> {
    const productsUrl = `${this.productsUrl}/${id}`;
    return this.http.get<Product>(productsUrl).pipe(tap(() => console.log('in http.get by id pipeline')));
  }

}
