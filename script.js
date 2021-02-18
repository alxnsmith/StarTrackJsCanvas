const CONFIG = {
    background: '#00000050', // only this format
    // background: '#000000ff', // only this format
    cxOffset: 0,
    cyOffset: 0,
    axisStarPrecision: window.innerWidth*.7,
    starColor: '#cff',

    starAcceleration: .001,
    starDistanceSpeedRatio: .5,
    starSpeedIncrement: 2,
    
    starSizeMultiplier: 3,
    starRadiusGrowing: .03,
    starDistanceSizeRatio: 3,
    

    starFrequency: 1,
    starDensity: 10,
}

class Star{
    constructor(x, y, angle, size, speed, color) {
        this.firstFrame = true
        this.color = color;
        this.angle = angle;
        this.radius = .1;
        this.size = size;
        this.speed = speed;
        this.x = x;
        this.y = y;
    }
}

class Canvas{
    h;w;cx;cy;canvas;ctx;
    stars = [];

    constructor(){
        this.canvas = document.getElementById('canvas'),
        this.ctx = canvas.getContext('2d')
        this.updateCanvasSize()
        this.ctx.fillStyle = CONFIG.background.slice(0, 2)
        this.ctx.fillRect(0,0,this.w,this.h)
        window.addEventListener('resize', this.updateCanvasSize)
    }
    updateCanvasSize() {
        this.w = canvas.width = window.innerWidth,
        this.h = canvas.height = window.innerHeight
        this.cx = this.w/2 + CONFIG.cxOffset
        this.cy = this.h/2 + CONFIG.cyOffset
    }
    render(){
        function getNewPositionStar(star, speed){
            // star.x += speed * Math.cos(star.angle)
            // star.y += speed * Math.sin(star.angle)
            let x = star.x + speed * Math.cos(star.angle)
            let y = star.y + speed * Math.sin(star.angle)
            return [x, y]
        }
        function drawStar(canvas, star){
            canvas.ctx.beginPath()
            canvas.ctx.arc(star.x, star.y, star.radius, 0, 360)
            canvas.ctx.closePath()
            canvas.ctx.fillStyle = star.color
            canvas.ctx.fill()
            // canvas.ctx.beginPath()
            // canvas.ctx.strokeStyle = CONFIG.starColor
            // canvas.ctx.moveTo(star.x, star.y)
            // canvas.ctx.lineTo(canvas.cx, canvas.cy)
            // canvas.ctx.closePath()
            // canvas.ctx.stroke()
        }

        this.ctx.fillStyle = CONFIG.background
        this.ctx.fillRect(0,0,this.w,this.h)

        this.stars = this.stars.filter(star => {
            let crossX = star.x <= this.w+star.radius && star.x >= 0
            let crossY = star.y <= this.h+star.radius && star.y >= 0
            return crossX && crossY
        })

        this.stars.map(star =>{
            if (star.firstFrame){
                let distance = Math.sqrt(Math.abs((star.x - this.cx)) + Math.abs(star.y - this.cy))
                star.firstFrame = false
                star.speed = star.speed / (Math.floor(distance)*CONFIG.starDistanceSpeedRatio)
                star.size = Math.floor(star.size) / (Math.floor(distance)/CONFIG.starDistanceSizeRatio)

            }
            let distx = Math.abs(this.cx-star.x) / (this.w/2/100)
            let disty = Math.abs(this.cy-star.y) / (this.h/2/100)
            star.radius+=CONFIG.starRadiusGrowing * star.size
            star.speed += (distx + disty) * (star.radius * CONFIG.starAcceleration);
            
            [star.x, star.y] = getNewPositionStar(star, star.speed)
            drawStar(this, star)
        })
    }
    createStar(count){
        for (let i = 0; i<count; i++){
            let precision = Math.random() * CONFIG.axisStarPrecision
            let angle = Math.random()*Math.PI*2
            let y = this.cy + precision * Math.sin(angle)
            let x = this.cx + precision * Math.cos(angle)
            this.stars.push(
                new Star(x, y, angle, Math.random()* CONFIG.starSizeMultiplier, Math.random()+CONFIG.starSpeedIncrement, CONFIG.starColor))
        }
    }

}

let c = new Canvas()
let starCounter = document.querySelector('#starCounter .value')

function loop(){
    c.hue++
    if (Math.random()*1<CONFIG.starFrequency) c.createStar(Math.random()*CONFIG.starDensity)
    c.render(CONFIG)
    starCounter.innerHTML = c.stars.length
    requestAnimationFrame(loop)
}
requestAnimationFrame(loop)
