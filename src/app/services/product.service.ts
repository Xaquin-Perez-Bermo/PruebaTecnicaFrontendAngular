import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

import { CartItem, CartResponse, Product, ProductDetail } from '../models/product.model';
import { CacheService } from './cache.service';

export const API_URL = 'https://itx-frontend-test.onrender.com/api';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly cache = inject(CacheService);

  getProducts(): Observable<Product[]> {
    return this.cached('products', () => this.http.get<Product[]>(`${API_URL}/product`));
  }

  getProduct(id: string): Observable<ProductDetail> {
    return this.cached(`product:${id}`, () =>
      this.http.get<ProductDetail>(`${API_URL}/product/${id}`),
    );
  }

  addToCart(item: CartItem): Observable<CartResponse> {
    return this.http.post<CartResponse>(`${API_URL}/cart`, item);
  }

  private cached<T>(key: string, request: () => Observable<T>): Observable<T> {
    const hit = this.cache.get<T>(key);
    if (hit !== null) {
      return of(hit);
    }
    return request().pipe(tap((data) => this.cache.set(key, data)));
  }
}
