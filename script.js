class Player {
    constructor(textAreaContent) {
        var splittedContent = textAreaContent.split(/\n{2,}/);
        var playerDescription = splittedContent[0];
        var inventoryDescription = splittedContent.slice(1, -1);
        this.name = playerDescription.match(Player.PLAYER_REGEX)[1];
        this.xp = parseInt(playerDescription.match(Player.PLAYER_REGEX)[2]);
        this.gold = playerDescription.match(Player.GOLD_REGEX)[1];
        var item_map = new Map();
        inventoryDescription.forEach(function (item) {
            var hasDs = item.includes("Dieses Item ist magisch gegen Diebstahl geschützt.");
            var parts = item.split("\n");
            var item_name = parts[0];
            var amount = item_name.match(Player.AMOUNT_REGEX) ? parseInt(item_name.match(Player.AMOUNT_REGEX)[1]) : 1;
            item_name = item_name.replace(Player.AMOUNT_REGEX, "");
            if (!hasDs) {
                if (item_map.has(item_name)) {
                    item_map.set(item_name, item_map.get(item_name) + amount);
                }
                else {
                    item_map.set(item_name, amount);
                }
            }
        });
        this.items = item_map;
    }
}
Player.AMOUNT_REGEX = /(\d+)x /;
Player.PLAYER_REGEX = /Name: (.*) \(Erfahrung: ([\d\.]*)\)/;
Player.GOLD_REGEX = /Geld: ([\d\.]*) Goldmünzen/;
function parseTextArea() {
    var textAreaNode = (document.getElementById("textarea-sicht"));
    var textAreaContent = textAreaNode.value;
    var p = new Player(textAreaContent);
    var playerSummary = document.getElementById("player-summary");
    var items = document.getElementById("items");
    appendPlayerInfoTable(playerSummary, p);
    appendItemTable(items, p);
}
function appendPlayerInfoTable(playerSummary, p) {
    var playerDiv = document.createElement("div");
    playerDiv.id = "playerDiv";
    var nameP = document.createElement("p");
    nameP.textContent = `Name : ${p.name}`;
    var xpP = document.createElement("p");
    xpP.textContent = `XP : ${p.xp}`;
    var item_count = Array.from(p.items.values()).reduce((a, b) => a + b) + "";
    var itemCountP = document.createElement("p");
    itemCountP.textContent = `Anzahl Items : ${item_count}`;
    var goldP = document.createElement("p");
    goldP.textContent = `${p.gold} Goldmünzen`;
    playerDiv.append(nameP, goldP, itemCountP);
    var oldElement = playerSummary.querySelector("#playerDiv");
    if (oldElement) {
        playerSummary.replaceChild(playerDiv, oldElement);
    }
    else {
        playerSummary.append(playerDiv);
    }
}
function appendItemTable(items, p) {
    var newTable = document.createElement("table");
    newTable.id = "resultTable";
    appendHeader();
    var tBody = newTable.createTBody();
    p.items.forEach(function (value, key, map) {
        var row = tBody.insertRow(-1);
        row.insertCell(-1).textContent = key;
        row.insertCell(-1).textContent = value + "";
    });
    var oldTable = items.querySelector("#resultTable");
    if (oldTable) {
        items.replaceChild(newTable, oldTable);
    }
    else {
        items.append(newTable);
    }
    function appendHeader() {
        var header = newTable.createTHead();
        var headerRow = header.insertRow(-1);
        headerRow.insertCell(-1).textContent = "Item";
        headerRow.insertCell(-1).textContent = "Anzahl";
        newTable.tHead = header;
    }
}
//# sourceMappingURL=script.js.map