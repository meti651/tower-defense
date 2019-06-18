function addEventGameCells() {
    let gameCells = document.querySelectorAll(".game-cell");
    for (cell of gameCells) {
        if (cell.dataset.colNumber != "9") {
            cell.addEventListener("drop", drop_handler);
            cell.addEventListener("dragover", dragover_handler);
        }
    }
}

function addEventInventory() {
    let inventoryCells = document.querySelectorAll((".inventory-cell"));
    for (cell of inventoryCells) {
        cell.setAttribute("draggable", "true");
        cell.addEventListener("dragstart", dragstart_handler);
    }
}


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
    newNode.classList.replace("inventory-cell", "active-plant");

    targetCell = event.target;

    targetCell.removeEventListener("drop", drop_handler);
    targetCell.removeEventListener("dragover", dragover_handler);

    ev.target.appendChild(newNode);
}

function startSpawn() {
    let randomRow = Math.floor(Math.random() * 5);
    let spawnCell = document.querySelectorAll("[data-col-number='9']")
    spawnCell[randomRow].textContent = "X"

}








function main() {
    addEventGameCells();
    addEventInventory();

    let startButton = document.querySelector("#start-game");
    startButton.addEventListener("click", startSpawn);
}

main();