"use strict";

import { sphere, cube } from "./data.js";

// main shape object for one 3dc shape
class Model {
    // we're going to transform our 3d shape to 2d and store here
    perspX = [];
    perspY = [];
    // camera location
    cam = [0, 0, -500];
    // viewing angle
    H = Math.tan(Math.PI / 4);

    constructor(obj, SQ_SIZE) {
        // import data
        this.X = obj.X;
        this.Y = obj.Y;
        this.Z = obj.Z;
        this.lines = obj.lines;

        this.SQ_SIZE = SQ_SIZE;
    }

    /* 3d -> 2d transformation */
    perspective() {
        this.perspX = [];
        this.perspY = [];
        for (let i = 0; i < this.X.length; i++) {
            this.perspX.push(
                ((this.SQ_SIZE / this.H) * (this.X[i] - this.cam[0])) /
                    (this.Z[i] - this.cam[2]) -
                    this.cam[0] +
                    this.SQ_SIZE / 2
            );
            this.perspY.push(
                ((this.SQ_SIZE / this.H) * (this.Y[i] - this.cam[1])) /
                    (this.Z[i] - this.cam[2]) -
                    this.cam[1] +
                    this.SQ_SIZE / 2
            );
        }
    }

    // to translate, simply add dx (or dy or dz) to each point
    translate(dx, dy, dz) {
        for (let i = 0; i < this.X.length; i++) {
            this.X[i] += dx;
            this.Y[i] += dy;
            this.Z[i] += dz;
        }
    }

    // find bounding box of object and slide the object to screen center. then return the translation values for each dim, so that an object can be slid to center, worked on, then slid back (makes the math easy)
    center() {
        let smallestX;
        let smallestY;
        let smallestZ;
        let biggestX;
        let biggestY;
        let biggestZ;
        for (let i = 0; i < this.X.length; i++) {
            if (this.X[i] > biggestX || biggestX == null) biggestX = this.X[i];
            else if (this.X[i] < smallestX || smallestX == null)
                smallestX = this.X[i];

            if (this.Y[i] > biggestY || biggestY == null) biggestY = this.Y[i];
            else if (this.Y[i] < smallestY || smallestY == null)
                smallestY = this.Y[i];

            if (this.Z[i] > biggestZ || biggestZ == null) biggestZ = this.Z[i];
            else if (this.Z[i] < smallestZ || smallestZ == null)
                smallestZ = this.Z[i];
        }

        let dX = -(biggestX + smallestX) / 2;
        let dY = -(biggestY + smallestY) / 2;
        let dZ = -(biggestZ + smallestZ) / 2;

        this.translate(dX, dY, dZ);
        return [-dX, -dY, -dZ];
    }

    centerOnScreen() {
        this.center();
        this.translate(this.SQ_SIZE / 2, this.SQ_SIZE / 2);
    }

    // simplified matrix multiplicaiton to rotate 3d object in 3d
    rotateY(angle) {
        let backupX = this.X.slice();
        let backupZ = this.Z.slice();

        let cos = Math.cos(angle);
        let sin = Math.sin(angle);

        let resTrans = this.center();
        for (let i = 0; i < this.X.length; i++) {
            this.X[i] = cos * backupX[i] + -sin * backupZ[i];
            this.Z[i] = sin * backupX[i] + cos * backupZ[i];
        }
        this.translate(resTrans[0], resTrans[1], resTrans[2]);
    }

    rotateX(angle) {
        let backupY = this.Y.slice();
        let backupZ = this.Z.slice();

        let cos = Math.cos(angle);
        let sin = Math.sin(angle);

        let resTrans = this.center();
        for (let i = 0; i < this.X.length; i++) {
            this.Y[i] = cos * backupY[i] + -sin * backupZ[i];
            this.Z[i] = sin * backupY[i] + cos * backupZ[i];
        }
        this.translate(resTrans[0], resTrans[1], resTrans[2]);
    }

    scale() {
        let smallestX = null;
        let smallestY = null;
        let smallestZ = null;
        let biggestX = null;
        let biggestY = null;
        let biggestZ = null;
        for (let i = 0; i < this.X.length; i++) {
            if (this.X[i] > biggestX || biggestX == null) biggestX = this.X[i];
            else if (this.X[i] < smallestX || smallestX == null)
                smallestX = this.X[i];

            if (this.Y[i] > biggestY || biggestY == null) biggestY = this.Y[i];
            else if (this.Y[i] < smallestY || smallestY == null)
                smallestY = this.Y[i];

            if (this.Z[i] > biggestZ || biggestZ == null) biggestZ = this.Z[i];
            else if (this.Z[i] < smallestZ || smallestZ == null)
                smallestZ = this.Z[i];
        }

        for (let i = 0; i < this.X.length; i++) {
            this.X[i] *= this.SQ_SIZE / 2 / (biggestX - smallestX);
            this.Y[i] *= this.SQ_SIZE / 2 / (biggestY - smallestY);
            this.Z[i] *= this.SQ_SIZE / 2 / (biggestZ - smallestZ);
        }
    }
}

class View {
    constructor(model, SQ_SIZE) {
        // setup canvas
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = this.canvas.height = SQ_SIZE;

        this.model = model;

        this.SQ_SIZE = SQ_SIZE;
    }

    drawWireframe() {
        this.ctx.clearRect(0, 0, this.SQ_SIZE, this.SQ_SIZE);

        // // center dot
        // this.ctx.fillStyle = "rgb(0,0,0)";
        // this.ctx.beginPath();
        // this.ctx.arc(
        //     this.SQ_SIZE / 2,
        //     this.SQ_SIZE / 2,
        //     10,
        //     0,
        //     2 * Math.PI,
        //     false
        // );
        // this.ctx.fill();

        for (let i = 0; i < this.model.lines.length; i++) {
            // this.ctx.fillStyle = Math.floor(Math.random() * 16777215).toString(
            //     16
            // );
            this.ctx.beginPath();
            this.ctx.moveTo(
                this.model.perspX[this.model.lines[i][0]],
                this.model.perspY[this.model.lines[i][0]]
            );
            for (let j = 1; j < this.model.lines[i].length; j++) {
                this.ctx.lineTo(
                    this.model.perspX[
                        this.model.lines[i][j % this.model.lines[i].length]
                    ],
                    this.model.perspY[
                        this.model.lines[i][j % this.model.lines[i].length]
                    ]
                );
            }
            this.ctx.stroke();
        }

        // for (let i = 0; i < this.model.X.length; i++) {
        //     this.ctx.fillRect(this.model.perspX[i], this.model.perspY[i], 1, 1);
        // }
    }
}

class Controller {
    constructor() {
        this.SQ_SIZE = 600;

        /* instantiate model */
        this.model = new Model(sphere, this.SQ_SIZE);
        // this.model = new Model(cube, this.SQ_SIZE);

        // instantiate view
        this.view = new View(this.model, this.SQ_SIZE);

        // prepare model
        this.model.center();
        this.model.scale();

        this.model.rotateY(Math.PI / 8);

        // call our update function every x milliseconds
        setInterval(() => {
            this.update();
        }, 10);
    }

    update() {
        this.model.rotateY(Math.PI / 1024);
        this.model.rotateX(Math.PI / 512);
        this.model.perspective();

        this.view.drawWireframe();
    }
}

const controller = new Controller();
