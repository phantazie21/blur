class ContextMenu {
    constructor() {
        if (ContextMenu._instance) {
            throw new Error("Singleton class is already instantiated.")
        }
        ContextMenu._instance = this;
        this.currentID = null; // id of context menu
        this.selectedItem = null; // dom element that was right clicked (tab, file, folder)
        this.getDOMMenus();
    }

    getDOMMenus() {
        this.DOMMenus = document.querySelectorAll(".ctx-menu");
    }

    setActive(id, x, y) {

        if (this.DOMMenus.length == 0) {
            this.getDOMMenus();
        }
        if (this.currentID != "") {
            this.DOMMenus.forEach(e => {
                e.classList.remove("active");
            });
        }
        if (id) {
            let element = null;
            for (const e of this.DOMMenus) {
                if (e.id == id) {
                    element = e;
                    break;
                }
            };
            element.classList.add("active");  

            let left = x;
            let top  = y;

            if (x + element.offsetWidth> window.innerWidth)  left = x - element.offsetWidth;
            if (y + element.offsetHeight > window.innerHeight) top  = y - element.offsetHeight;

            element.style.left = left + "px";
            element.style.top  = top + "px";
            this.currentID = id;
            this.selectedItem = document.elementsFromPoint(x, y).at(1);
        }
    }
}