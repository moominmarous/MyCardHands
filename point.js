const redPoint = document.getElementById('point');
let isDragging = false;
const clickNDrag = (container) => {
    container.addEventListener("mousedown", (e) => {
        isDragging = true;
        // Update the red dot position (fixed at the mouse press location)
        point.style.left = `${e.clientX - 2.5}px`;
        point.style.top = `${e.clientY - 2.5}px`;
        console.log(isDragging)
    });

    container.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        // Update the red dot position
        point.style.left = `${e.clientX - 2.5}px`;
        point.style.top = `${e.clientY - 2.5}px`;
    });

    container.addEventListener("mouseup", () => {
        isDragging = false;
    });
};
window.onload = () => {
    clickNDrag(document.body);
}