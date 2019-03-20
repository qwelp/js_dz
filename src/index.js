ymaps.ready(init);
var myMap;

let popup = document.querySelector('.popup');
let popupClose = document.querySelector('.popup__close');
let popupTitle = document.querySelector('#title');
let popupInfo = document.querySelector('.popupWrapItems__info');
let addBtn = document.querySelector('#addText');
let coordsInput = document.querySelector('#coords');
let textList = document.querySelector('.popupWrapItems');
let arPlacemarks = [];
let inputPageX = document.querySelector("#pos_x");
let inputPageY = document.querySelector("#pos_y");

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

        let balloon = coordsInput.value.split(',');
        let arBalloon = [parseFloat(balloon[0]), parseFloat(balloon[1])];
        
        addBallun(arBalloon, obj);

        name.value = '';
        address.value = '';
        text.value = '';
    });

    myMap.events.add('click', function (e) {
        let pos = e.get('pagePixels');
        let coords = e.get('coords');

        coordsInput.value = coords;

        popupInfo.style.display = 'block';
        textList.innerHTML = '';
        
        getAddress(coords);

        if (!myMap.balloon.isOpen()) {
            popup.style.display = 'block';
            popup.style.top = pos[1] + 'px';
            popup.style.left = pos[0] + 'px';
        } else {
            myMap.balloon.close();
        }
    });
    
    myMap.events.add('balloonopen', function (e) {

        if (!e.get('target').getGeoObjects) {
            let geoObject = e.get('target');
            let target = geoObject.geometry.getCoordinates();
            let pos = target;
            let latitude = pos[0];
            let longitude = pos[1];

            popupInfo.style.display = 'block';
            coordsInput.value = target;

            myMap.hint.close();
            textList.innerHTML = '';

            for (let item of arPlacemarks) {
                if (item.latitude === latitude && item.longitude === longitude) {
                    textList.innerHTML += addText(item.name, item.address, item.text,
                        item.latitude + '_' + item.longitude);
                }
            }

            setTimeout(function () {
                myMap.balloon.close();
                popup.style.top = inputPageY.value + 'px';
                popup.style.left = inputPageX.value + 'px';
                popup.style.display = 'block';
            }, 10);

        } else {
            popup.style.display = 'none';
            coordsInput.value = e.get('target')._geoBounds[0];
        }
    });

    function getAddress(coords) {
        ymaps.geocode(coords).then(function (res) {
            popupTitle.textContent = res.geoObjects.get(0).getAddressLine();
        });
    }

    function addBallun(coords, item) {

        item.latitude = coords[0];
        item.longitude = coords[1];

        arPlacemarks.push(item);

        popupInfo.style.display = 'none';
        textList.innerHTML = '';

        myMap.geoObjects.each(function(context) {
            myMap.geoObjects.remove(context);
        });

        var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
            // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
            '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
            '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
            '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
        );

        let geoObjects = [];

        for (let i = 0; i < arPlacemarks.length; i++) {
            geoObjects[i] = new ymaps.Placemark([arPlacemarks[i].latitude, arPlacemarks[i].longitude],
                {
                    balloonContentHeader: arPlacemarks[i].name,
                    balloonContentBody: arPlacemarks[i].address + `<a class="searchPos" 
                        data-pos="${arPlacemarks[i].latitude}_${arPlacemarks[i].longitude}" 
                        href="#">${arPlacemarks[i].text}</a>`,
                    balloonContentFooter: getDate()
                });

            if (coords[0] === arPlacemarks[i].latitude && coords[1] === arPlacemarks[i].longitude) {
                textList.innerHTML += addText(item.name, item.address, item.text,
                    arPlacemarks[i].latitude + '_' + arPlacemarks[i].longitude);
            }
        }

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
    }

    function addText(name, mesto, text, pos) {
        return `<li class="popupWrapItems__item">
				<span class="popupWrapItems__name">${name} ${getDate()}</span>
				<div class="popupWrapItems__marker"><a class="searchPos" data-pos="${pos}" href="#">${mesto}</a></div>
				<div class="popupWrapItems__text">${text}</div>
			</li>`;
    }

    let getDate = () => {
        let tm = new Date();
        let minute = tm.getMinutes();
        let month = tm.getMonth();

        if (minute < 10) {
            minute = '0' + minute;
        }
        if (month < 10) {
            month = '0' + month;
        }

        return `${tm.getFullYear()}.${month}.${tm.getDate()} ${tm.getHours()}:${minute}:${tm.getSeconds()}`;
    };

    document.addEventListener('click', (e) => {
        let target = e.target;

        inputPageX.value = e.pageX;
        inputPageY.value = e.pageY;

        if (target.getAttribute('class') === 'searchPos') {
            
            let pos = coordsInput.value.split(',');
            let latitude = pos[0];
            let longitude = pos[1];

            textList.innerHTML = '';

            for (let item of arPlacemarks) {
                if (String(item.latitude) === latitude && String(item.longitude) === longitude) {
                    textList.innerHTML += addText(item.name, item.address, item.text,
                        item.latitude + '_' + item.longitude);
                }
            }

            if (arPlacemarks.length > 0) {
                myMap.balloon.close();
                popup.style.display = 'block';
                popup.style.top = e.pageY + 'px';
                popup.style.left = e.pageX + 'px';
            }
        }
    });
}