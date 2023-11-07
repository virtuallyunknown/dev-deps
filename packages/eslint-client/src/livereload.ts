export function liveReload() {
    let reloadEvent = new EventSource('http://localhost:3000/live-reload');

    reloadEvent.addEventListener('message', () => {
        window.location.reload();
    });

    reloadEvent.addEventListener('error', () => {
        setTimeout(() => {
            reloadEvent.close();
            liveReload();
        }, 500);
    });
}

const socket = new WebSocket("ws://localhost:8080");

// Connection opened
socket.addEventListener("open", (event) => {
    socket.send("Hello Server!");
});

// Listen for messages
socket.addEventListener("message", (event) => {
    console.log("Message from server ", event.data);
});

