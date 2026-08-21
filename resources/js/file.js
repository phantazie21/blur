class File extends Node {
	constructor(name, path = '.') {
		super(name);
        this.path = path;
	}

	toHtml() {
		const a = document.createElement('a');
		const label = document.createElement('span');
		label.className = 'tree-label';
		label.textContent = this.name;
		a.appendChild(label);
		const li = document.createElement('li');
		li.appendChild(a);
        li.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            contextMenu.setActive("explorer-file", e.pageX, e.pageY);;
        });
        li.addEventListener('click', (e) => {
            e.stopPropagation();
            contextMenu.setActive(null, 0, 0);
            editor.openFile(this.path + "/" + this.name)
        });
		return li;
	}
}