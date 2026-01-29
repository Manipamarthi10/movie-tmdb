import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../core/services/movie.service';
import { WatchlistService } from '../../core/services/watchlist.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  template: `
    <div class="watchlist-container">
      <h1>My Watchlist</h1>

      <div *ngIf="watchlist.length > 0; else emptyState" class="content">
        <p class="count">{{ watchlist.length }} movie{{ watchlist.length !== 1 ? 's' : '' }}</p>
        <div class="movies-grid">
          <app-movie-card
            *ngFor="let movie of watchlist"
            [movie]="movie"
            (cardClick)="onMovieClick($event)"
          ></app-movie-card>
        </div>
      </div>

      <ng-template #emptyState>
        <div class="empty-state">
          <p>Your watchlist is empty</p>
          <button (click)="goHome()" class="btn">← Explore Movies</button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .watchlist-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    h1 {
      font-size: 2rem;
      margin: 0;
      color: #fff;
    }

    .count {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.95rem;
      margin: 0;
    }

    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1.5rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .empty-state p {
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      background: #e50914;
      color: white;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .btn:hover {
      background: #c40812;
    }

    @media (max-width: 768px) {
      .movies-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }
    }
  `]
})
export class WatchlistComponent implements OnInit {
  watchlist: Movie[] = [];

  constructor(
    private watchlistService: WatchlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.watchlistService.getWatchlist().subscribe((movies) => {
      this.watchlist = movies;
    });
  }

  onMovieClick(movieId: number): void {
    this.router.navigate(['/movie', movieId]);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
