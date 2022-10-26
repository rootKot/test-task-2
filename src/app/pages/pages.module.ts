import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardModule } from './dashboard/dashboard.module';


@NgModule({
  declarations: [
  ],
  exports: [
    DashboardModule
  ],
  imports: [
    CommonModule,
    DashboardModule
  ]
})
export class PagesModule { }
