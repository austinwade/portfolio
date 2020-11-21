"use strict";

import View from "./View.js";
import Model from "./Model.js";

class Controller {
    constructor() {
        let center;
        center = [window.innerWidth/2, window.innerHeight/2];
        // center = [window.innerWidth/4, window.innerHeight/2];
        // center = [0, 0];

        this.model = new Model(center);
        this.view = new View(this.model);

        this.setListeners();

        this.runDrawing();
    }

    drawFourier() {
        /* clear screen */
        this.view.clearScreen(this.view.blackVal);

        /* draw original path */
        this.view.drawPath(this.model.drawing);

        /* draw new partial fourier path */
        this.view.drawPartialPath(this.model.pathBeingDrawn);

        let epicycles = this.model.epicycles(
            this.model.center[0],
            this.model.center[1],
            0,
            this.model.fourier
        );

        this.view.drawEpicycles(epicycles);

        epicycles = epicycles[epicycles.length - 1];

        this.model.pathBeingDrawn.push(epicycles);

        this.model.time += (2 * Math.PI) / this.model.fourier.length;

        if (!this.view.hasBegunDrawing) this.view.displayInstructions();

        if (this.model.time > 2 * Math.PI) {
            this.model.time = 0;
            this.model.pathBeingDrawn = [];
            this.model.runDFT();
        }
    }

    runDrawing() {
        this.view.mouseIsMoving = false;
        this.model.runDFT();
        this.view.interval = setInterval(() => {
            this.drawFourier();
        }, this.view.refreshRate);
    }

    reset() {
        this.view.clearScreen();
        this.model.drawing = [];
        this.model.complex_points = [];
        this.model.time = 0;
        this.model.pathBeingDrawn = [];
    }

    setListeners() {
        /* window resize handler */
        window.onresize = () => {
            this.reset;
        };

        /* mousedown handler */
        this.view.canvas.addEventListener("mousedown", (e) => {
            this.view.mouseIsMoving = true;
            this.view.hasBegunDrawing = true;
            this.reset();
            this.model.clear();
            this.view.clearInterval();
        });

        /* mousemove handler */
        this.view.canvas.addEventListener("mousemove", (e) => {
            if (this.view.mouseIsMoving == false) return;
            this.model.drawing.push([e.clientX, e.clientY]);
            this.view.drawMouseMove();
        });

        /* mouseup handler */
        this.view.canvas.addEventListener("mouseup", () => {
            this.model.elongate(this.drawing);
            this.runDrawing();
        });

        /*
        this.view.lsd.onclick = () => {
            let lsd_classlist = this.view.lsd.classList;
            if (lsd_classlist.contains("active")) {
                lsd_classlist.remove("active");
                this.view.blackVal = 1;
            } else {
                lsd_classlist.add("active");
                this.view.blackVal = 0.25;
            }
        };
        */
    }
}

new Controller();
