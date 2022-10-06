canvas = document.getElementById('canvas1');
ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Symbol
{
    characters = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    x;
    y;
    fontSize;
    canvasHeight;
    text;

    constructor(x, y, fontSize, canvasHeight)
    {
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.canvasHeight = canvasHeight;
    }

    draw(context)
    {
        this.text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
        context.fillText(this.text, this.x * this.fontSize, this.y * this.fontSize);

        if (this.y * this.fontSize > this.canvasHeight && Math.random() > 0.95)
        {
            this.y = 0;
        }
        else
        {
            this.y++;
        }
    }
}

class Effect
{
    canvasWidth;
    canvasHeight;
    fontSize = 25;
    columns;

    constructor(width, height)
    {
        this.resize(width, height);
    }

    #initialize()
    {
        for (let i = 0; i < this.columns; i++)
        {
            this.symbols[i] = new Symbol(i, 0, this.fontSize, this.canvasHeight);
        }
    }

    resize(width, height)
    {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.columns = width / this.fontSize;
        this.symbols = [];
        this.#initialize();
    }
}

const effect = new Effect(canvas.width, canvas.height);

var lastTime = 0;
const fps = 45;
const nextFrame = 1000/fps;
var timer = 0;

function animate(timestamp = 0)
{
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    if (timer > nextFrame)
    {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = 'center';
        ctx.fillStyle = "#0AFF0A";
        ctx.fontSize = Effect.fontSize + 'px monospace';
        effect.symbols.forEach(symbol => symbol.draw(ctx));
        timer = 0;
    }
    else
    {
        timer += deltaTime;
    }
    
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    effect.resize(canvas.width, canvas.height);
});

animate();
