import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IMyDpOptions } from 'mydatepicker';
import { WebApiURL } from '../../shared/WebApiNames';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatTableDataSource } from '@angular/material';

/**
 * Component
 */
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportsComponent implements OnInit, AfterViewInit {
  public report: FormGroup;
  public reportNames: Array<any> = [];
  public ReportName: any;
  public dateVsl: Date = new Date();
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    disableUntil: { year: 2019, month: 1, day: 1 },
    disableSince: { year: this.dateVsl.getFullYear(), month: this.dateVsl.getMonth() + 1, day: this.dateVsl.getDate() + 1 }
  };
  public placeholder: string = 'DD/MM/YYYY';
  public reportModel: any = {
    Rname: '',
    Lname: ''
  };
  public reportBool: boolean = false;

  public displayedColumns: string[] = [];
  public dataSource: any = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private sessionData: Array<any> = [];
  constructor(private shared: SharedService) { }

  /**
   * on init
   */
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.shared.setTitle({ msg1: 'Reports' });
    this.sessionData = this.shared.getSessionData();
    this.initForm();
    this.getReportDetails();
  }

  /**
   * after view init
   */
  ngAfterViewInit() { }

  /**
   * Reports change
   * @param evt
   * @param type
   */
  public reportChange(evt, type) {
    if (evt) {
      if (type === 'report') {
        this.reportModel.Rname = evt.ReportName;
      } else if (type === 'loc') {
        this.reportModel.Lname = evt.location_name;
      }
    }
  }

  /**
   * Shows report
   */
  public showReport() {
    const payLoad = JSON.parse(JSON.stringify(this.report['value']));
    let dateValue_1 = '', dateValue_2 = '';
    if (payLoad['StartTime']) {
      dateValue_1 = this.shared.changeDateFormat(1, payLoad.StartTime.jsdate, '-');
    }
    if (payLoad['EndTime']) {
      dateValue_2 = this.shared.changeDateFormat(1, payLoad.EndTime.jsdate, '-');
    }
    payLoad['StartTime'] = dateValue_1;
    payLoad['EndTime'] = dateValue_2;
    this.shared.send(WebApiURL.dashBoard.getReportData, payLoad)
      .subscribe((res) => {
        if (res.hasOwnProperty('status') && !res.status) {
          this.shared.toasterMessage('error', res.message);
        } else {
          this.reportBool = true;
          this.generateTables(res);
          this.shared.toasterMessage('success', 'Generated successfully.');
        }
      }, (error) => {
        console.log(error);
        this.shared.toasterMessage('error', error.statusText);
      });
  }

  public downloadReport() {
    const payLoad = JSON.parse(JSON.stringify(this.report['value']));
    let dateValue_1 = '', dateValue_2 = '';
    if (payLoad['StartTime']) {
      dateValue_1 = this.shared.changeDateFormat(1, payLoad.StartTime.jsdate, '-');
    }
    if (payLoad['EndTime']) {
      dateValue_2 = this.shared.changeDateFormat(1, payLoad.EndTime.jsdate, '-');
    }
    payLoad['StartTime'] = dateValue_1;
    payLoad['EndTime'] = dateValue_2;
    this.shared.send(WebApiURL.dashBoard.downloadReports, payLoad)
      .subscribe((res) => {
        if (res.hasOwnProperty('status') && !res.status) {
          this.shared.toasterMessage('error', res.message);
        } else {
          this.shared.toasterMessage('success', 'Generated successfully.');
        }
      }, (error) => {
        if (error.status === 200) {
          this.downloadCSV(error.error.text);
        } else {
          console.log(error);
          this.shared.toasterMessage('error', error.statusText);
        }
      });
  }

  /**
   * Generates tables
   * @param data
   */
  private generateTables(data) {
    const keys = Object.keys(data[0]);
    this.displayedColumns = keys;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
	 * Inits form
	 */
  private initForm() {
    this.report = new FormGroup({
      UserID: new FormControl(this.sessionData['UserID'] ? this.sessionData['UserID'] : ''),
      ReportID: new FormControl(null, [Validators.required]),
      LocationID: new FormControl(null, [Validators.required]),
      StartTime: new FormControl(null),
      EndTime: new FormControl(null)
    });
  }

  // Calling this function set a new placeholder text
  private changePlaceholder() {
    this.placeholder = 'DD/MM/YYYY';
  }

  /**
	 * Gets location details
	 */
  private getReportDetails() {
    const payload = {
      'UserID': this.sessionData['UserID']
    };
    this.shared.send(WebApiURL.dashBoard.getReports, payload).subscribe((res) => {
      console.log(res);
      this.reportNames = res;
    }, (error) => {
      console.log(error);
      this.shared.toasterMessage('error', error.statusText);
    });
  }

  private downloadCSV(dataObj) {
    let data, filename, link;
    let csv = dataObj;
    if (csv === null) { return; }

    filename = `${this.reportModel.Rname}_${this.reportModel.Lname}.csv`;

    if (!csv.match(/^data:text\/csv/i)) {
      csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
    this.shared.toasterMessage('success', 'Generated successfully.');
  }

}
