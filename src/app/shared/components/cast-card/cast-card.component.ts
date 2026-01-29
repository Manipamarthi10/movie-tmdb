import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cast } from '../../../core/services/movie.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-cast-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cast-card">
      <div class="image-container">
        <img
          *ngIf="cast.profile_path"
          [src]="imageBaseUrl + cast.profile_path"
          [alt]="cast.name"
          class="profile"
        />
        <div *ngIf="!cast.profile_path" class="profile-placeholder">
          No Photo
        </div>
      </div>
      <div class="cast-info">
        <h4 class="name">{{ cast.name }}</h4>
        <p class="character">{{ cast.character }}</p>
      </div>
    </div>
  `,
  styles: [`
    .cast-card {
      text-align: center;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      overflow: hidden;
      padding: 1rem;
    }

    .image-container {
      width: 100%;
      aspect-ratio: 1;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 1rem;
    }

    .profile {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .profile-placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    .cast-info {
      text-align: center;
    }

    .name {
      font-size: 0.9rem;
      font-weight: 600;
      margin: 0 0 0.25rem;
      color: #fff;
    }

    .character {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
    }
  `]
})
export class CastCardComponent {
  @Input() cast!: Cast;
  imageBaseUrl = environment.tmdb.imageBaseUrl;
}
