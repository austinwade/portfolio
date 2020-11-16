"use strict";

import Model from "./Model.js";
import View from "./View.js";

class Controller {
    constructor() {
        this.dims = [(window.innerHeight * 3) / 4, window.innerHeight];
        this.interval = null;
        this.model = new Model(this.dims);
        this.view = new View(this.model, this.dims);

        /* mouse handler */
        document.onmousemove = (e) => {
            /* ignore mousemove if game is running */
            if (this.model.interval != null) return;
            this.view.drawMouseLine(e);
        };

        /* click handler */
        document.onclick = (e) => {
            e = e || window.event;

            /* ignore clicks if game is running */
            if (this.model.interval != null) return;

            /* set initial velocity vector for balls on click */
            let x = e.clientX - window.innerWidth / 2;
            let y = this.view.height - e.clientY;
            let r = Math.sqrt(x * x + y * y);
            x /= r;
            y /= r;
            this.model.balls.speedSet[0] = x * this.model.balls.speedDelta;
            this.model.balls.speedSet[1] = y * this.model.balls.speedDelta;

            /* add single live ball to game, on click */
            this.model.balls.addLiveBall();

            /* start game */
            this.model.readyNewLevel = true;
            this.model.startClock(this.view);
        };
    }
}

new Controller();
