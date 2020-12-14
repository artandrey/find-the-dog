const FPS = 60;
const PADDING_X = 40;
const BUBLES_COLORS = ['yellow','green','red','blue', 'soap'];
const canvas = document.createElement('canvas');
const gameBox = document.getElementById('game-box');
let discount = 0;
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
const textArray = new Array();
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
        this.size = object.size ? (object.size/100) * canvas.width : canvas.width > 1000 ? mathRandom(0.1, 0.15) * canvas.width : mathRandom(0.17, 0.22) * canvas.width;
        this.imageName = object.imageName ? object.imageName : BUBLES_COLORS[Math.floor(Math.random()*BUBLES_COLORS.length)];
        this.x = mathRandom(0 + PADDING_X + this.size, canvas.width - PADDING_X - this.size);
        this.y = 0 - this.size;
        this.speed = object.speed ? object.speed : mathRandom(0.5, 2);
        this.deformation = {
            y: 0,
            x: 0,
            yIsGrowing: true,
            xIsGrowing: false,
        }
    }
    destroy = function() {
        discount = (discount*10+1)/10;
        effectsArray.push(new Effect(this.size, this.x, this.y));
        textArray.push(new Text('+0.1%', this.x+(this.size/2), this.y+(this.size/2)));
    }
}
class Effect {
    constructor(size, x, y) {
        this.x = x;
        this.y = y;
        this.size = size / 4;
        this.entities = new Array();
        this.centerX = x + (this.size/2);
        this.centerY = y + (this.size/2);
        this.count = 7;
        this.entities = [];
        this.opacity = 0;
        for (let i = 0; i < this.count; i++) {
            let q = 1
            if (i < this.count/2) {
                q = -1
            }
            this.entities.push({
                x: this.centerX - mathRandom(0.1, size/4)*q,
                y: this.centerY - mathRandom(0.1, size/4)*q,
                moveRight: (i % 2 == 0),
                speed: mathRandom(0.3, 3)
            });
            
        }
        console.log(this);
    }
}
class Text {
    constructor(text, x, y) {
        this.size = 1;
        this.text = text;
        this.x = x;
        this.y = y;
        console.log(this);
    }
}
const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
gradient.addColorStop(0, "#16192e");
gradient.addColorStop(1, "#5f9ea7")
const render = function() {
    ctx.fillStyle = gradient;
    ctx.textAlign = 'center';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    bubblesArray.forEach(el => {
        ctx.drawImage(images[el.imageName], el.x - el.deformation.x, el.y - el.deformation.y, el.size + el.deformation.x, el.size + el.deformation.y);
        
    });
    effectsArray.forEach(effect =>{
    effect.entities.forEach(entity => {
        // console.log(entity);
        ctx.drawImage(images.snow_particle, entity.x, entity.y, effect.size, effect.size); 
    });
    });
    bubblesArray.forEach((bubble, i) => {
        bubble.y += bubble.speed * 60/FPS;
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
        if (bubble.y > canvas.height + bubble.size) bubblesArray.splice(i, 1);
        if (bubble.destroyed) {
            bubblesArray.splice(i, 1);
        }
    });
    effectsArray.forEach((effect, i) => {
        effect.size -= 0.07;
        if (effectsArray.length > 3) {
            effect.size -= 0.3;
        }
        effect.entities.forEach(entity => {
            const q = entity.moveRight ? 1 : -1
            entity.x += entity.speed * q;
            entity.y += Math.pow(entity.speed,2);
        });
        if (effect.size <= 0) {
            effectsArray.splice(i, 1);
        }
    });
    textArray.forEach((text, i) => {
        ctx.font = `bold ${40*text.size}px Game-font`;
        text.size-=0.01;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(text.text, text.x, text.y);
        ctx.strokeText(text.text, text.x, text.y);
        text.y-=0.5;
        if (text.size <= 0) {
            textArray.splice(i, 1);
        }
    });
    ctx.fillStyle = "#222222";
    ctx.fillRect(0,0,canvas.width, 50);
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 40px Game-font';
    ctx.fillText('Score ' + discount + '%', canvas.width/2,40);
}




window.main = function () {
    window.requestAnimationFrame( main );
    render();
    // Код, который цикл должен выполнить
  };
  



//loading imgs

const start = async function() {
    ctx.fillStyle = "#222222";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.font = 'bold 40px Game-font';
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = 'center';
    ctx.fillText('Loading...', canvas.width/2, canvas.height/2);
    ctx.strokeStyle = "#536DFE";
    ctx.strokeText('Loading...', canvas.width/2, canvas.height/2);
    for (const color of BUBLES_COLORS) {
        const img = await loadImage(`./img/${color}_snow.png`);
        images[color] = img;
    }
    images.snow_particle = await loadImage(`./img/snow_particle.png`)
    console.log(images);
    bubblesArray.push(new Bubble({size: 10, imageName: 'yellow'}));
    // setInterval(()=> {
        // bubblesArray.forEach((bubble, i) => {
        //     bubble.y += bubble.speed * 60/FPS;
        //     const deformation = bubble.deformation;
        //     if (deformation.xIsGrowing) {
        //         deformation.x+=0.10;
        //     }
        //     else {
        //         deformation.x-=0.10;
        //     }
        //     if (deformation.yIsGrowing) {
        //         deformation.y+=0.10;
        //     }
        //     else {
        //         deformation.y-=0.10;
        //     }
        //     if (deformation.x > 6 || deformation.x < 0) {
        //         deformation.xIsGrowing = !deformation.xIsGrowing;
        //     }
        //     if (deformation.y > 6 || deformation.y < 0) {
        //         deformation.yIsGrowing = !deformation.yIsGrowing;
        //     }
        //     if (bubble.y > canvas.height + bubble.size) bubblesArray.splice(i, 1);
        //     if (bubble.destroyed) {
        //         bubblesArray.splice(i, 1);
        //     }
        // });
        // effectsArray.forEach((effect, i) => {
        //     effect.size -= 0.07;
        //     effect.entities.forEach(entity => {
        //         const q = entity.moveRight ? 1 : -1
        //         entity.x += entity.speed * q;
        //         entity.y += Math.pow(entity.speed,2);
        //     });
        //     if (effect.size <= 0) {
        //         effectsArray.splice(i, 1);
        //     }
        // });
    // }, 1000/FPS);
    setInterval(()=> {
        if(!Math.floor(mathRandom(0, 3)) && bubblesArray.length < 6) {
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
