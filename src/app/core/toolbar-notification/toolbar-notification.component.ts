import { Component, OnInit, Input, HostListener, ElementRef, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-toolbar-notification',
  templateUrl: './toolbar-notification.component.html',
  styleUrls: ['./toolbar-notification.component.scss']
})
export class ToolbarNotificationComponent implements OnInit, OnDestroy {
  public cssPrefix: string = 'toolbar-notification';
  public isOpen: boolean = false;
  @Input() public notifications: Array<any> = [];

  constructor(private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private shared: SharedService) {
    this.matIconRegistry.addSvgIcon(
      'unicorn',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/images/bell.svg')
    );
  }

  /**
   * on init
   */
  ngOnInit() {
    this.shared.getNotifications();
    this.shared.notificationsData.subscribe(response => {
      if (response) {
        this.notifications = response;
      }
    });
  }

  /**
   * on destroy
   */
  ngOnDestroy() {
    this.isOpen = false;
  }

  /**
   * Deletes toolbar notification component
   * @param notification
   */
  delete(notification) { }
}
