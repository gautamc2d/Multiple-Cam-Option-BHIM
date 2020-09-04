import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
@Component({
  selector: 'app-notifications-panel',
  templateUrl: './notifications-panel.component.html',
  styleUrls: ['./notifications-panel.component.scss']
})
export class NotificationsPanelComponent implements OnInit {
  public displayedColumns: string[] = ['Message', 'Actions'];
  public dataSource: any = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public totlNotifications = 0;

  private userData: Array<any> = [];
  constructor(private sharedService: SharedService) {
    this.sharedService.svgRegistry('delete', '../../assets/images/delete.svg');
  }

  /**
   * on init
   */
  ngOnInit(): void {
    this.userData = this.sharedService.getSessionData();
    this.sharedService.setTitle('');
    this.sharedService.notificationsData.subscribe(response => {
      if (response) {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.totlNotifications = response.length;
      }
    });
  }

  /**
   * Deleting notifications panel component
   * @param ele
   */
  public deleting(ele): void { }

  /**
     * Dates format to iso
     * @param ele
     * @returns
     */
  public dateFormatToISO(ele): any {
    if (ele) {
      const dateConversion = new Date(ele).toISOString();
      return dateConversion;
    }
  }
}
