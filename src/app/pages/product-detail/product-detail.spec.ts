import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ProductDetail } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductDetailPage } from './product-detail';

describe('ProductDetailPage', () => {
  const product: ProductDetail = {
    id: '1',
    brand: 'Acer',
    model: 'Liquid Z6',
    price: '120',
    imgUrl: 'phone.jpg',
    cpu: 'Quad-core',
    ram: '2 GB',
    os: 'Android',
    displayResolution: '5 inches',
    displaySize: '720 x 1280',
    battery: '2000 mAh',
    primaryCamera: ['8 MP'],
    secondaryCmera: ['2 MP'],
    dimentions: '143 x 72 mm',
    weight: '150 g',
    options: {
      colors: [
        { code: 1000, name: 'Black' },
        { code: 1001, name: 'White' },
      ],
      storages: [{ code: 2000, name: '16 GB' }],
    },
  };

  function setup(overrides: Partial<ProductService> = {}) {
    const productService = {
      getProduct: vi.fn(() => of(product)),
      addToCart: vi.fn(() => of({ count: 1 })),
      ...overrides,
    };

    TestBed.configureTestingModule({
      imports: [ProductDetailPage],
      providers: [
        provideRouter([]),
        {
          provide: ProductService,
          useValue: productService,
        },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ id: '1' })) },
        },
      ],
    });

    const fixture = TestBed.createComponent(ProductDetailPage);
    fixture.detectChanges();
    return { fixture, element: fixture.nativeElement as HTMLElement, productService };
  }

  it('muestra las especificaciones y selecciona por defecto las primeras opciones', () => {
    const { element } = setup();

    expect(element.textContent).toContain('Liquid Z6');
    expect(element.textContent).toContain('Quad-core');
    expect(element.textContent).toContain('Resolución de pantalla720 x 1280');
    expect(element.textContent).toContain('Tamaño de pantalla5 inches');
    expect((element.querySelector('[aria-label="Color"]') as HTMLSelectElement).value).toBe(
      '1000',
    );
    expect(
      (element.querySelector('[aria-label="Almacenamiento"]') as HTMLSelectElement).value,
    ).toBe('2000');
    expect(element.querySelector('.back-link')?.getAttribute('href')).toBe('/');
  });

  it('muestra la cámara secundaria cuando la API la devuelve como texto', () => {
    const { element } = setup({
      getProduct: vi.fn(() => of({ ...product, secondaryCmera: '5 MP' })),
    });

    expect(element.textContent).toContain('Cámara secundaria5 MP');
  });

  it('añade a la cesta el producto con las opciones elegidas', () => {
    const { fixture, element, productService } = setup();
    const color = element.querySelector('[aria-label="Color"]') as HTMLSelectElement;
    color.value = '1001';
    color.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    (element.querySelector('button') as HTMLButtonElement).click();

    expect(productService.addToCart).toHaveBeenCalledWith({
      id: '1',
      colorCode: 1001,
      storageCode: 2000,
    });
  });

  it('informa si falla la carga de la ficha', () => {
    const { element } = setup({
      getProduct: vi.fn(() => throwError(() => new Error('fallo'))),
    });

    expect(element.textContent).toContain('No se ha podido cargar el producto');
  });
});
