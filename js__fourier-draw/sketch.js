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

        this.view.runDrawing();
    }

    setListeners() {
        /* window resize handler */
        window.onresize = () => {
            this.view.reset;
        };

        /* mousedown handler */
        this.view.canvas.addEventListener("mousedown", (e) => {
            this.view.mouseIsMoving = true;
            this.view.hasBegunDrawing = true;
            this.view.reset();
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
            this.view.runDrawing();
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
