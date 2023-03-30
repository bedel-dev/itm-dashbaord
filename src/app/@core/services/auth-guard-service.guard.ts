import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'ng-devui';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  i18nValues: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isUserLoggedIn()) {
      this.i18nValues = this.translate.instant('authNotice');
      console.log(this.i18nValues);
      this.toastService.open({
        value: [
          {
            severity: 'info',
            summary: "Accès refusé",
            content: "Connectez-vous s'il vous plaît.",
          },
        ],
        life: 2000,
      });
      this.router.navigate(['login']);
      return false;
    } else {
      return true;
    }
  }
}
