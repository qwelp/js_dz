/* ДЗ 2 - работа с массивами и объеектами */

/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array
 */
function forEach(array, fn) {
    for (let i = 0; i < array.length; i++) {
        fn(array[i], i, array);
    }
}

/*
 Задание 2:

 Напишите аналог встроенного метода map для работы с массивами
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array
 */
function map(array, fn) {
    var newArr = [];

    for (let i = 0; i < array.length; i++) {
        newArr.push(fn(array[i], i, array));
    }

    return newArr;
}

/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array
 */

function reduce(array, fn, initial) {
    let int = 0,
        prev = 0;

    if (initial) {
        prev = initial;
    }

    for (let i = 0; i < array.length; i++) {

        if (!initial && i === 0) {
            prev = array[i];
            continue;
        }

        int = fn(prev, array[i], i, array);

        prev = int;
    }

    return int;
}

/*

 Задание 4:

 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистр и вернуть в виде массива

 Пример:
   upperProps({ name: 'Сергей', lastName: 'Петров' }) вернет ['NAME', 'LASTNAME']
 */
function upperProps(obj) {
    let arrKey = [];

    for (let key in obj) {
        arrKey.push(key.toUpperCase());
    }

    return arrKey;
}

/*
 Задание 5 *:

 Напишите аналог встроенного метода slice для работы с массивами
 Посмотрите как работает slice и повторите это поведение для массива, который будет передан в параметре array
 */
function slice(array, from, to) {
    let newArr = [],
        total = 0;

    if (from === 0 && to === 0) {
        return [];
    }

    if (!from && !to) {
        return array;
    }

    if (from === 0 && !to) {

        for (let i = 0; i < array.length; i++) {
            newArr.push(array[i]);
        }
    }

    if (from === 0 && from <= array.length && to > 0 && to < array.length) {
        for (let i = from; i < to; i++) {
            newArr.push(array[i]);
        }
    }

    if (from === 0 && from <= array.length && to < 0) {
        to = -to;
        total = array.length - to;

        for (let i = from; i < total; i++) {
            newArr.push(array[i]);
        }
    }

    if (from > 0 && from <= array.length && !to) {
        for (let i = from; i < array.length; i++) {
            newArr.push(array[i]);
        }
    }

    if (from > 0 && to > array.length) {
        for (let i = from; i < array.length; i++) {
            newArr.push(array[i]);
        }
    }

    if (from > 0 && from <= array.length && to > 0 && to <= array.length) {
        for (let i = from; i < array.length; i++) {

            if (to === i) {
                break;
            }

            newArr.push(array[i]);
        }
    }

    if (from < 0 && !to) {
        for (let i = 0; i < array.length; i++) {
            newArr.push(array[i]);
        }
    }

    if (from < 0 && to > 0) {

        total = to;

        for (let i = 0; i < total; i++) {
            newArr.push(array[i]);
        }
    }

    if (from < 0 && to < 0) {

        to = - to;
        total = to - 1;

        for (let i = 0; i < total; i++) {
            newArr.push(array[i]);
        }
    }

    return newArr;
}

/*
 Задание 6 *:

 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj = {}) {

    let validator = {
        set: function(obj, prop, value) {
            obj[prop] = value * value;
        }
    };

    return new Proxy(obj, validator);
}

let obj = createProxy({});

obj.one = 1;
obj.two = 4;
obj.three = 3;

console.log(obj);

export {
    forEach,
    map,
    reduce,
    upperProps,
    slice,
    createProxy
};
