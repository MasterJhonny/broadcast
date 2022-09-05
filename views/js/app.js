window.addEventListener("DOMContentLoaded", () => {
    const host = document.getElementById("host");
    const container = document.getElementById("container");
    const connect = document.getElementById("connect");
   
    host.addEventListener('click', () => {
        const label = document.createElement("label");
        const span = document.createElement("span");
        const input = document.createElement("input");
        span.textContent = "Inserte la IP:";
        label.classList.add("label");
        input.classList.add("input");
        label.appendChild(span);
        label.appendChild(input);
        container.appendChild(label);
        host.style.display = "none";
        connect.style.display = "block";
        input.focus();
    })

    connect.addEventListener("click", () => {
        const input = document.querySelector("input");
        if (input.value) {
            window.location.href = `http://${input.value}:8080/cliente.html`
        }
    })
})