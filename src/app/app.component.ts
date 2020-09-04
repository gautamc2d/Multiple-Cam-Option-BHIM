import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationCancel, NavigationError, NavigationStart, RouterEvent } from '@angular/router';
import { LoaderService } from './shared/Loader.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {

  /**
   * Creates an instance of app component.
   * @param router
   * @param loaderService
   */
  constructor(private router: Router,
    private loaderService: LoaderService) {
    this.router.events.subscribe((event: RouterEvent) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loaderService.show();
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loaderService.hide();
          break;
        }
        default: {
          break;
        }
      }
    });
  }
  ngOnInit() { }

  getRouteAnimation(outlet) {
    return outlet.activatedRouteData.animation;
  }
}
