import { Component } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { CartService } from '../../services/cart.service';
import { AppHeader } from './app-header';

@Component({ template: '' })
class TestPage {}

describe('AppHeader', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [AppHeader],
      providers: [
        provideRouter([
          { path: '', component: TestPage },
          { path: 'product/:id', component: TestPage },
        ]),
      ],
    });
  });

  it('muestra la página actual, el enlace al inicio y el contador de la cesta', () => {
    const cart = TestBed.inject(CartService);
    cart.setCount(2);

    const fixture = TestBed.createComponent(AppHeader);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.brand')?.getAttribute('href')).toBe('/');
    expect(element.textContent).toContain('Lista de productos');
    expect(element.querySelector('.cart-count')?.textContent?.trim()).toBe('2');
  });

  it('restaura el breadcrumb al volver al listado y abrir otro producto', async () => {
    const fixture = TestBed.createComponent(AppHeader);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/product/first');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.breadcrumbs a')).not.toBeNull();

    await router.navigateByUrl('/');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.breadcrumbs a')).toBeNull();

    await router.navigateByUrl('/product/second');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.breadcrumbs a')).not.toBeNull();
  });
});
