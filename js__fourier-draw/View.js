export default class View {
    mouseIsMoving = false;
    hasBegunDrawing = false;
    refreshRate = 10;
    constructor(model) {
        /* import model */
        this.model = model;

        /* setup canvas */
        this.canvas = document.getElementById("drawHere");
        this.ctx = this.canvas.getContext("2d");
        this.setSizing();
    }

    clearInterval() {
        clearInterval(this.interval);
        this.interval = null;
    }

    setSizing() {
        this.canvas.width = window.innerWidth * 2;
        this.canvas.height = window.innerHeight * 2;
        this.canvas.style.width = this.canvas.width / 2 + "px";
        this.canvas.style.height = this.canvas.height / 2 + "px";
        this.ctx.scale(2, 2);
    }

    drawMouseMove() {
        this.clearScreen();
        this.drawPath(this.model.drawing);
    }

    drawEpicycles(points) {
        this.ctx.lineWidth = 0.5;
        this.ctx.strokeStyle = "rgba(255,255,255," + 1 + ")";
        this.ctx.beginPath();
        for (let i = 0; i < points.length - 1; i++) {
            this.ctx.moveTo(points[i][0], points[i][1]);
            this.ctx.lineTo(points[i + 1][0], points[i + 1][1]);
        }
        this.ctx.stroke();
    }

    displayInstructions() {
        this.ctx.fillStyle = "#FFF";
        this.ctx.font = "30px Arial";
        this.ctx.fillText(
            "Draw a big shape",
            window.innerWidth / 2 - 160,
            window.innerHeight / 2 - 100
        );
    }

    drawPath(path) {
        this.ctx.strokeStyle = "rgba(255,255,255," + 1 + ")";
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();
        for (let i = 0; i < path.length - 1; i++) {
            this.ctx.moveTo(path[i][0], path[i][1]);
            this.ctx.lineTo(path[i + 1][0], path[i + 1][1]);
        }
        this.ctx.stroke();
    }

    drawPartialPath(path) {
        this.ctx.lineWidth = 3;
        for (let i = 0; i < path.length - 1; i++) {
            let r = 0,
                g = (255 * (path.length - i)) / path.length + 0.3,
                b = (255 * i) / path.length,
                a = i / path.length;
            if (g < 255 * 0.4) g = 255 * 0.4;
            this.ctx.strokeStyle =
                "rgba(" + r + "," + g + "," + b + "," + a + ")";
            this.ctx.beginPath();
            this.ctx.moveTo(path[i][0], path[i][1]);
            this.ctx.lineTo(path[i + 1][0], path[i + 1][1]);
            this.ctx.stroke();
        }
    }

    clearScreen(opacity = 1) {
        this.ctx.fillStyle =
            "rgba(" + 0 + "," + 0 + "," + 0 + "," + opacity + ")";
        this.ctx.fillRect(0, 0, this.canvas.width / 2, this.canvas.height / 2);
    }
}
