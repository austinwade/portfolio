"use strict";
let field = {
    hideMenu : function() {
        document.getElementById("menu_container").style.visibility = "hidden";
    },
    // start interval and begin running the game
    startClock : function() {
        this.interval = setInterval(updateGameArea, 125);
        this.pauseTime = null;
    },
    clearScreen : function() {
        this.context.fillStyle = "#222222";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    lose : function() {
        alert("Excellent work! Highest score: "+mySnake.highest);
        clearInterval(this.interval);
        this.interval == null;
        location.reload()
    },
    pause : function() {
        // if the game is running,
        // set pauseTime; stop interval; update snack expirations
        if (this.interval) {
            field.pauseTime = (new Date).getTime()/1000;
            clearInterval(this.interval);
            this.interval = null;
            for (let i=0;i<field.snacks.length;i++) {
                field.snacks[i][2] -= (new Date).getTime()/1000;
            }
        // if game is not running,
        // update snack expirations and
        // call Bill Maher to StartTheClock
        } else {
            for (let i=0;i<field.snacks.length;i++) {
                field.snacks[i][2] += (new Date).getTime()/1000;
            }
            this.startClock();
        }
    },
    delta : 17,
    // objects that grow the snake if not expired.
    // when expired, snacks[i][3] is set to "p", which will shorten the snake when eaten
    snacks : [],
    // objects which immediately kill the snake and end the game
    obstacles : [],
    pauseTime : null,
    ctx : null,
    drawField : function() {
        this.ctx = field.context;
        // draw snacks and poison
        for (let i=0;i<field.snacks.length;i++) {
            if (this.snacks[i][3] == "p") {
                // draw poison objects (old snacks)
                this.ctx.fillStyle = "#fc447b";

                this.ctx.fillRect(field.snacks[i][0], this.snacks[i][1], field.delta, field.delta);


                // this.ctx.beginPath();
                // this.ctx.arc(field.snacks[i][0]+field.delta/2, this.snacks[i][1]+field.delta/2, field.delta/2.5, 0, 2 * Math.PI, false);
                // this.ctx.fill();
            } else {
                // draw snack objects
                this.ctx.fillStyle = "#44a6fc";

                this.ctx.fillRect(field.snacks[i][0], this.snacks[i][1], field.delta, field.delta);

                // this.ctx.beginPath();
                // this.ctx.arc(field.snacks[i][0]+field.delta/2, this.snacks[i][1]+field.delta/2, field.delta/2.5, 0, 2 * Math.PI, false);
                // this.ctx.fill();
            }
        }
    },
    // draw black squares of death
    drawObstacles : function() {
        this.ctx.fillStyle = "#888f8f";
        for (let i=0;i<field.obstacles.length;i++) {
            this.ctx.fillRect(field.obstacles[i][0], this.obstacles[i][1], field.delta, field.delta);
        }
    },
    genSnacks : function(num) {
        for (let i=0;i<num;i++) {
            field.snacks.push( [Math.floor( Math.random()*field.canvas.width/field.delta )*field.delta, Math.floor( Math.random()*field.canvas.height/field.delta )*field.delta, (new Date).getTime()/1000, "s"] );
        }
    },
    genObstacles : function(num, size) {
        let x,y
        let buffer = field.delta*5
        let snakeCent = [(field.canvas.width/2) - (field.canvas.width/2)%field.delta, (field.canvas.height/2) - (field.canvas.height/2)%field.delta]
        for (let i=0;i<num;i++) {
            for (let j=0;j<size;j++) {
                if (j>0) {
                    x = field.obstacles[i*size+j-1][0] + (Math.ceil(Math.random()*3)-2)*field.delta
                    y = field.obstacles[i*size+j-1][1] + (Math.ceil(Math.random()*3)-2)*field.delta
                    while (!(x != snakeCent[0] && y != snakeCent[1])) {
                        x = field.obstacles[i*size+j-1][0] + (Math.ceil(Math.random()*3)-2)*field.delta
                        y = field.obstacles[i*size+j-1][1] + (Math.ceil(Math.random()*3)-2)*field.delta
                    }
                    field.obstacles.push([x, y])

                }
                else  {

                    x = Math.random()*(field.canvas.width-buffer*2)+buffer
                    x = x - x%field.delta
                    y = Math.random()*(field.canvas.height-buffer*2)+buffer
                    y = y - y%field.delta
                    while (!(x != snakeCent[0] && y != snakeCent[1])) {
                        x = Math.random()*field.canvas.width
                        x = x - x%field.delta
                        y = Math.random()*field.canvas.height
                        y = y - y%field.delta
                    }
                    field.obstacles.push([x, y])
                }
            }
        }
    },
    // setup done only at load
    prepGame : function() {
        field.snacks = [];
        field.obstacles = [];
        if (this.canvas == null) {
            this.canvas = document.getElementById("canvas");
        }
        this.canvas.width = (window.innerWidth-field.delta) - (window.innerWidth)%field.delta;
        this.canvas.height = (window.innerHeight-field.delta) - (window.innerHeight)%field.delta;
        this.context = this.canvas.getContext("2d");

        document.getElementById("body").style.visibility = "visible"

        mySnake = new snake(field.canvas.width/2 - (field.canvas.width/2)%field.delta, field.canvas.height/2 - (field.canvas.height/2)%field.delta);
        field.genObstacles(field.canvas.width*field.canvas.height/20000, 8);
        field.genSnacks(field.canvas.width*field.canvas.height/20000)
        updateGameArea();
    },
    drawLines : function() {
        this.ctx = field.context;
        this.ctx.strokeStyle = "#222222";
        for (let i=0; i<field.canvas.width/field.delta; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i*field.delta, 0);
            this.ctx.lineTo(i*field.delta,field.canvas.height);
            this.ctx.stroke();
        }
        for (let i=0; i<field.canvas.height/field.delta; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i*field.delta);
            this.ctx.lineTo(field.canvas.width, i*field.delta);
            this.ctx.stroke();
        }
    },
    // loop through snacks and change snacks[i][3] to "p" if expired
    snacks2poison : function () {
        for (let i=0;i<field.snacks.length;i++) {
            if (field.snacks[i][2]+10+Math.random()*10 < (new Date).getTime()/1000 && field.snacks[i][3] == "s") {
                field.snacks[i][3] = "p";
                field.snacks[i][2] == (new Date).getTime()/1000;
                return;
            }
        }
    },
    // remove poison after it again expires
    poison2ether : function () {
        for (let i=0;i<field.snacks.length;i++) {
            if (field.snacks[i][2]+20+Math.random()*40 < (new Date).getTime()/1000 && field.snacks[i][3] == "p") {
                field.snacks.splice(i,1);
                return;
            }
        }
    }
}

function contains(array, thing) {
    for (let i=0;i<array.length;i++) {
        if (array[i][0] == thing[0] && array[i][1] == thing[1]) return i
    }
    return -1
}
let mySnake
function snake(x, y) {
    this.speedX = 0;
    this.speedY = 0;
    this.segments = [[x,y]];
    this.collisions = [];
    this.speed = field.delta;
    this.dims = [];
    this.highest = 0;
    this.draw = function() {
        // draw segments (not head)
        field.ctx.fillStyle = "#93ffa7";
        for (let i=1;i<mySnake.segments.length;i++) {
            field.ctx.fillRect(mySnake.segments[i][0], mySnake.segments[i][1], field.delta, field.delta);
        }
        // draw head
        field.ctx.fillStyle = "#62c147";
        field.ctx.fillRect(this.segments[0][0], this.segments[0][1], field.delta, field.delta);
    };
    this.updateSnake = function() {
            // backup segments
            let segmentsCopy = [];
            for (let i=0;i<mySnake.segments.length;i++) {
                segmentsCopy.push(mySnake.segments[i].slice());
            }

            // create temp variables for checking collisions of head
            let x = this.segments[0][0]+this.speedX;
            let y = this.segments[0][1]+this.speedY;

            // wrap walls
            if (x>=field.canvas.width || x<0) {
                x = x%field.canvas.width;
                if (x<0) x += field.canvas.width;
            } else {
                y = y%field.canvas.height;
                if (y<0) y += field.canvas.height;
            }

            // check head collisions w/ poison
            for (let i=0;i<field.snacks.length;i++) {
                if (field.snacks[i][0]==x && field.snacks[i][1]==y && field.snacks[i][3] == "p") {
                    if (mySnake.segments.length == 1) {
                        field.lose();
                        return;
                    } else {
                        let len = mySnake.segments.length < 5 ? mySnake.segments.length -1 : 5-1;
                        for (let j=0;j<len;j++) {
                            mySnake.segments.pop();
                        }
                        field.snacks.splice(i,1);
                        break;
                    }
                }
            }

            // check critical head collisions w/ obstacles
            for (let i=0;i<field.obstacles.length;i++) {
                if (field.obstacles[i][0]==x && field.obstacles[i][1]==y) {
                    field.lose();
                    return;
                }
            }

            // check critical head collisions w/ self
            for (let i=1;i<mySnake.segments.length;i++) {
                if (mySnake.segments[i][0] == x && mySnake.segments[i][1] == y) {
                    field.lose();
                    return;
                }
            }

            // check head collisions w/ snacks
            for (let i=0;i<field.snacks.length;i++) {
                if (field.snacks[i][0] == x && field.snacks[i][1] == y) {
                    mySnake.collisions.push(field.snacks[i]);
                    mySnake.collisions.push(field.snacks[i]);
                    field.snacks.splice(i,1);
                    break;
                }
            }

            // update head position and
            mySnake.segments[0][0] = x;
            mySnake.segments[0][1] = y;

            // update segments (0-n) from 1 to n
            for (let i=mySnake.segments.length-1;i>0;i--) {
                mySnake.segments[i] = segmentsCopy[i-1];
            }

            // move snack-collisions to segments
            let index;
            for (let i=0;i<mySnake.collisions.length;i++) {
                let nonoverlaps = 0;
                for (let j=0;j<mySnake.segments.length;j++) {
                    if (mySnake.collisions[i][0] != mySnake.segments[j][0] || mySnake.collisions[i][1] != mySnake.segments[j][1]) {
                        nonoverlaps += 1;
                    }
                }
                if (nonoverlaps != 0) {
                    mySnake.segments.push(mySnake.collisions[i]);
                    index = i;
                }

            }
            if (index != null) {
                mySnake.collisions.splice(index,1);
            }

            // update score

            if (mySnake.segments.length - 1 > mySnake.highest) mySnake.highest = mySnake.segments.length - 1;

            document.getElementById("score").innerHTML = mySnake.segments.length - 1;
            // document.getElementById("score2").innerHTML = mySnake.highest;
    };
    // set context variable "dims" to allow the snake only to go in a new, orthogonal direction
    this.setPrevContext = function() {
        if (field.interval != undefined) {
            if (mySnake.speedX != 0) {
                if (mySnake.speedX > 0) mySnake.dims = [1,0];
                else mySnake.dims = [-1,0];
            } else if (mySnake.speedY != 0) {
                if (mySnake.speedY > 0) mySnake.dims = [0,1];
                else mySnake.dims = [0,-1];
            }
        }
    };
}

function updateGameArea() {
    // clear everything
    field.clearScreen();

    // add new snacks
    if (Math.random() > 0.94) field.genSnacks( field.canvas.width * field.canvas.height / 200000 );

    // update and draw all objects on field (snacks, poison, obstacles)
    field.snacks2poison();
    field.poison2ether();
    field.drawField();
    field.drawObstacles();

    // update and draw snake
    mySnake.updateSnake();
    mySnake.setPrevContext();
    mySnake.draw();

    // field.drawLines();
}

// is keypress vertical (^, !^, w, s)
function isVert(e) {
    if (e.keyCode == 38 || e.keyCode == 87) return 1;
    if (e.keyCode == 40 || e.keyCode == 83) return -1;
    return 0;
}

// is keypress horizontal (<-, ->, a, d)
function isHoriz(e) {
    if (e.keyCode === 37 || e.keyCode === 65) return -1;
    if (e.keyCode === 39 || e.keyCode === 68) return 1;
    return 0;
}

// key handler
document.onkeydown = function(e) {
    e = e || window.event;

    // check if click is a direction or (inclusive) a space
    if([32, 37,38,39,40, 65,68,83,87].indexOf(e.keyCode) > -1) {
        e.preventDefault();
        if (e.keyCode === 32) {
            field.pause();
            return;
        } else {
            // if clock isn't already started, start it
            if (!field.interval) {
                field.startClock();
                for (let i=0; i < field.snacks.length;i++) {
                    field.snacks[i][2] = (new Date).getTime()/1000;
                }
            }
        }
    }

    // change snake direction if conditions are met
    if ((mySnake.dims[0] != 0 || !mySnake.dims) && isVert(e)) {
        mySnake.speedX = 0;
        if (isVert(e)<0) mySnake.speedY = mySnake.speed;
        else mySnake.speedY = -mySnake.speed;
    } else if ((mySnake.dims[1] != 0  || !mySnake.dims) && isHoriz(e)) {
        mySnake.speedY = 0;
        if (isHoriz(e)<0) mySnake.speedX = -mySnake.speed;
        else mySnake.speedX = mySnake.speed;
    }
};
