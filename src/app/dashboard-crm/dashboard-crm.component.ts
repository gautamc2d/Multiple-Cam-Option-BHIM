import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { SharedService } from '../shared/shared.service';
import { MatSort } from '@angular/material/sort';
import { WebApiURL } from '../shared/WebApiNames';
import { Subscription, interval } from 'rxjs';
import { ConfirmationDialogComponent } from '../core/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-dashboard-crm',
    templateUrl: './dashboard-crm.component.html',
    styleUrls: ['./dashboard-crm.component.scss']
})

export class DashboardCrmComponent implements OnInit, AfterViewInit, OnDestroy {

    public displayedColumns: string[] = ['location_name', 'AlarmName', 'Voltage', 'RoomTemp', 'Actions'];
    public dataSource: any = new MatTableDataSource();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    public totlLocations = 0;
    public userData: Object = {};
    public showPopup: boolean = false;

    private subscription: any;
    private subscribe: Subscription;

    /**
     * Creates an instance of dashboard crm component.
     * @param router
     * @param sharedService
     */
    constructor(private router: Router,
        private sharedService: SharedService,
        public dialog: MatDialog
    ) {
        this.sharedService.svgRegistry('edit', '../../assets/images/edit.svg');
        this.sharedService.svgRegistry('delete', '../../assets/images/delete.svg');
    }

    /**
     * on init
     */
    ngOnInit() {
        this.userData = this.sharedService.getSessionData();
        this.sharedService.setTitle({ msg1: 'Location Listing' });
        this.sharedService.hideSearch(false);
        this.getLocationList();
        const source = interval(300000);
        this.subscription = source.subscribe(val => this.getLocationList());
    }

    /**
    * Set the paginator and sort after the view init since this component will
    * be able to query its view for the initialized paginator and sort.
    */
    ngAfterViewInit() {
        this.subscription = this.sharedService.filterValue.subscribe(Value => {
            let filterValue = Value;
            filterValue = filterValue.trim();
            filterValue = filterValue.toLowerCase();
            this.dataSource.filter = filterValue;
        });
    }

    /**
     * on destroy
     */
    ngOnDestroy() {
        this.sharedService.hideSearch(true);
        this.subscription.unsubscribe();
        if (this.subscribe) {
            this.subscribe.unsubscribe();
        }
    }

    /**
     * Gets location list
     */
    public getLocationList(): any {
        const payload = {
            'UserID': this.userData['UserID']
        };
        this.sharedService.send(WebApiURL.dashBoard.dashBoardList, payload).subscribe((data) => {
            if (data.hasOwnProperty(status) && !data['status']) {
            } else {
                this.dataSource = new MatTableDataSource(data);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.totlLocations = data.length;
            }
        }, (error) => {
            console.log(error);
            this.sharedService.toasterMessage('error', 'Something Wrong!');
        });
    }


    /**
     * Dates format to iso
     * @param ele
     * @returns
     */
    public dateFormatToISO(ele) {
        if (ele) {
            const dateConversion = new Date(ele).toISOString();
            return dateConversion;
        }
    }

    /**
     * Editing dashboard crm component
     * @param item
     */
    public editing(item) {
        this.router.navigate(['auth/loclist', item['LocationID']]);
    }

    /**
     * Deleting dashboard crm component
     * @param Item
     */
    public deleting(Item) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '450px',
            data: { name: 'Delete Location', confirm: 'Yes', type: `Location - ${Item['location_name']}` }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 'Yes') {
                const payload = {
                    'LocationID': Item['LocationID']
                };
                this.sharedService.send(WebApiURL.dashBoard.deleteLocation, payload).subscribe((data) => {
                    if (data['status'] === false) {
                        this.sharedService.toasterMessage('error', 'Something Wrong!');
                    } else {
                        this.sharedService.toasterMessage('success', 'Deleted Successfully');
                    }
                }, (error) => {
                    console.log(error);
                    this.sharedService.toasterMessage('error', 'Something Wrong!');
                });
            }
        });
    }

    /**
     * Editing location
     * @param item
     */
    public editingLocation(item) {
        this.router.navigate(['auth/addNewLocation/Edit', item['LocationID']]);
    }
}
