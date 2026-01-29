import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HomeComponent } from './features/home/home.component';
import { SearchComponent } from './features/search/search.component';
import { MovieDetailComponent } from './features/movie-detail/movie-detail.component';
import { WatchlistComponent } from './features/watchlist/watchlist.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'search',
        component: SearchComponent
      },
      {
        path: 'movie/:id',
        component: MovieDetailComponent
      },
      {
        path: 'watchlist',
        component: WatchlistComponent
      }
    ]
  }
];
