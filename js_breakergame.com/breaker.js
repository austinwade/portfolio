"use strict";

class Balls {
    speedDelta = 2;
    speedSet = [1, 1];
    numBalls = 0;
    liveBalls = [];
    newBalls = [];
    readyNewLevel = true;
    constructor(dims, blockWidth, model, refreshRate) {
        this.model = model;
        this.dims = dims;
        this.blockWidth = blockWidth;
        this.radius = this.blockWidth / 8;
        this.newBallsRadius = (this.blockWidth / 2 - this.model.space) / 3;
        this.refreshRate = refreshRate;
        this.speedSet.map((val) => val / 2);
    }

    advanceBalls() {
        let wallDampening = 0.99;

        /* for each liveBall */
        for (let i = 0; i < this.liveBalls.length; i++) {
            // check for final ball ?
            if (this.numBalls == this.liveBalls.length - 1) {
                if (this.liveBalls[i][1] >= this.model.finishLineHeight) {
                    this.model.finalBall = this.liveBalls[i];
                }
            }
            // reflect off right wall
            if (this.liveBalls[i][0] >= this.dims[0] - this.radius) {
                this.liveBalls[i][2] = -1 * Math.abs(this.liveBalls[i][2]) * wallDampening;
            } else if (this.liveBalls[i][0] <= this.radius)
                // reflect off left wall
                this.liveBalls[i][2] = Math.abs(this.liveBalls[i][2]) * wallDampening;
            // remove ball when below bottom of screen
            if (this.liveBalls[i][1] >= this.dims[1] + this.radius / 2) {
                this.liveBalls.splice(i, 1);
                // this.advanceBalls();
                break;
            } else if (this.liveBalls[i][1] <= this.radius) {
                // bounce off top wall
                this.liveBalls[i][3] = Math.abs(this.liveBalls[i][3]) * wallDampening;
            }

            // update motion
            this.liveBalls[i][0] += this.liveBalls[i][2];
            this.liveBalls[i][1] += this.liveBalls[i][3];

            // gravity
            this.liveBalls[i][3] += Math.abs(this.speedSet[1] / 2500);
        }
    }

    addLiveBall() {
        /* add liveBall to array with default values */
        this.liveBalls.push([
            this.dims[0] / 2,
            this.dims[1] - this.radius,
            this.speedSet[0],
            -this.speedSet[1],
            "rgba(255,255,255,0.8)",
        ]);
    }
}

class Model {
    blocks = [];
    level = 0;
    snacks = [];
    obstacles = [];
    readyNewLevel = false;
    blockWidth = 50;
    blockDiagonal = Math.sqrt(2 * (this.blockWidth / 2) ** 2);
    space = this.blockWidth / 10;
    interval = null;
    refreshRate = 1;
    score = 0;
    constructor(dims) {
        this.dims = dims;
        this.width = dims[0];
        this.height = dims[1];
        this.balls = new Balls(
            this.dims,
            this.blockWidth,
            this,
            this.refreshRate
        );
        this.newBallsRadius = (this.blockWidth / 2 - this.space) / 3;
        this.constraint = (this.width % this.blockWidth) / 2;
        if (this.constraint < this.blockWidth)
            this.constraint = this.blockWidth;
        this.finishLineHeight =
            this.height - (this.height % this.blockWidth) - 2 * this.blockWidth;
        this.advanceBlocks();
        this.updateGameState();
    }

    genRow() {
        /* for each of the spots available in one horizontal row */
        for (
            let i = 0;
            i <
            Math.floor((this.width - this.constraint) / this.blockWidth) - 1;
            i++
        ) {
            /* add new block w/ 1/2 probability */
            if (Math.random() > 0.5) {
                this.blocks.push([
                    i * this.blockWidth + this.constraint,
                    -this.blockWidth,
                    Math.ceil((this.level + 1) * 2 * Math.random()),
                ]);
            /* add new newBall w/ 1/4 probability */
            } else if (Math.random() > 0.75)
                this.balls.newBalls.push([
                    i * this.blockWidth + this.constraint + this.blockWidth / 2,
                    -this.blockWidth / 2,
                ]);
        }
    }

    advanceBlocks() {
        /* generate new row */
        this.genRow();

        /* advance all blocks by one block height */
        for (let i = 0; i < this.blocks.length; i++) {
            this.blocks[i][1] += this.blockWidth;
        }

        /* advance newBalls */
        for (let i = 0; i < this.balls.newBalls.length; i++) {
            this.balls.newBalls[i][1] += this.blockWidth;
        }

        /* increment level */
        this.level++;
    }

    checkNewBallCollisions() {
        /* for each liveBall */
        for (let j = 0; j < this.balls.liveBalls.length; j++) {
            let x = this.balls.liveBalls[j][0];
            let y = this.balls.liveBalls[j][1];
            /* for each newBall */
            for (let i = 0; i < this.balls.newBalls.length; i++) {
                /* if newBall and liveBall intersect */
                if (
                    Math.sqrt(
                        Math.pow(this.balls.newBalls[i][0] - x, 2) +
                            Math.pow(this.balls.newBalls[i][1] - y, 2)
                    ) <=
                    this.balls.radius + this.balls.newBallsRadius
                ) {
                    /* increment numBalls */
                    this.balls.numBalls++;

                    /* update ball counter */
                    document.getElementsByClassName(
                        "ballnum"
                    )[0].innerHTML = this.balls.numBalls + 1;

                    /* remove newBall from array */
                    this.balls.newBalls.splice(i, 1);

                    /* start over because we messed up indexing by removing a newBall */
                    this.checkNewBallCollisions();
                    return;
                }
            }
        }
    }

    checkBlockCollisions() {
        let hitZone =
            this.blockWidth / 2 + 3 * this.balls.radius / (4 * this.refreshRate);
        let blockDampening = 0.99;
        /* for each liveBall */
        for (let j = 0; j < this.balls.liveBalls.length; j++) {
            let ball_x = this.balls.liveBalls[j][0];
            let ball_y = this.balls.liveBalls[j][1];
            this.checkNewBallCollisions();
            for (let i = 0; i < this.blocks.length; i++) {
                /* ball-center to block-center x-distance */
                let diff_x = Math.abs(
                    ball_x - (this.blocks[i][0] + this.blockWidth / 2)
                );
                /* ball-center to block-center y-distance */
                let diff_y = Math.abs(
                    ball_y - (this.blocks[i][1] + this.blockWidth / 2)
                );
                /* ball-center to block-center hypotenuse (actual distance) */
                let distance = Math.sqrt(diff_x ** 2 + diff_y ** 2);

                /* if ball is within (block_diagonal + radius) */
                if (distance <= this.blockDiagonal + this.balls.radius) {
                    /* if horizontal collision */
                    if (diff_x > diff_y) {
                        /* if ball center inside hit-zone */
                        if (diff_x <= hitZone) {
                            /* reverse horizontal velocity */
                            this.balls.liveBalls[j][2] *= -1;

                            /* advance this single ball, now in the reverse direction */
                            this.balls.liveBalls[j][0] +=
                                2 * this.balls.liveBalls[j][2] * blockDampening;

                            /* decrement block life */
                            this.blocks[i][2]--;

                            /* increment game score */
                            this.score++;
                        }
                    } else {
                        /* if vertical collision */
                        if (diff_y <= hitZone) {
                            /* reverse vertical velocity */
                            this.balls.liveBalls[j][3] *= -1;

                            /* advance this single ball, now in the reverse direction */
                            this.balls.liveBalls[j][1] +=
                                2 * this.balls.liveBalls[j][3];

                            /* decrement block life */
                            this.blocks[i][2]--;

                            /* increment game score */
                            this.score++;
                        }
                    }

                    /* if block is dead */
                    if (this.blocks[i][2] <= 0) {
                        /* remove dead block */
                        this.blocks.splice(i, 1);

                        /* restart checkBlockCollisions() */
                        this.checkBlockCollisions();
                        break;
                    }
                }
            }
        }
    }

    checkBlocksBelowFinishLine() {
        /* iterate over each block */
        for (let i = 0; i < this.blocks.length; i++) {
            /* if block top below finishLine */
            if (this.blocks[i][1] >= this.finishLineHeight) {
                /* stop game */
                this.lose();
                return;
            }
        }
    }

    /**
     * updateGameState - primary game logic update routine
     */
    updateGameState() {
        /* set current time */
        let now = new Date().getTime();

        /* if readyNewLevel true, prepare new level */
        if (this.readyNewLevel === true) {
            /* reset ballsInQueue to full */
            this.ballsInQueue = this.balls.numBalls;

            /* reset clock for ball dispensation */
            this.lastBallDispensed = now;

            /* disable readyNewLevel indicator */
            this.readyNewLevel = false;
        }

        /* if balls remain in queue and last dispensation was sufficiently long ago */
        if (
            this.ballsInQueue > 0 &&
            this.lastBallDispensed < now - this.refreshRate * 50
        ) {
            /* move ball from queue into game */
            this.balls.addLiveBall();
            this.ballsInQueue--;

            /* set clock for ball dispensation again */
            this.lastBallDispensed = now;
        }

        /* check if liveBalls collided with blocks */
        this.checkBlockCollisions();

        /* advance balls */
        this.balls.advanceBalls();

        /* update level counter */
        document.getElementsByClassName("level")[0].innerHTML = this.level;

        /* update level counter */
        document.getElementsByClassName("score")[0].innerHTML = this.score;
    }

    lose() {
        /* stop interval after losing */
        clearInterval(this.interval);
        this.interval = null;

        /* alert the player */
        alert("Excellent work! Highest score: " + this.score);

        /* reload the page after confirmation */
        location.reload();
    }

    startClock(view, x = 1) {
        /* clear last interval */
        clearInterval(this.interval);

        /* set start time of this interval */
        this.startTime = new Date().getTime();

        /* set browser to watch game state */
        this.interval = setInterval(() => {
            let wait = 3000;

            /* restart clock faster for SuperSpeed */
            if (this.startTime < new Date().getTime() - wait && this.ballsInQueue <= 0) {
                // this doesn't work right now because startTime is being set every time above
                if (this.startTime < new Date().getTime() - 2*wait) {
                    this.startClock(view, 8);
                    return;
                }
                this.startClock(view, 2);
                return;
            }

            /* update game x times between drawing */
            for (let i = 0; i < x; i++) {
                this.updateGameState();
            }

            /* logic for when no more liveBalls are left */
            if (this.balls.liveBalls.length <= 0) {
                this.advanceBlocks();
                this.checkBlocksBelowFinishLine();
                this.readyNewLevel = true;
                this.pause();
            }

            /* draw game */
            view.draw();
        }, this.refreshRate);
    }

    pause() {
        if (this.interval != null) {
            /* reset this interval */
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

class View {
    dpi = window.devicePixelRatio;
    constructor(model, dims) {
        this.model = model;
        this.dims = dims;
        this.width = this.dims[0];
        this.height = this.dims[1];
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.space = this.blockWidth / 10;
        this.newBallsRadius = (this.blockWidth / 2 - this.space) / 3;
        this.clearScreen();
        this.constraint = (this.width % this.blockWidth) / 2;
        if (this.constraint < this.blockWidth)
            this.constraint = this.blockWidth;
        document.getElementsByClassName(
            "ballnum"
        )[0].innerHTML = this.model.balls.numBalls + 1;
        document.body.style.visibility = "visible";
        this.draw();
    }
    drawBalls() {
        for (let i = 0; i < this.model.balls.liveBalls.length; i++) {
            this.ctx.fillStyle = this.model.balls.liveBalls[i][4];
            this.ctx.beginPath();
            this.ctx.arc(
                this.model.balls.liveBalls[i][0],
                this.model.balls.liveBalls[i][1],
                this.model.balls.radius,
                0,
                2 * Math.PI,
                false
            );
            this.ctx.fill();
        }
    }
    clearScreen() {
        let val = window.height / 2;
        let grd = this.ctx.createLinearGradient(0, 0, 0, this.height);
        grd.addColorStop(0, "rgb(34, 27, 37)");
        grd.addColorStop(1, "rgb(46, 61, 73)");
        this.ctx.fillStyle = grd;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    fix_dpi() {
        let style = {
            height() {
                return +getComputedStyle(this.canvas)
                    .getPropertyValue("height")
                    .slice(0, -2);
            },
            width() {
                return +getComputedStyle(this.canvas)
                    .getPropertyValue("width")
                    .slice(0, -2);
            },
        };
        this.canvas.setAttribute("width", style.width() * this.dpi);
        this.canvas.setAttribute("height", style.height() * this.dpi);
    }
    drawBlocks() {
        this.ctx.font = "bold 15px Helvetica";
        this.ctx.textAlign = "center";

        for (let i = 0; i < this.model.blocks.length; i++) {
            let val1 = Math.ceil((this.model.blocks[i][2] / 50) * 220 + 35);
            let val2 = Math.ceil(-(this.model.blocks[i][2] / 50) * 220 + 220);
            let val3 = Math.ceil((this.model.blocks[i][2] / 50) * 155 + 100);
            this.ctx.fillStyle = "rgb(" + val1 + "," + val2 + "," + val3 + ")";
            this.ctx.fillRect(
                this.model.blocks[i][0],
                this.model.blocks[i][1],
                this.model.blockWidth - this.model.space,
                this.model.blockWidth - this.model.space
            );
        }
        for (let i = 0; i < this.model.balls.newBalls.length; i++) {
            this.ctx.fillStyle = "rgb(255,255,255)";
            this.ctx.beginPath();
            this.ctx.arc(
                this.model.balls.newBalls[i][0],
                this.model.balls.newBalls[i][1],
                this.model.balls.newBallsRadius,
                0,
                2 * Math.PI,
                false
            );
            this.ctx.fill();
        }

        this.ctx.globalAlpha = 0.5;
        for (let i = 0; i < this.model.blocks.length; i++) {
            this.ctx.fillStyle = "black";
            this.ctx.fillText(
                this.model.blocks[i][2],
                this.model.blocks[i][0] +
                    (this.model.blockWidth - this.model.space) / 2,
                this.model.blocks[i][1] +
                    (this.model.blockWidth - this.model.space) * 0.65
            );
        }
        this.ctx.globalAlpha = 1;
    }
    drawFinishingLine() {
        this.ctx.strokeStyle = "#FFFFFF";
        this.ctx.setLineDash([10, 15]);
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.model.finishLineHeight + 10);
        this.ctx.lineTo(this.width, this.model.finishLineHeight + 10);
        this.ctx.stroke();
    }
    draw() {
        this.clearScreen();
        this.drawBlocks();
        this.drawBalls();
        this.drawFinishingLine();
    }
    drawMouseLine(e) {
        this.draw();
        this.ctx.strokeStyle = "white";
        this.ctx.setLineDash([5, 10]);

        let mouse_x = e.clientX - (window.innerWidth - this.canvas.width) / 2;
        let mouse_y = e.clientY;

        let point1_x = this.canvas.width / 2;
        let point1_y = this.canvas.height;

        let point2_x;
        let point2_y = 0;

        if (mouse_x == point1_x) {
            point2_x == point1_x;
        } else {
            let slope = (point1_y - mouse_y) / (mouse_x - point1_x);
            point2_x = this.width / 2 + (1 / slope) * this.height;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.lineTo(point2_x, point2_y);
        this.ctx.stroke();
        console.log("view: ", this.model.secretValue)
    }
}

function Controller() {
    let dims = [(window.innerHeight * 3) / 4, window.innerHeight];
    // let dims = [window.innerWidth, window.innerHeight];
    let interval = null;
    let model = new Model(dims);
    let view = new View(model, dims);

    // mouse handler
    document.onmousemove = function (e) {
        if (model.interval != null) return;
        view.drawMouseLine(e);
    };
    // click handler
    document.onclick = function (e) {
        e = e || window.event;
        console.log(model.interval);
        if (model.interval != null) return;

        let x = e.clientX - window.innerWidth / 2;
        let y = view.height - e.clientY;
        let r = Math.sqrt(x * x + y * y);
        x /= r;
        y /= r;
        model.balls.speedSet[0] = x * model.balls.speedDelta;
        model.balls.speedSet[1] = y * model.balls.speedDelta;

        model.balls.addLiveBall();

        model.readyNewLevel = true;
        model.startClock(view);
    };
    console.log(this);
}

new Controller();
