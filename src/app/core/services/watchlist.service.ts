import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Movie } from './movie.service';   // ✅ CORRECT PATH

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  private readonly STORAGE_KEY = 'movie_watchlist';

  private watchlistSubject = new BehaviorSubject<Movie[]>(this.loadFromStorage());
  watchlist$ = this.watchlistSubject.asObservable();

  constructor() {}

  private loadFromStorage(): Movie[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(movies: Movie[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(movies));
  }

getWatchlist() {
  return this.watchlist$;
}

  addToWatchlist(movie: Movie): void {
    const current = this.watchlistSubject.value;

    if (!current.find(m => m.id === movie.id)) {
      const updated = [...current, movie];
      this.watchlistSubject.next(updated);
      this.saveToStorage(updated);
    }
  }

  removeFromWatchlist(id: number): void {
    const updated = this.watchlistSubject.value.filter(m => m.id !== id);
    this.watchlistSubject.next(updated);
    this.saveToStorage(updated);
  }

  isInWatchlist(id: number): boolean {
    return this.watchlistSubject.value.some(m => m.id === id);
  }
}
