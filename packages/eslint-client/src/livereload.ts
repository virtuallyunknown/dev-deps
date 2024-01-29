export function liveReload() {
    const reloadEvent = new EventSource('http://localhost:3000/live-reload');

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