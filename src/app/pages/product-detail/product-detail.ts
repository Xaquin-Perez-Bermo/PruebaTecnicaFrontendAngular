import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EMPTY, catchError, switchMap, tap } from 'rxjs';

import { ProductDetail as ProductDetailModel } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  readonly product = signal<ProductDetailModel | null>(null);
  readonly selectedColor = signal<number | null>(null);
  readonly selectedStorage = signal<number | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly addingToCart = signal(false);
  readonly cartError = signal(false);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (!id) {
            this.loading.set(false);
            this.error.set(true);
            return EMPTY;
          }

          this.loading.set(true);
          this.error.set(false);
          return this.productService.getProduct(id).pipe(
            tap((product) => {
              this.product.set(product);
              this.selectedColor.set(product.options.colors[0]?.code ?? null);
              this.selectedStorage.set(product.options.storages[0]?.code ?? null);
              this.loading.set(false);
            }),
            catchError(() => {
              this.error.set(true);
              this.loading.set(false);
              return EMPTY;
            }),
          );
        }),
      )
      .subscribe();
  }

  onColorChange(event: Event): void {
    this.selectedColor.set(Number((event.target as HTMLSelectElement).value));
  }

  onStorageChange(event: Event): void {
    this.selectedStorage.set(Number((event.target as HTMLSelectElement).value));
  }

  formatValues(value: string[] | string): string {
    return Array.isArray(value) ? value.join(', ') : value;
  }

  addToCart(): void {
    const product = this.product();
    const colorCode = this.selectedColor();
    const storageCode = this.selectedStorage();
    if (!product || colorCode === null || storageCode === null || this.addingToCart()) {
      return;
    }

    this.addingToCart.set(true);
    this.cartError.set(false);
    this.productService
      .addToCart({ id: product.id, colorCode, storageCode })
      .subscribe({
        next: () => this.addingToCart.set(false),
        error: () => {
          this.addingToCart.set(false);
          this.cartError.set(true);
        },
      });
  }
}
