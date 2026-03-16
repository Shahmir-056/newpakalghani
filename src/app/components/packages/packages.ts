// src/app/components/packages/packages.ts
import { Component, OnInit, AfterViewInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './packages.html',
  styleUrls: ['./packages.scss']
})
export class PackagesComponent implements OnInit, AfterViewInit {

  loading      = true;
  activeFilter = 'all';
  filters      = ['all', 'umrah', 'hajj', 'tours', 'visa'];
  allPackages  : any[] = [];

  private app = getApps().length > 0 ? getApps()[0] : initializeApp(environment.firebase);
  private db  = getFirestore(this.app);

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {}

  get filtered(): any[] {
    if (this.activeFilter === 'all') return this.allPackages;
    return this.allPackages.filter(p => p.category === this.activeFilter);
  }

  setFilter(f: string) {
    this.activeFilter = f;
    setTimeout(() => this.initObserver(), 150);
  }

  async ngOnInit(): Promise<void> {
    try {
      const snapshot = await getDocs(collection(this.db, 'packages'));
      // ✅ Wrap in zone.run() so Angular detects the change immediately
      this.zone.run(() => {
        this.allPackages = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        this.loading = false;
        this.cdr.detectChanges();
        console.log('✅ Packages loaded:', this.allPackages);
      });
    } catch (err) {
      this.zone.run(() => {
        this.loading = false;
        this.cdr.detectChanges();
      });
      console.error('❌ Firestore error:', err);
    } finally {
      setTimeout(() => this.initObserver(), 200);
    }
  }

  ngAfterViewInit(): void {
    this.initObserver();
  }

  initObserver(): void {
    const els = document.querySelectorAll('.scroll-animate');
    if (!els.length) return;
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    els.forEach(el => observer.observe(el));
  }
}