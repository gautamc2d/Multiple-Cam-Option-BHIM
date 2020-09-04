import { AuthModule } from './../auth/auth.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from './shared.service';

@NgModule({
  imports: [
    CommonModule,
    AuthModule
  ],
  declarations: [],
  providers: [SharedService]
})
export class SharedModule { }
