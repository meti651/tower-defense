function dragstart_handler(ev) {
    // Add the target element's id to the data transfer object
    ev.dataTransfer.setData("text/plain", ev.target.id);
    ev.dataTransfer.dropEffect = "copy";
}

function dragover_handler(ev) {
    ev.preventDefault();
    // Set the dropEffect to move
    ev.dataTransfer.dropEffect = "copy"
}


function drop_handler(ev) {
    ev.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM
    let data = ev.dataTransfer.getData("text/plain");
    let newNode = document.getElementById(data).cloneNode(true);
    newNode.id = `newID${newNode.id}`;
    newNode.removeAttribute("draggable");
    newNode.removeAttribute("ondragstart");
    newNode.classList.replace("inventory-cell", "active-plant")

    ev.target.appendChild(newNode);
}


function main() {
    let inventoryCells = document.querySelectorAll(".inventory-cell");
    for (let i = 0; i < inventoryCells.length; i++) {
        inventoryCells[i].textContent = i;
    }



}

main();