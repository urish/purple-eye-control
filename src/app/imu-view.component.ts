import { Component, ElementRef, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ImuMeasurement } from './purple-eye.service';

import * as THREE from 'three';

import 'imports-loader?THREE=three!three/examples/js/loaders/ColladaLoader';

@Component({
    selector: 'pe-imu-view',
    template: ''
})
export class ImuViewComponent implements OnInit {
    @Input() imu: Observable<ImuMeasurement>;

    private scene: THREE.Scene;
    private camera: THREE.Camera;
    private renderer: THREE.WebGLRenderer;
    private robotModel: THREE.Mesh;

    constructor(private element: ElementRef) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 20000);
        this.camera.position.set(60, 50, 0);
        this.camera.lookAt(this.scene.position);
        this.scene.add(this.camera);

        const light = new THREE.AmbientLight(0xffffff);
        light.position.set(50, 50, 0);
        this.scene.add(light);
        const loader = new (THREE as any).ColladaLoader();
        loader.options.convertUpAxis = true;
        loader.load('./assets/purple-eye.dae', (collada) => {
            this.robotModel = collada.scene;
            this.robotModel.scale.set(10, 10, 10);
            (this.robotModel.getObjectByName('Eyeball').children[0] as THREE.Mesh).geometry.computeVertexNormals();
            this.scene.add(this.robotModel);
        });

        const plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(100, 100),
            new THREE.MeshPhongMaterial({ color: 0x404040, specular: 0x101010 })
        );
        plane.rotation.x = -Math.PI / 2;
        plane.receiveShadow = true;
        this.scene.add(plane);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(300, 300);
    }

    ngOnInit() {
        this.element.nativeElement.appendChild(this.renderer.domElement);
        this.animate();
        this.imu.subscribe((measurement: ImuMeasurement) => {
            if (this.robotModel) {
                const { acceleration } = measurement;
                const gVector = new THREE.Vector3(acceleration.z, -acceleration.y, -acceleration.x);
                gVector.applyAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI);
                const yAxis = new THREE.Vector3(0, 1, 0);
                this.robotModel.quaternion.setFromUnitVectors(yAxis, gVector.clone().normalize());
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}
