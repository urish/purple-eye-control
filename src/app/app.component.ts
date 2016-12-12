import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { PurpleEyeService, ImuMeasurement, ServoPositions } from './purple-eye.service';
import { PurpleEyeMovesService } from './purple-eye-moves.service';

@Component({
  selector: 'pe-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  connected = false;
  batteryLevel = 0;
  imu: Observable<ImuMeasurement>;
  servoPositions: ServoPositions;

  constructor(private purpleEye: PurpleEyeService, private purpleEyeMoves: PurpleEyeMovesService) {
    this.imu = purpleEye.imu;
  }

  ngOnInit() {
    this.purpleEye.batteryLevel.subscribe(level => {
      this.batteryLevel = level;
    });
    this.purpleEye.connectionState.subscribe(connected => {
      this.connected = connected;
    });
    this.purpleEye.servoPositions.subscribe(newPositions => {
      this.servoPositions = newPositions;
    });
  }

  connect() {
    this.purpleEye.connect();
  }

  get batteryLevelClass() {
    if (this.batteryLevel > 85) {
      return 'fa fa-battery-full';
    } else if (this.batteryLevel > 65) {
      return 'fa fa-battery-three-quarters';
    } else if (this.batteryLevel > 40) {
      return 'fa fa-battery-half';
    } else if (this.batteryLevel > 20) {
      return 'fa fa-battery-quarter';
    } else {
      return 'fa fa-battery-empty';
    }
  }

  stand() {
    this.purpleEyeMoves.stand();
  }

  spread() {
    this.purpleEyeMoves.spread();
  }

  rest() {
    this.purpleEyeMoves.rest();
  }

  dance() {
    this.purpleEyeMoves.dance();
  }

  shimmy() {
    this.purpleEyeMoves.shimmy();
  }

  stopMoving() {
    this.purpleEyeMoves.stopMoving();
  }

  updateServos() {
    this.purpleEye.writeServos(this.servoPositions.rightLeg, this.servoPositions.rightFoot, this.servoPositions.leftFoot,
     this.servoPositions.leftLeg);
  }

  get resting() {
    return this.servoPositions.rightLeg === 0;
  }
}
