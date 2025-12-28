import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private cache = new Map<string, WritableSignal<unknown>>();

  constructor(private http: HttpClient) {}

  getData<T>(endpoint: string): Signal<T | null> {
    const cached = this.cache.get(endpoint) as WritableSignal<T | null> | undefined;
    if (cached) {
      return cached.asReadonly();
    }

    const path = `/assets/data/${endpoint}.json`;
    const dataSignal = signal<T | null>(null);

    this.cache.set(endpoint, dataSignal as WritableSignal<unknown>);
    this.http.get<T>(path).subscribe({
      next: (data) => dataSignal.set(data),
      error: (error) => {
        console.error('Failed to load data:', error);
        dataSignal.set(null);
      }
    });

    return dataSignal.asReadonly();
  }
}
