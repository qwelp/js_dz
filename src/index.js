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
    for (let i = 0; i < array.length; i++) {
        fn(array[i]);
    }
}

/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array
 */
function reduce(array, fn, initial) {
    for (let i = 0; i < array.length; i++) {
        fn(initial, array[i]);
    }
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
function slice(array, from, to = array.length) {
    let neewArr = [];

    for (let i = from; i < to; i++) {
        neewArr.push(array[i]);
    }

    return neewArr;
}

/*
 Задание 6 *:

 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj = {}) {

    let p = new Proxy(obj, {
        set: function(target, prop, value) {
            target[prop] = Math.pow(value, 2);

            return true;
        }
    });

    p.one = 1;
    p.two = 2;
    p.three = 3;
}

createProxy();

/*

export {
    forEach,
    map,
    reduce,
    upperProps,
    slice,
    createProxy
};
*/
