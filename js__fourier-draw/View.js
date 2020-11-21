export default class View {
    lsd = document.getElementById("lsd");
    isDrawing = false;
    hasBegunDrawing = false;
    constructor(model) {
        this.model = model;

        this.canvas = document.getElementById("drawHere");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.lineWidth = 0.5;

        this.setSizing();
        this.setListeners();
    }

    setListeners() {
        window.onresize = this.reset;

        this.canvas.addEventListener("mousedown", (e) => {
            this.isDrawing = true;
            this.hasBegunDrawing = true;
            this.reset();
        });
        this.canvas.addEventListener("mousemove", (e) => {
            if (!this.isDrawing) return;
            this.ctx.fillRect(e.clientX, e.clientY, 2, 2);
            this.model.drawing.push([e.clientX, e.clientY]);
            this.drawMouseMove();
        });
        this.canvas.addEventListener("mouseup", () => {
            this.model.elongate();
            this.runDrawing();
        });
        document.body.onkeyup = (e) => {
            if (e.keyCode != 32) return;
            if (interval != null) {
                clearInterval(interval);
                interval = null;
            } else interval = setInterval(draw, timeInterval);
        };

        this.lsd.onclick = () => {
            console.log("lsd");
            let lsd_classlist = this.lsd.classList;
            if (lsd_classlist.contains("active")) {
                lsd_classlist.remove("active");
                this.blackVal = 1;
            } else {
                lsd_classlist.add("active");
                this.blackVal = 0.25;
            }
        };
    }

    setSizing() {
        this.canvas.width = window.innerWidth * 2;
        this.canvas.height = window.innerHeight * 2;
        this.canvas.style.width = this.canvas.width / 2 + "px";
        this.canvas.style.height = this.canvas.height / 2 + "px";
        this.ctx.scale(2, 2);
    }

    reset() {
        this.black();
        this.model.state = this.model.STATE_USER;
        this.model.drawing = [];
        this.model.complex_points = [];
        this.model.time = 0;
        this.model.path = [];
    }

    drawMouseMove() {
        if (this.model.state != this.model.STATE_USER) return;

        this.black();
        this.ctx.strokeStyle = "#FFF";
        this.drawPath(this.model.drawing);
    }

    drawEpicycles(points) {
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i < points.length - 1; i++) {
            this.ctx.strokeStyle = "rgba(255,255,255," + 0.5 + ")";
            this.ctx.beginPath();
            this.ctx.moveTo(points[i][0], points[i][1]);
            this.ctx.lineTo(points[i + 1][0], points[i + 1][1]);
            this.ctx.stroke();
        }
    }

    drawFourier() {
        if (this.model.state != this.model.STATE_FOURIER) return;

        this.black(this.blackVal);
        this.ctx.strokeStyle = "#FFF";
        this.drawPath(this.model.drawing);
        this.drawPath_blue(this.model.path);

        let epicycles = this.model.epicycles(
            this.canvas.width / 4,
            this.canvas.height / 4,
            0,
            this.model.fourier
        );

        this.drawEpicycles(epicycles);

        epicycles = epicycles[epicycles.length - 1];

        this.model.path[this.model.path.length] = epicycles;

        this.model.time += (Math.PI * 2) / this.model.fourier.length;

        if (!this.hasBegunDrawing) this.displayInstructions();

        if (this.model.time > Math.PI * 2) {
            this.model.time = 0;
            this.model.path = [];
            this.model.runFourier();
        }
    }

    displayInstructions() {
        this.ctx.fillStyle = "#FFF";
        this.ctx.font = "30px Arial";
        this.ctx.fillText(
            "Slowly draw a big shape",
            window.innerWidth / 2 - 160,
            window.innerHeight / 2 - 100
        );
    }

    runDrawing() {
        this.isDrawing = false;
        this.model.state = 1; // fourier
        this.model.runFourier();
        this.model.interval = setInterval(() => {
            this.drawFourier();
        }, this.model.timeInterval);
    }

    drawPath(path) {
        if (path.length <= 1) return -1;
        for (let i = 0; i < path.length - 1; i++) {
            // ctx.strokeStyle = "rgba(255,255,255," + i/path.length + ")"
            this.ctx.lineWidth = 0.5;
            this.ctx.strokeStyle = "rgba(255,255,255," + 1 + ")";
            this.ctx.beginPath();
            this.ctx.moveTo(path[i][0], path[i][1]);
            this.ctx.lineTo(path[i + 1][0], path[i + 1][1]);
            this.ctx.stroke();
        }
    }

    drawPath_blue(path) {
        this.drawPath(path);
        if (path.length <= 1) return -1;
        for (let i = 0; i < path.length - 1; i++) {
            this.ctx.lineWidth = 1;
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

    black(opacity = 1) {
        this.ctx.fillStyle =
            "rgba(" + 0 + "," + 0 + "," + 0 + "," + opacity + ")";
        this.ctx.fillRect(0, 0, this.canvas.width / 2, this.canvas.height / 2);
    }
}
