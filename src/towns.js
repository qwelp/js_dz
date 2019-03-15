/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном поря дке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загруки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
let loadTowns = () => {
    let url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';
    return fetch(url).then(response => response.json()).then(response => response.sort((a, b) => {
        if ( a.name < b.name ) return -1;
        if ( a.name < b.name ) return 1;
    }));
};

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
let isMatching = (full, chunk) => {
    if (full.toLowerCase().indexOf(chunk) === 0) {
        return true
    } else {
        return false;
    }
};

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

filterInput.addEventListener('keyup', function() {
    let inputValue = e.target.value;

    if (inputValue === '') {
        filterResult.innerHTML = '';
    } else {

        loadingBlock.style.display = 'block';

        loadTowns().then(function (city) {

            let arr = [],
                html = '';

            for (let item of city) {
                if (isMatching(item.name, inputValue)) {
                    arr.push(item.name);
                }
            }

            arr.forEach(function (name, i, arr) {
                html += '<div>' + name + '</div>';
            });

            filterResult.innerHTML = html;
        }).then(function () {
            loadingBlock.style.display = 'none';
        }).catch(function(error) {

            console.log('Не удалось загрузить города');

            let btn = document.createElement('button');
            btn.setAttribute('id', 'reset');
            btn.innerText = 'Повторить';

            homeworkContainer.after(btn);
        });
    }
});

document.addEventListener('click', (e) => {
    let target = e.target;
    if (target.getAttribute('id') === 'reset') {
        target.remove();
        let clickEvent = new Event('keyup');
        filterInput.dispatchEvent(clickEvent);
    }
});

export {
    loadTowns,
    isMatching
};
