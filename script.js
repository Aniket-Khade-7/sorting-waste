var items = document.querySelectorAll(".item");
var bins = document.querySelectorAll(".bin");
var waste = document.getElementById("waste");
var message = document.getElementById("message");

var draggedItem = null;
var offsetX = 0;
var offsetY = 0;

var originalItems = Array.from(items);

    
document.addEventListener("mousedown", function(event) {

    var item = event.target.closest(".item");

    if (item && waste.contains(item)) {

        draggedItem = item;

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


document.addEventListener("mousemove", function(event) {

    if (draggedItem) {

        draggedItem.style.left =
            event.clientX - offsetX + "px";

        draggedItem.style.top =
            event.clientY - offsetY + "px";
    }
});



document.addEventListener("mouseup", function(event) {

    if (draggedItem) {

        var target = document.elementFromPoint(
            event.clientX,
            event.clientY
        );

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

            
            if (draggedItem.dataset.type === bin.dataset.bin) {

                message.innerText = "Correct! Well done!";

            } else {

                message.innerText = "Wrong bin! Try again.";
            }

        } else {

            waste.appendChild(draggedItem);

            message.innerText = "Drop inside a bin.";
        }

        draggedItem = null;
    }
});



document.getElementById("reset").addEventListener("click", function() {


    originalItems.forEach(function(item) {

        waste.appendChild(item);

        item.style.position = "";
        item.style.left = "";
        item.style.top = "";
        item.style.width = "";
        item.style.zIndex = "";
        item.style.pointerEvents = "";
    });

    
    bins.forEach(function(bin) {

        bin.querySelector(".items").innerHTML = "";
    });

    message.innerText = "Start sorting!";
});