import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { DashboardCrmComponent } from '../dashboard-crm/dashboard-crm.component';
import { LocListComponent } from '../dashboard-crm/loc-list/loc-list.component';
import { ReportsComponent } from '../dashboard-crm/reports/reports.component';
import { AddLocationFormComponent } from '../dashboard-crm/add-location-form/add-location-form.component';
import { NotificationsPanelComponent } from '../dashboard-crm/notifications-panel/notifications-panel.component';

export const appRoutes: Routes = [
    {
        path: '', component: AuthComponent,
        children: [
            { path: 'dashboard', component: DashboardCrmComponent },
            { path: 'loclist/:LocID', component: LocListComponent },
            { path: 'reports', component: ReportsComponent },
            { path: 'addNewLocation/:mode/:LocID', component: AddLocationFormComponent },
            { path: 'notification', component: NotificationsPanelComponent }
        ]
    }, {
        path: 'auth', component: AuthComponent
    }];
