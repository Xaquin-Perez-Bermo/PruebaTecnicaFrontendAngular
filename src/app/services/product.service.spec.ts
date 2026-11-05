import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Product } from '../models/product.model';
import { CACHE_TTL_MS } from './cache.service';
import { API_URL, ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let http: HttpTestingController;

  const products: Product[] = [
    { id: '1', brand: 'Acer', model: 'Liquid Z6', price: '120', imgUrl: 'img.jpg' },
  ];

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    vi.useRealTimers();
  });

  it('pide el listado a la API y lo cachea', () => {
    let result: Product[] | undefined;
    service.getProducts().subscribe((p) => (result = p));
    http.expectOne(`${API_URL}/product`).flush(products);
    expect(result).toEqual(products);

    // La segunda llamada sale de la caché y no hace petición
    let cached: Product[] | undefined;
    service.getProducts().subscribe((p) => (cached = p));
    expect(cached).toEqual(products);
  });

  it('vuelve a pedir el listado cuando la caché ha expirado', () => {
    vi.useFakeTimers();
    service.getProducts().subscribe();
    http.expectOne(`${API_URL}/product`).flush(products);

    vi.advanceTimersByTime(CACHE_TTL_MS);
    service.getProducts().subscribe();
    http.expectOne(`${API_URL}/product`).flush(products);
  });

  it('cachea cada detalle por id', () => {
    service.getProduct('1').subscribe();
    http.expectOne(`${API_URL}/product/1`).flush({ id: '1' });

    service.getProduct('1').subscribe();
    service.getProduct('2').subscribe();
    http.expectOne(`${API_URL}/product/2`).flush({ id: '2' });
  });

  it('envía id, color y almacenamiento al añadir a la cesta (sin caché)', () => {
    const item = { id: '1', colorCode: 1000, storageCode: 2000 };
    let count: number | undefined;

    service.addToCart(item).subscribe((r) => (count = r.count));
    const req = http.expectOne(`${API_URL}/cart`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(item);
    req.flush({ count: 3 });

    expect(count).toBe(3);
  });
});
