export default class View {
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
