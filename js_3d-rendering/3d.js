"use strict";

import { sphere, cube } from "./data.js";

// main shape object for one 3dc shape
function Model(obj, SQ_SIZE) {
    // import data
    this.X = obj.X;
    this.Y = obj.Y;
    this.Z = obj.Z;
    this.lines = obj.lines;

    // camera location
    let cam = [0, 0, -500];

    // viewing angle
    const H = Math.tan(Math.PI / 4);

    // we're going to transform our 3d shape to 2d and store here
    this.perspX = [];
    this.perspY = [];

    // 3d -> 2d transformation
    this.perspective = function () {
        this.perspX = [];
        this.perspY = [];
        for (let i = 0; i < this.X.length; i++) {
            this.perspX.push(
                ((SQ_SIZE / H) * (this.X[i] - cam[0])) / (this.Z[i] - cam[2]) -
                    cam[0] +
                    SQ_SIZE / 2
            );
            this.perspY.push(
                ((SQ_SIZE / H) * (this.Y[i] - cam[1])) / (this.Z[i] - cam[2]) -
                    cam[1] +
                    SQ_SIZE / 2
            );
        }
    };
    // to translate, simply add dx (or dy or dz) to each point
    this.translate = function (dx, dy, dz) {
        for (let i = 0; i < this.X.length; i++) {
            this.X[i] += dx;
            this.Y[i] += dy;
            this.Z[i] += dz;
        }
    };
    // find bounding box of object and slide the object to screen center. then return the translation values for each dim, so that an object can be slid to center, worked on, then slid back (makes the math easy)
    this.center = function () {
        let smallestX;
        let smallestY;
        let smallestZ;
        let biggestX;
        let biggestY;
        let biggestZ;
        for (let i = 0; i < this.X.length; i++) {
            if (this.X[i] > biggestX || biggestX == null) biggestX = this.X[i];
            else if (this.X[i] < smallestX || smallestX == null) smallestX = this.X[i];

            if (this.Y[i] > biggestY || biggestY == null) biggestY = this.Y[i];
            else if (this.Y[i] < smallestY || smallestY == null) smallestY = this.Y[i];

            if (this.Z[i] > biggestZ || biggestZ == null) biggestZ = this.Z[i];
            else if (this.Z[i] < smallestZ || smallestZ == null) smallestZ = this.Z[i];
        }

        let dX = -smallestX - (biggestX - smallestX) / 2;
        let dY = -smallestY - (biggestY - smallestY) / 2;
        let dZ = -smallestZ - (biggestZ - smallestZ) / 2;

        this.translate(dX, dY, dZ);
        return [-dX, -dY, -dZ];
    };
    // simplified matrix multiplicaiton to rotate 3d object in 3d
    this.rotateY = function (dTheta) {
        let backupX = this.X.slice();
        let backupY = this.Y.slice();
        let backupZ = this.Z.slice();

        let cs = Math.cos(dTheta);
        let sn = Math.sin(dTheta);

        let resTrans = this.center();
        for (let i = 0; i < this.X.length; i++) {
            this.X[i] = cs * backupX[i] + -sn * backupZ[i];
            this.Z[i] = sn * backupX[i] + cs * backupZ[i];
        }
        this.translate(resTrans[0], resTrans[1], resTrans[2]);
    };
    this.rotateX = function (dTheta) {
        let backupX = this.X.slice();
        let backupY = this.Y.slice();
        let backupZ = this.Z.slice();

        let cs = Math.cos(dTheta);
        let sn = Math.sin(dTheta);

        let resTrans = this.center();
        for (let i = 0; i < this.X.length; i++) {
            this.Y[i] = cs * backupY[i] + -sn * backupZ[i];
            this.Z[i] = sn * backupY[i] + cs * backupZ[i];
        }
        this.translate(resTrans[0], resTrans[1], resTrans[2]);
    };
    this.scale = function () {
        let smallestX;
        let smallestY;
        let smallestZ;
        let biggestX;
        let biggestY;
        let biggestZ;
        for (let i = 0; i < this.X.length; i++) {
            if (this.X[i] > biggestX || biggestX == null) biggestX = this.X[i];
            else if (this.X[i] < smallestX || smallestX == null) smallestX = this.X[i];

            if (this.Y[i] > biggestY || biggestY == null) biggestY = this.Y[i];
            else if (this.Y[i] < smallestY || smallestY == null) smallestY = this.Y[i];

            if (this.Z[i] > biggestZ || biggestZ == null) biggestZ = this.Z[i];
            else if (this.Z[i] < smallestZ || smallestZ == null) smallestZ = this.Z[i];
        }

        for (let i = 0; i < this.X.length; i++) {
            this.X[i] *= 150 / biggestX;
            this.Y[i] *= 150 / biggestY;
            this.Z[i] *= 150 / biggestZ;
        }
    };
}

function View(model, SQ_SIZE) {
    // setup canvas
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.height = 500;

    // self explanatory
    this.draw = function () {
        ctx.clearRect(0, 0, SQ_SIZE, SQ_SIZE);

        for (let i = 0; i < model.lines.length; i++) {
            ctx.fillStyle = Math.floor(Math.random() * 16777215).toString(16);
            ctx.beginPath();
            ctx.moveTo(model.perspX[model.lines[i][0]], model.perspY[model.lines[i][0]]);
            for (let j = 1; j < model.lines[i].length; j++) {
                ctx.lineTo(
                    model.perspX[model.lines[i][j % model.lines[i].length]],
                    model.perspY[model.lines[i][j % model.lines[i].length]]
                );
            }
            ctx.stroke();
        }

        for (let i = 0; i < model.X.length; i++) {
            ctx.fillRect(model.perspX[i], model.perspY[i], 1, 1);
        }
    };
}

(function controller() {
    const SQ_SIZE = 400;
    // instantiate model
    let myModel = new Model(sphere, SQ_SIZE);

    // instantiate view
    let myView = new View(myModel, SQ_SIZE);

    // prepare model
    myModel.center();
    myModel.scale();

    // update function which will be repeatedly called
    function update() {
        myModel.rotateY(Math.PI / 512);
        myModel.rotateX(Math.PI / 512);
        myModel.perspective();

        myView.draw();
    }

    // call our update function every x milliseconds
    setInterval(update, 10);
})();
