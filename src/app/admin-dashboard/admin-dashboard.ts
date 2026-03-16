// src/app/admin-da/admin-dashboard.ts
import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboard implements OnInit {

  private app  = getApps().length > 0 ? getApps()[0] : initializeApp(environment.firebase);
  private db   = getFirestore(this.app);
  private auth = getAuth(this.app);

  loading     = true;
  adminEmail  = '';
  activePage  = 'dashboard';
  sidebarOpen = true;

  stats = [
    { icon: '📦', label: 'Total Packages',  value: 0, color: 'blue'   },
    { icon: '⚙️', label: 'Services',        value: 0, color: 'purple' },
    { icon: '🌍', label: 'Destinations',    value: 0, color: 'green'  },
    { icon: '📬', label: 'New Inquiries',   value: 0, color: 'orange' },
    { icon: '👥', label: 'Team Members',    value: 0, color: 'teal'   },
  ];

  navItems = [
    { key: 'dashboard',    icon: '📊', label: 'Dashboard'    },
    { key: 'packages',     icon: '📦', label: 'Packages'     },
    { key: 'services',     icon: '⚙️', label: 'Services'     },
    { key: 'destinations', icon: '🌍', label: 'Destinations' },
    { key: 'bookings',     icon: '📬', label: 'Bookings'     },
    { key: 'employees',    icon: '👥', label: 'Team'         },
  ];

  packages      : any[] = [];
  services      : any[] = [];
  destinations  : any[] = [];
  bookings      : any[] = [];
  employees     : any[] = [];
  recentBookings: any[] = [];

  showModal         = false;
  modalMode         : 'add' | 'edit' = 'add';
  modalSection      = '';
  saving            = false;
  editingId         = '';
  showDeleteConfirm = false;
  deletingId        = '';
  deletingSection   = '';

  pkgForm  = { name: '', category: 'umrah', price: '', duration: '', badge: '', img: '', features: '' };
  svcForm  = { icon: '', title: '', desc: '', tags: '', badge: '' };
  destForm = { name: '', category: 'asia', img: '', tag: '', popular: false };
  empForm  = {
    name: '', role: '', desc: '', img: '',
    order: 0, email: '', phone: '',
    facebook: '', instagram: '', linkedin: ''
  };

  pkgCategories  = ['umrah', 'hajj', 'tours', 'visa'];
  destCategories = ['asia', 'middle-east', 'europe', 'africa'];

  constructor(private router: Router, private zone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.adminEmail = this.auth.currentUser?.email || 'Admin';
    this.listenToCollections();
  }

  listenToCollections() {
    const responded = new Set<string>();
    const COLLECTIONS = ['packages', 'services', 'destinations', 'bookings', 'employees'];

    const markDone = (name: string) => {
      responded.add(name);
      if (COLLECTIONS.every(c => responded.has(c))) {
        this.loading = false;
        this.cdr.detectChanges();
      }
    };

    setTimeout(() => {
      if (this.loading) {
        this.zone.run(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    }, 2000);

    onSnapshot(collection(this.db, 'packages'), snap => {
      this.zone.run(() => {
        this.packages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        this.stats[0].value = this.packages.length;
        markDone('packages');
      });
    }, err => { console.error('❌ packages:', err); this.zone.run(() => markDone('packages')); });

    onSnapshot(collection(this.db, 'services'), snap => {
      this.zone.run(() => {
        this.services = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        this.stats[1].value = this.services.length;
        markDone('services');
      });
    }, err => { console.error('❌ services:', err); this.zone.run(() => markDone('services')); });

    onSnapshot(collection(this.db, 'destinations'), snap => {
      this.zone.run(() => {
        this.destinations = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        this.stats[2].value = this.destinations.length;
        markDone('destinations');
      });
    }, err => { console.error('❌ destinations:', err); this.zone.run(() => markDone('destinations')); });

    onSnapshot(collection(this.db, 'bookings'), snap => {
      this.zone.run(() => {
        this.bookings = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        this.recentBookings = this.bookings.slice(0, 6);
        this.stats[3].value = this.bookings.filter(b => b.status === 'new').length;
        markDone('bookings');
      });
    }, err => { console.error('❌ bookings:', err); this.zone.run(() => markDone('bookings')); });

    onSnapshot(collection(this.db, 'employees'), snap => {
      this.zone.run(() => {
        this.employees = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        this.stats[4].value = this.employees.length;
        markDone('employees');
      });
    }, err => { console.error('❌ employees:', err); this.zone.run(() => markDone('employees')); });
  }

  setPage(page: string) { this.activePage = page; }

  logout() {
    signOut(this.auth).then(() => this.router.navigate(['/admin']));
  }

  openAdd(section: string) {
    this.modalMode = 'add'; this.modalSection = section;
    this.editingId = ''; this.resetForms(); this.showModal = true;
  }

  openEdit(section: string, item: any) {
    this.modalMode = 'edit'; this.modalSection = section; this.editingId = item.id;
    if (section === 'packages') {
      this.pkgForm = {
        name: item.name || '', category: item.category || 'umrah',
        price: item.price || '', duration: item.duration || '',
        badge: item.badge || '', img: item.img || '',
        features: (item.features || []).join('\n')
      };
    } else if (section === 'services') {
      this.svcForm = {
        icon: item.icon || '', title: item.title || '',
        desc: item.desc || '', tags: (item.tags || []).join(', '),
        badge: item.badge || ''
      };
    } else if (section === 'destinations') {
      this.destForm = {
        name: item.name || '', category: item.category || 'asia',
        img: item.img || '', tag: item.tag || '', popular: item.popular ?? false
      };
    } else if (section === 'employees') {
      this.empForm = {
        name: item.name || '', role: item.role || '',
        desc: item.desc || '', img: item.img || '',
        order: item.order || 0, email: item.email || '',
        phone: item.phone || '', facebook: item.facebook || '',
        instagram: item.instagram || '', linkedin: item.linkedin || ''
      };
    }
    this.showModal = true;
  }

  closeModal() { this.showModal = false; }

  resetForms() {
    this.pkgForm  = { name: '', category: 'umrah', price: '', duration: '', badge: '', img: '', features: '' };
    this.svcForm  = { icon: '', title: '', desc: '', tags: '', badge: '' };
    this.destForm = { name: '', category: 'asia', img: '', tag: '', popular: false };
    this.empForm  = { name: '', role: '', desc: '', img: '', order: 0, email: '', phone: '', facebook: '', instagram: '', linkedin: '' };
  }

  async save() {
    this.saving = true;
    this.showModal = false;

    try {
      if (this.modalSection === 'packages') {
        const data: any = {
          name:     this.pkgForm.name,
          category: this.pkgForm.category,
          price:    this.pkgForm.price,
          duration: this.pkgForm.duration,
          badge:    this.pkgForm.badge,
          img:      this.pkgForm.img,
          features: this.pkgForm.features.split('\n').map((f:string) => f.trim()).filter((f:string) => f !== '')
        };
        if (this.modalMode === 'add') { data['createdAt'] = serverTimestamp(); await addDoc(collection(this.db, 'packages'), data); }
        else { await updateDoc(doc(this.db, 'packages', this.editingId), data); }

      } else if (this.modalSection === 'services') {
        const data: any = {
          icon: this.svcForm.icon, title: this.svcForm.title,
          desc: this.svcForm.desc, badge: this.svcForm.badge,
          tags: this.svcForm.tags.split(',').map((t:string) => t.trim()).filter((t:string) => t !== '')
        };
        if (this.modalMode === 'add') { data['createdAt'] = serverTimestamp(); await addDoc(collection(this.db, 'services'), data); }
        else { await updateDoc(doc(this.db, 'services', this.editingId), data); }

      } else if (this.modalSection === 'destinations') {
        const data: any = {
          name: this.destForm.name, category: this.destForm.category,
          img: this.destForm.img, tag: this.destForm.tag, popular: this.destForm.popular
        };
        if (this.modalMode === 'add') { data['createdAt'] = serverTimestamp(); await addDoc(collection(this.db, 'destinations'), data); }
        else { await updateDoc(doc(this.db, 'destinations', this.editingId), data); }

      } else if (this.modalSection === 'employees') {
        const data: any = {
          name:      this.empForm.name,
          role:      this.empForm.role,
          desc:      this.empForm.desc,
          img:       this.empForm.img,
          order:     Number(this.empForm.order) || 0,
          email:     this.empForm.email,
          phone:     this.empForm.phone,
          facebook:  this.empForm.facebook,
          instagram: this.empForm.instagram,
          linkedin:  this.empForm.linkedin,
        };
        if (this.modalMode === 'add') { data['createdAt'] = serverTimestamp(); await addDoc(collection(this.db, 'employees'), data); }
        else { await updateDoc(doc(this.db, 'employees', this.editingId), data); }
      }

    } catch (e: any) {
      console.error('❌ Save error:', e);
      alert('Save failed: ' + (e?.message || 'Check console'));

    // ✅ FIX 1: Always reset saving flag whether success or error.
    // Previously this.saving was set to true but NEVER reset,
    // so every modal re-open after the first edit showed the spinner forever.
    } finally {
      this.saving = false;
      this.cdr.detectChanges();
    }
  }

  confirmDelete(section: string, id: string) {
    this.deletingSection = section; this.deletingId = id; this.showDeleteConfirm = true;
  }

  // ✅ FIX 2: Wrap state reset inside zone.run() so Angular detects
  // the change after the Firebase async operation completes.
  // Previously showDeleteConfirm = false ran after an await outside
  // Angular's zone, so the modal stayed open until something else
  // triggered change detection (e.g. clicking the overlay).
  async doDelete() {
    try { await deleteDoc(doc(this.db, this.deletingSection, this.deletingId)); }
    catch (e) { console.error('❌ Delete error:', e); }
    this.zone.run(() => {
      this.showDeleteConfirm = false;
      this.cdr.detectChanges();
    });
  }

  cancelDelete() { this.showDeleteConfirm = false; }

  async updateBookingStatus(id: string, status: string) {
    try { await updateDoc(doc(this.db, 'bookings', id), { status }); }
    catch (e) { console.error('❌ Status error:', e); }
  }

  async deleteBooking(id: string) {
    try { await deleteDoc(doc(this.db, 'bookings', id)); }
    catch (e) { console.error('❌ Delete booking error:', e); }
  }
}