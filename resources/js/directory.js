class Directory extends Node {
    constructor(name, children = [], open = false) {
        super(name);
        this.children = children;
        this.open = open;
        this.element = null;
        this.nestedElement = null;
        this.labelElement = null;
    }

    toHtml() {
        const a = document.createElement('a');

        const label = document.createElement('span');
        label.className = 'tree-label';
        this.labelElement = label;

        const li = document.createElement('li');
        this.element = li;

        li.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            contextMenu.setActive("explorer-folder", e.pageX, e.pageY);;
        });
        li.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            contextMenu.setActive(null, 0, 0);
            this.toggleDirectory();
        });

        a.appendChild(label);
        li.appendChild(a);

		if (this.children.length > 0) {
			const nested = document.createElement('ul');
			this.nestedElement = nested;

			for (const child of this.children) {
				nested.appendChild(child.toHtml());
			}

			li.appendChild(nested);
		}

        this.updateDom();
        return li;
    }

    toggleDirectory() {
        this.open = !this.open;
        this.updateDom();
    }

    updateDom() {
        if (this.labelElement) {
            this.labelElement.textContent =
                (this.open ? '- ' : '+ ') + this.name;
        }

        if (this.nestedElement) {
            this.nestedElement.style.display = this.open ? 'block' : 'none';
        }
    }

	addChild(child) {
		this.children.push(child);
		if (this.nestedElement) {
			this.nestedElement.appendChild(child.toHtml());
		}
	}
}

function sortNodes(nodes) {
    return nodes.sort((left, right) => {
        const leftIsDirectory = left instanceof Directory;
        const rightIsDirectory = right instanceof Directory;

        if (leftIsDirectory !== rightIsDirectory) {
            return leftIsDirectory ? -1 : 1;
        }

        return left.name.localeCompare(right.name);
    });
}

async function buildFileTree() {
    const files = await Neutralino.filesystem.readDirectory('.');
    const rootDir = new Directory('root', [], true);

    for (const file of files) {
        rootDir.addChild(await createNode(file));
    }

    rootDir.children = sortNodes(rootDir.children);
    renderFileTree(rootDir);
}

function renderFileTree(rootDir) {
    const container = document.querySelector('#file-tree');
    const ul = document.createElement('ul');

    ul.appendChild(rootDir.toHtml());

    container.replaceChildren(ul);
}
