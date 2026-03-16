import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { AboutComponent } from './components/about/about';
import { ServicesComponent } from './components/services/services';
import { PackagesComponent } from './components/packages/packages';
import { Destinations } from './components/destinations/destinations';
import { ContactComponent } from './components/contact/contact';
import { BookingPolicyComponent } from './components/booking-policy/booking-policy';
// import { LoginComponent } from './components/login/login';
import { Admin } from './admin/admin';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { adminGuard } from './guards/admin.guard';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'packages', component: PackagesComponent },
  { path: 'destinations', component: Destinations},
  { path: 'contact', component: ContactComponent },
  { path: 'booking-policy', component: BookingPolicyComponent },
  // { path: 'login', component: LoginComponent },
  { path: 'admin', component: Admin },
  { path: 'admin-dashboard', component: AdminDashboard, canActivate: [adminGuard]  },
  { path: '**', redirectTo: '' } // fallback to Home
];