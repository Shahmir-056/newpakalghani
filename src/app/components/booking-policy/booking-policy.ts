import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-policy.html',
  styleUrls: ['./booking-policy.scss']
})
export class BookingPolicyComponent implements AfterViewInit {

  policies = [
    {
      icon: '💳',
      title: 'Payment & Advance Booking',
      points: [
        'All bookings require advance payment as specified in the package.',
        'A minimum 30% deposit is required to confirm any booking.',
        'Full payment must be completed 7 days before departure.',
        'Payments can be made via bank transfer, cash, or online payment.',
      ]
    },
    {
      icon: '📅',
      title: 'Date Changes & Amendments',
      points: [
        'Any changes in travel dates must be communicated 7 days prior.',
        'Date change requests are subject to availability.',
        'A date change fee may apply depending on the package.',
        'Airline ticket changes are subject to airline policies and fees.',
      ]
    },
    {
      icon: '🛂',
      title: 'Visa & Documentation',
      points: [
        'Visa and hotel arrangements are processed after booking confirmation.',
        'Customers must provide all required documents within 48 hours.',
        'We are not responsible for visa rejections due to incomplete documents.',
        'Original passport validity must be at least 6 months from travel date.',
      ]
    },
    {
      icon: '🏨',
      title: 'Hotel & Accommodation',
      points: [
        'Hotel rooms are allocated based on package type selected.',
        'Check-in is typically at 2:00 PM and check-out at 12:00 PM.',
        'Room upgrades are available at additional cost upon request.',
        'Special dietary or room requirements should be communicated in advance.',
      ]
    },
  ];

  ngAfterViewInit(): void {
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
        rect.bottom > 0;
      if (inViewport) {
        el.classList.add('visible');
      } else {
        observer.observe(el);
      }
    });
  }
}