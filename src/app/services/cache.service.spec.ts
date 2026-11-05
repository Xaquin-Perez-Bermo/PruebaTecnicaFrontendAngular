import { TestBed } from '@angular/core/testing';

import { CACHE_TTL_MS, CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CacheService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('devuelve null si no hay nada guardado', () => {
    expect(service.get('x')).toBeNull();
  });

  it('devuelve el dato guardado antes de que expire', () => {
    service.set('x', { a: 1 });
    expect(service.get('x')).toEqual({ a: 1 });
  });

  it('expira pasada 1 hora y elimina la entrada', () => {
    vi.useFakeTimers();
    service.set('x', 'dato');

    vi.advanceTimersByTime(CACHE_TTL_MS - 1);
    expect(service.get('x')).toBe('dato');

    vi.advanceTimersByTime(1);
    expect(service.get('x')).toBeNull();
    expect(localStorage.getItem('itx-cache:x')).toBeNull();
  });

  it('ignora entradas corruptas', () => {
    localStorage.setItem('itx-cache:x', '{no es json');
    expect(service.get('x')).toBeNull();
  });
});
