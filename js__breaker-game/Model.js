import Balls from "./Balls.js";

export default class Model {
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
        this.width = dims[0];
        this.height = dims[1];
        this.balls = new Balls(
            dims,
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
            } else if (Math.random() > 0.85)
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
                    document.getElementsByClassName("ballnum")[0].innerHTML =
                        this.balls.numBalls + 1;

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
            this.blockWidth / 2 +
            (3 * this.balls.radius) / (4 * this.refreshRate);
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
            let wait = 5 * 1000;

            /* restart clock faster for SuperSpeed */
            if (
                this.startTime < new Date().getTime() - wait &&
                this.ballsInQueue <= 0
            ) {
                // this doesn't work right now because startTime is being set every time above
                // if (this.startTime < new Date().getTime() - 2*wait) {
                //     this.startClock(view, 3);
                //     return;
                // }
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
