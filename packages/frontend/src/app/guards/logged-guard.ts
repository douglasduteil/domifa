import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from "@angular/router";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: "root" })
export class LoggedGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.authService.isAuth().pipe(
      map(isLogged => {
        if (isLogged) {
          this.router.navigate(["/manage"]);
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
