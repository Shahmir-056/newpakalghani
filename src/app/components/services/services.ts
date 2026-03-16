// src/app/components/services/services.ts
import { Component, AfterViewInit, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './services.html',
  styleUrls: ['./services.scss']
})
export class ServicesComponent implements OnInit, AfterViewInit {

  private app = getApps().length > 0 ? getApps()[0] : initializeApp(environment.firebase);
  private db  = getFirestore(this.app);

  coreServices : any[] = [];
  loading       = true;

  process = [
    { side: 'left',  num: '01', title: 'Consultation', desc: 'We discuss your travel requirements, preferences, and budget to create the perfect plan.' },
    { side: 'right', num: '02', title: 'Planning',      desc: 'Our experts research and design a customised travel package that matches your needs.' },
    { side: 'left',  num: '03', title: 'Booking',       desc: 'We handle all reservations, visa applications, and documentation on your behalf.' },
    { side: 'right', num: '04', title: 'Support',       desc: '24/7 assistance throughout your journey, ensuring a smooth and memorable experience.' }
  ];

  whyUs = [
    { icon: '⭐', title: 'Expert Experience',     desc: '30+ years in travel and tourism with deep knowledge of destinations and requirements.' },
    { icon: '⚡', title: 'Fast Processing',       desc: 'Quick turnaround times for visas, bookings, and all travel arrangements.' },
    { icon: '🎧', title: '24/7 Support',          desc: 'Round-the-clock customer support to assist you with any questions or emergencies.' },
    { icon: '💰', title: 'Best Prices',           desc: 'Competitive pricing with no hidden fees — best value guaranteed.' },
    { icon: '🔒', title: 'Secure & Reliable',     desc: 'Your information and payments are protected with industry-standard security.' },
    { icon: '❤️', title: 'Personalised Service', desc: 'Tailored travel solutions that match your specific needs, preferences, and budget.' }
  ];

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {}

  async ngOnInit(): Promise<void> {
    try {
      const snapshot = await getDocs(collection(this.db, 'services'));
      // ✅ Wrap in zone.run() so Angular detects the change immediately
      this.zone.run(() => {
        this.coreServices = snapshot.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .map(s => ({ ...s, btnLabel: 'Book Now', btnRoute: '/contact' }));
        this.loading = false;
        this.cdr.detectChanges();
        console.log('✅ Services loaded:', this.coreServices);
      });
    } catch (err) {
      this.zone.run(() => {
        this.loading = false;
        this.cdr.detectChanges();
      });
      console.error('❌ Services error:', err);
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

    const revealObserver = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObserver.unobserve(e.target);
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach(el => revealObserver.observe(el));

    const trackFill = document.querySelector<HTMLElement>('.process__track-fill');
    if (trackFill) {
      const trackObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              trackFill.classList.add('active');
              trackObserver.disconnect();
            }
          });
        },
        { threshold: 0.3 }
      );
      const stage = document.querySelector('.process__stage');
      if (stage) trackObserver.observe(stage);
    }
  }
}