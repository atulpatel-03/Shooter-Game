import kaplay from "kaplay";
import "kaplay/global";
import loadAssets from "./loadAssets";
import makeMenu from "./makeMenu";
import makeGame from "./makeGame";
import makeGameOver from "./makeGameOver";

const k = kaplay({
	global: false,
	width: 1280,
	height: 720,
	canvas: document.getElementById("game"),
	letterbox: true,
	texFilter: "nearest",
})

k.setBackground(k.Color.fromHex('#071821'))

loadAssets(k);
makeMenu(k);
makeGameOver(k);
makeGame(k);

// k.debug.inspect = true;

k.go('menu');