const FPS = 60;
const PADDING_X = 40;
const BUBLES_COLORS = ['yellow','green','red','blue', 'pink', 'soap'];
const canvas = document.createElement('canvas');
const gameBox = document.getElementById('game-box');
let isPaused = false;
gameBox.append(canvas);
const scaleCanvas = function() {
    canvas.width = gameBox.offsetWidth;
    canvas.height = gameBox.offsetHeight;
}
window.addEventListener('resize', ()=> {
    scaleCanvas();
});
scaleCanvas();
const ctx = canvas.getContext('2d');

const mathRandom = function(min, max) {
    return Math.random() * (max - min) + min;
}

const bubblesArray = new Array();
const effectsArray = new Array();
const images = new Object();

const loadImage = function (path) {
    const loadPromise = new Promise((res, rej) => {
        const img = new Image();
        img.onload = () => {
            res(img);
        }
        img.onerror = () => {
            rej('Failed');
        }
        img.src = path;
    });
    return loadPromise;
}

class Bubble {
    constructor(object) {
        this.size = object.size ? (object.size/100) * canvas.width : mathRandom(0.1, 0.15) * canvas.width;
        this.imageName = object.imageName ? object.imageName : BUBLES_COLORS[Math.floor(Math.random()*BUBLES_COLORS.length)];
        this.x = mathRandom(0 + PADDING_X + this.size, canvas.width - PADDING_X - this.size);
        this.y = canvas.height + this.size;
        this.speed = object.speed ? object.speed : mathRandom(0.5, 2);
        this.deformation = {
            y: 0,
            x: 0,
            yIsGrowing: true,
            xIsGrowing: false,
        }
    }
    destroy = function() {
        effectsArray.push(new Effect(this.imageName, this.size, this.x, this.y));
    }
}
class Effect {
    constructor(color, size, x, y) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size / 4;
        this.entities = new Array();
        this.centerX = x + (this.size/2);
        this.centerY = y + (this.size/2);
        this.count = 7;
        angle = Math.random()*Math.PI*2;
        for (let i = 0; i < this.count; i++) {
            const element = array[i];
            
        }
        console.log(this);
    }
}

const render = function() {
    ctx.fillStyle = "#222222";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    bubblesArray.forEach(el => {
        ctx.drawImage(images[el.imageName], el.x - el.deformation.x, el.y - el.deformation.y, el.size + el.deformation.x, el.size + el.deformation.y);
        // console.log(el.y);
    });
    // effectsArray.forEach(effect => {
    //     effect.entities.forEach(el => {
    //         ctx.drawImage(images[effect.color], el.xC * effect.size + effect.centerX, el.yC * effect.size + effect.centerY, effect.size, effect.size);

    //     });
    // });




}




window.main = function () {
    window.requestAnimationFrame( main );
    render();
    // Код, который цикл должен выполнить
  };
  



//loading imgs

const start = async function() {
    for (const color of BUBLES_COLORS) {
        const img = await loadImage(`./img/${color}_bubble.png`);
        images[color] = img;
    }
    console.log(images);
    bubblesArray.push(new Bubble({size: 10, imageName: 'yellow'}));
    setInterval(()=> {
        bubblesArray.forEach((bubble, i) => {
            bubble.y -= bubble.speed * 60/FPS;
            const deformation = bubble.deformation;
            if (deformation.xIsGrowing) {
                deformation.x+=0.10;
            }
            else {
                deformation.x-=0.10;
            }
            if (deformation.yIsGrowing) {
                deformation.y+=0.10;
            }
            else {
                deformation.y-=0.10;
            }
            if (deformation.x > 6 || deformation.x < 0) {
                deformation.xIsGrowing = !deformation.xIsGrowing;
            }
            if (deformation.y > 6 || deformation.y < 0) {
                deformation.yIsGrowing = !deformation.yIsGrowing;
            }
            if (bubble.y < 0 - bubble.size) bubblesArray.splice(i, 1);
            if (bubble.destroyed) {
                bubblesArray.splice(i, 1);
            }
        });
    }, 1000/FPS);
    setInterval(()=> {
        if(!Math.floor(mathRandom(0, 3))) {
            bubblesArray.push(new Bubble({}));
        }
        if (!!!bubblesArray.length) {
            bubblesArray.push(new Bubble({speed:2}));
            bubblesArray.push(new Bubble({speed:1}));
            bubblesArray.push(new Bubble({speed:3}));
        }
    }, 500)
    if (!isPaused) {
        main(); // Start the cycle
    }
}

start();

canvas.addEventListener('click', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    bubblesArray.forEach((entity, i) => {
        const entityX = entity.x;
        const entityY = entity.y;
        const centerX = entityX + (entity.size / 2);
        const centerY = entityY + (entity.size / 2);
        const radiusLenght = entity.size/2;
        const distance = Math.sqrt(Math.pow(x-centerX,2) + Math.pow(y-centerY,2));
        if (radiusLenght>distance) {
            bubblesArray.splice(i, 1);
            entity.destroy();
        }
    });
});

new Effect();