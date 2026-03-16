// src/app/guards/admin.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';

export const adminGuard: CanActivateFn = () => {

  const auth = inject(Auth);
  const router = inject(Router);

  const ADMIN_EMAIL = "admin.newpakalghani@gmail.com"; // 🔐 your admin email

  return authState(auth).pipe(
    take(1),
    map(user => {

      // ❌ Not logged in
      if (!user) {
        router.navigate(['/admin']);
        return false;
      }

      // ❌ Logged in but not admin
      if (user.email !== ADMIN_EMAIL) {
        router.navigate(['/']);
        return false;
      }

      // ✅ Admin allowed
      return true;
    })
  );
};