console.log('Hola preload!')
const { contextBridge, ipcRenderer } = require('electron');

function handleStream (stream) {
    const video = document.querySelector('video')
    video.srcObject = stream
    video.onloadedmetadata = (e) => video.play()
    video.dataset.status = "start";
}

function handleError (e) {
    console.log(e)
    publicMessage("ups, ocurrio un error!")
}

contextBridge.exposeInMainWorld('electronAPI', {
    sendData: (message) => ipcRenderer.send('message', message),
    getIpAddress: () => {
        ipcRenderer.invoke("ip:address").then(ipAdress => {
            console.log("ip", ipAdress);
            ipAddress.textContent = "IP: " + ipAdress;
        })
    },
    getMediaDevice: () => {
        ipcRenderer.invoke('set:sourse').then(response => {
            console.log(response);
            menu.innerHTML = "";
            const option = document.createElement("option");
            option.textContent = "---";
            option.value = "";
            option.classList.add("select-item");
            menu.appendChild(option);
            response.forEach(item => {
                const option = document.createElement("option");
                option.textContent = item.name;
                option.value = item.id;
                option.classList.add("select-item");
                menu.appendChild(option);
            });
        })
    },
    startCapture: async (idSource) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: idSource,
                        minWidth: 1280,
                        maxWidth: 1280,
                        minHeight: 720,
                        maxHeight: 720
                    }
                }
            })
            handleStream(stream)
        } catch (e) {
            handleError(e)
        }
    }
})