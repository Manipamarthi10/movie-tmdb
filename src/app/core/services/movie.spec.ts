import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { TmdbApiService } from './tmdb-api.service';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

export interface VideoResponse {
  results: Array<{
    id: string;
    key: string;
    name: string;
    type: string;
    site: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private tmdbApi: TmdbApiService) {}

  // 🔥 TRENDING MOVIES
  getTrendingMovies(): Observable<Movie[]> {
    return this.tmdbApi.get<any>('/trending/movie/week').pipe(
      map(response => response.results)
    );
  }

  // 🔥 POPULAR MOVIES
  getPopularMovies(): Observable<Movie[]> {
    return this.tmdbApi.get<any>('/movie/popular').pipe(
      map(response => response.results)
    );
  }

  // MOVIE DETAILS
  getMovieById(id: number): Observable<Movie> {
    return this.tmdbApi.get<Movie>(`/movie/${id}`);
  }

  // SEARCH
  searchMovies(query: string): Observable<Movie[]> {
    return this.tmdbApi.get<any>('/search/movie', { query }).pipe(
      map(response => response.results)
    );
  }

  // CAST
  getMovieCast(movieId: number): Observable<any> {
    return this.tmdbApi.get<any>(`/movie/${movieId}/credits`);
  }

  // VIDEOS
  getMovieVideos(movieId: number): Observable<VideoResponse> {
    return this.tmdbApi.get<VideoResponse>(`/movie/${movieId}/videos`);
  }
}
