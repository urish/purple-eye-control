import { Injectable } from '@angular/core';

import { PurpleEyeService } from './purple-eye.service';

@Injectable()
export class PurpleEyeMovesService {
    dancing = false;
    shimming = false;
    contorting = false;

    constructor(private purpleEye: PurpleEyeService) {
    }

    private _spread() {
        return this.purpleEye.writeServos(110, 94, 86, 70);
    }

    private _stand() {
        return this.purpleEye.writeServos(90, 90, 90, 90);
    }

    spread() {
        this.stopMoving();
        return this._spread();
    }

    stand() {
        this.stopMoving();
        return this._stand();
    }

    rest() {
        this.stopMoving();
        return this.purpleEye.writeServos(0, 0, 0, 0)
            .then(() => console.log('Rest successful'));
    }

    shimmy() {
        let standing = true;
        this.stopMoving();
        this.shimming = true;

        const step = () => {
            const promise = standing ? this._stand() : this._spread();
            standing = !standing;
            promise.then(() => {
                if (this.shimming) {
                    setTimeout(step, 150);
                }
            });
        };

        step();
    }

    async contort() {
        this.stopMoving();
        this.contorting = true;
        let currentIndex = 0;
        const contortSteps = [
            { rightLegValue: 60, rightFootValue: 60, leftFootValue: 60, leftLegValue: 60 },
            { rightLegValue: 80, rightFootValue: 80, leftFootValue: 80, leftLegValue: 80 },
            { rightLegValue: 100, rightFootValue: 100, leftFootValue: 100, leftLegValue: 100 },
            { rightLegValue: 120, rightFootValue: 120, leftFootValue: 120, leftLegValue: 120 },
        ];

        while (this.contorting) {
            await this.purpleEye.writeServos(
                contortSteps[currentIndex].rightLegValue,
                contortSteps[currentIndex].rightFootValue,
                contortSteps[currentIndex].leftFootValue,
                contortSteps[currentIndex].leftLegValue
            );

            currentIndex = (currentIndex + 1) % contortSteps.length;
            await new Promise(res => setTimeout(res, 150));
        }
    }

    dance() {
        let delta = 0, direction = 1;
        this.stopMoving();
        this.dancing = true;

        const danceStep = () => {
            delta += direction * 2;
            if (delta > 20 || delta < -20) {
                direction = -direction;
            }
            this.purpleEye.writeServos(90 + delta, 90 + delta, 90 + delta, 90 + delta)
                .then(() => {
                    if (this.dancing) {
                        setTimeout(danceStep, 10);
                    }
                });
        };

        danceStep();
    }

    stopMoving() {
        this.dancing = false;
        this.shimming = false;
        this.contorting = false;
    }
}
