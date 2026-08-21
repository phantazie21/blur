class Node {
	constructor(name) {
		this.name = name;
	}

	toHtml() {
		throw new Error("Method 'toHtml()' must be implemented.");
	}
}

async function createNode(entry, parentPath = '.') {
    const path = `${parentPath}/${entry.entry}`;

    if (entry.type === 'DIRECTORY') {
        const directory = new Directory(entry.entry, [], false);
        const children = await Neutralino.filesystem.readDirectory(path);

        for (const child of children) {
            directory.addChild(await createNode(child, path));
        }

        directory.children = sortNodes(directory.children);
        return directory;
    }

    return new File(entry.entry, parentPath);
}
