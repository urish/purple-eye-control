import { Injectable } from '@angular/core';

import { PurpleEyeService } from './purple-eye.service';

@Injectable()
export class PurpleEyeMovesService {
    dancing = false;
    shimming = false;

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
    }
}
