import { Injectable } from '@angular/core';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export const CACHE_TTL_MS = 60 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class CacheService {
  private readonly prefix = 'itx-cache:';

  get<T>(key: string): T | null {
    const raw = localStorage.getItem(this.prefix + key);
    if (!raw) {
      return null;
    }

    try {
      const entry = JSON.parse(raw) as CacheEntry<T>;
      if (Date.now() < entry.expiresAt) {
        return entry.data;
      }
    } catch {
      // Entrada corrupta: se trata como si no existiera
    }

    localStorage.removeItem(this.prefix + key);
    return null;
  }

  set<T>(key: string, data: T): void {
    const entry: CacheEntry<T> = { data, expiresAt: Date.now() + CACHE_TTL_MS };
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(entry));
    } catch {
      // Storage lleno o no disponible: la app sigue funcionando sin caché
    }
  }
}
