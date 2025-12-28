import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private cache = new Map<string, Observable<any>>();

  constructor(private http: HttpClient) {}

  getData<T>(endpoint: string): Observable<T> {
    if (this.cache.has(endpoint)) {
      return this.cache.get(endpoint) as Observable<T>;
    }

    const path = `/assets/data/${endpoint}.json`;
    const request$ = this.http.get<T>(path).pipe(shareReplay(1));

    this.cache.set(endpoint, request$);
    return request$;
  }
}
