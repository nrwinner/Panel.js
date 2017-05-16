// panel
function Panel(elementID) {
    this.element = document.getElementById(elementID);
}

Panel.prototype.setElement = function(elementID) {
    this.element = document.getElementById(elementID);
}

Panel.prototype.calculateAlignment = function(width, alignment, collapsed, positionRatio) {
    positionRatio = (typeof positionRatio != "undefined") ? positionRatio : 0;
    if (!collapsed) return parseInt(this.element.style[alignment]) + parseInt(width) + "px";
    else  {
        var direction = (parseInt(width) > 0) ? 1 : -1;
        var scalarOffset = 35 * direction;
        var calculatedAlignment = parseInt(this.element.style[alignment]);

        return calculatedAlignment + (Math.abs(parseInt(width)) - (parseInt(this.element.style.width))) * direction + scalarOffset + "px";
    }
}

// panel manager
function PanelManager(styles, collapsed) {
    this.panels = [];
    this.collapsed = (typeof collapsed != "undefined") ? collapsed : false;

    var s = document.createElement("link");
    s.setAttribute("href", styles);
    s.setAttribute("type", "text/css");
    s.setAttribute("rel", "stylesheet");
    var h = document.getElementsByTagName("head")[0];
    h.appendChild(s);
}

PanelManager.prototype.setAlignment = function(alignment) {
    this.alignment = alignment;
}

PanelManager.prototype.getPanels = function() {
    return this.panels;
}

// adds a new panel to the end of the list
PanelManager.prototype.addPanel = function(elementID, width, multiple, delay) {
    multiple = (typeof delay == "undefined") ? false : multiple;
    delay = (typeof delay == "undefined") ? "0s" : delay;
    if (this.getPanel(elementID) == -1) {
        var p = new Panel(elementID);

        p.element.style.setProperty(this.alignment, "-" + width +  "px");
        p.element.style.setProperty("width", parseInt(width)  + "px");
        p.element.style.setProperty("display", "block");
        p.element.style.setProperty("transition-duration", this.getTransitionDuration(width));
        p.element.style.setProperty("z-index", 99999 + this.panels.length);
        p.element.style.setProperty("transition-delay", delay);

        var _this = this;
        setTimeout(function() {
            p.element.style.setProperty(_this.alignment, "0px");
        }, 125);

        for (var i = 0; i < this.panels.length; i++) {
            var p2 = this.panels[i];
            var t = this.panels[i].element.style.transitionDuration;
            var newT  = this.getTransitionDuration(width);

            if (!multiple) p2.element.style.setProperty("transition-delay", "0.25s");
            p2.element.style.setProperty("transition-duration", newT);
            p2.element.style.setProperty(this.alignment, this.panels[i].calculateAlignment(width, this.alignment, this.collapsed, i));
            this.resetTransitionAdd(p2.element, newT, t);
        }

        // add delay for body click checks
        var _this = this;
        setTimeout(function() {
            _this.panels.push(p);
            if (_this.panels.length == 1) document.getElementsByTagName("body")[0].dispatchEvent(new Event("panels-visible"));
        }, 150)
    } else {
        console.log("AddPanels: Panel already added!");
    }
}

PanelManager.prototype.addPanels = function(p) {
    if (Array.isArray(p) && p.length > 0) {
        var toAdd = p.splice(0, 1)[0];
        var delay = (p.length * 0.2) + "s";

        this.addPanel(toAdd.id, toAdd.width, true, delay);
        var _this = this;
        setTimeout(function() {
            if (p.length > 0) _this.addPanels(p);
        }, 150);
    } else {
        console.error("AddPanels: Invalid function parameter!");
    }
}

// "pops" the panel most recently added
PanelManager.prototype.pop = function() {
    this.closePanel(this.panels.length - 1);
}

// deletes panel at specified index, and shifts elements past the index back to fit
PanelManager.prototype.closePanel = function(index) {
    var p = this.panels[index];

    if (p != undefined) {
        var w = p.element.style.width;
        if (this.panels.length > 1) p.element.style.setProperty("transition-delay", "0.15s");
        p.element.style.setProperty(this.alignment, parseInt(p.element.style[this.alignment]) - (parseInt(p.element.style.width) + 10) + "px");

        setTimeout(function() {
            p.element.style = "";
        }, parseFloat(p.element.style.transitionDuration) * 1000);

        for (var i = 0; i < index; i++) {
            var p2 = this.panels[i];
            var t = this.panels[i].element.style.transitionDuration;
            var newT  = this.getTransitionDuration(parseInt(w));

            p2.element.style.setProperty("transition-duration", newT);
            p2.element.style.setProperty(this.alignment, this.panels[i].calculateAlignment("-" + w, this.alignment, this.collapsed, this.panels.length - 1));

            this.resetTransitionClose(p2.element, newT, t);
        }

        this.panels.splice(index, 1);
        if (this.panels.length == 0) document.getElementsByTagName("body")[0].dispatchEvent(new Event("panels-hidden"));
    } else {
        // code here if attempting to remove a panel from an index that doesn't exist
        console.error("ClosePanel: specified index does not exist!");
    }
}

PanelManager.prototype.closeAll = function() {
    while(this.panels.length > 0) this.pop();
}

// takes an element id and returns the location in the panels array of the element, or -1 if it doesnt exist
PanelManager.prototype.getPanel = function(elementID) {
    for (var i = 0; i < this.panels.length; i++) {
        var p = this.panels[i];
        if (p.element.id == elementID) return i;
    }
    return -1;
}

// takes a panel width and returns a valid css transition-duration value
PanelManager.prototype.getTransitionDuration = function(width) {
    return Math.round(((parseInt(width) * .0009) + 0.00001) * 100) / 100 + "s";
}

// used to remove transition delay for each element that's added when a new element is inserted
PanelManager.prototype.resetTransitionAdd = function(element, newT, t) {
    setTimeout(function() {
        element.style.setProperty("transition-delay", "0s");
        element.style.setProperty("transition-duration", t);
    }, parseFloat(newT) * 1000);
}

PanelManager.prototype.resetTransitionClose = function(element, newT, t) {
    setTimeout(function() {
        element.style.setProperty("transition-duration", t);
    }, parseFloat(newT) * 1000);
}
