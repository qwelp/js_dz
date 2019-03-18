/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

filterNameInput.addEventListener('keyup', function() {
    filter();
});

addButton.addEventListener('click', () => {
    cookieAdd();

    if (filterNameInput.value) {
        filter();
    } else {
        itemsList();
    }
});

const cookieList = () => {

    const objCookie = document.cookie.split('; ').reduce((obj, v) => {
        const [name, value] = v.split('=');

        obj[name] = value;

        return obj;
    }, {});
    return objCookie;
};

const itemsList = () => {

    listTable.innerHTML = '';

    for (let item in cookieList()) {
        if (item.length > 0) {
            listTable.innerHTML += `<tr><td>${item}</td><td>${cookieList()[item]}</td><td><a class="delete" data-name="${item}" href="#">Удалить</a></td></tr>`;
        }
    }
};

const cookieAdd = () => {
    document.cookie = `${addNameInput.value}=${addValueInput.value}`;

    addNameInput.value = '';
    addValueInput.value = '';
};

const isMatching = (full, chunk) => {
    if (full.toLowerCase().indexOf(chunk.toLowerCase()) >= 0) {
        return true;
    }
    return false;
};

const filter = () => {

    let items = cookieList();
    let obj = {};

    for (let item in items) {
        if (isMatching(item, filterNameInput.value) || isMatching(items[item], filterNameInput.value)) {
            obj[item] = items[item];
        }
    }

    listTable.innerHTML = '';

    for (let key in obj) {

        console.log(key);

        listTable.innerHTML += `<tr><td>${key}</td><td>${items[key]}</td><td><a class="delete" data-name="${key}" href="#">Удалить</a></td></tr>`;
    }
};

const deleteCookie = name => {
    const date = new Date ( );
    date.setTime (date.getTime() - 1);
    document.cookie = name += "=; expires=" + date.toGMTString();
};

itemsList();

document.addEventListener('click', (e) => {
    let target = e.target;
    if (target.getAttribute('class') === 'delete') {
        let name = target.dataset.name;
        deleteCookie(name);
        itemsList();
    }
});