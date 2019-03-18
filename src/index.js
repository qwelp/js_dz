ymaps.ready(init);
var myMap;

let popup = document.querySelector('.popup');
let popupClose = document.querySelector('.popup__close');
let popupTitle = document.querySelector('#title');
let addBtn = document.querySelector('#addText');
let coordsInput = document.querySelector('#coords');
let textList = document.querySelector('.popupWrapItems');
let objItems = {};
let arPlacemarks = [];

popupClose.addEventListener('click', () => {
    popup.style.display = 'none';
});

function init () {

    myMap = new ymaps.Map("map", {
        center: [57.5262, 38.3061], // Углич
        zoom: 11
    });

    addBtn.addEventListener('click', (e) => {
        e.preventDefault();

        let name = document.querySelector('#name');
        let address = document.querySelector('#address');
        let text = document.querySelector('#text');

        let obj = {
            name : name.value,
            address : address.value,
            text : text.value
        };

        name.value = '';
        address.value = '';
        text.value = '';

        let balloon = coordsInput.value.split(',');
        let arBalloon = [parseFloat(balloon[0]), parseFloat(balloon[1])];

        addBallun(arBalloon, obj);
    });
    
    // Обработка события, возникающего при щелчке
    // левой кнопкой мыши в любой точке карты.
    // При возникновении такого события откроем балун.
    myMap.events.add('click', function (e) {
        let pos = e.get('pagePixels');
        let coords = e.get('coords');
        let obj = {};

        coordsInput.value = coords;

        getAddress(coords);

        if (!myMap.balloon.isOpen()) {
            popup.style.display = 'block';
            popup.style.top = pos[1] + 'px';
            popup.style.left = pos[0] + 'px';
        }
        else {
            myMap.balloon.close();
        }
    });

    // Скрываем хинт при открытии балуна.
    /*myMap.events.add('balloonopen', function (e) {
        myMap.hint.close();
    });*/

    // Название н пункта
    function getAddress(coords) {
        ymaps.geocode(coords).then(function (res) {
            popupTitle.textContent = res.geoObjects.get(0).getAddressLine();
        });
    }

    function addBallun(coords, item) {

        let arCoords = String(coords[0] + '_' + coords[1]);
        let arrItems = [];

       /* if (objItems[arCoords] === undefined) {
            arrItems.push(item);
            objItems[arCoords] = arrItems;
        } else {
            let array = objItems[arCoords];

            for (let i = 0; i < array.length; i++) {
                arrItems.push(array[i]);
            }
            arrItems.push(item);

            objItems[arCoords] = arrItems;
        }*/

        item.latitude = coords[0];
        item.longitude = coords[1];

        arPlacemarks.push(item);

        textList.innerHTML = '';

        myMap.geoObjects.each(function(context) {
            myMap.geoObjects.remove(context);
        });

        let geoObjects = [];

        for (let i = 0; i < arPlacemarks.length; i++) {
            geoObjects[i] = new ymaps.Placemark([arPlacemarks[i].latitude, arPlacemarks[i].longitude],
                {
                    balloonContentHeader: arPlacemarks[i].name,
                    balloonContentBody: arPlacemarks[i].address,
                    balloonContentFooter: arPlacemarks[i].text
                });

            textList.innerHTML += addText(item.name, item.name, item.name, item.text);
        }

        var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
            // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
            '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
            '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
            '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
        );

        let clusterer = new ymaps.Clusterer({
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: true,
            // Устанавливаем стандартный макет балуна кластера "Карусель".
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            // Устанавливаем собственный макет.
            clusterBalloonItemContentLayout: customItemContentLayout,
            // Устанавливаем режим открытия балуна.
            // В данном примере балун никогда не будет открываться в режиме панели.
            clusterBalloonPanelMaxMapArea: 0,
            // Устанавливаем размеры макета контента балуна (в пикселях).
            clusterBalloonContentLayoutWidth: 200,
            clusterBalloonContentLayoutHeight: 130,
            // Устанавливаем максимальное количество элементов в нижней панели на одной странице
            clusterBalloonPagerSize: 5
            // Настройка внешнего вида нижней панели.
            // Режим marker рекомендуется использовать с небольшим количеством элементов.
            // clusterBalloonPagerType: 'marker',
            // Можно отключить зацикливание списка при навигации при помощи боковых стрелок.
            // clusterBalloonCycling: false,
            // Можно отключить отображение меню навигации.
            // clusterBalloonPagerVisible: false
        });

        myMap.geoObjects.add(clusterer);
        clusterer.add(geoObjects);

        /*var placemarks = [];
        for (let item of objItems[arCoords]) {
            var placemark = new ymaps.Placemark(coords, {
                // Устаналиваем данные, которые будут отображаться в балуне.
                balloonContentHeader: item.name,
                balloonContentBody: item.address,
                balloonContentFooter: item.text
            });
            placemarks.push(placemark);

            textList.innerHTML += addText(item.name, item.name, item.name, item.text);
        }

        var clusterer = new ymaps.Clusterer({
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: true,
            // Устанавливаем стандартный макет балуна кластера "Карусель".
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            // Устанавливаем собственный макет.
            clusterBalloonItemContentLayout: customItemContentLayout,
            // Устанавливаем режим открытия балуна.
            // В данном примере балун никогда не будет открываться в режиме панели.
            clusterBalloonPanelMaxMapArea: 0,
            // Устанавливаем размеры макета контента балуна (в пикселях).
            clusterBalloonContentLayoutWidth: 200,
            clusterBalloonContentLayoutHeight: 130,
            // Устанавливаем максимальное количество элементов в нижней панели на одной странице
            clusterBalloonPagerSize: 5,
            // Настройка внешнего вида нижней панели.
            // Режим marker рекомендуется использовать с небольшим количеством элементов.
            // clusterBalloonPagerType: 'marker',
            // Можно отключить зацикливание списка при навигации при помощи боковых стрелок.
            // clusterBalloonCycling: false,
            // Можно отключить отображение меню навигации.
            // clusterBalloonPagerVisible: false
        });

        myMap.geoObjects.add(clusterer);

        clusterer.add(placemarks);*/
    }

    function addText(name, mesto, date, text) {
        return `<li class="popupWrapItems__item">
				<span class="popupWrapItems__name">${name}</span>
				<span class="popupWrapItems__marker">${mesto}<span>${date}</span></span>
				<div class="popupWrapItems__text">${text}</div>
			</li>`;
    }
}