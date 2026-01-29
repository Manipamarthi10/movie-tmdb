import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { forkJoin, Observable } from 'rxjs';
import { MovieService, Movie, Cast, VideoResponse } from '../../core/services/movie.service';
import { WatchlistService } from '../../core/services/watchlist.service';
import { CastCardComponent } from '../../shared/components/cast-card/cast-card.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { environment } from '../../../environments/environment';
import { YearPipe } from '../../shared/pipes/year.pipe';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, CastCardComponent, LoaderComponent, YearPipe],
  template: `
    <div class="movie-detail">
      <app-loader *ngIf="isLoading"></app-loader>

      <div *ngIf="!isLoading && movie" class="detail-container">
        <div class="backdrop-section">
          <img
            *ngIf="movie.backdrop_path"
            [src]="imageBaseUrl + movie.backdrop_path"
            alt="backdrop"
            class="backdrop"
          />
        </div>

        <div class="content">
          <div class="header-section">
            <div class="poster-section">
              <img
                *ngIf="movie.poster_path"
                [src]="imageBaseUrl + movie.poster_path"
                [alt]="movie.title"
                class="poster"
              />
            </div>

            <div class="info-section">
              <h1 class="title">{{ movie.title }}</h1>
              <p class="meta">
                {{ movie.release_date | year }} • {{ movie.vote_average.toFixed(1) }} ★
              </p>
              <p class="overview">{{ movie.overview }}</p>

              <div class="actions">
                <button
                  (click)="toggleWatchlist()"
                  [class.in-watchlist]="isInWatchlist"
                  class="btn btn-watchlist"
                >
                  {{ isInWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist' }}
                </button>
                <button (click)="goBack()" class="btn btn-back">← Back</button>
              </div>
            </div>
          </div>

          <section *ngIf="cast.length > 0" class="cast-section">
            <h2>Cast</h2>
            <div class="cast-grid">
              <app-cast-card
                *ngFor="let member of cast.slice(0, 12)"
                [cast]="member"
              ></app-cast-card>
            </div>
          </section>

          <section *ngIf="trailerKey" class="video-section">
            <h2>Watch Trailer</h2>
            <div class="trailer-container">
              <iframe
                [src]="getSafeTrailerUrl()"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </section>
        </div>
      </div>

      <div *ngIf="!isLoading && !movie" class="error">
        <p>Movie not found</p>
        <button (click)="goBack()" class="btn">← Back</button>
      </div>
    </div>
  `,
  styles: [`
    .movie-detail {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .backdrop-section {
      width: 100%;
      height: 300px;
      margin: -2rem -1rem 0;
      overflow: hidden;
    }

    .backdrop {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .header-section {
      display: flex;
      gap: 2rem;
      margin-top: -150px;
      position: relative;
      z-index: 10;
    }

    .poster-section {
      flex-shrink: 0;
    }

    .poster {
      width: 200px;
      border-radius: 8px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    }

    .info-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .title {
      font-size: 2.5rem;
      margin: 0;
      color: #fff;
    }

    .meta {
      color: rgba(255, 255, 255, 0.7);
      font-size: 1rem;
      margin: 0;
    }

    .overview {
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.6;
      max-width: 600px;
      margin: 0;
    }

    .actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
    }

    .btn-watchlist {
      background: #e50914;
      color: white;
    }

    .btn-watchlist:hover {
      background: #c40812;
    }

    .btn-watchlist.in-watchlist {
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
    }

    .btn-back {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .btn-back:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .cast-section,
    .video-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .cast-section h2,
    .video-section h2 {
      font-size: 1.5rem;
      margin: 0;
      color: #fff;
    }

    .cast-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
    }

    .trailer-container {
      position: relative;
      width: 100%;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
      border-radius: 8px;
    }

    .trailer-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 8px;
    }

    .error {
      text-align: center;
      padding: 2rem;
      color: rgba(255, 255, 255, 0.6);
    }

    @media (max-width: 768px) {
      .header-section {
        flex-direction: column;
        align-items: center;
        text-align: center;
        margin-top: -100px;
      }

      .title {
        font-size: 1.8rem;
      }

      .cast-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      }
    }
  `]
})
export class MovieDetailComponent implements OnInit {
  movie: Movie | null = null;
  cast: Cast[] = [];
  trailerKey: string | null = null;
  isLoading = true;
  isInWatchlist = false;

  imageBaseUrl = environment.tmdb.imageBaseUrl;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private watchlistService: WatchlistService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const movieId = +params['id'];
      if (movieId) {
        this.loadMovieDetails(movieId);
      }
    });
  }

  private loadMovieDetails(movieId: number): void {
    this.isLoading = true;
    console.log('Loading movie details for ID:', movieId);

    forkJoin({
      movie: this.movieService.getMovieById(movieId),
      credits: this.movieService.getMovieCast(movieId),
      videos: this.movieService.getMovieVideos(movieId)
    }).subscribe({
      next: ({ movie, credits, videos }) => {
        console.log('Movie data received:', movie);
        console.log('Credits received:', credits);
        console.log('Videos received:', videos);
        this.movie = movie;
        this.cast = credits.cast;
        this.trailerKey =
          videos.results.find((v) => v.type === 'Trailer' && v.site === 'YouTube')?.key ||
          null;
        console.log('Trailer key:', this.trailerKey);
        this.isInWatchlist = this.watchlistService.isInWatchlist(movieId);
        this.isLoading = false;
        console.log('Loading complete, isLoading:', this.isLoading);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading movie details:', err);
        this.isLoading = false;
      }
    });
  }

  toggleWatchlist(): void {
    if (!this.movie) return;

    if (this.isInWatchlist) {
      this.watchlistService.removeFromWatchlist(this.movie.id);
    } else {
      this.watchlistService.addToWatchlist(this.movie);
    }
    this.isInWatchlist = !this.isInWatchlist;
  }

  getTrailerUrl(): string {
    return `https://www.youtube.com/embed/${this.trailerKey}?autoplay=1&mute=0`;
  }

  getSafeTrailerUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.getTrailerUrl());
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
