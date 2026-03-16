// src/app/components/destinations/destinations.ts
import { Component, AfterViewInit, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './destinations.html',
  styleUrl: './destinations.scss',
})
export class Destinations implements OnInit, AfterViewInit {

  private app = getApps().length > 0 ? getApps()[0] : initializeApp(environment.firebase);
  private db  = getFirestore(this.app);

  activeFilter    = 'all';
  filters         = ['all', 'asia', 'middle-east', 'europe', 'africa'];
  allDestinations : any[] = [];
  loading         = true;

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {}

  get filtered() {
    if (this.activeFilter === 'all') return this.allDestinations;
    return this.allDestinations.filter(d => d.category === this.activeFilter);
  }

  setFilter(f: string) {
    this.activeFilter = f;
    setTimeout(() => this.initObserver(), 150);
  }

  highlights = [
    { icon: '🕌', label: 'Hajj & Umrah',     desc: 'Sacred journeys to Makkah & Madinah'    },
    { icon: '🏖️', label: 'Beach Escapes',    desc: 'Pristine shores across Asia & Maldives' },
    { icon: '🏛️', label: 'Heritage Tours',   desc: 'Explore ancient history & culture'       },
    { icon: '🌆', label: 'City Experiences', desc: 'Modern cities & urban adventures'        },
  ];

  async ngOnInit(): Promise<void> {
    try {
      const snapshot = await getDocs(collection(this.db, 'destinations'));
      // ✅ Wrap in zone.run() so Angular detects the change immediately
      this.zone.run(() => {
        this.allDestinations = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        this.loading = false;
        this.cdr.detectChanges();
        console.log('✅ Destinations loaded:', this.allDestinations);
      });
    } catch (err) {
      this.zone.run(() => {
        this.loading = false;
        this.cdr.detectChanges();
      });
      console.error('❌ Destinations error:', err);
    } finally {
      setTimeout(() => this.initObserver(), 200);
    }
  }

  ngAfterViewInit(): void {
    this.initObserver();
  }

  initObserver(): void {
    const els = document.querySelectorAll<HTMLElement>('.scroll-animate');
    if (!els.length) return;

    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    els.forEach(el => {
      if (el.classList.contains('visible')) return;

      const rect = el.getBoundingClientRect();
      const inViewport =
        rect.top < window.innerHeight - 30 &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0;

      if (inViewport) {
        el.classList.add('visible');
      } else {
        observer.observe(el);
      }
    });
  }
}