import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// import { LiveCamComponent } from '../dashboard-crm/live-cam/live-cam.component';
import { DashboardCrmComponent } from '../dashboard-crm/dashboard-crm.component';
import { AuthComponent } from '../auth/auth.component';


const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [{
      path: 'dashboard',
      component: DashboardCrmComponent,
      // children: [{
      //   path: 'live_cam',
      //   component: LiveCamComponent,
      // }]
    }]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
