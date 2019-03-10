window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);
window.addEventListener("mouseup", mouseUp);
window.addEventListener("mousedown", mouseDown);
window.addEventListener("click", clickHandler);
let track = [[]], record = [], time = [], sound= [];
let soundsList = {
    q: "WilhelmScream",
    a: "boom",
    s: "tom",
    d: "kick",
    f: "clap",
    g: "hihat",
    h: "snare",
    j: "openhat",
    k: "ride",
    l: "tink"
}

function loadAudio() {
    Object.values(soundsList).forEach((e) => sound[e] = new Audio('./sounds/' + e + '.wav'));
}

function keyDown(e) { 
    if (document.getElementById(e.key)) {
        document.getElementById(e.key).classList.add('key-pressed')
        PlayKey(e);
    }
}

function keyUp(e) { 
    if (document.getElementById(e.key)) {
        document.getElementById(e.key).classList.remove('key-pressed')
    }
}

function mouseDown(e) { 
    e.target.classList.add('key-pressed')
}

function mouseUp(e) { 
    e.target.classList.remove('key-pressed')
}

function clickHandler(e) {
    PlayKey({ key: e.target.id });
}

function Record(trackNumber) { 
    if (record[trackNumber]) { 
        record[trackNumber] = false;
        document.getElementById("recordBtn" + trackNumber).innerText = "Record " + trackNumber;
    }
    else { 
        record[trackNumber] = true;
        time[trackNumber] = Date.now();
        track[trackNumber] = [];
        document.getElementById("recordBtn" + trackNumber).innerText = "Stop";
    }
}

function PlayKey(e) {
    sound[soundsList[e.key]].currentTime = 0; 
    sound[soundsList[e.key]].play();
    console.log(soundsList[e.key]);

    for (i = 1; i <= track.length; i++){
        if (record[i]) {
            track[i].push(
            {
                delay: Date.now() - time[i],
                key: e.key
            })
        }
    }
}

function Play(trackNumber) {
    if (track[trackNumber].length > 0) { 
        track[trackNumber].forEach((e) => {
            setTimeout(() => { PlayKey(e) }, e.delay);
        })
    }
}
