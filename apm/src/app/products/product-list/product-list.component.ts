import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { NgIf, NgFor, NgClass } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import { catchError, EMPTY, Subscription, tap } from 'rxjs';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent]
})
export class ProductListComponent implements OnInit, OnDestroy {
  // Just enough here for the template to compile
  pageTitle = 'Products';
  errorMessage = '';
  private productService = inject(ProductService);
  private subs = new Subscription();
  // Products
  products: Product[] = [];

  // Selected product id to highlight the entry
  selectedProductId: number = 0;

  ngOnInit(): void {
    this.subs.add(this.productService.getProducts()
      .pipe(
        tap(() => console.log("in component pipeline")),
        catchError(err => { this.errorMessage = err; return EMPTY; })
      ).subscribe(
        products => this.products = products
      ))
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }


  onSelected(productId: number): void {
    console.log(productId);
    this.selectedProductId = productId;
  }
}
