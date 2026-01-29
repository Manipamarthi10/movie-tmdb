import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../core/services/movie.service';
import { environment } from '../../../../environments/environment';
import { YearPipe } from '../../pipes/year.pipe';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, YearPipe],
  template: `
    <div class="movie-card" (click)="onClick()">

      <div class="poster-container">
        <img
          *ngIf="movie.poster_path"
          [src]="imageBaseUrl + movie.poster_path"
          [alt]="movie.title"
          class="poster"
        />

        <div *ngIf="!movie.poster_path" class="poster-placeholder">
          No Image
        </div>
      </div>

      <div class="movie-info">
        <h3 class="title">{{ movie.title }}</h3>
        <p class="year">{{ movie.release_date | year }}</p>

        <div class="rating">
          ⭐ {{ movie.vote_average | number:'1.1-1' }}
        </div>
      </div>

    </div>
  `,
  styles: [`
    .movie-card {
      cursor: pointer;
      border-radius: 8px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.05);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .movie-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    }

    .poster-container {
      width: 100%;
      aspect-ratio: 2 / 3;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .poster {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .poster-placeholder {
      color: rgba(255, 255, 255, 0.5);
      text-align: center;
    }

    .movie-info {
      padding: 1rem;
    }

    .title {
      font-size: 0.95rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
      color: #fff;
    }

    .year {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 0.5rem;
    }

    .rating {
      color: #ffd700;
      font-weight: 600;
    }
  `]
})
export class MovieCardComponent {

  @Input() movie!: Movie;
  @Output() cardClick = new EventEmitter<number>();

  imageBaseUrl = environment.tmdb.imageBaseUrl;

  onClick(): void {
    this.cardClick.emit(this.movie.id);
  }
}
