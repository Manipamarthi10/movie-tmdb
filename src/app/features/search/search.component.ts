import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { MovieService, Movie } from '../../core/services/movie.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, MovieCardComponent, LoaderComponent],
  template: `
    <div class="search-container">
      <div class="search-box">
        <input
          type="text"
          placeholder="Search movies..."
          class="search-input"
          (input)="onSearchInput($event)"
        />
      </div>

      <app-loader *ngIf="isLoading"></app-loader>

      <div *ngIf="searchResults.length > 0 && !isLoading" class="results">
        <p class="result-count">Found {{ searchResults.length }} results</p>
        <div class="movies-grid">
          <app-movie-card
            *ngFor="let movie of searchResults"
            [movie]="movie"
            (cardClick)="onMovieClick($event)"
          ></app-movie-card>
        </div>
      </div>

      <div *ngIf="searched && searchResults.length === 0 && !isLoading" class="no-results">
        <p>No movies found. Try another search.</p>
      </div>

      <div *ngIf="!searched && searchResults.length === 0" class="empty-state">
        <p>Start typing to search for movies...</p>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .search-box {
      width: 100%;
    }

    .search-input {
      width: 100%;
      padding: 1rem;
      font-size: 1rem;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
      transition: border-color 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.5);
    }

    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    .result-count {
      color: rgba(255, 255, 255, 0.7);
      margin: 0 0 1rem;
      font-size: 0.95rem;
    }

    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1.5rem;
    }

    .no-results,
    .empty-state {
      text-align: center;
      padding: 2rem;
      color: rgba(255, 255, 255, 0.6);
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .movies-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }
    }
  `]
})
export class SearchComponent implements OnInit, OnDestroy {
  searchResults: Movie[] = [];
  isLoading = false;
  searched = false;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((query) => {
          if (!query.trim()) {
            this.searchResults = [];
            this.searched = false;
            return [];
          }
          this.isLoading = true;
          this.searched = true;
          return this.movieService.searchMovies(query);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.searchResults = response.results;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.searchSubject.next(input);
  }

  onMovieClick(movieId: number): void {
    this.router.navigate(['/movie', movieId]);
  }
}
