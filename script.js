class Item {
    constructor(name, hasDs) {
        this.name = name;
        this.hasDs = hasDs;
    }
}
const AMOUNT_REGEX = /(\d+)x /;
function doSomething() {
    var textAreaNode = (document.getElementById("textarea-sicht"));
    var textAreaContent = textAreaNode.value;
    var items = textAreaContent.split(/\n{2,}/);
    var item_map = new Map();
    items.slice(1, -1).forEach(function (item) {
        var hasDs = item.includes("Dieses Item ist magisch gegen Diebstahl geschützt.");
        var parts = item.split("\n");
        var item_name = parts[0];
        var amount = item_name.match(AMOUNT_REGEX) ? parseInt(item_name.match(AMOUNT_REGEX)[1]) : 1;
        item_name = item_name.replace(AMOUNT_REGEX, "");
        if (!hasDs) {
            if (item_map.has(item_name)) {
                item_map.set(item_name, item_map.get(item_name) + amount);
            }
            else {
                item_map.set(item_name, amount);
            }
        }
    });
    appendTable(item_map);
}
function appendTable(data) {
    if (document.getElementById("resultTable")) {
        document.getElementById("resultTable").remove();
    }
    var newTable = document.createElement("table");
    newTable.id = "resultTable";
    appendHeader(newTable);
    var tBody = newTable.createTBody();
    data.forEach(function (value, key, map) {
        var row = tBody.insertRow(-1);
        row.insertCell(-1).textContent = key;
        row.insertCell(-1).textContent = value + "";
    });
    appendFooter(newTable, data);
    document.body.append(newTable);
}
function appendFooter(table, data) {
    var footer = table.createTFoot();
    var row = footer.insertRow(-1);
    row.insertCell(-1).textContent = "Anzahl Items";
    row.insertCell(-1).textContent = Array.from(data.values()).reduce((a, b) => a + b) + "";
}
function appendHeader(table) {
    var header = table.createTHead();
    var headerRow = header.insertRow(-1);
    headerRow.insertCell(-1).textContent = "Item";
    headerRow.insertCell(-1).textContent = "Anzahl";
    table.tHead = header;
}
//# sourceMappingURL=script.js.map