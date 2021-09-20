'use strict';

window.addEventListener('DOMContentLoaded', () => {
  const axios = require('axios').default;

  /* Tabs */
  const tabs = document.querySelectorAll('.tabheader__item '),
    tabsContent = document.querySelectorAll('.tabcontent'),
    tabsParent = document.querySelector('.tabheader__items');
  /* сделать табы и их содержимое не активными  */
  const hideTabContent = () => {
    tabsContent.forEach((item) => {
      item.classList.add('hide');
      item.classList.remove('show', 'fade');
    });
    tabs.forEach((item) => item.classList.remove('tabheader__item_active'));
  };

  /* сделать табы и их содержимое активными  */
  const showTabContent = (i = 0) => {
    tabsContent[i].classList.add('show', 'fade');
    tabsContent[i].classList.remove('hide');
    tabs[i].classList.add('tabheader__item_active');
  };

  hideTabContent();
  showTabContent();
  /*
  по нажатию на таб, сделать его активным и показать содержимое */
  tabsParent.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  /* Timer */
  const deadline = '2021-12-01';

  /* оРасчет временных промежутков */
  const getTimeRemaining = (endtime) => {
    /*  в переменную t получаем разницу между датами */
    const t = Date.parse(endtime) - Date.parse(new Date()),
      /* получаем количество дней до дедлайна */
      days = Math.floor(t / (1000 * 60 * 60 * 24)),
      /* получаем количество часов до дедлайна */
      hours = Math.floor((t / (1000 * 60 * 60)) % 24),
      /* получаем количество минут до дедлайна */
      minutes = Math.floor((t / 1000 / 60) % 60),
      /* получаем количество сукунд до дедлайна */
      seconds = Math.floor((t / 1000) % 60);

    /* возвращаем наружу данные вычислений */
    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  };

  /*  если дата и время меньше 10 то вписываем впереди 0 */
  const getZero = (num) => {
    /* проверяем какое пришло число */
    /*  если число не двухзначное, добавляем впред 0 */
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  };

  /* устанавливаем дату и время на страницу */
  const setClock = (selector, endtime) => {
    const timer = document.querySelector(selector),
      days = timer.querySelector('#days'),
      hours = timer.querySelector('#hours'),
      minutes = timer.querySelector('#minutes'),
      seconds = timer.querySelector('#seconds'),
      timeInterval = setInterval(updateClock, 1000);

    updateClock();

    /* функция обновляющая время каждую секунду */
    function updateClock() {
      /* расчет времени которое осталось прямо на эту секунду */
      const t = getTimeRemaining(endtime);

      /* количество дней которое нужно отобразить на странице */
      days.innerHTML = getZero(t.days);

      /* количество часов которое нужно отобразить на странице */
      hours.innerHTML = getZero(t.hours);

      /* количество минут которое нужно отобразить на странице */
      minutes.innerHTML = getZero(t.minutes);

      /* количество секунд которое нужно отобразить на странице */
      seconds.innerHTML = getZero(t.seconds);

      /* если суммарное время больше дедлайна то стоп интервал */
      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  };
  setClock('.timer', deadline);

  // Modal window START

  /* Получаю со страницы */
  const modalTrigger = document.querySelectorAll('[data-modal]'),
    modal = document.querySelector('.modal');

  /* ф-ция открытия модалки */
  const showModal = () => {
    modal.classList.add('show', 'fade');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
  };
  showModal();
  /* ф-ция открытия модалки во время скролла*/
  /* ф-ция удаления открытия модалки при долистывании до конца страницы*/
  const showModalByScroll = () => {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight
    ) {
      showModal();
      window.removeEventListener('scroll', showModalByScroll);
    }
  };

  /* ф-ция закрытия модалки */
  const closeModal = () => {
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
  };
  closeModal();
  /* открытие модалки */
  modalTrigger.forEach((item) => item.addEventListener('click', showModal));

  /*   закрыть модалку если кликаем мимо формы */
  modal.addEventListener('click', (e) => {
    const target = e.target;
    if (target === modal || target.getAttribute('data-close') === '') {
      closeModal();
    }
  });

  /*   закрыть модалку если нажимаем escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  /* показать модалку через время как зашел на страницу */
  const modalTimerId = setTimeout(() => {
    showModal();
  }, 50000);

  /* отследить скролл для показа модалки в конце страницы */
  window.addEventListener('scroll', showModalByScroll);

  // Modal window END

  /* Используем классы для динамического
  создания карточек */
  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.classes = classes;
      this.parent = document.querySelector(parentSelector);
      this.transfer = 27;
      this.changeToUAH();
    }
    changeToUAH() {
      this.price = this.price * this.transfer;
    }
    render() {
      const element = document.createElement('div');
      if (this.classes.length === 0) {
        this.element = 'menu__item';
        element.classList.add(this.element);
      } else {
        this.classes.forEach((className) => element.classList.add(className));
      }
      element.innerHTML = `
      <img src=${this.src} alt=${this.alt}>
      <h3 class="menu__item-subtitle">${this.title}</h3>
      <div class="menu__item-descr">${this.descr}</div>
      <div class="menu__item-divider"></div>
      <div class="menu__item-price">
          <div class="menu__item-cost">Цена:</div>
          <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
      </div>`;
      this.parent.append(element);
    }
  }

  axios
    .get('http://localhost:3000/menu')

    .then((data) => {
      data.data.forEach(({ img, altimg, title, descr, price }) => {
        new MenuCard(
          img,
          altimg,
          title,
          descr,
          price,
          '.menu .container'
        ).render();
      });
    });

  // Forms

  const forms = document.querySelectorAll('form');

  /* хранилище сообщений на случай ошибки и успеха */
  const message = {
    loading: 'img/form/spinner.svg',
    success: 'Спасибо! Скоро мы с вами свяжемся',
    failure: 'Что-то пошло не так...',
  };

  /* Навешиваем обработчик каждой форме */
  forms.forEach((item) => {
    bindPostData(item);
  });

  /* ф-ция постинга данных */
  const postData = async (url, data) => {
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: data,
    });
    return await result.json();
  };

  /* ф-ция привязки отправки данных из формы */
  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); /* cancel standart function button */

      let statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.classList.add('order__status-message');
      form.insertAdjacentElement('beforeend', statusMessage);

      /* Собираем данные из формы */
      const formData = new FormData(form);

      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      /* Отправляем на сервер */
      postData('http://localhost:3000/requests', json)
        .then((data) => {
          console.log(data);
          showThanksModal(message.success);
          statusMessage.remove();
        })
        .catch(() => {
          showThanksModal(message.failure);
        })
        .finally(() => {
          form.reset();
        });
    });
  }

  /* ф-ция благодарности за отправку данных из формы */
  function showThanksModal(message) {
    /* получение модального диалога */
    const prevModalDialog = document.querySelector('.modal__dialog');

    /* прячем до вызова показа модалки */
    prevModalDialog.classList.add('hide');
    showModal();

    /* наполняем контентом окно */
    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
    <div class="modal__content">
    <div class="modal__close" data-close>×</div>
    <div class="modal__title">${message}</div>
    </div>
    `;

    /* добавляем контент в модальное окно после отправки */
    document.querySelector('.modal').append(thanksModal);

    /* закрытие благодарственного модального окна вместе с содержимым и контентом */
    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.add('show');
      prevModalDialog.classList.remove('hide');
      closeModal();
    }, 4000);
  }

  /* Slider */

  const slider = document.querySelector('.offer__slider'),
    sliderWrapper = document.querySelector('.offer__slider-wrapper'),
    sliderInner = document.querySelector('.offer__slider-inner'),
    sliderItems = document.querySelectorAll('.offer__slide'),
    // sliderCounter = document.querySelector(".offer__slider-counter"), /* old version slider */
    sliderCurrent = document.querySelector('#current'),
    sliderTotal = document.querySelector('#total'),
    sliderPrevBtn = document.querySelector('.offer__slider-prev'),
    sliderNextBtn = document.querySelector('.offer__slider-next'),
    width =
      window.getComputedStyle(sliderWrapper).width; /* slider wrapper size */
  // parsedWidth = parseInt(width); /* width in number type */

  /* slider v 2.0 */

  /* номер слайда по порядку */
  let slideIndex = 1;

  /* отступ при transform */
  let offset = 0;

  if (sliderItems.length < 10) {
    sliderTotal.textContent = `0${sliderItems.length}`;
    sliderCurrent.textContent = `0${slideIndex}`;
  } else {
    sliderTotal.textContent = sliderItems.length;
    sliderCurrent.textContent = slideIndex;
  }

  sliderInner.style.width = 100 * sliderItems.length + '%';
  sliderInner.style.display = 'flex';
  sliderInner.style.transition = '0.8s all';

  sliderWrapper.style.overflow = 'hidden';

  sliderItems.forEach((slide) => (slide.style.width = width));

  slider.style.position = 'relative';

  /* Обертка для дотсов */
  const sliderDots = document.createElement('ol'),
    dots = [];
  sliderDots.classList.add('carousel-indicators');
  slider.append(sliderDots);

  for (let i = 0; i < sliderItems.length; i++) {
    const dot = document.createElement('li');
    dot.classList.add('dot');
    /* каждой точке устанавливаем аттрибут и говорим к какому слайду относится. И устанавливаем нумерацию начиная с 1 */
    dot.setAttribute('data-slide-to', i + 1);
    if (i === 0) {
      dot.style.opacity = 1;
    }
    sliderDots.append(dot);
    dots.push(dot);
  }

  const addDotsOpacity = () => {
    dots.forEach((dot) => (dot.style.opacity = '.5'));
    dots[slideIndex - 1].style.opacity = 1;
  };

  const deleteNotDigets = (str) => {
    return +str.replace(/\D/g, '');
  };

  const checkSliderCurrent = () => {
    if (sliderItems.length < 10) {
      sliderCurrent.textContent = `0${slideIndex}`;
    } else {
      sliderCurrent.textContent = slideIndex;
    }
  };

  sliderNextBtn.addEventListener('click', () => {
    /* если последний слайд, то возвращаемся в начало */
    if (offset === deleteNotDigets(width) * (sliderItems.length - 1)) {
      offset = 0;
    } else {
      /* если не последний, то увеличиваем */
      offset += deleteNotDigets(width);
    }
    sliderInner.style.transform = `translateX(-${offset}px)`;

    if (slideIndex === sliderItems.length) {
      slideIndex = 1;
    } else {
      slideIndex++;
    }
    checkSliderCurrent();
    addDotsOpacity();
  });

  sliderPrevBtn.addEventListener('click', () => {
    /* если первый слайд */
    if (offset === 0) {
      /* возвращаемся в конец */
      offset = deleteNotDigets(width) * (sliderItems.length - 1);
    } else {
      offset -= deleteNotDigets(width);
    }
    sliderInner.style.transform = `translateX(-${offset}px)`;

    if (slideIndex === 1) {
      slideIndex = sliderItems.length;
    } else {
      slideIndex--;
    }
    checkSliderCurrent();
    addDotsOpacity();
  });

  /* ручное переключение слайдов по клику на дотс */
  dots.forEach((dot) => {
    /* вешаем обработчик на каждую отдельную точку */
    dot.addEventListener('click', (e) => {
      const target = e.target;
      const slideTo = target.getAttribute('data-slide-to');
      /* записываем в слайд-индекс индекс точки на которую нажали */
      slideIndex = slideTo;
      offset = deleteNotDigets(width) * (slideTo - 1);
      sliderInner.style.transform = `translateX(-${offset}px)`;
      checkSliderCurrent();
      addDotsOpacity();
    });
  });

  /* slider_v 1.0 */

  // if (sliderItems.length < 10) {
  //   sliderTotal.textContent = `0${sliderItems.length}`;
  // } else {
  //   sliderTotal.textContent = sliderItems.length;
  // }

  // const showSlides = (n) => {
  //   if (n > sliderItems.length) {
  //     slideIndex = 1;
  //   }
  //   if (n < 1) {
  //     slideIndex = sliderItems.length;
  //   }
  //   sliderItems.forEach((slide) => (slide.style.display = "none"));

  /* показать определенный слайд по индексу 0 */
  //   sliderItems[slideIndex - 1].style.display = "block";

  //   if (slideIndex < 10) {
  //     sliderCurrent.textContent = `0${slideIndex}`;
  //   } else {
  //     sliderCurrent.textContent = slideIndex;
  //   }
  // };

  // const plusIndex = (n) => {
  //   showSlides((slideIndex += n));
  // };

  // sliderCounter.addEventListener("click", (e) => {
  //   const target = e.target;
  //   if (target.classList.contains("offer__slider-prev")) {
  //     plusIndex(-1);
  //   }
  //   if (target.classList.contains("offer__slider-next")) {
  //     plusIndex(1);
  //   }
  // });

  // /* активация слайдера */
  // showSlides(slideIndex);
  // setInterval(() => {
  //   plusIndex(1);
  // }, 2000);

  // Calculator

  const result = document.querySelector('.calculating__result span');

  let sex, height, weight, age, ratio;

  if (localStorage.getItem('sex')) {
    sex = localStorage.getItem('sex');
  } else {
    sex = 'female';
    localStorage.setItem('sex', 'female');
  }

  if (localStorage.getItem('ratio')) {
    ratio = localStorage.getItem('ratio');
  } else {
    ratio = 1.375;
    localStorage.setItem('ratio', 1.375);
  }

  const initLocalSettings = (selector, activeClass) => {
    const elements = document.querySelectorAll(selector);

    elements.forEach((el) => {
      el.classList.remove(activeClass);

      if (el.getAttribute('id') === localStorage.getItem('sex')) {
        el.classList.add(activeClass);
      }
      if (el.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
        el.classList.add(activeClass);
      }
    });
  };
  initLocalSettings('#gender div', 'calculating__choose-item_active');
  initLocalSettings(
    '.calculating__choose_big div',
    'calculating__choose-item_active'
  );

  const calcTotal = () => {
    if (!sex || !height || !weight || !age || !ratio) {
      result.textContent = '0';
      return;
    }

    if (sex === 'female') {
      result.textContent = Math.round(
        (447.6 + 9.2 * weight + 3.1 * height - 4.3 * age) * ratio
      );
    } else {
      result.textContent = Math.round(
        (88.36 + 13.4 * weight + 4.8 * height - 5.7 * age) * ratio
      );
    }
  };
  calcTotal();

  const getStaticInformation = (selector, activeClass) => {
    const elements = document.querySelectorAll(selector);

    elements.forEach((elem) =>
      elem.addEventListener('click', (e) => {
        const target = e.target;

        if (target.getAttribute('data-ratio')) {
          ratio = +target.getAttribute('data-ratio');
          localStorage.setItem('ratio', +target.getAttribute('data-ratio'));
        } else {
          sex = target.getAttribute('id');
          localStorage.setItem('sex', target.getAttribute('id'));
        }

        elements.forEach((el) => el.classList.remove(activeClass));
        target.classList.add(activeClass);
        calcTotal();
      })
    );
  };
  getStaticInformation('#gender div', 'calculating__choose-item_active');
  getStaticInformation(
    '.calculating__choose_big div',
    'calculating__choose-item_active'
  );

  const getDynamicInformation = (selector) => {
    const input = document.querySelector(selector);
    input.addEventListener('input', (e) => {
      const target = e.target;
      if (input.value.match(/\D/g)) {
        input.style.boxShadow = '0px 4px 15px rgb(255 0 0)';
      } else {
        input.style.boxShadow = '';
      }
      if (target.getAttribute('id') === 'height') {
        height = +input.value;
      }
      if (target.getAttribute('id') === 'weight') {
        weight = +input.value;
      }
      if (target.getAttribute('id') === 'age') {
        age = +input.value;
      }
      // switch (input.getAttribute("id")) {
      //   case "height":
      //     height = +input.value;
      //     break;
      //   case "weight":
      //     weight = +input.value;
      //     break;
      //   case "age":
      //     age = +input.value;
      //     break;
      // }
      calcTotal();
    });
  };
  getDynamicInformation('#height');
  getDynamicInformation('#weight');
  getDynamicInformation('#age');

  /* Slow scroll */

  const btnUp = document.querySelector('.up');
  window.addEventListener('scroll', () => {
    if (pageYOffset > 800) {
      btnUp.classList.remove('hide');
      btnUp.classList.add('show');
    } else {
      btnUp.classList.remove('show');
      btnUp.classList.add('hide');
    }
  });

  /* end DOM script */
});

/* jQuery script for scroll */
$(document).ready(function () {
  $(function () {
    $("a[href='#header']").click(function () {
      var _href = $(this).attr('href');
      $('html, body').animate(
        { scrollTop: $(_href).offset().top + 'px' },
        { duration: 900 }
      );
      return false;
    });
  });
});
