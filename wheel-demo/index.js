let angle = 90;
const BACKEND_URL = 'http://176.37.194.15:8080/';
[...document.querySelectorAll('.moving-wheel-text-box')].forEach(el => {
    if (angle > 100 && angle < 230) {
        const span = el.querySelector('span')
        span.style.transform = `scale(-1, -1)`;
        span.style.textAlign = 'left';
    }
    el.style.transform = `translateX(-50%) translateY(-50%) rotate(${angle}deg)`;
    angle += 45;
});

const wrapper = document.getElementById('wheel-wrapper');
const showModal = function() {
    wrapper.style.display = "block";
}
const closeModal = function() {
    wrapper.style.display = "none";
}
document.getElementById('wheel-close-btn').addEventListener('click', closeModal);

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
    fetch(BACKEND_URL+'/wheel', {method: 'POST', body: jsonString}).then(data => data.json())
    .then(data => {
        if (data.error === 'phone') {
            alert('Этот номер телефона уже использовали');
            return;
        } 
        if (!Number.isNaN(data.optionIndex)) {
            let angle = 0;
            let speed = 2;
            let optionAngle = 360/8*data.optionIndex+90
            optionAngle = optionAngle > 360 ? optionAngle - 360 : optionAngle;
            submitBtn.setAttribute('disabled', '');
            const animationInterval = setInterval(()=> {
                angle+=speed;
                if (speed < 0.5 && angle <= 360) {
                    if(angle > optionAngle - 10) {
                        speed -=0.01;
                    }
                    if(angle > optionAngle) {
                        clearInterval(animationInterval);
                        setTimeout(() => {
                            document.querySelector('.wheel-container').style.display = 'none';
                            document.querySelector('.wheel-info-box').style.display = 'none';
                            const container = document.createElement('div');
                            container.classList.add('modal-end-container');
                            container.innerHTML = `
                            <h3 class="wheel-modal-end-h3">${data.optionName}</h3>
                            <h4 class="wheel-modal-end-h4">Поздравляем! Не пропустите звонок, мы скоро свяжемся с Вами!</h4>
                            `
                            const modal = document.querySelector('.wheel-modal');
                            modal.append(container);
                            modal.classList.add('end-modal-wheel-color');
                        },1000)
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

});

showModal();