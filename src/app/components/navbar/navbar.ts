import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  menuOpen = false;
  scrolled = false;
  navVisible = false;

  bannerVisible = false;
  bannerRendered = false;

  private bannerTimer!: ReturnType<typeof setTimeout>;
  private hideTimer!: ReturnType<typeof setTimeout>;

  navLinks = [
    { label: 'Home', path: '/', exact: true },
    { label: 'About', path: '/about', exact: false },
    { label: 'Services', path: '/services', exact: false },
    { label: 'Packages', path: '/packages', exact: false },
    { label: 'Destinations', path: '/destinations', exact: false },
    { label: 'Booking Policy', path: '/booking-policy', exact: false },
    { label: 'Contact', path: '/contact', exact: false }
  ];

  ngOnInit(): void {
    setTimeout(() => {
      this.navVisible = true;
    }, 80);

    this.initBanner();
  }

  ngOnDestroy(): void {
    clearTimeout(this.bannerTimer);
    clearTimeout(this.hideTimer);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 10;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    document.body.style.overflow = this.menuOpen ? 'hidden' : '';
  }

  closeMenu(): void {
    this.menuOpen = false;
    document.body.style.overflow = '';
  }

  private initBanner(): void {
    if (!sessionStorage.getItem('alghani_banner')) {
      this.bannerRendered = true;

      setTimeout(() => {
        this.bannerVisible = true;
      }, 120);

      this.bannerTimer = setTimeout(() => {
        this.dismissBanner();
      }, 6000);

      sessionStorage.setItem('alghani_banner', '1');
    }
  }

  dismissBanner(): void {
    this.bannerVisible = false;

    this.hideTimer = setTimeout(() => {
      this.bannerRendered = false;
    }, 600);
  }
}