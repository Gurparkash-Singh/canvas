let canvas = window.document.getElementById("canvas");
let context = canvas.getContext("2d");
let num = 7;
let flowEffect;

window.onload = () => 
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    flowEffect = new Effect(canvas, context, num);
};

window.addEventListener("resize", () => 
{
    Effect.cancelAnim();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    flowEffect = new Effect(canvas, context, num);
});


window.addEventListener("mousemove", Effect.mouseMove);