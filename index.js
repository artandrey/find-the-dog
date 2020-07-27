const imgs = [
    {
        img: '1.jpg',
        type: 'cake'
    },
    {
        img: '2.jpg',
        type: 'dog'
    },
    {
        img: '3.jpg',
        type: 'cake'
    },
    {
        img: '4.jpg',
        type: 'dog'
    },
    {
        img: '5.jpg',
        type: 'dog'
    },
    {
        img: '6.jpg',
        type: 'cake'
    },
    {
        img: '7.jpg',
        type: 'dog'
    },
    {
        img: '8.jpg',
        type: 'cake'
    },
    {
        img: '9.jpg',
        type: 'cake'
    },
    {
        img: '10.jpg',
        type: 'dog'
    },
    {
        img: '11.jpg',
        type: 'cake'
    },
    {
        img: '12.jpg',
        type: 'dog'
    }
];



const container = document.querySelector('.container');
const img = document.querySelector('.main-img');
const btnBox = document.querySelector('.btx-box');
const timeBox = document.querySelector('.time');
const startBtn = document.querySelector('.start-btn');
const startBox = document.querySelector('.start');
const gameBox = document.querySelector('.game');
const endBox = document.querySelector('.end');


endBox.querySelector('button').addEventListener('click' , () => {
    startBtn.click();
    img.src = '';
    const counter = document.querySelector('.counter'); 
    counter.textContent = '3';
    endBox.style.display = 'none';
    
});



btnBox.addEventListener('click', (e) => {
    if (e.target.nodeName !== 'BUTTON') return;
    clearInterval(timerInterval);
    timeCounter = timeCounterDefault;
    const target = e.target;
    btnBox.style.pointerEvents = 'none';
    if (target.dataset.type === 'dog') {
        manageImg('dog');
    }
    else {
        manageImg('cake');
    }
});

const manageImg = function(btnValue) {
    if (img.dataset.type === btnValue) {
        container.style.backgroundColor = '#56bb2ef1';
    }
    else {
        container.style.backgroundColor = '#d43e3ef1';
        fails++;
    }
    
    setTimeout(() => {
        container.style.backgroundColor = 'rgba(255, 255, 255, 0.733)';
        btnBox.style.pointerEvents = 'unset';
        if (imgsCounter + 1 > currentArray.length) {
            gameBox.style.display = 'none';
            endBox.style.display = 'block';
            endBox.querySelector('span').textContent = fails;
            timeBox.style.display = 'none';
            gameIsStarted = false
            currentArray = ''
            imgsCounter = 0
            fails = 0
            timerInterval = null
            timeCounter = 100
            timeCounterDefault = timeCounter
            return;
        }
        img.src = `./img/${currentArray[imgsCounter].img}`;
        img.setAttribute('data-type', currentArray[imgsCounter].type)
        imgsCounter++;
        timerInterval = setInterval(() => {
            timeCounter--;
            const percents = (timeCounterDefault - timeCounter) / timeCounterDefault * 100;
            changeTimeLine(percents);
            if (timeCounter <= 0) {
                clearInterval(timerInterval) 
                    if (img.dataset.type === 'dog') {
                        const btn = [...btnBox.querySelectorAll('button')].find(el => el.dataset.type === 'cake');
                        btn.click();
                    }
                    else {
                        const btn = [...btnBox.querySelectorAll('button')].find(el => el.dataset.type === 'dog');
                        btn.click();
                    }
                
            }
        }, 1000/60); 
    }, 500)
}


startBtn.addEventListener('click', () => {
    if (gameIsStarted) return;
    gameIsStarted = true;
    startBox.style.display = 'none';
    gameBox.style.display = 'block';
    btnBox.style.display = 'none';
    img.style.display = 'block';
    const counter = document.querySelector('.counter'); 
    counter.style.display = 'block';
    let counterValue = 3;
    const interval = setInterval(() => {
        counterValue--;
        counter.textContent = counterValue;
        if (counterValue < 1) {
            timeBox.style.display = 'block';
            clearInterval(interval);
            counter.style.display = 'none';
            currentArray = mixArray(imgs);
            img.src = `./img/${currentArray[0].img}`;
            img.setAttribute('data-type', currentArray[0].type);
            btnBox.style.display = 'flex';
            timerInterval = setInterval(() => {
                timeCounter--;
                const percents = (timeCounterDefault - timeCounter) / timeCounterDefault * 100;
                changeTimeLine(percents);
                if (timeCounter <= 0) {
                    clearInterval(timerInterval) 
                        if (img.dataset.type === 'dog') {
                            const btn = [...btnBox.querySelectorAll('button')].find(el => el.dataset.type === 'cake');
                            btn.click();
                        }
                        else {
                            const btn = [...btnBox.querySelectorAll('button')].find(el => el.dataset.type === 'dog');
                            btn.click();
                        }
                    
                }
            }, 1000/60); 
            imgsCounter++;
        }
    }, 1000);
    
});
//current game variables
let gameIsStarted = false,
    currentArray = '',
    imgsCounter = 0,
    fails = 0,
    timerInterval = null,
    timeCounter = 90,
    timeCounterDefault = timeCounter

//

const changeTimeLine = function (percents) {
    timeBox.querySelector('div').style.width = 100 - percents + '%';
}

const mixArray = function(array) {
    const copy = [...array];
    const out = new Array();
    for (let i = copy.length-1; i > -1; i--) {
        const index = Math.floor(Math.random() * i)
        out.push(copy[index]);
        copy.splice(index, 1);
    }
    return out;
}