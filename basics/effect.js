class nice
{
    constructor()
    {
        this.#newFunc();
    }

    #newFunc()
    {
        console.log("Hello");
    }
}

class Effect extends nice
{
    // # allows for private properties and methods
    // You need to specify private properties here
    // There are no protected properties
    // You don't need to initialize public properties here
    // They can be initialized anywhere
    // They should be initialized here or in the constructor method
    #rect;
    #ctx;
    #width;
    #height;
    funcNumber;
    angle;
    midX;
    midY;
    lastTime;
    interval;
    timer;
    cellSize;
    gradient;
    radius;
    radiusVelocity;
    len = 300;
    static flowEffectAnimation;
    static mouse = 
    {
        x: -100,
        y: -100
    };

    constructor(canvas, ctx, funcNumber = 8)
    {
        // Initialize values here not in outside for any non-static properties.
        // super() to use the constructor from the nice class. (required if extending a class)
        super();
        this.#rect = canvas.getBoundingClientRect();
        this.#ctx = ctx;
        this.#width = canvas.width;
        this.#height = canvas.height;
        this.funcNumber = funcNumber;
        
        if (this.#width < 500 || this.#height < 500)
        {
            this.len = ((((this.#width ** 2) + (this.#width ** 2)) ** (1/2)) / 2) - 50;
        }

        this.angle = 0;
        this.midX = (this.#width / 2) - (this.len / 2);
        this.midY = (this.#height / 2) - (this.len / 2);
        this.lastTime = 0;
        this.interval = 1000/60;
        this.timer = 0;
        // Make this larger for less performance issues
        this.cellSize = 10;
        this.radius = 6;
        this.radiusVelocity = 0.03;
        this.#createGradient();
        this.#ctx.strokeStyle = this.gradient;
        this.#ctx.fillStyle = this.gradient;
        // Also has a small effect on performance
        this.#ctx.lineWidth = 3;
        this.run();
    }

    #createGradient()
    {
        this.gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height);
        this.gradient.addColorStop("0.1", "#FF5C33");
        this.gradient.addColorStop("0.2", "#FF66B3");
        this.gradient.addColorStop("0.4", "#CCCCFF");
        this.gradient.addColorStop("0.6", "#B3FFFF");
        this.gradient.addColorStop("0.8", "#80FF80");
        this.gradient.addColorStop("0.9", "#FFFF33");
    }

    #calculate(toRun, timeStamp, clear){
        let deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;

        if (this.timer > this.interval)
        {
            if (clear)
            {
                this.#ctx.clearRect(0,0, this.#width, this.#height);
            }
            toRun();
            this.timer = 0;
        }
        else
        {
            this.timer += deltaTime;
        }
    }

    #basics()
    {
        let circleRadius = ((((this.len ** 2) + (this.len ** 2)) ** (1/2)) / 2) + 10;
        this.#ctx.fillRect(this.midX, this.midY, this.len, this.len);
        // begin the path
        this.#ctx.beginPath();
        this.#ctx.arc(this.#width / 2, this.#height / 2, circleRadius, 0, Math.PI * 2);
        this.#ctx.stroke();
    }

    #basicMouse(){
        let circleRadius = 50;
        let mousePosition =
        {
            x: Effect.mouse.x - this.#rect.left,
            y: Effect.mouse.y - this.#rect.top
        } 

        if (this.#width < 50 || this.#height < 50)
        {
            circleRadius = this.len;
        }

        this.#ctx.beginPath();
        this.#ctx.arc(mousePosition.x, mousePosition.y, circleRadius, 0, Math.PI * 2);
        this.#ctx.stroke();
        this.#ctx.fill();
    }

    #drawLine(x, y, endX, endY)
    {
        this.#ctx.beginPath();
        this.#ctx.moveTo(x, y);
        this.#ctx.lineTo(endX, endY);
        this.#ctx.stroke();
    }

    #drawMovingLine()
    {
        let multiplier = 200;
        let moveX = this.midX + Math.sin(this.angle) * multiplier;
        let moveY = this.midY + Math.cos(this.angle) * multiplier;
        let length = this.len;
    
        this.angle += 1;
        this.#drawLine(moveX, moveY, moveX + length, moveY + length);
    }

    #mouseAnimation()
    {
        let mousePosition =
        {
            x: Effect.mouse.x - this.#rect.left,
            y: Effect.mouse.y - this.#rect.top
        }
        this.#drawLine(this.#width / 2, this.#height / 2, mousePosition.x, mousePosition.y);
        console.log(`${mousePosition.x} , ${mousePosition.y}`);
    }

    #trigPattern()
    {
        // Try perlin noise or simplex noise
        let angle;
        let lengthX;
        let lengthY;
        let zoomLevel = 0.01;
        let lineLength = 30;
        let radiusSize = 10;

        this.radius += this.radiusVelocity;

        if (this.radius > radiusSize || this.radius < -radiusSize)
        {
            this.radiusVelocity *= -1;
        }

        for (let y = 0; y < this.#height; y += this.cellSize) 
        {
            for (let x = 0; x < this.#width; x += this.cellSize)
            {
                angle = (Math.cos(x * zoomLevel) + Math.sin(y * zoomLevel)) * this.radius;
                lengthX = x + Math.cos(angle) * lineLength;
                lengthY = y + Math.sin(angle) * lineLength;
                this.#drawLine(x, y, lengthX, lengthY);
            }
        }
    }

    #mouseTrig()
    {
        // Try perlin or simplex noise
        let angle;
        let lengthX;
        let lengthY;
        let zoomLevel = 0.000012;
        let lineLength;
        let positionX;
        let positionY;
        let dx;
        let dy;
        let distance;
        let min = 100000;
        let max = 600000;
        let multiplier = 0.0001;
        let mousePosition =
        {
            x: Effect.mouse.x - this.#rect.left,
            y: Effect.mouse.y - this.#rect.top
        }

        for (let y = 0; y < this.#height; y += this.cellSize) 
        {
            for (let x = 0; x < this.#width; x += this.cellSize)
            {
                positionX = x;
                positionY = y;
                dx = mousePosition.x - positionX;
                dy = mousePosition.y - positionY;
                distance = (dx * dx) + (dy * dy);

                if (distance > max)
                {
                    distance = max;
                }
                else if (distance < min)
                {
                    distance = min;
                }

                lineLength = distance * multiplier;
                angle = (Math.cos(Effect.mouse.x * x * zoomLevel) + Math.sin(Effect.mouse.y * y * zoomLevel)) * this.radius;
                lengthX = x + Math.cos(angle) * lineLength;
                lengthY = y + Math.sin(angle) * lineLength;
                this.#drawLine(x, y, lengthX, lengthY);
            }
        }
    }

    run(timeStamp = 0)
    {
        switch (this.funcNumber)
        {
            case 1:
                this.#calculate(this.#basics.bind(this), timeStamp, true);
                break;
            case 2:
                this.#calculate(this.#basicMouse.bind(this), timeStamp, true);
                break;
            case 3:
                this.#calculate(this.#basicMouse.bind(this), timeStamp, false);
                break;
            case 4:
                this.#calculate(this.#drawMovingLine.bind(this), timeStamp, false);
                break;
            case 5:
                this.#calculate(this.#mouseAnimation.bind(this), timeStamp, true);
                break;
            case 6:
                this.#calculate(this.#mouseAnimation.bind(this), timeStamp, false);
                break;
            case 7:
                this.#calculate(this.#trigPattern.bind(this), timeStamp, true);
                break;
            default:
                this.#calculate(this.#mouseTrig.bind(this), timeStamp, true);
                break;
        }

        console.log("Animating...");
        Effect.flowEffectAnimation = requestAnimationFrame(this.run.bind(this));
    }

    static cancelAnim()
    {
        cancelAnimationFrame(Effect.flowEffectAnimation);
    }

    static mouseMove(e)
    {
        Effect.mouse.x = e.x;
        Effect.mouse.y = e.y;
    }
}