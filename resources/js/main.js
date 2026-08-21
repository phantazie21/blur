function onWindowClose() {
	Neutralino.app.exit();
}

const contextMenu = new ContextMenu();

const editor = new Editor();

async function openFile(fileName) {
	let data = await Neutralino.filesystem.readFile(fileName);
	const editor = document.querySelector('#editor-parent > textarea');
	editor.value = data;
}

function closeTab() {
    let element = contextMenu.selectedItem.closest(".editor-tab");
    if (element) editor.closeDOMTab(element);
    contextMenu.setActive(null, 0, 0);
}

document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
	var handler = document.querySelector('#main > div.handler');
	var main = document.querySelector("#main");
	var explorer = document.querySelector('#file-tree');
    explorer.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        contextMenu.setActive("explorer", e.pageX, e.pageY);
    });
    explorer.addEventListener('click', (e) => {
        e.stopPropagation();
        contextMenu.setActive("", 0, 0);
    });
	var isHandlerDragging = false;
	document.addEventListener('mousedown', function(e) {
		if (e.target === handler) {
			isHandlerDragging = true;
		}
	});
	
	document.addEventListener('mousemove', function(e) {
		if (!isHandlerDragging) {
			return false;
		}
		var containerOffsetLeft = main.offsetLeft;
		var pointerRelativeXpos = e.clientX - containerOffsetLeft;
		var explorerMinWidth = 60;
		explorer.style.width = (Math.max(explorerMinWidth, pointerRelativeXpos - 8)) + 'px';
		explorer.style.flexGrow = 0;
	});
	
	document.addEventListener('mouseup', function(e) {
		isHandlerDragging = false;
	});

    editor.getDOMTextArea();

    editor.registerEvents();
	
	buildFileTree();
});

Neutralino.init();

Neutralino.events.on("windowClose", onWindowClose);