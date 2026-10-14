import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { JwtService } from '../services/jwt.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authSrv = inject(AuthService);
  const jwtSrv = inject(JwtService);
  const router = inject(Router);

  const toLogin = () => router.createUrlTree(['/login'], { queryParams: { dest: state.url } });

  // utente già caricato: nessuna attesa
  if (authSrv.isAuthenticated()) {
    return true;
  }

  // nessun token: inutile chiamare il backend
  if (!jwtSrv.hasToken()) {
    return toLogin();
  }

  // token presente ma utente non ancora caricato (refresh): aspetto /users/me
  return authSrv.fetchUser().pipe(
    map(user => user ? true : toLogin())
  );
};