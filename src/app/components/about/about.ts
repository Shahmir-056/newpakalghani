import { Component, AfterViewInit, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, CommonModule, NgFor],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {

  private app = getApps().length > 0 ? getApps()[0] : initializeApp(environment.firebase);
  private db  = getFirestore(this.app);
  private unsubTeam: (() => void) | null = null;
  private revealObserver: IntersectionObserver | null = null;

  teamLoading = true;

  journey = [
    {
      side: 'left',
      year: '2005',
      title: 'The Beginning',
      desc: 'Founded in Jalalpur Sobatiyan, Gujrat, with a bold vision — to make travel affordable, accessible, and memorable for every Pakistani traveller.'
    },
    {
      side: 'right',
      year: '2012',
      title: 'Growing Roots',
      desc: 'Expanded our portfolio to include Umrah packages and domestic tour services, earning the trust of thousands of families across Gujrat and beyond.'
    },
    {
      side: 'left',
      year: '2017',
      title: 'Going International',
      desc: 'Launched international tour packages to Dubai, Turkey, and Europe, establishing partnerships with global hotels and airlines for seamless travel experiences.'
    },
    {
      side: 'right',
      year: '2021',
      title: 'Digital Leap',
      desc: 'Transformed our operations with a full digital presence, enabling online bookings, real-time support, and reaching 25,000+ happy travellers across 300+ destinations.'
    },
    {
      side: 'left',
      year: '2025',
      title: 'Today & Beyond',
      desc: 'Now proudly serving 50,000+ travellers with access to 460+ destinations worldwide, while continuing our commitment to excellence from Jalalpur Sobatiyan to the world.'
    }
  ];

  testimonials = [
    { text: 'Outstanding service! Pak New Al-Ghani made our Dubai trip absolutely perfect. The attention to detail and personalized care made all the difference.', name: 'M Ali',    trip: 'Europe Tour, 2025',    stars: 5 },
    { text: "The Umrah package exceeded our expectations. The team's spiritual guidance and support made our journey truly memorable.",                              name: 'Kazim Jutt', trip: 'Dubai Tour, 2025', stars: 5 },
    { text: 'Professional and reliable service. Their Europe tour package was well-organized and the guides were knowledgeable and friendly.',                       name: 'Mahanoor kusar ',  trip: 'Umrah Package, 2024',   stars: 4 }
  ];

  // Team is loaded exclusively from Firestore — no static fallback (professional approach)
  team: any[] = [];

  getStars(count: number): number[] {
    return Array(count).fill(0);
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.unsubTeam = onSnapshot(
      collection(this.db, 'employees'),
      (snap) => {
        const members = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

        // Only populate if Firestore actually has data
        this.team = members.length > 0 ? [...members] : [];
        this.teamLoading = false;

        this.cdr.detectChanges();
        this.initScrollObserver();
      },
      (err) => {
        console.warn('Could not load team from Firestore.', err);
        // Show nothing — team stays empty, section container remains clean
        this.team = [];
        this.teamLoading = false;

        this.cdr.detectChanges();
        this.initScrollObserver();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.unsubTeam) this.unsubTeam();
    if (this.revealObserver) this.revealObserver.disconnect();
  }

  ngAfterViewInit(): void {
    this.initScrollObserver();

    // Journey progress track animation
    const trackFill  = document.querySelector<HTMLElement>('.journey__track-fill');
    const trackNodes = document.querySelectorAll<HTMLElement>('.journey__track-node');

    const trackObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (trackFill) trackFill.classList.add('active');
            trackNodes.forEach((node, i) => {
              setTimeout(() => node.classList.add('node-active'), i * 280);
            });
            trackObserver.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    const stage = document.querySelector('.journey__stage');
    if (stage) trackObserver.observe(stage);
  }

  private initScrollObserver(): void {
    // Disconnect previous observer to avoid duplicates
    if (this.revealObserver) this.revealObserver.disconnect();

    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.revealObserver?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.scroll-animate:not(.visible)').forEach((el) => {
      this.revealObserver!.observe(el);
    });
  }
}