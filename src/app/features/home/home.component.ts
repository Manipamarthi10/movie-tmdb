import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService, Movie } from '../../core/services/movie.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, LoaderComponent],
  template: `
    <div class="home">

      <section class="section">
        <h2>Trending This Week</h2>
        <p style="color:white">Trending count: {{ trendingMovies.length }}</p>

        <app-loader *ngIf="trendingLoading"></app-loader>

        <div class="movies-grid" *ngIf="!trendingLoading && trendingMovies.length">
          <app-movie-card
            *ngFor="let movie of trendingMovies"
            [movie]="movie"
            (cardClick)="onMovieClick($event)">
          </app-movie-card>
        </div>
      </section>

      <section class="section">
        <h2>Popular Now</h2>
        <p style="color:white">Popular count: {{ popularMovies.length }}</p>

        <app-loader *ngIf="popularLoading"></app-loader>

        <div class="movies-grid" *ngIf="!popularLoading && popularMovies.length">
          <app-movie-card
            *ngFor="let movie of popularMovies"
            [movie]="movie"
            (cardClick)="onMovieClick($event)">
          </app-movie-card>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .home { display: flex; flex-direction: column; gap: 3rem; }
    .section { display: flex; flex-direction: column; gap: 1.5rem; }
    h2 { font-size: 1.8rem; margin: 0; color: #fff; }
    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1.5rem;
    }
  `]
})
export class HomeComponent implements OnInit {

  trendingMovies: Movie[] = [];
  popularMovies: Movie[] = [];

  trendingLoading = true;
  popularLoading = true;

  constructor(
    private movieService: MovieService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

 ngOnInit(): void {

  // 🔥 TRENDING MOVIES
  this.movieService.getTrendingMovies().subscribe({
    next: (movies: Movie[]) => {
      console.log('TRENDING MOVIES:', movies);
      console.log('TRENDING MOVIES LENGTH:', movies.length);
      this.trendingMovies = movies;
      this.trendingLoading = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('TRENDING ERROR:', err);
      this.trendingLoading = false;
    }
  });

  // 🔥 POPULAR MOVIES
  this.movieService.getPopularMovies().subscribe({
    next: (movies: Movie[]) => {
      console.log('POPULAR MOVIES:', movies);
      console.log('POPULAR MOVIES LENGTH:', movies.length);
      this.popularMovies = movies;
      this.popularLoading = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('POPULAR ERROR:', err);
      this.popularLoading = false;
    }
  });
}


  onMovieClick(movieId: number): void {
    this.router.navigate(['/movie', movieId]);
  }
}
