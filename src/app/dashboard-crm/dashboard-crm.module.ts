import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardCrmComponent } from './dashboard-crm.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import {
  MatPaginatorModule, MatFormFieldModule, MatInputModule,
  MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatSelectModule,
  MatSortModule, MatProgressSpinnerModule, MatDialogModule, MatDialogConfig
} from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { LocListComponent } from './loc-list/loc-list.component';
import { NotificationsPanelComponent } from './notifications-panel/notifications-panel.component';
import { AddLocationFormComponent } from './add-location-form/add-location-form.component';
import { ReportsComponent } from './reports/reports.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MyDatePickerModule } from 'mydatepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PopoverModule } from 'ngx-smart-popover';
import { HighchartsChartModule } from 'highcharts-angular';
import {MatTabsModule} from '@angular/material/tabs';
// import { LiveCamComponent } from './live-cam/live-cam.component';
import { DialogContentComponent } from './dialog-content/dialog-content.component'; //modal

export const appRoutes: Routes = [
  { path: '', component: DashboardCrmComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    FlexLayoutModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    NgSelectModule,
    MatSortModule,
    MyDatePickerModule,
    NgxDatatableModule,
    PopoverModule,
    HighchartsChartModule,
    MatTabsModule,
    MatDialogModule
  ],
  declarations: [
    DashboardCrmComponent,
    LocListComponent,
    NotificationsPanelComponent,
    AddLocationFormComponent,
    ReportsComponent,
    // LiveCamComponent,
    DialogContentComponent,
  ],
  entryComponents: [
    DialogContentComponent,
  ],
  exports: [],
  providers: [
    MatDatepickerModule
  ]
})
export class DashboardCrmModule { }
