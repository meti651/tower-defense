// Drag and Drop functions + fire event on new plants

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
    let plant = document.getElementById(data).cloneNode(true);
    plant.id = `${plant.id}`;
    plant.removeAttribute("draggable");
    plant.removeAttribute("ondragstart");
    plant.classList.replace("inventory-cell", "active-plant");
    plant.classList.add("object");//to get the objects in a row
    plant.addEventListener("fire", spawnProjectile);

    targetCell = event.target;

    targetCell.removeEventListener("drop", drop_handler);
    targetCell.removeEventListener("dragover", dragover_handler);

    ev.target.appendChild(plant);

    let fire = new Event("fire");

    plant.dispatchEvent(fire);
    setInterval(function () {
        plant.dispatchEvent(fire)
        }, 1500)

}


// Game start / adding events

function addEventGameCells() {
    let gameCells = document.querySelectorAll(".game-cell");
    for (let cell of gameCells) {
        if (cell.dataset.colNumber != "9") {
            cell.addEventListener("drop", drop_handler);
            cell.addEventListener("dragover", dragover_handler);
        }
    }
}

function addEventInventory() {
    let inventoryCells = document.querySelectorAll((".inventory-cell"));
    for (let cell of inventoryCells) {
        cell.setAttribute("draggable", "true");
        cell.addEventListener("dragstart", dragstart_handler);
    }
}

// Detecting hit stuff for enemies

function detect_hit(nearest_object, target) {
    let actual_enemy_pos = target.getBoundingClientRect();
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
    let enemy = document.createElement("img");
    enemy.addEventListener("spawnEnemy", enemyMove);
    enemy.classList.add("enemy");
    enemy.src = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/a6e7ea16-118d-4afb-9e51-77dbbdfb633e/dai916o-45b8d628-c7d4-4b9d-a0e7-9b8e528c9c0a.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2E2ZTdlYTE2LTExOGQtNGFmYi05ZTUxLTc3ZGJiZGZiNjMzZVwvZGFpOTE2by00NWI4ZDYyOC1jN2Q0LTRiOWQtYTBlNy05YjhlNTI4YzljMGEuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BqlWOl1EsDgYvP1Ejuq-6khzqoHRfEYpdIfZQu6eA_Y"
    enemy.classList.add("object");//to get the objects in a row
    spawnRow.appendChild(enemy);

    let event = new Event('spawnEnemy');
    enemy.dispatchEvent(event);

}

function enemyMove() {
    let enemy = event.target;
    let pos = 1038;

    let id = setInterval(frame, 30);

    function frame() {
        if (enemy.parentNode == null) {
            clearInterval(id);
            return;
        }
        let nearest_object = get_nearest_object(enemy);
        let is_touching = detect_hit(nearest_object, enemy);
        if (pos === 70) {
            clearInterval(id);
        } else if (is_touching) {
            pos--;
            enemy.style.left = pos + 'px';
        }
    }
}

// plants shooting stuff

function spawnProjectile() {
    let plant = this;
    let parentCol = parseInt(plant.parentNode.dataset.colNumber) + 0.5;
    let grandParentRow = plant.parentNode.parentNode;
    let projectileLeftCoordinate = parentCol * 100 + 70;

    let projectile = document.createElement("div");
    projectile.addEventListener("spawnProjectile", projectileMove);
    projectile.classList.add("projectile");
    projectile.style.left = projectileLeftCoordinate + "px";
    projectile.style.top = "62px";

    grandParentRow.appendChild(projectile);

    let ev = new Event('spawnProjectile');
    projectile.dispatchEvent(ev);
}

function projectileMove() {
    let id = setInterval(frame, 50);
    let projectile = event.target;
    let pos = projectile.style.left;
    pos = parseInt(pos.slice(0, -2));

    function frame() {
        if (pos >= 1070) {
            clearInterval(id);
            projectile.remove();
        } else if (projectile.parentNode == null) {
            clearInterval(id)
        } else if (!didProjectileHit(projectile) ) {
            pos += 5;
            projectile.style.left = pos + 'px';
        }
    }
}

// Detecting hit stuff for projectiles

function didProjectileHit(projectile) {
    let parentRow = projectile.parentNode;
    let enemy = parentRow.querySelector(".enemy");

    if (enemy && projectile.style.left >= enemy.style.left) {
        projectile.remove();
        enemy.remove();
        return true
    } else {
        return false;
    }
}


// Main function

function main() {
    addEventGameCells();
    addEventInventory();

    let startButton = document.querySelector("#start-game");
    startButton.addEventListener("click", spawnStart);
}

main();
