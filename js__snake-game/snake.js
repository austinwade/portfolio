"use strict";

class Field {
    delta = 17;
    snacks = [];
    obstacles = [];

    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    lose() {
        alert("Excellent work! Highest score: " + mySnake.highest);
        clearInterval(this.interval);
        this.interval == null;
        location.reload();
    }

    genSnacks(num) {
        for (let i = 0; i < num; i++) {
            this.snacks.push([
                Math.floor((Math.random() * this.width) / this.delta) *
                    this.delta,
                Math.floor((Math.random() * this.height) / this.delta) *
                    this.delta,
                new Date().getTime() / 1000,
                "s",
            ]);
        }
    }

    genObstacles(num, size) {
        let x, y;
        let buffer = this.delta * 5;
        let snakeCent = [
            this.width / 2 - ((this.width / 2) % this.delta),
            this.height / 2 - ((this.height / 2) % this.delta),
        ];
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < size; j++) {
                if (j > 0) {
                    x =
                        this.obstacles[i * size + j - 1][0] +
                        (Math.ceil(Math.random() * 3) - 2) * this.delta;
                    y =
                        this.obstacles[i * size + j - 1][1] +
                        (Math.ceil(Math.random() * 3) - 2) * this.delta;
                    while (!(x != snakeCent[0] && y != snakeCent[1])) {
                        x =
                            this.obstacles[i * size + j - 1][0] +
                            (Math.ceil(Math.random() * 3) - 2) * this.delta;
                        y =
                            this.obstacles[i * size + j - 1][1] +
                            (Math.ceil(Math.random() * 3) - 2) * this.delta;
                    }
                    this.obstacles.push([x, y]);
                } else {
                    x = Math.random() * (this.width - buffer * 2) + buffer;
                    x = x - (x % this.delta);
                    y = Math.random() * (this.height - buffer * 2) + buffer;
                    y = y - (y % this.delta);
                    while (!(x != snakeCent[0] && y != snakeCent[1])) {
                        x = Math.random() * this.width;
                        x = x - (x % this.delta);
                        y = Math.random() * this.height;
                        y = y - (y % this.delta);
                    }
                    this.obstacles.push([x, y]);
                }
            }
        }
    }

    snacks2poison() {
        for (let i = 0; i < this.snacks.length; i++) {
            if (
                this.snacks[i][2] + 10 + Math.random() * 10 <
                    new Date().getTime() / 1000 &&
                this.snacks[i][3] == "s"
            ) {
                this.snacks[i][3] = "p";
                this.snacks[i][2] == new Date().getTime() / 1000;
                return;
            }
        }
    }

    poison2ether() {
        for (let i = 0; i < this.snacks.length; i++) {
            if (
                this.snacks[i][2] + 20 + Math.random() * 40 <
                    new Date().getTime() / 1000 &&
                this.snacks[i][3] == "p"
            ) {
                this.snacks.splice(i, 1);
                return;
            }
        }
    }
}

class View {
    ctx = null;

    constructor(model) {
        this.model = model;
        this.canvas = document.querySelector("canvas");
        this.canvas.width =
            window.innerWidth - this.model.delta - (window.innerWidth % this.model.delta);
        this.canvas.height =
            window.innerHeight - this.model.delta - (window.innerHeight % this.model.delta);
        this.ctx = this.canvas.getContext("2d");
    }

    drawSnake() {
        // draw segments (not head)
        this.ctx.fillStyle = "#93ffa7";
        for (let i = 1; i < this.model.snake.segments.length; i++) {
            this.ctx.fillRect(
                this.model.snake.segments[i][0],
                this.model.snake.segments[i][1],
                this.model.delta,
                this.model.delta
            );
        }
        // draw head
        this.ctx.fillStyle = "#62c147";
        this.ctx.fillRect(
            this.model.snake.segments[0][0],
            this.model.snake.segments[0][1],
            this.model.delta,
            this.model.delta
        );
    }

    hideMenu() {
        document.getElementById("menu_container").style.visibility = "hidden";
    }

    clearScreen() {
        this.ctx.fillStyle = "#222222";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawField() {
        // draw snacks and poison
        for (let i = 0; i < this.model.field.snacks.length; i++) {
            if (this.model.field.snacks[i][3] == "p") {
                // draw poison objects (old snacks)
                this.ctx.fillStyle = "#fc447b";

                this.ctx.fillRect(
                    field.snacks[i][0],
                    this.model.field.snacks[i][1],
                    this.model.delta,
                    this.model.delta
                );
            } else {
                // draw snack objects
                this.ctx.fillStyle = "#44a6fc";

                this.ctx.fillRect(
                    this.model.field.snacks[i][0],
                    this.model.field.snacks[i][1],
                    this.model.delta,
                    this.model.delta
                );
            }
        }
    }

    drawObstacles() {
        this.ctx.fillStyle = "#888f8f";
        for (let i = 0; i < this.model.field.obstacles.length; i++) {
            this.ctx.fillRect(
                this.model.field.obstacles[i][0],
                this.model.field.obstacles[i][1],
                this.model.delta,
                this.model.delta
            );
        }
    }

    drawLines() {
        this.ctx.strokeStyle = "#222222";
        for (let i = 0; i < this.canvas.width / this.model.delta; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.model.delta, 0);
            this.ctx.lineTo(i * this.model.delta, this.canvas.height);
            this.ctx.stroke();
        }
        for (let i = 0; i < this.canvas.height / this.model.delta; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.model.delta);
            this.ctx.lineTo(this.canvas.width, i * this.model.delta);
            this.ctx.stroke();
        }
    }
}

class Snake {
    speedX = 0;
    speedY = 0;
    collisions = [];
    dims = [];
    highest = 0;

    constructor(model, x, y, delta) {
        this.model = model;
        this.segments = [[x, y]];
        this.speed = delta;
    }

    updateSnake() {
        // backup segments
        let segmentsCopy = [];
        for (let i = 0; i < this.segments.length; i++) {
            segmentsCopy.push(this.segments[i].slice());
        }

        // create temp variables for checking collisions of head
        let x = this.segments[0][0] + this.speedX;
        let y = this.segments[0][1] + this.speedY;

        // wrap walls
        if (x >= this.width || x < 0) {
            x = x % this.width;
            if (x < 0) x += this.width;
        } else {
            y = y % this.height;
            if (y < 0) y += this.height;
        }

        // check head collisions w/ poison
        for (let i = 0; i < this.model.field.snacks.length; i++) {
            if (
                this.model.field.snacks[i][0] == x &&
                this.model.field.snacks[i][1] == y &&
                this.model.field.snacks[i][3] == "p"
            ) {
                if (this.segments.length == 1) {
                    this.model.field.lose();
                    return;
                } else {
                    let len =
                        this.segments.length < 5
                            ? this.segments.length - 1
                            : 5 - 1;
                    for (let j = 0; j < len; j++) {
                        this.segments.pop();
                    }
                    this.model.field.snacks.splice(i, 1);
                    break;
                }
            }
        }

        // check critical head collisions w/ obstacles
        for (let i = 0; i < this.model.field.obstacles.length; i++) {
            if (this.model.field.obstacles[i][0] == x && this.model.field.obstacles[i][1] == y) {
                this.model.field.lose();
                return;
            }
        }

        // check critical head collisions w/ self
        for (let i = 1; i < this.segments.length; i++) {
            if (this.segments[i][0] == x && this.segments[i][1] == y) {
                this.model.field.lose();
                return;
            }
        }

        // check head collisions w/ snacks
        for (let i = 0; i < this.model.field.snacks.length; i++) {
            if (this.model.field.snacks[i][0] == x && this.model.field.snacks[i][1] == y) {
                this.collisions.push(this.model.field.snacks[i]);
                this.collisions.push(this.model.field.snacks[i]);
                this.model.field.snacks.splice(i, 1);
                break;
            }
        }

        // update head position and
        this.segments[0][0] = x;
        this.segments[0][1] = y;

        // update segments (0-n) from 1 to n
        for (let i = this.segments.length - 1; i > 0; i--) {
            this.segments[i] = segmentsCopy[i - 1];
        }

        // move snack-collisions to segments
        let index;
        for (let i = 0; i < this.collisions.length; i++) {
            let nonoverlaps = 0;
            for (let j = 0; j < this.segments.length; j++) {
                if (
                    this.collisions[i][0] != this.segments[j][0] ||
                    this.collisions[i][1] != this.segments[j][1]
                ) {
                    nonoverlaps += 1;
                }
            }
            if (nonoverlaps != 0) {
                this.segments.push(this.collisions[i]);
                index = i;
            }
        }
        if (index != null) {
            this.collisions.splice(index, 1);
        }

        // update score

        if (this.segments.length - 1 > this.highest)
            this.highest = this.segments.length - 1;

        document.getElementById("score").innerHTML = this.segments.length - 1;
        // document.getElementById("score2").innerHTML = this.highest;
    }

    setPrevContext() {
        if (this.model.field.interval != undefined) {
            if (this.speedX != 0) {
                if (this.speedX > 0) this.dims = [1, 0];
                else this.dims = [-1, 0];
            } else if (this.speedY != 0) {
                if (this.speedY > 0) this.dims = [0, 1];
                else this.dims = [0, -1];
            }
        }
    }
}

class Model {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.field = new Field();
        this.snake = new Snake(
            this,
            this.width / 2 - ((this.width / 2) % this.field.delta),
            this.height / 2 - ((this.height / 2) % this.field.delta),
            this.field.delta
        );
    }
}

class Controller {
    constructor() {
        this.model = new Model(100, 100);
        this.view = new View(this.model, this.model.field.delta);

        this.setListeners();
    }

    prepGame() {
        document.body.style.visibility = "visible";

        this.model.field.genObstacles(
            (this.view.canvas.width * this.view.canvas.height) / 20000,
            8
        );
        this.model.field.genSnacks(
            (this.view.canvas.width * this.view.canvas.height) / 20000
        );
        this.updateGameArea();
    }

    pause() {
        // if the game is running,
        // set pauseTime; stop interval; update snack expirations
        if (this.interval) {
            this.pauseTime = new Date().getTime() / 1000;
            clearInterval(this.interval);
            this.interval = null;
            for (let i = 0; i < this.model.field.snacks.length; i++) {
                this.model.field.snacks[i][2] -= new Date().getTime() / 1000;
            }
            // if game is not running,
            // update snack expirations and
            // call Bill Maher to StartTheClock
        } else {
            for (let i = 0; i < this.model.field.snacks.length; i++) {
                this.model.field.snacks[i][2] += new Date().getTime() / 1000;
            }
            this.startClock();
        }
    }

    startClock() {
        this.interval = setInterval(() => {
            this.updateGameArea();
        }, 125);
        this.pauseTime = null;
    }

    updateGameArea() {
        // clear everything
        this.view.clearScreen();

        // add new snacks
        if (Math.random() > 0.94)
            this.model.field.genSnacks(
                (this.model.width * this.model.height) / 200000
            );

        // update and draw all objects on field (snacks, poison, obstacles)
        this.model.field.snacks2poison();
        this.model.field.poison2ether();
        this.view.drawField();
        this.view.drawObstacles();

        // update and draw snake
        this.model.snake.updateSnake();
        this.model.snake.setPrevContext();
        this.view.drawSnake();

        // this.model.field.drawLines();
    }

    setListeners() {
        document.body.onload = () => {
            this.prepGame();
        };
        document.body.onresize = () => {
            this.prepGame();
        };

        // key handler
        document.onkeydown = (e) => {
            e = e || window.event;

            // check if click is a direction or (inclusive) a space
            if ([32, 37, 38, 39, 40, 65, 68, 83, 87].indexOf(e.keyCode) > -1) {
                e.preventDefault();
                if (e.keyCode === 32) {
                    this.pause();
                    return;
                } else {
                    // if clock isn't already started, start it
                    if (!this.interval) {
                        this.startClock();
                        for (let i = 0; i < this.model.field.snacks.length; i++) {
                            this.model.field.snacks[i][2] =
                                new Date().getTime() / 1000;
                        }
                    }
                }
            }

            // change snake direction if conditions are met
            if ((this.model.snake.dims[0] != 0 || !this.model.snake.dims) && this.isVert(e)) {
                this.model.snake.speedX = 0;
                if (this.isVert(e) < 0) this.model.snake.speedY = this.model.snake.speed;
                else this.model.snake.speedY = -this.model.snake.speed;
            } else if ((this.model.snake.dims[1] != 0 || !this.model.snake.dims) && this.isHoriz(e)) {
                this.model.snake.speedY = 0;
                if (this.isHoriz(e) < 0) this.model.snake.speedX = -this.model.snake.speed;
                else this.model.snake.speedX = this.model.snake.speed;
            }
        };
    }

    isVert(e) {
        // is keypress vertical (^, !^, w, s)
        if (e.keyCode == 38 || e.keyCode == 87) return 1;
        if (e.keyCode == 40 || e.keyCode == 83) return -1;
        return 0;
    }

    isHoriz(e) {
        // is keypress horizontal (<-, ->, a, d)
        if (e.keyCode === 37 || e.keyCode === 65) return -1;
        if (e.keyCode === 39 || e.keyCode === 68) return 1;
        return 0;
    }
}

new Controller();
