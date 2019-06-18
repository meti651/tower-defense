function main() {
    let inventoryCells = document.querySelectorAll(".inventory-cell");
    for (let i = 0; i < inventoryCells.length; i++) {
        inventoryCells[i].textContent = i;
    }


}

main();