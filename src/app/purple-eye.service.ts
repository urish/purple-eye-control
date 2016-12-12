import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const BATTERY_SERVICE = 0x180F;
const IMU_SERVICE = 0xff08;
const IMU_CHARACTERISTIC = 0xff09;
const SERVO_SERVICE = 0x5100;
const SERVO_CHARACTERISTIC = 0x5200;

export interface XYZVector {
    x: number;
    y: number;
    z: number;
}

export class ImuMeasurement {
    acceleration: XYZVector;
    compass: XYZVector;
    gyroscope: XYZVector;
}

@Injectable()
export class PurpleEyeService {
    private device: BluetoothDevice;
    private gattServer: BluetoothRemoteGATTServer;
    private servoCharacteristic: BluetoothRemoteGATTCharacteristic;

    imu = new BehaviorSubject<ImuMeasurement>(null);
    batteryLevel = new BehaviorSubject<number>(null);
    connectionState = new BehaviorSubject<boolean>(false);

    constructor() {
    }

    async connect() {
        if (!this.device) {
            this.device = await navigator.bluetooth.requestDevice({
                filters: [{ services: [SERVO_SERVICE] }],
                optionalServices: [BATTERY_SERVICE, IMU_SERVICE]
            });
        }

        this.device.addEventListener('gattserverdisconnected', listener => {
            this.connectionState.next(false);
        });

        console.log('Found: ' + this.device.name);
        console.log('Connecting to GATT Server...');
        this.gattServer = await this.device.gatt.connect();

        const servoService = await this.gattServer.getPrimaryService(SERVO_SERVICE);
        this.servoCharacteristic = await servoService.getCharacteristic(SERVO_CHARACTERISTIC);

        const batteryService = await this.gattServer.getPrimaryService(BATTERY_SERVICE);
        const batteryCharacteristic = await batteryService.getCharacteristic('battery_level');
        const batteryValueInitial = await batteryCharacteristic.readValue();
        this.batteryLevel.next(batteryValueInitial.getUint8(0));
        batteryCharacteristic.addEventListener('characteristicvaluechanged', (e) => {
            this.batteryLevel.next(batteryCharacteristic.value.getUint8(0));
        });
        await batteryCharacteristic.startNotifications();

        const imuService = await this.gattServer.getPrimaryService(IMU_SERVICE);
        const imuCharacteristic = await imuService.getCharacteristic(IMU_CHARACTERISTIC);
        imuCharacteristic.addEventListener('characteristicvaluechanged', e => {
            this.imu.next(parseImuMeasurement(imuCharacteristic.value));
        });
        await imuCharacteristic.startNotifications();

        this.connectionState.next(true);
    }

    writeServos(rightLegValue: number, rightFootValue: number, leftFootValue: number, leftLegValue: number) {
        const view = new Uint8Array([rightLegValue, rightFootValue, leftFootValue, leftLegValue]);
        return this.servoCharacteristic.writeValue(view);
    }
}

function parseImuMeasurement(value: DataView): ImuMeasurement {
    return {
        acceleration: {
            x: value.getInt16(0, true),
            z: value.getInt16(2, true),
            y: value.getInt16(4, true)
        },
        compass: {
            x: value.getInt16(6, true),
            z: value.getInt16(8, true),
            y: value.getInt16(10, true)
        },
        gyroscope: {
            x: value.getInt16(12, true),
            z: value.getInt16(14, true),
            y: value.getInt16(16, true)
        }
    };
}
