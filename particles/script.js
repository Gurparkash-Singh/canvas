let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
// Required even with CSS 100% width and height
// Otherwise, canvas behaves unexpectedly
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let hue = 0;
const particlesArray = [];

const mouse =
{
    x: undefined,
    y: undefined
}

window.addEventListener("resize", () => 
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

canvas.addEventListener("click", (event) => {
    for (i = 0; i < 5; i++)
    {
        mouse.x = event.x;
        mouse.y = event.y;
        particlesArray.push(new Particle());
    }
});

window.addEventListener("mousemove", (event) => {
    for (i = 0; i < 5; i++)
    {
        mouse.x = event.x;
        mouse.y = event.y;
        particlesArray.push(new Particle());
    }
});

class Particle
{
    x;
    y;
    size;
    speedX;
    speedY;
    color;

    constructor()
    {
        //this.x = Math.random() * canvas.width;
        //this.y = Math.random() * canvas.height;
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = (Math.random() * 15) + 1;
        this.speedX = (Math.random() * 3) - 1.5;
        this.speedY = (Math.random() * 3) - 1.5;
        //this.color = `hsl(${hue}, 100%, 50%)`
        this.color = "white";
    }

    update()
    {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2)
        {
            this.size -= 0.1;
        }
    }

    draw()
    {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
    }

    static init(num)
    {
        for (let i = 0; i < num; i++)
        {
            particlesArray.push(new Particle());
        }
    
    }

    static animate()
    {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "rgba(0,0,0,0.02)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        Particle.handleParticles();
        hue += 0.2;
        requestAnimationFrame(Particle.animate);
    }

    static handleParticles()
    {
        for (let i = 0; i < particlesArray.length; i++)
        {
            particlesArray[i].update();
            particlesArray[i].draw();
            for (let j = i; j < particlesArray.length; j++)
            {
                const dx = (particlesArray[i].x - particlesArray[j].x);
                const dy = (particlesArray[i].y - particlesArray[j].y)
                const distance = Math.sqrt((dx * dx) + (dy * dy));
                if (distance < 100)
                {
                    context.beginPath();
                    context.strokeStyle = particlesArray[i].color;
                    context.lineWidth = 0.5; //particlesArray[i].size;
                    context.moveTo(particlesArray[i].x, particlesArray[i].y);
                    context.lineTo(particlesArray[j].x, particlesArray[j].y);
                    context.stroke();
                }
            }
            if (particlesArray[i].size <= 0.3)
            {
                particlesArray.splice(i, 1);
                i--;
            }
        }
    }
}

//init();
Particle.animate();