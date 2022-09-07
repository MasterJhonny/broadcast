const canvas = document.getElementById("preview");
const btn = document.getElementById("btn");
const btnHome = document.getElementById("btnHome");
const menu = document.getElementById("menu");
const reloadView = document.getElementById("reloadView");
const video = document.getElementById("video");
const ipAddress = document.getElementById("ipAddress");
const statusLive = document.getElementById("statusLive");

const socket = io();
const FPS = 45;
let statusStreamLive = false;
canvas.style.display = "none";

window.electronAPI.sendData('init emosor!!');
window.electronAPI.getMediaDevice();
window.electronAPI.getIpAddress();

function stopStream () {
    socket.emit("stop", "stop");
    window.location.reload();
}

async function streamDisplay() {
    publicMessage("En vivo");
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let cap = new cv.VideoCapture(video);

    function precessVideo () {
        let begin = Date.now();
        
        cap.read(src);
        cv.imshow("preview", src); 
        socket.emit("stream", canvas.toDataURL("image/jpeg"));

        let delay = 1000/ FPS - (Date.now() - begin);
        setTimeout(precessVideo, delay);
    }
    setTimeout(precessVideo, 0);
    statusStreamLive = true;
}


function publicMessage(message) {
    statusLive.classList.toggle("live");
    statusLive.innerText = message;
}

function errorCamera() {
    publicMessage("Display Fail!")
    setTimeout(() => {
        publicMessage("not Live")
    }, 2000) 
}

btn.addEventListener("click", () => {
    
    if (video.dataset.status === "start") {
        if(!statusStreamLive) {
            streamDisplay();
            btn.textContent = 'Detener';
        } else {
            stopStream();
        }
    } else {
        alert("Seleciona una Ventana!");
    }
})

menu.addEventListener("change", () => {
    if(menu.value) {
        window.electronAPI.startCapture(menu.value);
    }
})

reloadView.addEventListener("click", () => {
    console.log("reload!");
    window.electronAPI.getMediaDevice();
})

btnHome.addEventListener("click", () => {
    socket.emit("stop", "stop");
    window.location.href = "index.html";
})