"use strict"
let field = {
    hideMenu : function() {
        document.getElementById("menu_container").style.visibility = "hidden";
    },
    // start interval and begin running the game
    startClock : function() {
        clearInterval(this.interval);
        this.interval = setInterval(updateGameArea, 4);
        this.pauseTime = null;
    },
    clearScreen : function() {
        let val = window.height/2
        let grd = this.ctx.createLinearGradient(0,0,0,this.canvas.height)
        grd.addColorStop(0, "rgb(34, 27, 37)")
        grd.addColorStop(1, "rgb(46, 61, 73)")

        this.ctx.fillStyle = grd;
        // this.context.fillStyle = "#222222";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    lose : function() {
        clearInterval(this.interval)
        alert("Excellent work! Highest score: "+this.score);
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
            this.startClock();
        }
    },
    delta : 50,
    pauseTime : null,
    ctx : null,
    constraint : null,
    level : 0,
    blocks : [],
    space : 10,
    dpi : window.devicePixelRatio,
    fix_dpi : function() {
        let style = {
            height() {
                return +getComputedStyle(canvas).getPropertyValue('height').slice(0,-2);
            },
            width() {
                return +getComputedStyle(canvas).getPropertyValue('width').slice(0,-2);
            }
        }
        canvas.setAttribute('width', style.width() * this.dpi);
        canvas.setAttribute('height', style.height() * this.dpi);
    },
    newBallsRadius : 0,
    drawBlocks : function() {
        this.ctx.font = "bold 15px Helvetica";
        this.ctx.textAlign = "center"

        this.ctx = field.context;
        // draw snacks and poison
        for (let i=0;i<field.blocks.length;i++) {
            // this.ctx.fillStyle = "#fc447b";
            let val1 = Math.ceil((this.blocks[i][2]/50)*220+35)
            let val2 = Math.ceil(-(this.blocks[i][2]/50)*220+220)
            let val3 = Math.ceil((this.blocks[i][2]/50)*155+100)
            // console.log(val)
            this.ctx.fillStyle = "rgb(" + val1 + "," + val2 + "," + val3 + ")"

            this.ctx.fillRect(this.blocks[i][0], this.blocks[i][1], field.delta-field.space, field.delta-field.space);
        }
        for (let i=0;i<field.newBalls.length;i++) {
            this.ctx.fillStyle = "rgb(255,255,255)"

            // this.ctx.fillRect(this.newBalls[i][0], this.newBalls[i][1], field.delta-field.space, field.delta-field.space);
            field.ctx.beginPath();
            field.ctx.arc(this.newBalls[i][0], this.newBalls[i][1], this.newBallsRadius, 0, 2 * Math.PI, false);
            field.ctx.fill()
        }

        this.ctx.globalAlpha = 0.5
        for (let i=0;i<field.blocks.length;i++) {
            this.ctx.fillStyle = "black"
            this.ctx.fillText(this.blocks[i][2], this.blocks[i][0]+(this.delta-this.space)/2, this.blocks[i][1]+(this.delta-this.space)*0.65);
        }
        this.ctx.globalAlpha = 1
    },
    advanceBlocks : function() {
        this.genRow()
        for (let i=0;i<this.blocks.length;i++) {
            this.blocks[i][1] += this.delta
        }
        for (let i=0;i<this.newBalls.length;i++) {
            this.newBalls[i][1] += this.delta
        }
        this.level++
        document.getElementsByClassName("score2")[0].innerHTML = field.level;

    },

    // setup done only at load
    prepGame : function() {
        field.snacks = [];
        field.obstacles = [];
        if (this.canvas == null) {
            this.canvas = document.getElementById("canvas");
            this.ctx = this.canvas.getContext("2d");
        }
        // this.canvas.width = window.innerHeight*3/4;
        // this.canvas.height = window.innerHeight;
        this.canvas.width = 600;
        this.canvas.height = 700;
        this.space = this.delta/10
        this.newBallsRadius = (this.delta/2-this.space)/3,
        this.fix_dpi()

        field.clearScreen()
        this.constraint = (field.canvas.width%field.delta)/2
        if (this.constraint < this.delta) this.constraint = this.delta
        this.context = this.canvas.getContext("2d");
        this.finishLinePosition = this.canvas.height - this.canvas.height%this.delta - 2*this.delta
        // myBalls.addBall()
        field.advanceBlocks()
        field.advanceBlocks()
        // field.drawBlocks()

        document.getElementsByClassName("ballnum")[0].innerHTML = myBalls.numBalls;
        document.body.style.visibility = "visible"
        updateGameArea();
    },
    drawLines : function() {
        this.ctx.strokeStyle = "#333333";
        for (let i=0; i<field.canvas.width/field.delta; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i*field.delta+this.constraint, 0);
            this.ctx.lineTo(i*field.delta+this.constraint, field.canvas.height);
            this.ctx.stroke();
        }
        for (let i=0; i<field.canvas.height/field.delta; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i*field.delta);
            this.ctx.lineTo(field.canvas.width, i*field.delta);
            this.ctx.stroke();
        }
    },
    newBalls : [],
    genRow : function() {
        for (let i=0;i<Math.floor((this.canvas.width-this.constraint)/this.delta)-1;i++) {
            if (Math.random()>0.5) {
                this.blocks.push([i*this.delta+this.constraint,-field.delta,Math.ceil((this.level+1)*2*Math.random())])
            } else if (Math.random()>0.75) {
                this.newBalls.push([i*this.delta+this.constraint+field.delta/2,-field.delta/2])
            }
        }
    },
    checkNewBallTouches : function(balls) {
        for (let j=0;j<balls.length;j++) {
            let x = balls[j][0]
            let y = balls[j][1]
            for (let i=0;i<this.newBalls.length;i++) {
                if (Math.sqrt(Math.pow(this.newBalls[i][0] - x,2) + Math.pow(this.newBalls[i][1] - y,2)) <= myBalls.radius+this.newBallsRadius) {
                    myBalls.numBalls++
                    document.getElementsByClassName("ballnum")[0].innerHTML = myBalls.numBalls;
                    this.newBalls.splice(i,1)
                    this.checkNewBallTouches(balls)
                    return
                }
            }
        }
    },
    score : 0,
    checkCollisions : function(balls) {
        let recheck = false
        for (let j=0;j<balls.length;j++) {
            let x = balls[j][0]
            let y = balls[j][1]

            this.checkNewBallTouches(balls)


            for (let i=0;i<this.blocks.length;i++) {
                if (x >= this.blocks[i][0]-myBalls.radius && x <= this.blocks[i][0]+field.delta+myBalls.radius-field.space) {
                    if (y >= this.blocks[i][1]-myBalls.radius && y <= this.blocks[i][1]+field.delta+myBalls.radius-field.space) {
//
                        let arctan =
                            Math.atan(
                                (this.blocks[i][1]+field.delta/2-balls[j][1]) / (this.blocks[i][0]+field.delta/2-balls[j][0])
                            ) % Math.PI

                        if (arctan > Math.PI/2) arctan = Math.PI - arctan%Math.PI
                        if (arctan < Math.PI/4) {
                            balls[j][2] *= -1
                            // balls[j][0] += 2*balls[j][2]
                        }
                        else {
                            balls[j][3] *= -1
                            // balls[j][1] += 2*balls[j][3]
                        }

                        balls[j][0] += balls[j][2]
                        balls[j][1] += balls[j][3]

                        // this.drawBox(this.blocks[j][0],this.blocks[j][1],this.delta)

                        this.blocks[i][2]--
                        this.score++
                        document.getElementsByClassName("score")[0].innerHTML = this.score;

                        if (this.blocks[i][2]<=0) {
                            recheck = true
                            // killBlocks.push(i)
                            this.blocks.splice(i,1)
                            this.checkCollisions(balls)
                            break
                        }
                    }
                }
            }
        }
    },
    finishLinePosition : 0,
    drawFinishingLine : function() {
        this.ctx.strokeStyle = "#FFFFFF"
        this.ctx.setLineDash([10,15])
        this.ctx.beginPath();
        this.ctx.moveTo(0,this.finishLinePosition+10);
        this.ctx.lineTo(this.canvas.width,this.finishLinePosition+10);
        this.ctx.stroke();
    },
    checkBlocksBelow : function() {
        for (let i=0;i<this.blocks.length;i++) {
            if (this.blocks[i][1] >= this.finishLinePosition) {
                this.advanceBlocks()
                justDrawing()
                field.lose()
                return
            }
        }
    },
    finalBall : []
}
function balls() {
    this.speedDelta = 2
    this.speedSet = [1,1]
    this.numBalls = 1
    this.balls = []
    this.radius = field.delta/8
    this.draw = function() {
        for (let i=0;i<this.balls.length;i++) {
            field.ctx.fillStyle = this.balls[i][4];
            field.ctx.beginPath();
            field.ctx.arc(this.balls[i][0], this.balls[i][1], this.radius, 0, 2 * Math.PI, false);
            field.ctx.fill()
        }
    }
    this.advanceBalls = function() {
        for (let i=0;i<this.balls.length;i++) {
            if (myBalls.numBalls == levelBalls-1)
                if (this.balls[i][1] >= field.finishLinePosition) {
                    field.finalBall = this.balls[i]
                    console.log(field.finalBall)
                }

            if (this.balls[i][0]>=field.canvas.width-this.radius) {
                this.balls[i][2] = -1 * Math.abs(this.balls[i][2])
            } else if (this.balls[i][0]<=this.radius) this.balls[i][2] = Math.abs(this.balls[i][2])

            if (this.balls[i][1]>=field.canvas.height+this.radius/2) {
                this.balls.splice(i,1)
                this.advanceBalls()
                break
            } else if (this.balls[i][1]<=this.radius) {
                this.balls[i][3] = Math.abs(this.balls[i][3])
                // this.balls[i][1] += this.balls[i][3]
                // this.balls[i][1] += this.balls[i][3]
                // thats an extra move prior to the regular one to hopefully push these thigns loose
            }

            this.balls[i][0] += this.balls[i][2]
            this.balls[i][1] += this.balls[i][3]

            // gravity
            this.balls[i][3] += this.speedSet[1]/10000
        }
    },
    this.addBall = function() {
        field.startClock()
        this.balls.push([field.canvas.width/2, field.canvas.height-myBalls.radius,  this.speedSet[0], -this.speedSet[1], "rgba(255,255,255,0.8)"])
    }
}
let myBalls = new balls()
let levelBalls = 1
let last = (new Date).getTime()
let first = 0
let readyNewLevel = false


function justDrawing() {
    field.clearScreen();
    field.drawBlocks()
    myBalls.draw()
    field.drawFinishingLine()
}

function updateGameArea() {

    if (readyNewLevel) {
        levelBalls = myBalls.numBalls
        readyNewLevel = false
    }

    // add ball on update it not out of them
    let now = (new Date).getTime()
    if (levelBalls && last < now-100) {
        myBalls.addBall()
        levelBalls--
        // sleep(1)
        last = now;
    }

    field.checkCollisions(myBalls.balls)
    myBalls.advanceBalls()

    justDrawing()

    if (myBalls.balls.length<=0 ) {
        if (first != 0) field.advanceBlocks()
        field.checkBlocksBelow()

        readyNewLevel = true

        justDrawing()
        field.pause()
    }
    first++
}

document.onmousemove = function(e) {
    if (field.interval == null) {
        justDrawing()
        field.ctx.strokeStyle = "white";
        field.ctx.setLineDash([5,10])

        field.ctx.beginPath();
        field.ctx.moveTo(field.canvas.width/2, field.canvas.height);
        field.ctx.lineTo(e.clientX-(window.innerWidth-field.canvas.width)/2,e.clientY);
        field.ctx.stroke();

        field.ctx.beginPath();
        field.ctx.moveTo(field.canvas.width/2, field.canvas.height);
        field.ctx.lineTo(e.clientX-(window.innerWidth-field.canvas.width)/2,e.clientY);
        field.ctx.stroke();
    }
}

document.onclick = function(e) {
    e = e || window.event
    if (field.interval==null) {
        field.ctx.fillStyle = "lightgreen"
        field.ctx.beginPath()
        field.ctx.arc(e.clientX - (window.innerWidth-field.canvas.width)/2, e.clientY, 5, 0, 2 * Math.PI, false)
        field.ctx.fill()
        // field.pause()
        let x = e.clientX-window.innerWidth/2
        let y = field.canvas.height - e.clientY
        // console.log(x,y)
        let r = Math.sqrt(x*x+y*y)
        x /= r
        y /= r
        // console.log(x,y)
        // console.log(field.canvas.width)
        // myBalls.speedSet = [1,-(field.canvas.height-event.clientY)/(event.clientX-field.canvas.width)]
        myBalls.speedSet[0] = x*myBalls.speedDelta
        myBalls.speedSet[1] = y*myBalls.speedDelta
        // console.log(event.clientX,event.clientY)
        // console.log(myBalls.speedSet)
        readyNewLevel = true
        field.startClock()
    }

}

// key handler
document.onkeydown = function(e) {
    e = e || window.event;

    // check if click is a direction or (inclusive) a space
    if([32, 37,38,39,40, 65,68,83,87  , 13].indexOf(e.keyCode) > -1) {
        e.preventDefault();
        if (e.keyCode === 32) {
            field.pause();
            return;
        }
        else if (e.keyCode == 13)
            updateGameArea()
        else
            // if clock isn't already started, start it
            if (!field.interval)
                field.startClock();
    }
};

(()=>{
    document.body.onload = field.prepGame()
})()
