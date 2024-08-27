//import 'zone.js/dist/zone';  // Required for Stackblitz
import { Component, inject, signal } from '@angular/core';
import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { CartService } from './cart/cart.service';

@Component({
  selector: 'pm-root',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  pageTitle = 'Acme Product Management';

  private cartService = inject(CartService);
  cartCount = this.cartService.cartCount;


  randomDaley() {
    return Math.floor(Math.random() * 1000) + 500;
  }
}
