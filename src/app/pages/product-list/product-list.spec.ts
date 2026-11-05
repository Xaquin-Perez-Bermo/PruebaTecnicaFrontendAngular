import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductList } from './product-list';

describe('ProductList', () => {
  const products: Product[] = [
    { id: '1', brand: 'Acer', model: 'Liquid Z6', price: '120', imgUrl: 'a.jpg' },
    { id: '2', brand: 'Samsung', model: 'Galaxy S8', price: '', imgUrl: 'b.jpg' },
    { id: '3', brand: 'Apple', model: 'iPhone 8', price: '700', imgUrl: 'c.jpg' },
  ];

  function setup(getProducts: () => ReturnType<ProductService['getProducts']>) {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: ProductService, useValue: { getProducts } }],
    });
    const fixture = TestBed.createComponent(ProductList);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    return { fixture, element };
  }

  function type(fixture: { detectChanges(): void }, element: HTMLElement, text: string) {
    const input = element.querySelector('input') as HTMLInputElement;
    input.value = text;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  it('muestra todos los productos con marca, modelo y precio', () => {
    const { element } = setup(() => of(products));

    const items = element.querySelectorAll('app-product-item');
    expect(items.length).toBe(3);
    expect(items[0].textContent).toContain('Acer');
    expect(items[0].textContent).toContain('Liquid Z6');
    expect(items[0].textContent).toContain('120 €');
    expect(items[1].textContent).toContain('Precio no disponible');
  });

  it('cada producto enlaza a su detalle', () => {
    const { element } = setup(() => of(products));

    const link = element.querySelector('app-product-item a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/product/1');
  });

  it('filtra por marca ignorando mayúsculas', () => {
    const { fixture, element } = setup(() => of(products));

    type(fixture, element, 'SAMS');

    const items = element.querySelectorAll('app-product-item');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toContain('Galaxy S8');
  });

  it('filtra por modelo', () => {
    const { fixture, element } = setup(() => of(products));

    type(fixture, element, 'iphone');

    expect(element.querySelectorAll('app-product-item').length).toBe(1);
  });

  it('muestra un mensaje si no hay coincidencias', () => {
    const { fixture, element } = setup(() => of(products));

    type(fixture, element, 'nokia');

    expect(element.querySelectorAll('app-product-item').length).toBe(0);
    expect(element.textContent).toContain('No hay productos');
  });

  it('muestra un mensaje si falla la API', () => {
    const { element } = setup(() => throwError(() => new Error('fallo')));

    expect(element.textContent).toContain('No se han podido cargar');
  });
});
