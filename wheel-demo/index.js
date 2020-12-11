let angle = 90;
const BACKEND_URL = 'http://176.37.194.15:8080';
[...document.querySelectorAll('.moving-wheel-text-box')].forEach(el => {
    if (angle > 100 && angle < 230) {
        const span = el.querySelector('span')
        span.style.transform = `scale(-1, -1)`;
        span.style.textAlign = 'left';
    }
    el.style.transform = `translateX(-50%) translateY(-50%) rotate(${angle}deg)`;
    angle += 45;
});

const form = document.getElementById('phone-form');
const textInput = document.getElementById('phone-input');
const submitBtn = document.querySelector('.submit-btn');
const wheel = document.getElementById('wheel');
textInput.addEventListener('input', (event) => {
    if (validator.isMobilePhone(event.target.value)) {
        submitBtn.removeAttribute('disabled', '');
    }
    else {
        submitBtn.setAttribute('disabled', '');
    }
});
form.addEventListener('submit' ,event => {
    event.preventDefault();
    const jsonString = JSON.stringify({
        phone: textInput.value

    });
    console.log("SUBMIT");
        data.optionIndex = Math.floor(Math.random()*8);
    
        if (data.error === 'phone') {
            alert('Этот номер телефона уже использовали');
        } 
        if (data.optionIndex) {
            let angle = 0;
            let speed = 2;
            const optionAngle = 360/8*data.optionIndex+90
            submitBtn.setAttribute('disabled', '');
            const animationInterval = setInterval(()=> {
                angle+=speed;
                if (speed < 0.5 && angle <= 360) {
                    if(angle > optionAngle - 10) {
                        speed -=0.01;
                    }
                    if(angle > optionAngle) {
                        clearInterval(animationInterval);
                    }
                }
                else {
                    speed-=0.005;
                    if (angle >= 360) {
                        angle = 1;
                    }
                }
                wheel.style.transform = `rotate(${angle}deg)`;
            }, 10);
        }
    

});
