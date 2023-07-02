update();

document.querySelector('.notification__form button').addEventListener('click', function () {
  let time = document.querySelector('.notification__form input').value;
  let message = document.querySelector('.notification__form textarea').value;
  let info = document.querySelector('.notification__info');

  if (!time || !message) {
    info.textContent = '* добавьте время и сообщение';
    info.style.opacity = 1;
    setTimeout(() => {
      info.style.opacity = 0;
    }, 2000);
    setTimeout(() => {
      info.textContent = '';
    }, 3000);
    return;
  }
  localStorage.setItem(time, message);
  update();
  Swal.fire('Уведомление добавлено!', '', 'success');
});

document.querySelector('.notification__list > button').addEventListener('click', function () {
  if (localStorage.length) {
    Swal.fire({
      title: 'Очистить список уведомлений?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#242B2C',
      cancelButtonColor: '#ff4711',
      confirmButtonText: 'ОК',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Удалено!', 'Вы очистили список уведомлений', 'success');
        localStorage.clear();
        update();
        document.querySelector('.notification__list').hidden = true;
      }
    });
  } else if (!localStorage.length) {
    alert('Уведомлений нет!');
  }
});

function update() {
  const timeFormat = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  localStorage.removeItem(
    Object.keys(localStorage).filter((element) => /^[a-zA-Z]+$/.test(element)),
  );

  if (!localStorage.length) {
    document.querySelector('.notification__list').hidden = true;
  } else {
    document.querySelector('.notification__list').hidden = false;
  }
  document.querySelector('.notification__list > div').innerHTML = '';
  document.querySelector('.notification__info').textContent = '';

  for (let key of Object.keys(localStorage)
    .sort()
    .filter((element) => timeFormat.test(element))) {
    document.querySelector('.notification__list > div').insertAdjacentHTML(
      'beforeend',
      `
      <div class = "notification__item">
        <div>${key} - ${localStorage.getItem(key)}</div>
        <button data-time = "${key}">&times;</button>
      </div>
    `,
    );
  }
  document.querySelector('.notification__form input').value = '';
  document.querySelector('.notification__form textarea').value = '';
  if (document.querySelector('.audioAlert')) {
    document.querySelector('.audioAlert').remove();
  }
}

document.querySelector('.notification__list').addEventListener('click', function (e) {
  if (!e.target.dataset.time) {
    return;
  }
  localStorage.removeItem(e.target.dataset.time);
  update();
});

setInterval(() => {
  let currentDate = new Date();
  let currentHour = currentDate.getHours();
  if (currentHour < 10) {
    currentHour = '0' + currentHour;
  }
  let currentMinute = currentDate.getMinutes();
  if (currentMinute < 10) {
    currentMinute = '0' + currentMinute;
  }
  let currentTime = `${currentHour}:${currentMinute}`;
  const timeFormat = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

  for (let key of Object.keys(localStorage)
    .sort()
    .filter((element) => timeFormat.test(element))) {
    let keyHour = key.split(':')[0];
    let keyMinute = key.split(':')[1];

    if (key == currentTime || (keyHour == currentHour && keyMinute < currentMinute)) {
      document
        .querySelector(`button[data-time="${key}"]`)
        .closest('.notification__item')
        .classList.add('notification__warning');
      if (!document.querySelector('.audioAlert')) {
        document
          .querySelector('body')
          .insertAdjacentHTML(
            'afterbegin',
            '<audio loop class="audioAlert" autoplay><source src="./source/alert.mp3" type="audio/mpeg"</audio>',
          );
        document.querySelector('.audioAlert').play();
      }
    }
  }
}, 1000);
