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
    newNode.classList.add("object");//to get the objects in a row
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
    enemy.classList.add("object");//to get the objects in a row
    spawnRow.appendChild(enemy);

    let event = new Event('spawn');
    enemy.dispatchEvent(event);

}

function detect_hit(nearest_object, target) {
    let actual_enemy = target;
    let actual_enemy_pos = actual_enemy.getBoundingClientRect();
    try {
        let other_pos = nearest_object.getBoundingClientRect();
        if (nearest_object.className === 'enemy object') {
            return (other_pos.left + 10 < actual_enemy_pos.left)
        }
        return (other_pos.right + 10 < actual_enemy_pos.left);
    } catch (err) {
        return true;
    }
}


function get_nearest_object(target) {
    let parent = target.parentNode;
    let objects = parent.querySelectorAll(".object");
    let nearest_object;
    let actual_enemy_pos = target.getBoundingClientRect();
    for (let object of objects) {
        let obj_pos = object.getBoundingClientRect();
        if (obj_pos.right < actual_enemy_pos.right) {
            nearest_object = object;
        }
    }
    return nearest_object;
}


function myMove() {
    let enemy = event.target;
    let pos = 1038;

    let id = setInterval(frame, 30);

    function frame() {
        let nearest_object = get_nearest_object(enemy);
        let is_touching = detect_hit(nearest_object, enemy);
        if (pos == 70) {
            clearInterval(id);
        } else {
            if (is_touching) {
                pos--;
                enemy.style.left = pos + 'px';
            }
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
