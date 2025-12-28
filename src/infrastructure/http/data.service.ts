import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private cache = new Map<string, WritableSignal<unknown>>();
  private inFlight = new Set<string>();

  constructor(private http: HttpClient) {}

  getData<T>(endpoint: string): Signal<T | null> {
    const cached = this.cache.get(endpoint) as WritableSignal<T | null> | undefined;
    if (cached) {
      if (cached() === null && !this.inFlight.has(endpoint)) {
        this.fetchData(endpoint, cached);
      }
      return cached.asReadonly();
    }

    const path = `/assets/data/${endpoint}.json`;
    const dataSignal = signal<T | null>(null);

    this.cache.set(endpoint, dataSignal as WritableSignal<unknown>);
    this.fetchData(endpoint, dataSignal, path);

    return dataSignal.asReadonly();
  }

  private fetchData<T>(endpoint: string, target: WritableSignal<T | null>, customPath?: string): void {
    if (this.inFlight.has(endpoint)) {
      return;
    }

    this.inFlight.add(endpoint);
    const path = customPath || `/assets/data/${endpoint}.json`;

    this.http.get<T>(path).subscribe({
      next: (data) => {
        target.set(data);
        this.inFlight.delete(endpoint);
      },
      error: (error) => {
        console.error('Failed to load data:', error);
        target.set(null);
        this.inFlight.delete(endpoint);
      }
    });
  }
}
