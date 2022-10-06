window.addEventListener("load", () => {
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // canvas settings:
    ctx.fillStyle = 'green';
    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowOffsetX = 10;
    ctx,shadowOffsetY = 5;
    ctx.shadowBlur = 10;

    // effect settings:
    const maxLevel = 10;
    const branches = 2;
    let size = canvas.width < canvas.height ? canvas.width * 0.3 : canvas.height * 0.3;

    let sides = 5;
    let scale = 0.9;
    let spread = 0.5;
    let lineWidth = Math.random() * 20 + 10;
    let color = 'hsl('+(Math.random() * 360)+', 100%, 50%)';
    // let color = "#0070ff"

    // Controls:
    const randomizeButton = document.getElementById('randomizeButton');
    const resetButton = document.getElementById('resetButton');
    const slider_spread = document.getElementById('spread');
    const label_spread =  document.querySelector('[for="spread"]');
    slider_spread.addEventListener('change', (e) => {
        spread = e.target.value;
        updateSliders()
        drawFractal();
    });
    const slider_sides = document.getElementById('sides');
    const label_sides =  document.querySelector('[for="sides"]');
    slider_sides.addEventListener('change', (e) => {
        sides = e.target.value;
        updateSliders();
        drawFractal();
    });

    function drawBranch(level)
    {
        
        if (level > maxLevel) return;
        
        // Create  line
        ctx.beginPath();
        ctx.moveTo(0, 0);
        // change - 0 to smaller number i.e. -70
        ctx.lineTo(size - 0, 0);
        ctx.stroke();
        
        for (let i = 0; i < branches; i++)
        {
            ctx.save();
            // ctx.strokeStyle = color;
            
            // Set properties for next line
            // change the value after the comma for broken fractal
            ctx.translate(size - (size/branches) * i, 0);
            ctx.scale(scale, scale);

            ctx.save();
            ctx.rotate(spread);
            
            drawBranch(level + 1);
            ctx.restore();

            ctx.restore();
        }
        // draw circles
        ctx.beginPath();
        ctx.arc(0, size, size * 0.1, 0, Math.PI * 2);
        ctx.fill();
    }
    
    function drawFractal()
    {
        ctx.clearRect(0,0, canvas.width, canvas.height);

        // Set translate, scale and rotate
        ctx.save();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.translate(canvas.width/2, canvas.height/2);
        
        for (let i = 0; i < sides; i++)
        {
            ctx.rotate((Math.PI * 2 / sides));
            drawBranch(0);
        }

        ctx.restore();
        randomizeButton.style.backgroundColor = color;
    }
    drawFractal();

    function randomizeFractal()
    {
        sides = Math.floor(Math.random() * 7 + 2);
        scale = Math.random() * 0.4 + 0.4;
        spread = Math.random() * 2.9 + 0.1;
        lineWidth = Math.random() * 20 + 10;
        color = 'hsl('+(Math.random() * 360)+', 100%, 50%)';
    }

    function resetFractal()
    {
        sides = 5;
        scale = 0.5;
        spread = 0.7;
        lineWidth = 15;
        color = '#0070ff';
    }

    randomizeButton.addEventListener("click", () => {
        randomizeFractal();
        updateSliders();
        drawFractal();
    });

    resetButton.addEventListener('click', () => {
        resetFractal();
        updateSliders();
        drawFractal();
    })

    function updateSliders()
    {
        slider_spread.value = spread;
        label_spread.innerText = "Spread: " + Number(spread).toFixed(2);
        slider_sides.value = sides;
        label_sides.innerText = "Sides: " + sides;
    }
    updateSliders();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        size = canvas.width < canvas.height ? canvas.width * 0.3 : canvas.height * 0.3;
        ctx.shadowColor = 'rgba(0,0,0,0.7)';
        ctx.shadowOffsetX = 10;
        ctx,shadowOffsetY = 5;
        ctx.shadowBlur = 10;
        drawFractal();
    })
});