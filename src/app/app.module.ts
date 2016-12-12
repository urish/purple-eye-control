import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { PurpleEyeService } from './purple-eye.service';
import { ImuViewComponent } from './imu-view.component';
import { PurpleEyeMovesService } from './purple-eye-moves.service';

@NgModule({
  declarations: [
    AppComponent,
    ImuViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
  ],
  providers: [PurpleEyeService, PurpleEyeMovesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
