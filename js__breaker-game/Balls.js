export default class Balls {
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
                this.liveBalls[i][2] =
                    -1 * Math.abs(this.liveBalls[i][2]) * wallDampening;
            } else if (this.liveBalls[i][0] <= this.radius)
                // reflect off left wall
                this.liveBalls[i][2] =
                    Math.abs(this.liveBalls[i][2]) * wallDampening;
            // remove ball when below bottom of screen
            if (this.liveBalls[i][1] >= this.dims[1] + this.radius / 2) {
                this.liveBalls.splice(i, 1);
                // this.advanceBalls();
                break;
            } else if (this.liveBalls[i][1] <= this.radius) {
                // bounce off top wall
                this.liveBalls[i][3] =
                    Math.abs(this.liveBalls[i][3]) * wallDampening;
            }

            // update motion
            this.liveBalls[i][0] += this.liveBalls[i][2];
            this.liveBalls[i][1] += this.liveBalls[i][3];

            // gravity
            this.liveBalls[i][3] += Math.abs(this.speedSet[1] / 5000);
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
