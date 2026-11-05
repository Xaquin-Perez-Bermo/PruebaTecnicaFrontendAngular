import { Injectable, signal } from '@angular/core';

const CART_COUNT_KEY = 'itx-cart-count';

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly count = signal(this.readCount());

  setCount(count: number): void {
    this.count.set(count);
    try {
      localStorage.setItem(CART_COUNT_KEY, String(count));
    } catch {
      // La aplicación sigue funcionando aunque el almacenamiento no esté disponible.
    }
  }

  private readCount(): number {
    try {
      const count = Number(localStorage.getItem(CART_COUNT_KEY));
      return Number.isInteger(count) && count >= 0 ? count : 0;
    } catch {
      return 0;
    }
  }
}
