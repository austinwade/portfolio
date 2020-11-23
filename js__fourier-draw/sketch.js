"use strict";

import View from "./View.js";
import Model from "./Model.js";

class Controller {
    refreshRate = 10;
    mouseIsMoving = false;
    hasBegunDrawing = false;

    constructor() {
        let center = [];
        center[0] = window.innerWidth / 2;
        center[1] = window.innerHeight / 2;

        /* create model */
        this.model = new Model(center);
        // this.model.elongate(8);

        /* create view */
        this.view = new View(this.model);

        /* set window listeners */
        this.setListeners();

        /* draw initial model */
        this.draw();
    }

    drawFourier() {
        /* clear screen */
        this.view.clear(this.view.blackVal);

        /* draw original path */
        // this.view.drawPath(this.model.drawing);

        /* calculate epicycles */
        let epicycles = this.model.epicycles(
            this.model.center[0],
            this.model.center[1],
            0,
            this.model.fourier
        );

        /* draw epicycles */
        this.view.drawEpicycles(epicycles);

        /* push last epicycle to pathBeingDrawn */
        this.model.pathBeingDrawn.push(epicycles[epicycles.length - 1]);

        /* draw new partial fourier path */
        this.view.drawPartialPath(this.model.pathBeingDrawn);

        /* update time */
        this.model.time += (2 * Math.PI) / this.model.fourier.length;

        /* display instructons */
        if (!this.hasBegunDrawing) this.view.displayInstructions();

        /* reset drawing */
        if (this.model.time > 2 * Math.PI) {
            this.reset();
        }
    }

    draw() {
        this.model.runDFT();
        this.interval = setInterval(() => {
            this.drawFourier();
        }, this.refreshRate);
    }

    reset() {
        this.view.clear();
        this.model.clear();
    }

    clearInterval() {
        clearInterval(this.interval);
        this.interval = null;
    }

    setListeners() {
        /* window resize handler */
        window.onresize = () => {
            this.reset;
        };

        /* mousedown handler */
        this.view.canvas.addEventListener("mousedown", (e) => {
            this.mouseIsMoving = true;
            this.hasBegunDrawing = true;
            this.reset();
            this.model.clear();
            this.clearInterval();
        });

        /* mousemove handler */
        this.view.canvas.addEventListener("mousemove", (e) => {
            if (this.mouseIsMoving == false) return;
            this.model.drawing.push([e.clientX, e.clientY]);
            this.view.drawMouseMove();
        });

        /* mouseup handler */
        this.view.canvas.addEventListener("mouseup", () => {
            this.model.elongate(4);
            this.mouseIsMoving = false;
            this.draw();
        });
    }
}

new Controller();
