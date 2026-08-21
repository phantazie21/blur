class Editor {
    constructor() {
        if (Editor._instance) {
            throw new Error("Singleton class is already instantiated.")
        }
        Editor._instance = this;
        this.tabs = [];
        this.active = null;
        this.domTextArea = document.querySelector("#editor-parent > textarea");
    }

    alreadyOpened(filePath) {
        for (const e of this.tabs) {
            if (e.filePath == filePath) {
                return true;
            }
        };
    }

    registerEvents() {
        this.domTextArea.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            contextMenu.setActive("editor", e.pageX, e.pageY);;
        });
        this.domTextArea.addEventListener('click', (e) => {
            e.stopPropagation();
            contextMenu.setActive(null, 0, 0);
        });
        this.domTextArea.addEventListener('change', (e) => {
            this.activeTab.dirty = true;
            this.updateDom();
        })
        this.domTextArea.addEventListener('input', (e) => {
            this.activeTab.dirty = true;
            this.updateDom();
        })
    }

    getDOMTextArea() {
        if (!this.domTextArea) {
            this.domTextArea = document.querySelector("#editor-parent > textarea");
        }
    }

    setActive(element) {
        this.getDOMTextArea();
        this.domTextArea.value = element.data;
        this.active = element;
        this.activeTab = null;
        for (const tab of this.tabs) {
            tab.active = (tab.filePath == element.filePath)
            if (tab.filePath == element.filePath) {
                this.activeTab = tab;
            }
        }
        this.updateDom();
    }

    updateDom() {
        const domParent = document.querySelector("#editor-tabs")
        //Remove deleted tabs
        for (const div of domParent.querySelectorAll(".editor-tab")) {
            if (!this.tabs.some(t => t.filePath == div.dataset.filePath)) div.remove();
        }

        //Add unadded tabs
        this.tabs.forEach(element => {
            if (!domParent.querySelector(`.editor-tab[data-file-path="${element.filePath}"]`)) {
                let div = document.createElement('div');
                div.classList.add('editor-tab');
                div.dataset.filePath = element.filePath;
                let a = document.createElement('a');
                div.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    contextMenu.setActive("tab", e.pageX, e.pageY);;
                });
                div.addEventListener('click', (e) => {
                    e.stopPropagation();
                    contextMenu.setActive(null, 0, 0);
                    this.setActive(element);
                });
                a.innerText = element.filePath;
                div.appendChild(a);
                domParent.appendChild(div);
            }
        });

        //Set active tab
        this.tabs.forEach(tab => {
            const div = domParent.querySelector(`.editor-tab[data-file-path="${tab.filePath}"]`)
            if (div) div.classList.toggle("active", tab.active);
        });

        //Set dirty
        this.tabs.forEach(tab => {
            const div = domParent.querySelector(`.editor-tab[data-file-path="${tab.filePath}"]`)
            if (div) {
                div.querySelector("a").innerText = tab.dirty ? "●  " + tab.filePath : tab.filePath;
            }
            //●
        })
    }

    async openFile(filePath) {
        if (this.alreadyOpened(filePath)) {
            let element = this.tabs.find(e => e.filePath === filePath);
            this.setActive(element);
            return;
        }
        if (this.domElement) {
            this.domElement = document.querySelector("#editor-parent");
        }
        let data = await Neutralino.filesystem.readFile(filePath);
        let element = {filePath: filePath, data: data, dirty: false, active: false};
        this.tabs.push(element);
        this.updateDom();
        this.setActive(element);
    }

    closeDOMTab(element) {
        const filePath = element.dataset.filePath;
        const wasActive = this.active && this.active.filePath == filePath;
        this.tabs = this.tabs.filter(e => e.filePath !== filePath);
        if (wasActive) {
            const next = this.tabs[this.tabs.length - 1];
            if (next) { this.setActive(next); return; }   // setActive calls updateDom
            this.active = null;
            this.domTextArea.value = "";
        }
        this.updateDom();
    }

}