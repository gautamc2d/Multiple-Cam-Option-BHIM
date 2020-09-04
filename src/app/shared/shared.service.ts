import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { WebApiURL, serverURL } from './WebApiNames';
import { Injectable, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SharedService implements OnInit {

  public URLItems: any = WebApiURL;
  public title: any = new BehaviorSubject({ msg1: 'Title', msg2: '' });
  public filterValue: any = new BehaviorSubject('');
  public hideSearchBar: any = new BehaviorSubject(true);
  public hideSelecthBar: any = new BehaviorSubject(true);
  public chartData: any = new BehaviorSubject([]);
  public notificationsData: BehaviorSubject<any> = new BehaviorSubject([]);

  private sessionDetails: any = {};

  private headerOptions: HttpHeaders = new HttpHeaders();
  private URL: any;
  constructor(private http: HttpClient,
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.headerOptions = this.headerOptions.append('Access-Control-Allow-Origin', '*');
    this.headerOptions = this.headerOptions.append('Accept', 'text/html');
    this.headerOptions = this.headerOptions.append('zumo-api-version', '2.0.0');
  }
  /**
   * Gets shared service
   * @param url
   * @returns get
   */
  get(url: string): Observable<any> {
    this.URL = url;
    return this.http.get(`${serverURL.URL}${this.URL}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Sends shared service
   * @param url
   * @param dataObj
   * @returns send
   */
  send(url: string, dataObj: any): Observable<any> {
    this.URL = url;
    const options = { headers: this.headerOptions };
    return this.http.post(`${serverURL.URL}${this.URL}`, dataObj).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Sends shared service
   * @param url
   * @param dataObj
   * @returns send
   */
  update(url: string, dataObj: any): Observable<any> {
    this.URL = url;
    const options = { headers: this.headerOptions };
    return this.http.put(`${serverURL.URL}${this.URL}`, dataObj).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Extracts response
   * @param res
   * @returns
   */
  extractResponse(res: HttpResponse<any>) {
    return res || [];
  }

  /**
   * Sets title
   * @param title
   */
  public setTitle(title: {}) {
    this.title.next(title);
  }

  /**
   * Gets session data
   * @returns
   */
  public getSessionData() {
    const sessionObj = localStorage.getItem('userData');
    let userObject;
    if (sessionObj) {
      userObject = JSON.parse(sessionObj);
      this.sessionDetails = userObject;
      return userObject;
    }
  }

  /**
   * Access levels
   * @returns
   */
  public accessLevels() {
    const levelData = this.getSessionData();
    const accessLevelsArr = []; let levels = {};
    for (let i = 0; i < levelData['AccessLevel']; i++) {
      levels = {
        id: i + 1,
        label: `Level ${i + 1}`
      };
    }
    accessLevelsArr.push(levels);
    return {
      data: accessLevelsArr,
      level: levelData['AccessLevel']
    };
  }

  /**
   * Svgs registry
   * @param iconName
   * @param iconURL
   * @returns
   */
  public svgRegistry(iconName, iconURL) {
    return this.matIconRegistry.addSvgIcon(iconName, this.domSanitizer.bypassSecurityTrustResourceUrl(iconURL));
  }

  /**
   * Toasters message
   * @param [type]
   * @param [message]
   * @returns
   */
  public toasterMessage(type?: string, message?: string) {
    let toasterMsg;
    switch (type) {
      case 'success':
        toasterMsg = this.toastr.success(message);
        break;
      case 'error':
        toasterMsg = this.toastr.error(message);
        break;
      case 'info':
        toasterMsg = this.toastr.info(message);
        break;
      case 'warning':
        toasterMsg = this.toastr.warning(message);
        break;
      default:
        toasterMsg = this.toastr.show('This is Message');
        break;
    }
    return toasterMsg;
  }

  /**
   * Sets filter
   * @param filterValue
   */
  public setFilter(filterValue) {
    this.filterValue.next(filterValue);
  }

  /**
   * Hides search
   * @param type
   */
  public hideSearch(type: boolean) {
    this.hideSearchBar.next(type);
  }

  /**
   * Changes date format
   * @param type
   * @param date
   */
  public changeDateFormat(type, dateval, seperate) {
    if (dateval) {
      const d = new Date(dateval);
      let month = '' + (d.getMonth() + 1), day = '' + d.getDate();
      const year = d.getFullYear();
      let dateType;
      if (month.length < 2) {
        month = '0' + month;
      }
      if (day.length < 2) {
        day = '0' + day;
      }

      switch (type) {
        case 1:
          dateType = [year, month, day].join(seperate);
          break;
        case 2:
          dateType = [day, month, year].join(seperate);
          break;
        default:
          dateType = [day, month, year].join('/');
          break;
      }
      return dateType;
    }
  }

  /**
     * Gets location list
     */
  public getNotifications() {
    const payload = {
      'UserID': this.sessionDetails['UserID']
    };
    this.send(WebApiURL.dashBoard.getnotification, payload).subscribe((data) => {
      if (data['status'] === false) {
        this.toasterMessage('error', 'No Data Available');
      } else {
        this.notificationsData.next(data);
      }
    }, (error) => {
      console.log(error);
      this.toasterMessage('error', 'Something Wrong!');
    });
  }

  /**
   * Handles error
   * @param error
   * @returns
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(error);
  }
}
