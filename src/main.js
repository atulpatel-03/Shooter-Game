import kaplay from "kaplay";
import "kaplay/global";
import loadAssets from "./loadAssets";
import makeMenu from "./makeMenu";
import makeGame from "./makeGame";
import makeGameOver from "./makeGameOver";

const k = kaplay({
	global: false,
	width: window.innerWidth,  // Set width to match the window width
	height: window.innerHeight, // Set height to match the window height
	canvas: document.getElementById("game"),
	texFilter: "nearest",
	background: '#071821',
});

// Handle resizing of the window
window.addEventListener('resize', () => {
    k.width = window.innerWidth;  // Update canvas width
    k.height = window.innerHeight; // Update canvas height
    k.scale(); // Recalculate the canvas scaling
});

loadAssets(k);
makeMenu(k);
makeGameOver(k);
makeGame(k);

// k.debug.inspect = true;

k.go('menu');