import { Routes } from '@angular/router';

import { ProductDetailPage } from './pages/product-detail/product-detail';
import { ProductList } from './pages/product-list/product-list';

export const routes: Routes = [
  { path: '', component: ProductList },
  { path: 'product/:id', component: ProductDetailPage },
  { path: '**', redirectTo: '' },
];
