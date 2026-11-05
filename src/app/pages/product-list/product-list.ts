import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { ProductItem } from '../../components/product-item/product-item';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  imports: [ProductItem],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  private readonly productService = inject(ProductService);

  products = signal<Product[]>([]);
  search = signal('');
  loading = signal(true);
  error = signal(false);

  // Se recalcula solo cada vez que cambia la lista o el texto de búsqueda
  filteredProducts = computed(() => {
    const text = this.search().trim().toLowerCase();
    return this.products().filter((p) => `${p.brand} ${p.model}`.toLowerCase().includes(text));
  });

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }
}
