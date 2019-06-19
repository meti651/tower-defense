// Drag and Drop functions

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
    newNode.id = `${newNode.id}`;
    newNode.removeAttribute("draggable");
    newNode.removeAttribute("ondragstart");
    newNode.classList.replace("inventory-cell", "active-plant");

    targetCell = event.target;

    targetCell.removeEventListener("drop", drop_handler);
    targetCell.removeEventListener("dragover", dragover_handler);

    ev.target.appendChild(newNode);
}

// Game start / adding events

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

// Enemy spawn + enemy movement

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function spawnStart() {
    for (let enemyNum = 0, minSec = 2, maxSec = 6; enemyNum <= 10; enemyNum++, minSec += 3, maxSec += 3) {
        let randomNum = getRandomInt(minSec, maxSec) * 1000;
        //let randomInterval = Math.floor(Math.random() * 10) * 1000;
        //setInterval(spawnEnemy, randomInterval)
        setTimeout(spawnEnemy, randomNum);
    }
}

function spawnEnemy() {
    let randomRow = String(Math.floor(Math.random() * 5));
    let spawnRow = document.getElementById(randomRow);
    let enemy = document.createElement("div");
    enemy.addEventListener("spawn", myMove);
    enemy.classList.add("enemy");
    spawnRow.appendChild(enemy);

    let event = new Event('spawn');
    enemy.dispatchEvent(event);

}


function myMove() {
    let pos = 1069;

    let id = setInterval(frame, 30);
    let enemy = event.target;

    function frame() {
        if (pos == 70) {
            clearInterval(id);
        } else {
            pos--;
            enemy.style.left = pos + 'px';
        }
    }
}





function main() {
    addEventGameCells();
    addEventInventory();

    let startButton = document.querySelector("#start-game");
    startButton.addEventListener("click", spawnStart);
}

main();
