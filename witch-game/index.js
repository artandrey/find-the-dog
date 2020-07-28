const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const container = document.querySelector('.container');
const body = document.querySelector('body');
container.prepend(canvas);
let gameIsOn = false;
let resizeTimeout = null;
let allowSpawn = true;
let score = 0;
let hp = 100;
let hiscore = +localStorage.getItem('hiscore');
if (!hiscore) {
    hiscore = 0;
}

addEventListener('resize', () => {
    resize();
});
const resize = function() {
    clearTimeout(resizeTimeout);
    canvas.width = body.clientWidth;
    canvas.height = body.clientHeight;
    if (gameIsOn) {
        resizeTimeout = setTimeout(() => {
            start();
        }, 500);
    }
}
resize();

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
const mathRandom = function(min, max) {
    return Math.random() * (max - min) + min;
}

const start = async function() {
    const WITCH_WIDTH = 100;
    const WITCH_HEIGHT = 100;
    const EXPLODE_WIDTH = 64;
    const EXPLODE_HEIGHT = 64;
    witches = [];
    explodes = [];
    const bg = await loadImage('./img/640px-Sky.jpg');
    const witch = await loadImage('./img/witch.png');
    const witch_left = await loadImage('./img/witch-left.png');
    const explodeSprite = await loadImage('./img/explode.png');
        const explodeFrames = new Array();
        const spriteCanvas = document.createElement('canvas');
        const spriteCtx = spriteCanvas.getContext('2d');
        spriteCanvas.width = 64;
        spriteCanvas.height = 64;
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                console.log(x, y)
                spriteCtx.drawImage(explodeSprite, -x * 64, -y * 64, 320, 320);
                const img = new Image();
                img.src = spriteCanvas.toDataURL();
                spriteCtx.clearRect(0, 0, spriteCanvas.width, spriteCanvas.height)
                img.title = x + ' ' + y
                explodeFrames.push(img);
            }
        }
    const Witch = function() {
            this.x = mathRandom(40, canvas.width - 40);
            this.y = -100;
            this.direction = Math.floor(Math.random()) === 1 ? 'right' : 'left';
            this.speed = mathRandom(1, canvas.height/110);
            this.up = false;
    }
    const Explode = function(x, y) {
        this.x = x;
        this.y = y;
        this.stage = 0;
    }
    witches.push(new Witch);

    ;(function () {
        if (!gameIsOn) {setInterval(() => {
            let bottomCounter = 0;
            const height = canvas.height;
            witches.map(entity => {
                if (entity.x < 40) {
                    entity.direction = 'right'
                }
                else if (entity.x > height - 40) {
                    entity.direction = 'left'
                }
                if (entity.direction === 'right') {
                    entity.x += 0.3 * entity.speed;
                }
                else if (entity.direction) {
                    entity.x -= 0.4 * entity.speed;
                }
                if (!entity.up) {
                    if (entity.y > height/2.5) {
                            entity.y += 1.8 / entity.speed;
                    }
                    else {
                            entity.y += 1.4 * entity.speed;
                    }
                    if (entity.y > height/2.8) {
                            bottomCounter++;
                    }
                    if (bottomCounter > 6) {
                        if (Math.round(Math.random()) === 1) {
                            entity.up = true;
                        }
                    }
                }
                else {
                        if (entity.y < 100) {
                            entity.up = false
                        }
                        else {
                            entity.y -= 2.3 / entity.speed;
                        }
                }
            });
            explodes.map(entity => {
                entity.stage += 0.3;
            });
        }, 10)
        setInterval(() => {
            if (witches.length === 0) {
                for (let i = 0; i < 4; i++) {
                    witches.push(new Witch());
                }
            }
            const height = canvas.height;
            witches.map((entity, i) => {
                if (score < 100) {
                    entity.speed = mathRandom(1, canvas.height/180);
                }
                else if (score > 300) {
                    entity.speed = mathRandom(2, canvas.height/170);
                }
                else {
                    entity.speed = mathRandom(1, canvas.height/140);
                }
                if (mathRandom(1, 10) > 7) {
                    if (entity.x + 200 < canvas.width && entity.y > height - WITCH_HEIGHT * 200) {
                        entity.direction = 'right'
                    }
                    else {
                        entity.direction = 'left'
                    }
                    if (Math.random() > 0.2) {
                        entity.direction = entity.direction === 'right' ? 'left' : 'right'; 
                    }
                    else {
                        entity.up = entity.up ? false : true;
                    }
                
                }
                if (entity.y > height) {
                    witches.splice(i, 1);
                    hp -= 20;
                    if (hp <= 0) {
                        score = 0;
                        hp = 100;
                        witches = [];
                    }
                }
                if (witches.length > 15) allowSpawn = false;
                if (Math.random() > 0.6 && allowSpawn) {
                    witches.push(new Witch);
                    if (Math.random() > 0.9) {
                        setTimeout(() => {
                            witches.push(new Witch);
                        }, Math.floor(Math.random() * 10) * 1000);
                    }
                }
            });
        }, 1000);
        canvas.addEventListener('click', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            witches.forEach((entity, i) => {
                const entityX = entity.x;
                const entityY = entity.y;
                
                if (entityX < x && entityX + WITCH_WIDTH > x && entityY < y && entityY + WITCH_HEIGHT > y) {
                    witches.splice(i, 1);
                    explodes.push(new Explode(x, y));
                    score++;
                }
            });
        }); }
        function main() {




            
            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
            witches.forEach(entity => {
                if (entity.direction === 'right') {
                    ctx.drawImage(witch, entity.x, entity.y, WITCH_WIDTH, WITCH_HEIGHT);
                }
                else {
                    ctx.drawImage(witch_left, entity.x, entity.y, WITCH_WIDTH, WITCH_HEIGHT);
                }
            });
            explodes.forEach((explode, i) => {
                if (explode.stage > explodeFrames.length - 1) {
                    explodes.splice(i, 1);
                }
                else {
                    ctx.drawImage(explodeFrames[Math.floor(explode.stage)], explode.x, explode.y, EXPLODE_WIDTH, EXPLODE_HEIGHT);
                }
            });
            ctx.fillStyle = '#7543223';
            ctx.font = '20px sans-serif';
            ctx.fillText(score, 30, 65);
            ctx.fillStyle = '#754ff23';
            ctx.font = '20px sans-serif';
            if (score > hiscore) {
                hiscore = score;
                localStorage.setItem('hiscore', score)
            }
            ctx.fillText('HI: ' + hiscore, 30, 90);



            //hp bar 
            ctx.strokeStyle = '#D32F2F';
            ctx.fillStyle = '#F44336';
            const barWidth = canvas.width / 2;
            const barHeight = 30;

            ctx.strokeRect(canvas.width/2 - barWidth/2, 10, barWidth, barHeight);
            ctx.fill();

            ctx.fillRect(canvas.width/2 - barWidth/2, 10, barWidth/100 * hp, barHeight)

            window.requestAnimationFrame( main );
            



        }
        gameIsOn = true;
        main(); 
      })();
}

start();