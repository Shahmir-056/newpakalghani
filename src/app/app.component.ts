// src/app/app.component.ts
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar';
import { FooterComponent } from './components/footer/footer';
import { SplashComponent } from './components/splash/splash';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent, FooterComponent, SplashComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {

  private router = inject(Router);

  isAdminPage  = false;
  showSplash   = true;
  hidingSplash = false;

  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.isAdminPage = e.urlAfterRedirects.startsWith('/admin');
    });

    // Start fade-out 600ms before removing
    setTimeout(() => this.hidingSplash = true,  2400);
    setTimeout(() => this.showSplash   = false, 3000);
  }
}