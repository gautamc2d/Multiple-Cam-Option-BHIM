import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

/**
 * Auth guard
 */
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    /**
     * Determines whether activate can
     * @param route
     * @param state
     * @returns true if activate
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const url: string = state.url;
        return this.verifyLogin(url);
    }

    /**
     * Verifys login
     * @param url
     * @returns true if login
     */
    private verifyLogin(url): boolean {
        if (!this.isLoggedIn()) {
            this.router.navigate(['login']);
            return false;
        } else if (this.isLoggedIn()) {
            return true;
        }
    }

    /**
     * Determines whether logged in is
     * @returns true if logged in
     */
    private isLoggedIn(): boolean {
        let status = false;
        if (localStorage.getItem('isLoggedIn') === 'true') {
            status = true;
        } else {
            status = false;
        }
        return status;
    }
}
