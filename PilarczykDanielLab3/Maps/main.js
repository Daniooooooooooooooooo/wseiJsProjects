let position;
let map;
let marker;
let webSocket;
let playerInfo = {};
let playerName = window.prompt("Type in your name: ");

function initMap() {
    window.addEventListener("keydown", MoveMarker);
    StartWebSocket();
    GetLocalization();
    position = { lat: 50.0, lng: 19.0 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: position,
        keyboardShortcuts: false
    });
    marker = new google.maps.Marker({
        position: position,
        map: map,
        animation: google.maps.Animation.BOUNCE,
    });

    google.maps.event.addListener(map, 'mousemove', function (e) {
        marker.setPosition(e.latLng); 
        var lat = e.latLng.lat;
        var lng = e.latLng.lng;
        let wsData = { lat: lat, lng: lng, id: playerName };
        webSocket.send(JSON.stringify(wsData));
    });
}

function MoveMarker(ev) {
    let lat = marker.getPosition().lat();
    let lng = marker.getPosition().lng();
    switch (ev.code) {                       
        case 'ArrowUp':
            lat += 0.01;
            break;
        case 'ArrowDown':
            lat -= 0.01;
            break;
        case 'ArrowLeft':
            lng -= 0.01;
            break;
        case 'ArrowRight':
            lng += 0.01;
            break;
    }
    let position = { lat, lng }
    marker.setPosition(position)
    let wsData = { lat: lat, lng: lng, id: playerName }
    webSocket.send(JSON.stringify(wsData))        
}

function GetLocalization() {             
    navigator.geolocation.getCurrentPosition(geoOk, geoFail)
}

function geoOk(data) {                     
    let coords = {
        lat: data.coords.latitude,
        lng: data.coords.longitude
    }
    marker.setPosition(coords);
    map.setCenter(coords);
}

function geoFail(error) {                   
    console.log(error)
}

function StartWebSocket() {
    let url = 'ws://91.121.6.192:8010'
    webSocket = new WebSocket(url);
    webSocket.addEventListener('open', onWebSocketOpen);
    webSocket.addEventListener('message', onWebSocketMessage);
}

function onWebSocketOpen(data) {
    console.log(data)
}

function onWebSocketMessage(e) {
    let data = JSON.parse(e.data)
    if (!playerInfo['user' + data.id] && data.id !== playerName) {
        playerInfo['user' + data.id] = new google.maps.Marker({
            position: { lat: data.lat, lng: data.lng },
            map: map
        })
    } else if (data.id !== playerName) {
        playerInfo['user' + data.id].position =
            {
                lat: data.lat, lng: data.lng
            }
        playerInfo['user' + data.id].setPosition(playerInfo['user' + data.id].position)
    }
}