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
      var hasDs = item.includes(
        "Dieses Item ist magisch gegen Diebstahl geschützt."
      );
      var hasTs = item.includes(
        "Dieses Item ist gegen Verlust durch Tod geschützt."
      );
      var parts = item.split("\n");
      var item_name = parts[0];
      var item_description = parts[1];
      var amount = item_name.match(Player.AMOUNT_REGEX)
        ? parseInt(item_name.match(Player.AMOUNT_REGEX)[1])
        : 1;
      var item_name = item_name.replace(Player.AMOUNT_REGEX, "");
      //Clean up Item name for lookup

      var item_price =
        ITEM_PRICES[item_name.replace(Player.ITEM_DETAILS_REGEX, "").trim()] ||
        "?";
      var item_details = {
        item_name: item_name,
        amount: amount,
        item_description: item_description,
        has_ds: hasDs,
        has_ts: hasTs,
        item_price: item_price,
        display: true,
      };
      if (item_map.has(item_name)) {
        item_map.get(item_name).amount =
          item_map.get(item_name).amount + item_details.amount;
      } else {
        item_map.set(item_name, item_details);
      }
    });
    this.items = item_map;
  }
}
var p;
Player.AMOUNT_REGEX = /(\d+)x /;
Player.PLAYER_REGEX = /Name: (.*) \(Erfahrung: ([\d\.]*)\)/;
Player.GOLD_REGEX = /Geld: ([\d\.]*) Goldmünzen/;
Player.ITEM_DETAILS_REGEX = /(\([\w+\d+: ]+\) ?)+/; // RegEx for item details like (Z: 1)

function parseTextArea() {
  var textAreaNode = document.getElementById("textarea-sicht");
  var textAreaContent = textAreaNode.value;
  p = new Player(textAreaContent);
  var items = document.getElementById("items");
  renderPlayerInfoTable(p);
  renderItemTable(items, p);
}
function renderPlayerInfoTable(p) {
  var playerSummary = document.getElementById("player-summary");
  var playerDiv = document.createElement("div");
  playerDiv.id = "playerDiv";
  var nameP = document.createElement("p");
  nameP.textContent = `Name : ${p.name}`;
  var xpP = document.createElement("p");
  xpP.textContent = `XP : ${p.xp}`;
  var item_count =
    Array.from(p.items.values()).reduce((a, item) => a + item.amount, 0) + "";
  var true_item_count =
    Array.from(p.items.values()).reduce((a, item) => {
      if (item.display) {
        return a + item.amount;
      } else {
        return a + 0;
      }
    }, 0) + "";
  console.log(true_item_count);
  var itemCountP = document.createElement("p");
  itemCountP.textContent = `Anzahl Items : ${item_count}`;
  var spanTrueItemCount = document.createElement("span");
  spanTrueItemCount.textContent = ` (${true_item_count} im aktuellen Filter)`;
  itemCountP.append(spanTrueItemCount);
  var goldP = document.createElement("p");
  goldP.textContent = `${p.gold} Goldmünzen`;
  playerDiv.append(nameP, goldP, itemCountP);
  var oldElement = playerSummary.querySelector("#playerDiv");
  if (oldElement) {
    playerSummary.replaceChild(playerDiv, oldElement);
  } else {
    playerSummary.append(playerDiv);
  }
}
function renderItemTable(items, p) {
  var newTable = document.createElement("table");
  newTable.id = "resultTable";
  filterItems();
  appendHeader();
  var tBody = newTable.createTBody();
  p.items.forEach(function (value, key, map) {
    if (value.display == true) {
      var row = tBody.insertRow(-1);
      item_name_cell = row.insertCell(-1);
      item_name_cell.textContent = key;
      item_name_cell.title = value.item_description;
      row.insertCell(-1).textContent = value.amount;
      row.insertCell(-1).textContent = value.has_ds ? "✓" : "✗";
      row.insertCell(-1).textContent = value.has_ts ? "✓" : "✗";
      row.insertCell(-1).textContent = value.item_price
        ? value.item_price
        : value.item_price == 0
        ? 0
        : "?";
      //row.insertCell(-1).textContent = value.item_price;
    }
  });
  var oldTable = items.querySelector("#resultTable");
  if (oldTable) {
    items.replaceChild(newTable, oldTable);
  } else {
    items.append(newTable);
  }
  function appendHeader() {
    var header = newTable.createTHead();
    var headerRow = header.insertRow(-1);
    headerRow.insertCell(-1).textContent = "Item";
    headerRow.insertCell(-1).textContent = "Anzahl";
    headerRow.insertCell(-1).textContent = "DS";
    headerRow.insertCell(-1).textContent = "TS";
    var item_price_headerRow = headerRow.insertCell(-1);
    item_price_headerRow.addEventListener("click", sortItemsBy);
    item_price_headerRow.textContent = "Itempreis (Shopwert)";
    newTable.tHead = header;
  }
}

//TODO: Zusammenführen mit filterDsItems und Checkbox values nutzen

function filterAndRerenderItems() {
  filterItems();
  renderPlayerInfoTable(p);
  renderItemTable(items, p);
}
function filterItems(e) {
  var ds_checkbox = document.getElementById("filter_ds_option");
  var ts_checkbox = document.getElementById("filter_ts_option");
  var questionmark_checkbox = document.getElementById("filter_unknown_items");

  p.items.forEach(function (k, v) {
    if (ds_checkbox.checked && ts_checkbox.checked) {
      // Alle mit DS & TS auf false, rest True
      //k.display = k.has_ds && k.has_ts ? false : true;
      k.display = true;
    } else if (ds_checkbox.checked && !ts_checkbox.checked) {
      //console.log("DS checked, TS nicht");
      // Alle mit DS & ohne TS auf False, rest True
      //k.display = k.has_ds && !k.has_ts ? true : false;
      k.display = !k.has_ts ? true : false;
    } else if (!ds_checkbox.checked && ts_checkbox.checked) {
      k.display = !k.has_ds ? true : false;
    } else {
      k.display = !k.has_ds && !k.has_ts ? true : false;
    }
    if (questionmark_checkbox.checked) {
      k.display = k.item_price == "?" ? true : false;
    }
  });
}

function filterTsItems(e) {
  p.items.forEach(function (k, v) {
    if (k.has_ts) {
      k.display = k.display == true ? false : true;
    }
  });
  var items = document.getElementById("items");
  renderItemTable(items, p);
}

function filterDsItems(e) {
  p.items.forEach(function (k, v) {
    if (k.has_ts) {
      k.display = k.display == true ? false : true;
    }
  });
  var items = document.getElementById("items");
}

function sortItemsBy() {
  p.items = new Map(
    Array.from(
      [...p.items.entries()].sort((a, b) => {
        // a[0], b[0] is the key of the map
        if (!isFinite(b[1].item_price) && !isFinite(a[1].item_price)) {
          return 0;
        }
        if (!isFinite(a[1].item_price)) {
          return 1;
        }
        if (!isFinite(b[1].item_price)) {
          return -1;
        }
        return b[1].item_price - a[1].item_price;
      })
    )
  );
  var items = document.getElementById("items");
  renderItemTable(items, p);
}
//# sourceMappingURL=script.js.map
