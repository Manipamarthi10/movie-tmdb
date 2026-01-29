import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="container">
        <div class="logo">🎬 MovieFlix</div>
        <nav class="nav">
          <a routerLink="/home" routerLinkActive="active" class="nav-link">Home</a>
          <a routerLink="/search" routerLinkActive="active" class="nav-link">Search</a>
          <a routerLink="/watchlist" routerLinkActive="active" class="nav-link">Watchlist</a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: rgba(0, 0, 0, 0.8);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
      text-decoration: none;
    }

    .nav {
      display: flex;
      gap: 2rem;
    }

    .nav-link {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 1rem;
      transition: color 0.3s ease;
    }

    .nav-link:hover,
    .nav-link.active {
      color: #fff;
    }
  `]
})
export class HeaderComponent {}
