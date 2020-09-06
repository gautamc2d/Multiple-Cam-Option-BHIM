import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { WebApiURL } from '../../shared/WebApiNames';
import { ActivatedRoute, Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from '../dialog-content/dialog-content.component';
import JSMpeg from 'jsmpeg-player';

@Component({
  selector: 'app-loc-list',
  templateUrl: './loc-list.component.html',
  styleUrls: ['./loc-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LocListComponent implements OnInit, OnDestroy , AfterViewInit{

  public batteryData: any;
  public batCount: number = 0;
  public mode: string;
  public locID: number;
  public userData: Object = {};
  public locationData: any;
  public locationAddress: Object = {};
  public enableChart: boolean = false;
  public chartDataObj: any = [];
  public Highcharts: typeof Highcharts = Highcharts;
  public chartConstructor = 'chart';
  public chartOptions: Highcharts.Options = {
    series: []
  };

  private mySeries: any = [];
  private xAxisCat: Array<any> = [];
  private voltageValues: Array<any> = [];
  private tempValues: Array<any> = [];
  private cell: number = 0;
  /**
   * Creates an instance of loc list component.
   * @param sharedService
   * @param acRoute
   */

   //camera
  @ViewChild('streaming') streamingcanvas: ElementRef;

  player:any;

  paused: boolean;

  closeResult = '';


  constructor(private sharedService: SharedService,
    private acRoute: ActivatedRoute,
    private modalService: NgbModal,
    // private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.userData = this.sharedService.getSessionData();
    this.acRoute.params.subscribe(data => {
      this.locID = Number(data['LocID']);
    });
    this.getLocationDetails();
    this.getBatteryDetails();
    this.getTotalBatteriesCount();
    this.initChart();

    //camera
          this.player = new JSMpeg.Player('ws://45.79.121.63:8082/s', {
        canvas: this.streamingcanvas.nativeElement, autoplay: true, audio: true
      });
      // setTimeout( () => {
      //   this.player.pause();
      //   console.log("is paused");
      //  }, 5000)
  }

  ngAfterViewInit() {
    setTimeout( () => {
        this.player.pause();
        console.log("is paused");
        }, 1000)
    }

  ngOnDestroy() { }

  /**
   * Gets number
   * @param num
   * @returns
   */
  public getNumber(num) {
    return new Array(num);
  }

  /**
   * Returns volt
   * @param index
   * @returns
   */
  public returnVolt(index) {
    let classval = 'color1';
    const voltObj = {
      value: 0,
      class: classval
    };
    if (this.batteryData && this.batCount) {
      if (index <= this.batCount) {
        if (this.batteryData['Voltage_Battery_' + index] < 10) {
          classval = 'color2';
        } else if (this.batteryData['Voltage_Battery_' + index] > 11 && this.batteryData['Voltage_Battery_' + index] < 25) {
          classval = 'color3';
        }
        voltObj['value'] = this.batteryData['Voltage_Battery_' + index];
        voltObj['class'] = classval;
      }
    }
    return voltObj;
  }

  public returnTemp(index) {
    if (this.batteryData && this.batCount) {
      if (index <= this.batCount) {
        return this.batteryData['Temp_Battery_' + index];
      }
    }
  }

  public showChart(index) {
    const payload = {
      'LocationID': this.locID,
      'CellID': Number(index),
      'DataLimit': 2
    };
    this.cell = Number(index);
    this.sharedService.send(WebApiURL.dashBoard.getChartData, payload).subscribe((data) => {
      this.enableChart = false;
      if (data['status'] === false) {
        this.sharedService.toasterMessage('error', 'No Data Available');
      } else {
        this.enableChart = true;
        this.chartDataObj = data;
        this.initChart();
      }
    }, (error) => {
      console.log(error);
      this.sharedService.toasterMessage('error', 'Something Wrong!');
    });
  }

  public initChart() {
    const chartOptions: Highcharts.Options = {};
    chartOptions.chart = { type: 'column', width: 550, height: 195 };
    chartOptions.title = { text: `Cell ${this.cell}` };
    chartOptions.tooltip = {
      shared: true
    };
    chartOptions.credits = {
      enabled: false
    };
    chartOptions.yAxis = {
      title: null
    };
    chartOptions.lang = { loading: 'Loading ...', noData: 'No data available, please try again' };
    chartOptions.noData = {
      style: { fontSize: '15px', color: 'gray' },
      position: { align: 'left' }
    };
    if (this.chartDataObj.length !== 0) {
      this.xAxisCat = []; this.voltageValues = []; this.tempValues = [];
      for (let ele = 0; ele < this.chartDataObj.length; ele++) {
        const dateTime = new Date(this.chartDataObj[ele]['Dev_TimeStamp']).toLocaleString();
        this.xAxisCat.push(dateTime);
        this.voltageValues.push(Number(this.chartDataObj[ele]['Voltage_Battery_' + this.cell]));
        this.tempValues.push(Number(this.chartDataObj[ele]['Temp_Battery_' + this.cell]));
      }
    }
    this.mySeries = [{
      name: 'Volatage',
      data: this.voltageValues
    }, {
      name: 'Temperature',
      data: this.tempValues
    }];
    if (this.xAxisCat.length > 0) {
      chartOptions.xAxis = {
        type: 'datetime',
        categories: this.xAxisCat,
        crosshair: true
      };
    }
    chartOptions.series = this.mySeries;
    this.chartOptions = chartOptions;
  }

  /**
	 * Gets location details
	 */
  private getLocationDetails() {
    const payload = {
      'UserID': this.userData['UserID']
    };
    this.sharedService.send(WebApiURL.dashBoard.dashBoardList, payload).subscribe((data) => {
      if (data.hasOwnProperty(status) && !data['status']) {
      } else {
        const result = JSON.parse(JSON.stringify(data));
        const index = result.filter(x => x.LocationID === this.locID);
        this.locationData = index[0];
        this.sharedService.setTitle({
          msg1: this.locationData['location_name'],
          msg2: new Date(this.batteryData['Updated_on']).toISOString()
        });
      }
    }, (error) => {
      console.log(error);
      this.sharedService.toasterMessage('error', 'Something Wrong!');
    });
  }

  private getBatteryDetails() {
    const payload = {
      'LocationID': this.locID
    };
    this.sharedService.send(WebApiURL.dashBoard.batteryDetails, payload).subscribe((data) => {
      if (data.hasOwnProperty(status) && !data['status']) {
      } else {
        this.batteryData = data;
        this.sharedService.setTitle({
          msg1: this.locationData['location_name'],
          msg2: new Date(this.batteryData['Updated_on']).toISOString()
        });
      }
    }, (error) => {
      console.log(error);
    });
  }

  private getTotalBatteriesCount() {
    const payload = {
      'LocationID': this.locID
    };
    this.sharedService.send(WebApiURL.dashBoard.totalBatteries, payload).subscribe((data) => {
      if (data.hasOwnProperty(status) && !data['status']) {
      } else {
        this.batCount = data[0]['TotalBatteries'];
      }
    }, (error) => {
      console.log(error);
    });
  }

  // private showcam() {
  //   this.router.navigate(['auth/live-cam']);
  // }

  // play(){
  //   this.player.play();
  //   this.paused = false;
  //   console.log("is playing");
    
  // }
  // pause(){
  //   this.player.pause();
  //   this.paused = true;
  //   console.log("is paused");

  // }
  // togglePlay(){
  //   return this.paused ? this.play() : this.pause();
  //   // return this.canvas.requestFullscreen();
  // }
  // fullScreen() {
  //   return this.canvas.requestFullscreen();

  // }
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

//modal
  openDialog(data) {

  if(data === 'One') {     
      this.dialog.open(DialogContentComponent, {data: {component: 'ws://45.79.121.63:8082/', cameraNum: data}, });      

  } 
  else if(data === 'Two') {

    this.dialog.open(DialogContentComponent, {data: {component: 'ws://45.79.121.63:8082/', cameraNum: data}, }); 

  }
  else if(data === 'Three') {

    this.dialog.open(DialogContentComponent, {data: {component: 'ws://45.79.121.63:8082/', cameraNum: data}, }); 

  }
    
  }

}

