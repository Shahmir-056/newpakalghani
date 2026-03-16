import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  // ── GTA Plane Drop ───────────────────────────────
  planeRendered = false;   // in DOM
  planeActive   = false;   // triggers fly-in animation
  planeLeaving  = false;   // triggers fly-out animation
  private planeTimer!: ReturnType<typeof setTimeout>;
  private leaveTimer!: ReturnType<typeof setTimeout>;
  private removeTimer!: ReturnType<typeof setTimeout>;

  // ── Scroll Reveal ────────────────────────────────
  private observer!: IntersectionObserver;

  // ── Animated Counters ────────────────────────────
  years        = 0;
  destinations = 0;
  customers    = 0;
  private countersStarted = false;

  ngOnInit(): void {
    this.initPlane();
    this.initScrollReveal();
  }

  ngOnDestroy(): void {
    clearTimeout(this.planeTimer);
    clearTimeout(this.leaveTimer);
    clearTimeout(this.removeTimer);
    this.observer?.disconnect();
  }

  // ── Plane Logic ──────────────────────────────────
  private initPlane(): void {
    // Always show on every page load / reload
    this.planeRendered = true;
    setTimeout(() => (this.planeActive = true), 200);
    this.planeTimer = setTimeout(() => this.closePlane(), 7000);
  }

  closePlane(): void {
    clearTimeout(this.planeTimer);
    if (this.planeLeaving) return;

    // Switch to leave animation
    this.planeActive  = false;
    this.planeLeaving = true;

    // Remove from DOM after animation finishes
    this.removeTimer = setTimeout(() => {
      this.planeRendered = false;
      this.planeLeaving  = false;
    }, 1500);
  }

  // ── Scroll Reveal ────────────────────────────────
  private initScrollReveal(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('hm-in-view');
            if (
              entry.target.classList.contains('hm-trigger-counters') &&
              !this.countersStarted
            ) {
              this.countersStarted = true;
              this.animateCounters();
            }
          }
        });
      },
      { threshold: 0.15 }
    );
    setTimeout(() => {
      document.querySelectorAll(
        '.hm-reveal, .hm-reveal-left, .hm-reveal-right, .hm-trigger-counters'
      ).forEach(el => this.observer.observe(el));
    }, 150);
  }

  private animateCounters(): void {
    this.countUp('years',        20,  1800);
    this.countUp('destinations', 460, 2100);
    this.countUp('customers',    50,  2400);
  }

  private countUp(
    key: 'years' | 'destinations' | 'customers',
    target: number,
    duration: number
  ): void {
    const start = performance.now();
    const step  = (now: number) => {
      const p     = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      this[key]   = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
      else this[key] = target;
    };
    requestAnimationFrame(step);
  }
}