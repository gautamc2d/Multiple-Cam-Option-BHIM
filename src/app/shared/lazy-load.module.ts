import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './Authentication/AuthGuard';

const routes: Routes = [
    {path: 'auth', loadChildren: '../auth/auth.module#AuthModule', canActivate: [AuthGuard]},
    {path: 'login', loadChildren: '../pages/login/login.module#LoginModule'},
    {path: '**', redirectTo: 'login'},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class LazyLoadModule { }
