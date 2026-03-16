// src/app/components/contact/contact.ts
import { Component, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ FormsModule, CommonModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss']
})
export class ContactComponent implements AfterViewInit {

  private app = getApps().length > 0 ? getApps()[0] : initializeApp(environment.firebase);
  private db  = getFirestore(this.app);

  formData = { name: '', email: '', phone: '', subject: '', message: '' };

  submitted  = false;
  submitting = false;
  error      = '';

  contactInfo = [
    { icon: '📞', title: 'Phone',    value: '+92 315 6262051',            link: 'tel:+923156262051',                                              sub: 'Mon–Sat, 9am–8pm'     },
    { icon: '💬', title: 'WhatsApp', value: '+92 315 6262051',            link: 'https://wa.me/923156262051',                                     sub: 'Available 24/7'        },
    { icon: '📧', title: 'Email',    value: 'sales.newpakalghani@hotmail.com',     link: 'mailto:sales.newpakalghani@hotmail.com',                                  sub: 'Reply within 24 hours' },
    { icon: '📍', title: 'Office',   value: 'Rana Faiz Market, Jalalpur Sobtian', link: 'https://maps.google.com/?q=32.7682554,74.2122194', sub: 'Awan Sharif Road, 50700'  },
  ];

  async onSubmit() {
    if (!this.formData.name || !this.formData.email || !this.formData.message) return;

    this.submitting = true;
    this.error      = '';

    try {
      await addDoc(collection(this.db, 'bookings'), {
        name     : this.formData.name,
        email    : this.formData.email,
        phone    : this.formData.phone,
        subject  : this.formData.subject,
        message  : this.formData.message,
        status   : 'new',
        createdAt: serverTimestamp()
      });

      this.submitted = true;
      this.formData  = { name: '', email: '', phone: '', subject: '', message: '' };

    } catch (err) {
      console.error('❌ Contact form error:', err);
      this.error = 'Something went wrong. Please try WhatsApp instead.';
    } finally {
      this.submitting = false;
    }
  }

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