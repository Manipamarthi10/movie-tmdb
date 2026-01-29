import { Injectable } from '@angular/core';
import { TmdbApiService } from './tmdb-api.service';
import { Observable, map } from 'rxjs';

/* 🔹 MODELS */

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  runtime?: number;
  genres?: Array<{ id: number; name: string }>;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

export interface CreditsResponse {
  cast: Cast[];
  crew: any[];
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

export interface SearchResponse {
  results: Movie[];
}

/* 🔹 SERVICE */

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private tmdbApi: TmdbApiService) {}

  // 🔥 TRENDING MOVIES (returns Movie[])
  getTrendingMovies(): Observable<Movie[]> {
    return this.tmdbApi.get<SearchResponse>('/trending/movie/week')
      .pipe(map(res => res.results));
  }

  // 🔥 POPULAR MOVIES (returns Movie[])
  getPopularMovies(): Observable<Movie[]> {
    return this.tmdbApi.get<SearchResponse>('/movie/popular')
      .pipe(map(res => res.results));
  }

  // 🔥 MOVIE DETAILS
  getMovieById(id: number): Observable<Movie> {
    return this.tmdbApi.get<Movie>(`/movie/${id}`);
  }

  // 🔥 MOVIE CAST & CREW
  getMovieCast(movieId: number): Observable<CreditsResponse> {
    return this.tmdbApi.get<CreditsResponse>(`/movie/${movieId}/credits`);
  }

  // 🔥 MOVIE VIDEOS (TRAILERS)
  getMovieVideos(movieId: number): Observable<VideoResponse> {
    return this.tmdbApi.get<VideoResponse>(`/movie/${movieId}/videos`);
  }

  // 🔥 SEARCH MOVIES
  searchMovies(query: string, page: number = 1): Observable<SearchResponse> {
    return this.tmdbApi.get<SearchResponse>('/search/movie', { query, page });
  }
}
