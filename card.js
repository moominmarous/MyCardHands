let start = { x: 0, y: 0 };
const CARDMAX = 10;
const allcards = [];

const socket = new WebSocket('ws://localhost:8000');

const sendCardUpdate = (cardID, { x: x, y: y }) => {
    const message = JSON.stringify({ cardID, x, y })
    // console.log(message);
    socket.send(message)
}

// Log connection status
socket.onopen = () => {
    console.log('Connected to WebSocket server');
};

socket.onclose = () => {
    console.log('Disconnected from WebSocket server');
};

socket.onerror = (error) => {
    console.error('WebSocket error:', error);
};

socket.onmessage = (event) => {
    // console.log(event.data)
    try {
        const data = JSON.parse(event.data);
        // console.log('Parsed data:', data);
        // Process the data if valid
        let { cardID, x, y } = JSON.parse(event.data);
        let card = document.getElementById(cardID)
        if (card) {
            card.style.left = `${x}px`
            card.style.top = `${y}px`
        }
    } catch (error) {
        console.warn('Non-JSON message received:', event.data);
        // Handle non-JSON data here
    }
}

const createCard = (id, { x: x, y: y }) => {
    let card = document.createElement('div');
    card.className = 'card'
    card.id = id
    card.position = 'absolute'
    card.style.left = `${x}px`
    card.style.top = `${y}px`
    allcards.push(card);
    let delta = { x: 0, y: 0 };
    card.addEventListener("mousedown", (e) => {
        // isDragging = true;
        start.x = e.clientX
        start.y = e.clientY
        delta.x = e.clientX - card.getBoundingClientRect().left
        delta.y = e.clientY - card.getBoundingClientRect().top

        // Create a small "pixel" div
        let pixel = card.childNodes[0]
        if (pixel == undefined) {
            pixel = document.createElement("div")
            pixel.className = 'grabpoint'
            pixel.style.position = "absolute"
            pixel.style.width = "5px" // Size of the "pixel"
            pixel.style.height = "5px"
        }
        pixel.style.backgroundColor = "red" // Color of the "pixel"
        pixel.style.left = `${delta.x - 2.5}px`
        pixel.style.top = `${delta.y - 2.5}px`

        // Append the "pixel" to the clicked card
        card.appendChild(pixel);
    })

    document.body.appendChild(card)
}

const stackCards = () => {
    for (let i = 0; i < CARDMAX; i++) {
        createCard("card" + i, { x: 100 + (100 * i), y: 300 })
    }
}

const cardEvents = () => {
    let cards = document.getElementsByClassName('card')
    console.assert(cards.length > 0, "no cards")
    // console.log(cards)
    Array.from(cards).forEach(element => {
        let isDragging = false;
        let delta = { x: 0, y: 0 };
        element.addEventListener("mousedown", (e) => {
            isDragging = true;
            delta.x = e.clientX - element.getBoundingClientRect().left;
            delta.y = e.clientY - element.getBoundingClientRect().top;

            // Create a small "pixel" div
            let pixel = element.childNodes[0]
            if (pixel == undefined) {
                pixel = document.createElement("div");
                pixel.className = 'grabpoint';
                pixel.style.position = "absolute";
                pixel.style.width = "5px"; // Size of the "pixel"
                pixel.style.height = "5px";
            }
            pixel.style.backgroundColor = "red"; // Color of the "pixel"
            pixel.style.left = `${delta.x - 2.5}px`;
            pixel.style.top = `${delta.y - 2.5}px`;

            // Append the "pixel" to the clicked element
            element.appendChild(pixel);

            const onMouseMove = (e) => {
                if (!isDragging) return;
                element.style.position = "absolute";
                let x = e.clientX - delta.x
                let y = e.clientY - delta.y
                element.style.left = `${x}px`;
                element.style.top = `${y}px`;

                const hoveredElements = document.elementsFromPoint(e.clientX, e.clientY);
                const overHandSpace = Array.from(hoveredElements).some(el => el.id === "hand-space");
                if (overHandSpace) {
                    console.log(`${overHandSpace}`)
                } else {
                    // Send the updated position to the server
                    sendCardUpdate(element.id, { x, y });
                }
            };
            const onMouseUp = (e) => {
                isDragging = false;
                const hoveredElements = document.elementsFromPoint(e.clientX, e.clientY);
                const overHandSpace = Array.from(hoveredElements).some(el => el.id === "hand-space");
                if (overHandSpace) {
                    console.log(`${overHandSpace}`)
                } else {
                    // document.removeEventListener("mousemove", onMouseMove);
                    // document.removeEventListener("mouseup", onMouseUp);
                    let x = element.getBoundingClientRect().left;
                    let y = element.getBoundingClientRect().top;
                    // Send the updated position to the server
                    sendCardUpdate(element.id, { x, y })
                }


            };
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);

        })
    });
}

window.onload = () => {
    stackCards()
    cardEvents()
}