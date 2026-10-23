var items = document.querySelectorAll(".item");
var bins = document.querySelectorAll(".bin");
var waste = document.getElementById("waste");
var message = document.getElementById("message");
var submitButton = document.getElementById("submit");

var draggedItem = null;
var offsetX = 0;
var offsetY = 0;

var originalItems = Array.from(items);

document.addEventListener("mousedown", function (event) {
  if (event.target.classList.contains("item") && waste.contains(event.target)) {
    draggedItem = event.target;

    var box = draggedItem.getBoundingClientRect();

    offsetX = event.clientX - box.left;
    offsetY = event.clientY - box.top;

    draggedItem.style.position = "fixed";
    draggedItem.style.left = box.left + "px";
    draggedItem.style.top = box.top + "px";
    draggedItem.style.width = box.width + "px";
    draggedItem.style.zIndex = "1000";
    draggedItem.style.pointerEvents = "none";
  }
});

document.addEventListener("mousemove", function (event) {
  if (draggedItem) {
    draggedItem.style.left = event.clientX - offsetX + "px";

    draggedItem.style.top = event.clientY - offsetY + "px";
  }
});

document.addEventListener("mouseup", function (event) {
  if (draggedItem) {
    var target = document.elementFromPoint(event.clientX, event.clientY);

    var bin = null;

    if (target) {
      bin = target.closest(".bin");
    }

    draggedItem.style.position = "";
    draggedItem.style.left = "";
    draggedItem.style.top = "";
    draggedItem.style.width = "";
    draggedItem.style.zIndex = "";
    draggedItem.style.pointerEvents = "";

    if (bin) {
      var area = bin.querySelector(".items");
      var row = area.lastElementChild;

      if (!row || row.children.length >= 2) {
        row = document.createElement("div");
        row.className = "item-row";
        area.appendChild(row);
      }

      row.appendChild(draggedItem);

      submitButton.disabled = false;

      message.innerText = "Item placed! Continue sorting.";
    } else {
      waste.appendChild(draggedItem);
      message.innerText = "Drop inside a bin.";
    }

    draggedItem = null;
  }
});


submitButton.addEventListener("click", function () {
  var correct = 0;
  var total = originalItems.length;
  var remaining = waste.querySelectorAll(".item").length;

  if (remaining > 0) {
    message.innerText = "Please move all waste items into the bins first!";
    return;
  }

  bins.forEach(function (bin) {
    var binItems = bin.querySelectorAll(".item");

    binItems.forEach(function (item) {
      if (item.dataset.type === bin.dataset.bin) {
        correct++;
      }
    });
  });

  if (correct === total) {
    message.innerText =
      "Excellent! All " + total + " items are sorted correctly!";
  } else {
    message.innerText =
      "You sorted " +
      correct +
      " out of " +
      total +
      " items correctly. Click Reset Game to try again.";
  }
});

document.getElementById("reset").addEventListener("click", function () {
  originalItems.forEach(function (item) {
    waste.appendChild(item);

    item.style.position = "";
    item.style.left = "";
    item.style.top = "";
    item.style.width = "";
    item.style.zIndex = "";
    item.style.pointerEvents = "";
  });

  bins.forEach(function (bin) {
    bin.querySelector(".items").innerHTML = "";
  });
    
  submitButton.disabled = true;

  draggedItem = null;
  message.innerText = "Start sorting!";
});
