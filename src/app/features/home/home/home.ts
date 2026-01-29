import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MovieService, Movie } from '../../../core/services/movie.service';
import { MovieCardComponent } from '../../../shared/components/movie-card/movie-card.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, LoaderComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  trendingMovies: Movie[] = [];
  popularMovies: Movie[] = [];
  loading = true;

  constructor(
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;

    this.movieService.getTrendingMovies().subscribe({
      next: (movies) => {
        this.trendingMovies = movies;
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Error loading trending movies:', err);
        this.checkLoadingComplete();
      }
    });

    this.movieService.getPopularMovies().subscribe({
      next: (movies) => {
        this.popularMovies = movies;
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Error loading popular movies:', err);
        this.checkLoadingComplete();
      }
    });
  }

  checkLoadingComplete(): void {
    if (this.trendingMovies.length > 0 && this.popularMovies.length > 0) {
      this.loading = false;
    }
  }

  onMovieClick(movieId: number): void {
    this.router.navigate(['/movie', movieId]);
  }
}
