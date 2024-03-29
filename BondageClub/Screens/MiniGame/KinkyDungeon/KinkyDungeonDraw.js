"use strict";


let KDRecentRepIndex = 0;

let ShowBoringness = false;

let KDWallReplacers = "14,dDb";

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {string} noReplace
 * @returns {boolean}
 */
function KDWallVert(x, y, noReplace) {
	//let tileUp = KinkyDungeonMapGet(x, y);
	let tileBelow = KinkyDungeonMapGet(x, y + 1);
	if (
		// These are the tiles that trigger a replacement
		KDWallReplacers.includes(tileBelow)
		&& (!noReplace || !noReplace.includes(tileBelow))
	)
		return true;

	return false;
}

function KinkyDungeonGetSprite(code, x, y, Fog, noReplace) {
	let sprite = "Floor";
	if (code == "1") {
		if (KDWallVert(x, y, noReplace))
			sprite = "WallVert";
		else
			sprite = "Wall";
	}
	//else if (code == "|") sprite = "WallVert";
	//else if (code == "\\") sprite = "WallVert";
	else if (code == "2") sprite = "Brickwork";
	else if (code == "3") sprite = Fog ? "Doodad" : "MimicBlock";
	else if (code == "b") sprite = "Bars";
	else if (code == "X") sprite = "Doodad";
	else if (code == "4") {
		if (KDWallVert(x, y, noReplace))
			sprite = "WallVert";
		else
			sprite = "Wall";
	}
	else if (code == "L") sprite = "Barrel";
	else if (code == "?") sprite = "Floor";
	else if (code == "/") sprite = "RubbleLooted";
	else if (code == ",") {
		if (KDWallVert(x, y, noReplace))
			sprite = "WallVert";
		else
			sprite = "Wall";
	}
	else if (code == "D") {
		sprite = "Door";
		if (Fog) {
			if (KinkyDungeonTilesMemory.get(x + "," + y)) sprite = KinkyDungeonTilesMemory.get(x + "," + y);
		} else {
			KinkyDungeonTilesMemory.set(x + "," + y, "Door");
		}
	}
	else if (code == "d") {
		sprite = "DoorOpen";
		if (Fog) {
			if (KinkyDungeonTilesMemory.get(x + "," + y)) sprite = KinkyDungeonTilesMemory.get(x + "," + y);
		} else {
			KinkyDungeonTilesMemory.set(x + "," + y, "DoorOpen");
		}
	} else if (code == "R") sprite = "RubbleLooted";
	else if (code == "Y") sprite = "Doodad";
	else if (code == "T") {if (KinkyDungeonBlindLevel > 0) sprite = "Floor"; else sprite = "Trap";}
	else if (code == "r") sprite = "RubbleLooted";
	else if (code == "g") sprite = "Grate";
	else if (code == "S") sprite = "StairsUp";
	else if (code == "s") sprite = "StairsDown";
	else if (code == "H") sprite = "StairsDown"; // Shortcut
	else if (code == "A") sprite = (KinkyDungeonTiles.get(x + "," + y) && KinkyDungeonTiles.get(x + "," + y).Type == "Shrine" && KinkyDungeonTiles.get(x + "," + y).Name == "Commerce") ? "ShrineC" : "Shrine";
	else if (code == "O") sprite = "OrbEmpty";
	else if (code == "o") sprite = "OrbEmpty";
	else if (code == "a") sprite = "ShrineBroken";
	else if (code == "w") sprite = "Floor";
	else if (code == "]") sprite = "Floor";
	else if (code == "[") sprite = "Floor";
	else if (code == "=") sprite = "Brickwork";
	else if (code == "+") sprite = "Brickwork";
	else if (code == "-") sprite = "Brickwork";
	return sprite;
}

function KinkyDungeonGetSpriteOverlay(code, x, y, Fog, noReplace) {
	let sprite = "";
	if (code == "G") {
		sprite = "Ghost";
		if (KinkyDungeonTiles.get(x + "," + y).Msg || KinkyDungeonTiles.get(x + "," + y).Dialogue) {
			sprite = "GhostImportant";
		}
	}
	if (code == "$") sprite = "Angel";
	else if (code == "R") sprite = "Rubble";
	else if (code == "/") sprite = "Scrap";
	else if (code == "Y") sprite = "Rubble";
	else if (code == "=") sprite = "ChargerCrystal";
	else if (code == "+") sprite = "Charger";
	else if (code == "-") sprite = "ChargerSpent";
	else if (code == "B") sprite = "Bed";
	else if (code == "?") sprite = "HookHigh";
	else if (code == "4") {
		let left = KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(x - 1, y));
		let right = KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(x + 1, y));
		let up = KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(x, y - 1));
		let down = KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(x, y + 1));
		if (down) {
			sprite = "Crack";
		} else if (up) {
			sprite = "CrackHoriz";
		} else if (left && right) {
			sprite = "CrackVert";
		} else if (left) {
			sprite = "CrackLeft";
		} else if (right) {
			sprite = "CrackRight";
		} else
			sprite = "CrackNone";
	} else if (code == ",") sprite = "HookLow";
	else if (code == "O") sprite = "Orb";
	else if (code == "w") sprite = Fog ? "" : "Water";
	else if (code == "]") sprite = "HappyGas";
	else if (code == "[") sprite = "Spores";
	else if (code == "C") sprite = (KinkyDungeonTiles.get(x + "," + y) && (KinkyDungeonTiles.get(x + "," + y).Loot == "gold" || KinkyDungeonTiles.get(x + "," + y).Loot == "lessergold")) ? "ChestGold" :
		((KinkyDungeonTiles.get(x + "," + y) && (KinkyDungeonTiles.get(x + "," + y).Loot == "silver")) ? "ChestSilver" :
		((KinkyDungeonTiles.get(x + "," + y) && (KinkyDungeonTiles.get(x + "," + y).Loot == "blue")) ? "ChestBlue" :
		((KinkyDungeonTiles.get(x + "," + y) && (KinkyDungeonTiles.get(x + "," + y).Loot == "dark")) ? "ChestDark" :
		((KinkyDungeonTiles.get(x + "," + y) && (KinkyDungeonTiles.get(x + "," + y).Loot == "pearl" || KinkyDungeonTiles.get(x + "," + y).Loot == "lesserpearl")) ? "ChestPearl" : "Chest"))));
	else if (code == "c") sprite = (KinkyDungeonTiles.get(x + "," + y) && (KinkyDungeonTiles.get(x + "," + y).Loot == "gold" || KinkyDungeonTiles.get(x + "," + y).Loot == "lessergold")) ? "ChestGoldOpen" :
		((KinkyDungeonTiles.get(x + "," + y) && (KinkyDungeonTiles.get(x + "," + y).Loot == "silver")) ? "ChestSilverOpen" :
		((KinkyDungeonTiles.get(x + "," + y) && (KinkyDungeonTiles.get(x + "," + y).Loot == "blue")) ? "ChestBlueOpen" :
		((KinkyDungeonTiles.get(x + "," + y) && (KinkyDungeonTiles.get(x + "," + y).Loot == "dark")) ? "ChestDarkOpen" :
		((KinkyDungeonTiles.get(x + "," + y) && (KinkyDungeonTiles.get(x + "," + y).Loot == "pearl" || KinkyDungeonTiles.get(x + "," + y).Loot == "lesserpearl")) ? "ChestPearlOpen" : "ChestOpen"))));
	return sprite;
}

// Draw function for the game portion
function KinkyDungeonDrawGame() {
	KDProcessInputs();

	if (KDRefresh) {
		CharacterRefresh(KinkyDungeonPlayer);
	}
	KDNaked = false;
	KDRefresh = false;

	if (ServerURL == "foobar") {
		MainCanvas.textAlign = "center";
		DrawTextFit(TextGet("KinkyDungeon"), 1865, 50, 200, "white", "gray");
		MainCanvas.textAlign = "center";
	}


	if (KinkyDungeonDrawState == "Game")
		KinkyDungeonListenKeyMove();
	if ((KinkyDungeonGameKey.keyPressed[9])) {
		KinkyDungeonDrawState = "Game";
		KinkyDungeonMessageToggle = false;
		KinkyDungeonTargetingSpell = null;
		KinkyDungeonTargetTile = null;
		KinkyDungeonTargetTileLocation = "";
		KinkyDungeonSpellPress = "";
		KDModalArea = false;
		KinkyDungeonShowInventory = false;
		KDRepSelectionMode = "";
	}

	KinkyDungeonCapStats();

	if (ChatRoomChatLog.length > 0) {
		let LastChatObject = ChatRoomChatLog[ChatRoomChatLog.length - 1];
		let LastChat = LastChatObject.Garbled;
		let LastChatTime = LastChatObject.Time;
		let LastChatSender = (LastChatObject.SenderName) ? LastChatObject.SenderName + ": " : ">";
		let LastChatMaxLength = 60;

		if (LastChat)  {
			LastChat = (LastChatSender + LastChat).substr(0, LastChatMaxLength);
			if (LastChat.length == LastChatMaxLength) LastChat = LastChat + "...";
			if (LastChatTime && CommonTime() < LastChatTime + KinkyDungeonLastChatTimeout)
				if (!KinkyDungeonSendTextMessage(0, LastChat, "white", 1) && LastChat != KinkyDungeonActionMessage)
					if (!KinkyDungeonSendActionMessage(0, LastChat, "white", 1) && LastChat != KinkyDungeonTextMessage)
						KinkyDungeonSendTextMessage(1, LastChat, "white", 1);
		}
	}


	KinkyDungeonDrawDelta = CommonTime() - KinkyDungeonLastDraw;
	KinkyDungeonLastDraw = CommonTime();

	if (!(KinkyDungeonDrawState == "MagicSpells")) {
		KDSwapSpell = -1;
	}

	if (KinkyDungeonDrawState == "Game") {
		let KinkyDungeonForceRender = "";
		let KinkyDungeonForceRenderFloor = "";

		for (let b of Object.values(KinkyDungeonPlayerBuffs)) {
			if (b && b.mushroom) {
				//DrawImageCanvas(KinkyDungeonRootDirectory + "MushroomOverlay.png", KinkyDungeonContext, 0, 0);
				KinkyDungeonForceRender = '2';
				KinkyDungeonForceRenderFloor = "cry";
			}
		}

		let tooltip = "";
		if ((KinkyDungeonIsPlayer() || (KinkyDungeonGameData && CommonTime() < KinkyDungeonNextDataLastTimeReceived + KinkyDungeonNextDataLastTimeReceivedTimeout))) {


			KinkyDungeonUpdateVisualPosition(KinkyDungeonPlayerEntity, KinkyDungeonDrawDelta);

			let CamX = KinkyDungeonPlayerEntity.x - Math.floor(KinkyDungeonGridWidthDisplay/2);//Math.max(0, Math.min(KinkyDungeonGridWidth - KinkyDungeonGridWidthDisplay, KinkyDungeonPlayerEntity.x - Math.floor(KinkyDungeonGridWidthDisplay/2)));
			let CamY = KinkyDungeonPlayerEntity.y - Math.floor(KinkyDungeonGridHeightDisplay/2);// Math.max(0, Math.min(KinkyDungeonGridHeight - KinkyDungeonGridHeightDisplay, KinkyDungeonPlayerEntity.y - Math.floor(KinkyDungeonGridHeightDisplay/2)));
			let CamX_offset = KinkyDungeonPlayerEntity.visual_x - Math.floor(KinkyDungeonGridWidthDisplay/2) - CamX;//Math.max(0, Math.min(KinkyDungeonGridWidth - KinkyDungeonGridWidthDisplay, KinkyDungeonPlayerEntity.visual_x - Math.floor(KinkyDungeonGridWidthDisplay/2))) - CamX;
			let CamY_offset = KinkyDungeonPlayerEntity.visual_y - Math.floor(KinkyDungeonGridHeightDisplay/2) - CamY;//Math.max(0, Math.min(KinkyDungeonGridHeight - KinkyDungeonGridHeightDisplay, KinkyDungeonPlayerEntity.visual_y - Math.floor(KinkyDungeonGridHeightDisplay/2))) - CamY;

			KinkyDungeonCamX = CamX;
			KinkyDungeonCamY = CamY;

			KinkyDungeonSetMoveDirection();

			if (KinkyDungeonCanvas) {
				KinkyDungeonContext.fillStyle = "rgba(0,0,0.0,1.0)";
				KinkyDungeonContext.fillRect(0, 0, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height);
				KinkyDungeonContext.fill();
				let noReplace = "";
				let noReplace_skin = {};
				for (let tile of KinkyDungeonTilesSkin.values()) {
					if (tile.skin && noReplace_skin[tile.skin] != undefined) {
						let paramskin = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];
						if (paramskin.noReplace)
							noReplace_skin[tile.skin] = paramskin.noReplace;
						else noReplace_skin[tile.skin] = "";
					}
				}

				let params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];
				if (params.noReplace)
					noReplace = params.noReplace;
				// Draw the grid and tiles
				let rows = KinkyDungeonGrid.split('\n');
				for (let R = -1; R <= KinkyDungeonGridHeightDisplay; R++)  {
					for (let X = -1; X <= KinkyDungeonGridWidthDisplay; X++)  {
						let RY = R+CamY;
						let RX = X+CamX;
						if (RY >= 0 && RY < KinkyDungeonGridHeight && RX >= 0 && RX < KinkyDungeonGridWidth) {
							let floor = KinkyDungeonTilesSkin.get(RX + "," + RY) ? KinkyDungeonMapIndex[KinkyDungeonTilesSkin.get(RX + "," + RY).skin] : KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint];

							let nR = KinkyDungeonTilesSkin.get(RX + "," + RY) ? noReplace : noReplace_skin[floor];
							let sprite = KinkyDungeonGetSprite(rows[RY][RX], RX, RY, KinkyDungeonLightGet(RX, RY) == 0, nR);
							let sprite2 = KinkyDungeonGetSpriteOverlay(rows[RY][RX], RX, RY, KinkyDungeonLightGet(RX, RY) == 0, nR);
							if (KinkyDungeonForceRender) {
								sprite = KinkyDungeonGetSprite(KinkyDungeonForceRender, RX, RY, KinkyDungeonLightGet(RX, RY) == 0, nR);
								sprite2 = null;
							}
							if (KinkyDungeonForceRenderFloor != "") floor = KinkyDungeonForceRenderFloor;

							DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Floor_" + floor + "/" + sprite + ".png", KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
								(-CamX_offset + X)*KinkyDungeonGridSizeDisplay, (-CamY_offset+R)*KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
							if (sprite2)
								DrawImageZoomCanvas(KinkyDungeonRootDirectory + "FloorGeneric/" + sprite2 + ".png", KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
									(-CamX_offset + X)*KinkyDungeonGridSizeDisplay, (-CamY_offset+R)*KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);

							if (rows[RY][RX] == "A") {
								let color = "";
								if (KinkyDungeonTiles.get(RX + "," + RY)) {
									if (KinkyDungeonTiles.get(RX + "," + RY).Name == "Illusion") color = "#8154FF";
									else if (KinkyDungeonTiles.get(RX + "," + RY).Name == "Conjure") color = "#D4AAFF";
									else if (KinkyDungeonTiles.get(RX + "," + RY).Name == "Elements") color = "#FF0000";
									else if (KinkyDungeonTiles.get(RX + "," + RY).Name == "Latex") color = "#2667FF";
									else if (KinkyDungeonTiles.get(RX + "," + RY).Name == "Leather") color = "#442E1E";
									else if (KinkyDungeonTiles.get(RX + "," + RY).Name == "Metal") color = "#222222";
									else if (KinkyDungeonTiles.get(RX + "," + RY).Name == "Rope") color = "#7C4926";
									else if (KinkyDungeonTiles.get(RX + "," + RY).Name == "Will") color = "#23FF44";
								}
								if (color)
									DrawImageCanvasColorize(KinkyDungeonRootDirectory + "ShrineAura.png",  KinkyDungeonContext,
										(-CamX_offset + X)*KinkyDungeonGridSizeDisplay, (-CamY_offset+R)*KinkyDungeonGridSizeDisplay,
										KinkyDungeonGridSizeDisplay/KinkyDungeonSpriteSize, color, true, []);
							}
							if (KinkyDungeonLightGet(RX, RY) > 0 && KinkyDungeonTiles.get(RX + "," + RY) && rows[RY][RX] == "A" && MouseIn(canvasOffsetX + (-CamX_offset + X)*KinkyDungeonGridSizeDisplay, canvasOffsetY + (-CamY_offset+R)*KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay)) {
								tooltip = TextGet("KinkyDungeonShrine" + KinkyDungeonTiles.get(RX + "," + RY).Name);
							}
						}
					}
				}

				// Get lighting grid
				if (KinkyDungeonUpdateLightGrid) {
					KinkyDungeonUpdateLightGrid = false;
					let lights = [ {x: KinkyDungeonPlayerEntity.x, y:KinkyDungeonPlayerEntity.y, brightness: KinkyDungeonGetVisionRadius() }];
					for (let t of KinkyDungeonTiles.keys()) {
						let tile = KinkyDungeonTiles.get(t);
						let x = parseInt(t.split(',')[0]);
						let y = parseInt(t.split(',')[1]);
						if (tile && tile.Light && x && y && KDistEuclidean(x - KinkyDungeonPlayerEntity.x, y - KinkyDungeonPlayerEntity.y) <= 2 * Math.max(tile.Light, KinkyDungeonGetVisionRadius())) {
							if (KinkyDungeonCheckPath(x, y, KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, true, false, 2))
								lights.push({x: x, y:y, brightness: tile.Light - KinkyDungeonBlindLevel });
						}
					}
					KinkyDungeonMakeLightMap(KinkyDungeonGridWidth, KinkyDungeonGridHeight, lights, KDVisionUpdate);
					KDVisionUpdate = 0;
				}

				for (let b of Object.values(KinkyDungeonPlayerBuffs)) {
					if (b && b.aura) {
						DrawImageCanvasColorize(KinkyDungeonRootDirectory + (b.auraSprite ? b.auraSprite : "Aura") + ".png", KinkyDungeonContext,
							(KinkyDungeonPlayerEntity.visual_x - CamX - CamX_offset)*KinkyDungeonGridSizeDisplay,
							(KinkyDungeonPlayerEntity.visual_y - CamY - CamY_offset)*KinkyDungeonGridSizeDisplay,
							KinkyDungeonSpriteSize/KinkyDungeonGridSizeDisplay,
							b.aura, true, []);
					}
				}

				KinkyDungeonDrawItems(canvasOffsetX, canvasOffsetY, CamX+CamX_offset, CamY+CamY_offset);
				KinkyDungeonContext.drawImage(KinkyDungeonCanvasPlayer,  (KinkyDungeonPlayerEntity.visual_x - CamX - CamX_offset)*KinkyDungeonGridSizeDisplay, (KinkyDungeonPlayerEntity.visual_y - CamY - CamY_offset)*KinkyDungeonGridSizeDisplay);

				if (KinkyDungeonMovePoints < 0 || KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "SlowLevel") > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Slow.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(KinkyDungeonPlayerEntity.visual_x - CamX - CamX_offset)*KinkyDungeonGridSizeDisplay,
						(KinkyDungeonPlayerEntity.visual_y - CamY - CamY_offset)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonStatBlind > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Stun.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(KinkyDungeonPlayerEntity.visual_x - CamX - CamX_offset)*KinkyDungeonGridSizeDisplay,
						(KinkyDungeonPlayerEntity.visual_y - CamY - CamY_offset)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonStatFreeze > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Freeze.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(KinkyDungeonPlayerEntity.visual_x - CamX - CamX_offset)*KinkyDungeonGridSizeDisplay,
						(KinkyDungeonPlayerEntity.visual_y - CamY - CamY_offset)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonStatBind > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Bind.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(KinkyDungeonPlayerEntity.visual_x - CamX - CamX_offset)*KinkyDungeonGridSizeDisplay,
						(KinkyDungeonPlayerEntity.visual_y - CamY - CamY_offset)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Sneak") > 0 || KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "SlowDetection") > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Sneak.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(KinkyDungeonPlayerEntity.visual_x - CamX - CamX_offset)*KinkyDungeonGridSizeDisplay,
						(KinkyDungeonPlayerEntity.visual_y - CamY - CamY_offset)*KinkyDungeonGridSizeDisplay - 30,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "AttackDmg") > 0 || KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "AttackAcc") > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Buff.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(KinkyDungeonPlayerEntity.visual_x - CamX - CamX_offset)*KinkyDungeonGridSizeDisplay,
						(KinkyDungeonPlayerEntity.visual_y - CamY - CamY_offset)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "AttackDmg") < 0 || KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "AttackAcc") < 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Debuff.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(KinkyDungeonPlayerEntity.visual_x - CamX - CamX_offset)*KinkyDungeonGridSizeDisplay,
						(KinkyDungeonPlayerEntity.visual_y - CamY - CamY_offset)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "AttackDmg") < 0 || KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "AttackAcc") < 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Debuff.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(KinkyDungeonPlayerEntity.visual_x - CamX - CamX_offset)*KinkyDungeonGridSizeDisplay,
						(KinkyDungeonPlayerEntity.visual_y - CamY - CamY_offset)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Armor") > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/ArmorBuff.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(KinkyDungeonPlayerEntity.visual_x - CamX - CamX_offset)*KinkyDungeonGridSizeDisplay,
						(KinkyDungeonPlayerEntity.visual_y - CamY - CamY_offset)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				} else if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Armor") < 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/ArmorDebuff.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(KinkyDungeonPlayerEntity.visual_x - CamX - CamX_offset)*KinkyDungeonGridSizeDisplay,
						(KinkyDungeonPlayerEntity.visual_y - CamY - CamY_offset)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Evasion") > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/EvasionBuff.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(KinkyDungeonPlayerEntity.visual_x - CamX - CamX_offset)*KinkyDungeonGridSizeDisplay,
						(KinkyDungeonPlayerEntity.visual_y - CamY - CamY_offset)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "DamageReduction") > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/ShieldBuff.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(KinkyDungeonPlayerEntity.visual_x - CamX - CamX_offset)*KinkyDungeonGridSizeDisplay,
						(KinkyDungeonPlayerEntity.visual_y - CamY - CamY_offset)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "DamageAmp") > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/DamageAmp.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(KinkyDungeonPlayerEntity.visual_x - CamX - CamX_offset)*KinkyDungeonGridSizeDisplay,
						(KinkyDungeonPlayerEntity.visual_y - CamY - CamY_offset)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}

				KinkyDungeonDrawFight(canvasOffsetX, canvasOffsetY, CamX+CamX_offset, CamY+CamY_offset);
				KinkyDungeonDrawEnemiesWarning(canvasOffsetX, canvasOffsetY, CamX+CamX_offset, CamY+CamY_offset);
				KinkyDungeonDrawEnemies(canvasOffsetX, canvasOffsetY, CamX+CamX_offset, CamY+CamY_offset);
				KinkyDungeonDrawEnemiesStatus(canvasOffsetX, canvasOffsetY, CamX+CamX_offset, CamY+CamY_offset);

				// Draw fog of war
				for (let R = -1; R <= KinkyDungeonGridHeightDisplay; R++)  {
					for (let X = -1; X <= KinkyDungeonGridWidthDisplay; X++)  {

						let RY = Math.max(0, Math.min(R+CamY, KinkyDungeonGridHeight-1));
						let RX = Math.max(0, Math.min(X+CamX, KinkyDungeonGridWidth-1));
						let fog = KinkyDungeonStatBlind > 0 ? 0 : Math.min(0.5, KinkyDungeonFogGrid[RX + RY*KinkyDungeonGridWidth]/10);
						let lightDiv = (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(RX, RY))) ? 3 : 2;
						let light = Math.max(KinkyDungeonLightGrid[RX + RY*KinkyDungeonGridWidth]/lightDiv, fog);
						if (KinkyDungeonLightGrid[RX + RY*KinkyDungeonGridWidth] > 0 && KDistChebyshev(KinkyDungeonPlayerEntity.x - RX, KinkyDungeonPlayerEntity.y - RY) < 2) {
							light = light + (1 - light)*0.5;
						}

						KinkyDungeonContext.beginPath();
						KinkyDungeonContext.fillStyle = "rgba(0,0,0," + Math.max(0, 1-light) + ")";

						KinkyDungeonContext.fillRect((-CamX_offset + X)*KinkyDungeonGridSizeDisplay, (-CamY_offset + R)*KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay);
						KinkyDungeonContext.fill();
					}
				}
				if (ShowBoringness) {
					let maxBoringness = Math.max(...KinkyDungeonBoringness);
					for (let R = -1; R <= KinkyDungeonGridHeightDisplay; R++)  {
						for (let X = -1; X <= KinkyDungeonGridWidthDisplay; X++)  {

							let RY = Math.max(0, Math.min(R+CamY, KinkyDungeonGridHeight-1));
							let RX = Math.max(0, Math.min(X+CamX, KinkyDungeonGridWidth-1));

							if (KinkyDungeonBoringGet(RX, RY) && RY == R+CamY && RX == X+CamX) {
								KinkyDungeonContext.beginPath();
								KinkyDungeonContext.lineWidth = 3;
								KinkyDungeonContext.strokeStyle = "rgba(255,0,0," + Math.max(0, (KinkyDungeonBoringGet(RX, RY) / maxBoringness)) + ")";

								KinkyDungeonContext.rect(
									(-CamX_offset + X)*KinkyDungeonGridSizeDisplay,
									(-CamY_offset + R)*KinkyDungeonGridSizeDisplay,
									KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay);
								KinkyDungeonContext.stroke();
							}
						}
					}
				}

				KinkyDungeonSendEvent("draw",{update: KDDrawUpdate, CamX:CamX, CamY:CamY, CamX_offset: CamX_offset, CamY_offset: CamY_offset});
				KDDrawUpdate = 0;


				// Draw targeting reticule
				if (!KinkyDungeonAutoWait && !KinkyDungeonShowInventory && MouseIn(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height) && KinkyDungeonIsPlayer()
					&& !MouseIn(0, 0, 500, 1000) && (!KDModalArea || !MouseIn(KDModalArea_x, KDModalArea_y, KDModalArea_width, KDModalArea_height))) {
					if (KinkyDungeonTargetingSpell) {
						KinkyDungeonSetTargetLocation();

						KinkyDungeonContext.beginPath();
						KinkyDungeonContext.rect((KinkyDungeonTargetX - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonTargetY - CamY)*KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay);
						KinkyDungeonContext.lineWidth = 3;
						KinkyDungeonContext.strokeStyle = "#88AAFF";
						KinkyDungeonContext.stroke();

						let spellRange = KinkyDungeonTargetingSpell.range * KinkyDungeonMultiplicativeStat(-KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "spellRange"));
						let free = KinkyDungeonOpenObjects.includes(KinkyDungeonMapGet(KinkyDungeonTargetX, KinkyDungeonTargetY)) || KinkyDungeonLightGet(KinkyDungeonTargetX, KinkyDungeonTargetY) < 0.1;
						KinkyDungeonSpellValid = (KinkyDungeonTargetingSpell.projectileTargeting || spellRange >= Math.sqrt((KinkyDungeonTargetX - KinkyDungeonPlayerEntity.x) *(KinkyDungeonTargetX - KinkyDungeonPlayerEntity.x) + (KinkyDungeonTargetY - KinkyDungeonPlayerEntity.y) * (KinkyDungeonTargetY - KinkyDungeonPlayerEntity.y))) &&
							(KinkyDungeonTargetingSpell.projectileTargeting || KinkyDungeonTargetingSpell.CastInWalls || free) &&
							(!KinkyDungeonTargetingSpell.WallsOnly || !KinkyDungeonOpenObjects.includes(KinkyDungeonMapGet(KinkyDungeonTargetX, KinkyDungeonTargetY)));
						if (KinkyDungeonTargetingSpell.noTargetEnemies && KinkyDungeonEnemyAt(KinkyDungeonTargetX, KinkyDungeonTargetY)) KinkyDungeonSpellValid = false;
						if (KinkyDungeonTargetingSpell.noTargetAllies) {
							let enemy = KinkyDungeonEnemyAt(KinkyDungeonTargetX, KinkyDungeonTargetY);
							if (enemy && KDAllied(enemy))
								KinkyDungeonSpellValid = false;
						}
						if (KinkyDungeonTargetingSpell.selfTargetOnly && (KinkyDungeonPlayerEntity.x != KinkyDungeonTargetX || KinkyDungeonPlayerEntity.y != KinkyDungeonTargetY)) KinkyDungeonSpellValid = false;
						if (KinkyDungeonTargetingSpell.noTargetDark && KinkyDungeonLightGet(KinkyDungeonTargetX, KinkyDungeonTargetY) < 1) KinkyDungeonSpellValid = false;
						if (KinkyDungeonTargetingSpell.noTargetPlayer && KinkyDungeonPlayerEntity.x == KinkyDungeonTargetX && KinkyDungeonPlayerEntity.y == KinkyDungeonTargetY) KinkyDungeonSpellValid = false;
						if (KinkyDungeonTargetingSpell.mustTarget && KinkyDungeonNoEnemy(KinkyDungeonTargetX, KinkyDungeonTargetY, true)) KinkyDungeonSpellValid = false;

						if (KinkyDungeonSpellValid)
							if (KinkyDungeonTargetingSpell.projectileTargeting) {
								let range = KinkyDungeonTargetingSpell.castRange;
								if (!range || spellRange > range) range = spellRange;
								let dist = Math.sqrt((KinkyDungeonTargetX - KinkyDungeonPlayerEntity.x)*(KinkyDungeonTargetX - KinkyDungeonPlayerEntity.x)
									+ (KinkyDungeonTargetY - KinkyDungeonPlayerEntity.y)*(KinkyDungeonTargetY - KinkyDungeonPlayerEntity.y));
								for (let R = 0; R <= Math.max(1, range - 1); R+= 0.5) {
									let xx = KinkyDungeonMoveDirection.x + Math.round((KinkyDungeonTargetX - KinkyDungeonPlayerEntity.x) * R / dist);
									let yy = KinkyDungeonMoveDirection.y + Math.round((KinkyDungeonTargetY - KinkyDungeonPlayerEntity.y) * R / dist);
									if (KinkyDungeonLightGet(xx + KinkyDungeonPlayerEntity.x, yy + KinkyDungeonPlayerEntity.y) > 0 && !KinkyDungeonForceRender)
										DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Target.png",
											KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
											(xx + KinkyDungeonPlayerEntity.x - CamX)*KinkyDungeonGridSizeDisplay, (yy + KinkyDungeonPlayerEntity.y - CamY)*KinkyDungeonGridSizeDisplay,
											KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
								}
							}
							else if (!KinkyDungeonForceRender)
								DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Target.png",
									KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
									(KinkyDungeonTargetX - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonTargetY - CamY)*KinkyDungeonGridSizeDisplay,
									KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
					} else if (KinkyDungeonFastMove && (KinkyDungeonMoveDirection.x != 0 || KinkyDungeonMoveDirection.y != 0)) {
						KinkyDungeonSetTargetLocation();

						if (KinkyDungeonLightGet(KinkyDungeonTargetX, KinkyDungeonTargetY) > 0 || KinkyDungeonFogGet(KinkyDungeonTargetX, KinkyDungeonTargetY) > 0) {
							KinkyDungeonContext.beginPath();
							KinkyDungeonContext.rect((KinkyDungeonTargetX - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonTargetY - CamY)*KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay);
							KinkyDungeonContext.lineWidth = 3;
							KinkyDungeonContext.strokeStyle = "#ff4444";
							KinkyDungeonContext.stroke();
						}
					} else if ((KinkyDungeonMoveDirection.x != 0 || KinkyDungeonMoveDirection.y != 0)) {
						KinkyDungeonContext.beginPath();
						KinkyDungeonContext.rect((KinkyDungeonMoveDirection.x + KinkyDungeonPlayerEntity.x - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonMoveDirection.y + KinkyDungeonPlayerEntity.y - CamY)*KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay);
						KinkyDungeonContext.lineWidth = 3;
						KinkyDungeonContext.strokeStyle = "#ff4444";
						KinkyDungeonContext.stroke();
					}
				}

				if (KinkyDungeonFastMoveSuppress) {
					KinkyDungeonContext.beginPath();
					KinkyDungeonContext.rect(0, 0, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height);
					KinkyDungeonContext.lineWidth = 4;
					KinkyDungeonContext.strokeStyle = "#ff4444";
					KinkyDungeonContext.stroke();
				}

				if (KinkyDungeonLastTurnAction == "Struggle" && KinkyDungeonCurrentEscapingItem && KinkyDungeonCurrentEscapingItem.lock) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Lock.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(KinkyDungeonPlayerEntity.visual_x - CamX - CamX_offset)*KinkyDungeonGridSizeDisplay,
						(KinkyDungeonPlayerEntity.visual_y - CamY - CamY_offset)*KinkyDungeonGridSizeDisplay - 60,
						KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}

				MainCanvas.drawImage(KinkyDungeonCanvas, canvasOffsetX, canvasOffsetY);

			}

			if (KDGameData && KDGameData.AncientEnergyLevel) {
				let h = 1000 * KDGameData.AncientEnergyLevel;
				const Grad = MainCanvas.createLinearGradient(0, 1000-h, 0, 1000);
				Grad.addColorStop(0, `rgba(255,255,0,0)`);
				Grad.addColorStop(0.5, `rgba(255,255,128,0.5)`);
				Grad.addColorStop(0.75, `rgba(255,255,255,1.0)`);
				Grad.addColorStop(1.0, `rgba(255,255,255,0.25)`);
				MainCanvas.fillStyle = Grad;
				MainCanvas.fillRect(0, 1000-h, 500, h);
			}

			DrawCharacter(KinkyDungeonPlayer, 0, 0, 1);


			DrawText(
				TextGet("CurrentLevel").replace("FLOORNUMBER", "" + MiniGameKinkyDungeonLevel).replace("DUNGEONNAME", TextGet("DungeonName" + KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]))
				+ (KinkyDungeonNewGame ? TextGet("KDNGPlus").replace("XXX", "" + KinkyDungeonNewGame) : ""),
				1000+1, 42+1, "black", "black");
			//DrawText(TextGet("DungeonName" + KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]), 1500+1, 42+1, "black", "black");
			DrawText(
				TextGet("CurrentLevel").replace("FLOORNUMBER", "" + MiniGameKinkyDungeonLevel).replace("DUNGEONNAME", TextGet("DungeonName" + KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]))
				+ (KinkyDungeonNewGame ? TextGet("KDNGPlus").replace("XXX", "" + KinkyDungeonNewGame) : ""),
				1000, 42, "white", "gray");
			//DrawText(TextGet("DungeonName" + KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]), 1500, 42, "white", "gray");

			// Draw the stats
			KinkyDungeonDrawStats(1750, 164, 230, KinkyDungeonStatBarHeight);

			if (KinkyDungeonSleepiness) {
				CharacterSetFacialExpression(KinkyDungeonPlayer, "Emoticon", "Sleep");
			} else CharacterSetFacialExpression(KinkyDungeonPlayer, "Emoticon", null);

			// Draw the player no matter what
			KinkyDungeonContextPlayer.clearRect(0, 0, KinkyDungeonCanvasPlayer.width, KinkyDungeonCanvasPlayer.height);
			DrawCharacter(KinkyDungeonPlayer, -KinkyDungeonGridSizeDisplay/2, KinkyDungeonPlayer.Pose.includes("Hogtied") ? -165 : (KinkyDungeonPlayer.IsKneeling() ? -78 : 0), KinkyDungeonGridSizeDisplay/250, false, KinkyDungeonContextPlayer);

			KinkyDungeonDrawEnemiesHP(canvasOffsetX, canvasOffsetY, CamX+CamX_offset, CamY+CamY_offset);
			KinkyDungeonDrawFloaters(CamX+CamX_offset, CamY+CamY_offset);

			if (KinkyDungeonCanvas) {
				let barInt = 0;
				if (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax*0.9) {
					KinkyDungeonBar(canvasOffsetX + (KinkyDungeonPlayerEntity.visual_x - CamX-CamX_offset)*KinkyDungeonGridSizeDisplay, canvasOffsetY + (KinkyDungeonPlayerEntity.visual_y - CamY-CamY_offset)*KinkyDungeonGridSizeDisplay - 12 - 13 * barInt,
						KinkyDungeonGridSizeDisplay, 12, 100 * KinkyDungeonStatStamina / KinkyDungeonStatStaminaMax, "#44ff44", "#000000");
					barInt += 1;
				}
				for (let b of Object.values(KinkyDungeonPlayerBuffs)) {
					if (b && b.aura && b.duration > 0 && b.duration < 999) {
						if (!b.maxduration) b.maxduration = b.duration;
						KinkyDungeonBar(canvasOffsetX + (KinkyDungeonPlayerEntity.visual_x - CamX-CamX_offset)*KinkyDungeonGridSizeDisplay, canvasOffsetY + (KinkyDungeonPlayerEntity.visual_y - CamY-CamY_offset)*KinkyDungeonGridSizeDisplay - 12 - 13 * barInt,
							KinkyDungeonGridSizeDisplay, 12, 100 * b.duration / b.maxduration, b.aura, "#000000");
						barInt += 1;
					}
				}
				if (KinkyDungeonCurrentEscapingItem && KinkyDungeonLastTurnAction == "Struggle") {
					let item = KinkyDungeonCurrentEscapingItem;
					let value = 0;
					let value2 = 0;
					let color = "#ecebe7";
					let color2 = "red";
					if (KinkyDungeonCurrentEscapingMethod == "Struggle") {
						if (item.struggleProgress)
							value = item.struggleProgress;
						if (item.cutProgress)
							value2 = item.cutProgress;
					} else if (KinkyDungeonCurrentEscapingMethod == "Pick" && item.pickProgress) {
						value = item.pickProgress;
						color = "#ceaaed";
					} else if (KinkyDungeonCurrentEscapingMethod == "Remove") {
						if (item.struggleProgress)
							value = item.struggleProgress;
						if (item.cutProgress)
							value2 = item.cutProgress;
					} else if (KinkyDungeonCurrentEscapingMethod == "Cut") {
						if (item.struggleProgress)
							value = item.struggleProgress;
						if (item.cutProgress)
							value2 = item.cutProgress;
					} else if (KinkyDungeonCurrentEscapingMethod == "Unlock" && item.unlockProgress) {
						value = item.unlockProgress;
						color = "#d0ffea";
					}
					let xAdd = 0;
					let yAdd = 0;
					if (KinkyDungeonStruggleTime > CommonTime()) {
						xAdd = Math.round(-1 + 2*Math.random());
						yAdd = Math.round(-1 + 2*Math.random());
					}
					if (value <= 1)
						KinkyDungeonBar(canvasOffsetX + xAdd + (KinkyDungeonPlayerEntity.visual_x - CamX-CamX_offset)*KinkyDungeonGridSizeDisplay, canvasOffsetY + yAdd + (KinkyDungeonPlayerEntity.visual_y - CamY-CamY_offset)*KinkyDungeonGridSizeDisplay - 24,
							KinkyDungeonGridSizeDisplay, 12, Math.max(7, Math.min(100, 100 * (value + value2))), color, "#000000");
					if (value2 && value2 <= 1) {
						KinkyDungeonBar(canvasOffsetX + xAdd + (KinkyDungeonPlayerEntity.visual_x - CamX-CamX_offset)*KinkyDungeonGridSizeDisplay, canvasOffsetY + yAdd + (KinkyDungeonPlayerEntity.visual_y - CamY-CamY_offset)*KinkyDungeonGridSizeDisplay - 24,
							KinkyDungeonGridSizeDisplay, 12, Math.max(7, 100 * value2), color2, "none");
					}
				}

				KinkyDungeonDrawTether(KinkyDungeonPlayerEntity, CamX+CamX_offset, CamY+CamY_offset);

				if (tooltip) {
					DrawTextFit(TextGet("KinkyDungeonShrineTooltip") + tooltip, 1 + MouseX, 1 + MouseY - KinkyDungeonGridSizeDisplay/2, 200, "black", "black");
					DrawTextFit(TextGet("KinkyDungeonShrineTooltip") + tooltip, MouseX, MouseY - KinkyDungeonGridSizeDisplay/2, 200, "white", "gray");
				}
			}

			if (KinkyDungeonIsPlayer()) {
				KinkyDungeonDrawInputs();
			}

			if (KDGameData.CurrentDialog) {
				KDDrawDialogue();
			}

			KinkyDungeonDrawMessages();

			// Draw the quick inventory
			if (KinkyDungeonShowInventory || (KDGameData.CurrentDialog && KDDialogue[KDGameData.CurrentDialog] && KDDialogue[KDGameData.CurrentDialog].shop)) {
				KinkyDungeonDrawQuickInv();
			}
		} else {
			DrawText(TextGet("KinkyDungeonLoading"), 1100, 500, "white", "gray");
			if (CommonTime() > KinkyDungeonGameDataNullTimerTime + KinkyDungeonGameDataNullTimer) {
				ServerSend("ChatRoomChat", { Content: "RequestFullKinkyDungeonData", Type: "Hidden", Target: KinkyDungeonPlayerCharacter.MemberNumber });
				KinkyDungeonGameDataNullTimerTime = CommonTime();
			}
		}
	} else if (KinkyDungeonDrawState == "Orb") {
		KinkyDungeonDrawOrb();
	} else if (KinkyDungeonDrawState == "Heart") {
		KinkyDungeonDrawHeart();
	} else if (KinkyDungeonDrawState == "Magic") {
		DrawButton(1540, 925, 200, 60, TextGet("KinkyDungeonGame"), "White", "", "");
		KinkyDungeonDrawMagic();
	} else if (KinkyDungeonDrawState == "MagicSpells") {
		DrawButton(1540, 925, 200, 60, TextGet("KinkyDungeonGame"), "White", "", "");
		KinkyDungeonDrawMagicSpells();
	} else if (KinkyDungeonDrawState == "Inventory") {
		DrawButton(650, 925, 165, 60, TextGet("KinkyDungeonGame"), "White", "", "");
		KinkyDungeonDrawInventory();
	} else if (KinkyDungeonDrawState == "Logbook") {
		DrawButton(650, 925, 565, 60, TextGet("KinkyDungeonGame"), "White", "", "");
		KinkyDungeonDrawLore();
	} else if (KinkyDungeonDrawState == "Reputation") {
		DrawButton(820, 925, 165, 60, TextGet("KinkyDungeonGame"), "White", "", "");
		KinkyDungeonDrawReputation();
	} else if (KinkyDungeonDrawState == "Lore") {
		DrawButton(650, 925, 250, 60, TextGet("KinkyDungeonGame"), "White", "", "");
		KinkyDungeonDrawLore();
	} else if (KinkyDungeonDrawState == "Restart") {
		MainCanvas.textAlign = "left";
		// Check URL to see if indev branch
		const params = new URLSearchParams(window.location.search);
		let branch = params.has('branch') ? params.get('branch') : "";
		if (branch || ServerURL == 'https://bc-server-test.herokuapp.com/') {
			DrawCheckbox(600, 20, 64, 64, "Debug Mode", KDDebugMode, false, "white");
			if (KDDebugMode) {
				let dd = 30;
				let i = 0;
				for (let r of KinkyDungeonRestraints) {
					if (i * dd < 1200 && r.name.includes(ElementValue("DebugItem"))) {
						DrawTextFit(r.name, 0, 15 + i * dd, 200, "white", "black");
						i++;
					}
				}
				i = 0;
				for (let r of Object.values(KinkyDungeonConsumables)) {
					if (i * dd < 1200 && r.name.includes(ElementValue("DebugItem"))) {
						DrawTextFit(r.name, 200, 15 + i * dd, 200, "lightblue", "black");
						i++;
					}
				}
				i = 0;
				for (let r of KinkyDungeonEnemies) {
					if (i * dd < 1200 && r.name.includes(ElementValue("DebugEnemy"))) {
						DrawTextFit(r.name, 400, 15 + i * dd, 200, "red", "black");
						i++;
					}
				}
				i = 0;
				for (let r of Object.values(KinkyDungeonWeapons)) {
					if (i * dd < 1200 && r.name.includes(ElementValue("DebugItem"))) {
						DrawTextFit(r.name, 1800, 15 + i * dd, 200, "orange", "black");
						i++;
					}
				}
				i = 0;
				for (let r of KinkyDungeonOutfitsBase) {
					if (i * dd < 1200 && r.name.includes(ElementValue("DebugItem"))) {
						DrawTextFit(r.name, 900, 15 + i * dd, 200, "lightgreen", "black");
						i++;
					}
				}

				DrawCheckbox(1100, 20, 64, 64, "Verbose Console", KDDebug, false, "white");
				DrawCheckbox(1100, 100, 64, 64, "Changeable Perks", KDDebugPerks, false, "white");
				DrawCheckbox(1100, 180, 64, 64, "Unlimited Gold", KDDebugGold, false, "white");
				MainCanvas.textAlign = "center";
				ElementPosition("DebugEnemy", 1650, 52, 300, 64);
				DrawButton(1500, 100, 100, 64, "Enemy", "White", "");
				DrawButton(1600, 100, 100, 64, "Ally", "White", "");
				DrawButton(1700, 100, 100, 64, "Shop", "White", "");
				ElementPosition("DebugItem", 1650, 212, 300, 64);
				DrawButton(1500, 260, 300, 64, "Add to inventory", "White", "");
				DrawButton(1100, 260, 300, 64, "Teleport to stairs", "White", "");
				DrawButton(1500, 320, 300, 64, "Get save code", "White", "");
				DrawButton(1100, 320, 300, 64, "Enter parole mode", "White", "");

			}
		}

		MainCanvas.textAlign = "left";
		DrawCheckbox(600, 100, 64, 64, TextGet("KinkyDungeonSound"), KinkyDungeonSound, false, "white");
		DrawCheckbox(600, 180, 64, 64, TextGet("KinkyDungeonDrool"), KinkyDungeonDrool, false, "white");
		DrawCheckbox(600, 260, 64, 64, TextGet("KinkyDungeonFullscreen"), KinkyDungeonFullscreen, false, "white");
		if (ServerURL == "foobar")
			DrawCheckbox(600, 340, 64, 64, TextGet("KinkyDungeonGraphicsQuality"), KinkyDungeonGraphicsQuality, false, "white");

		//DrawText(TextGet("KDVibeVolume"), 600, 420, "Black", "Gray");
		DrawCheckbox(600, 650, 64, 64, TextGet("KinkyDungeonFastWait"), KinkyDungeonFastWait, false, "white");
		MainCanvas.textAlign = "center";
		DrawBackNextButton(600, 420, 350, 64, TextGet("KDVibeVolume") + " " + (KDVibeVolume * 100 + "%"), "White", "",
			() => KDVibeVolumeList[(KDVibeVolumeListIndex + KDVibeVolumeList.length - 1) % KDVibeVolumeList.length] * 100 + "%",
			() => KDVibeVolumeList[(KDVibeVolumeListIndex + 1) % KDVibeVolumeList.length] * 100 + "%");

		MainCanvas.textAlign = "center";
		DrawText(TextGet("KinkyDungeonRestartConfirm"), 1250, 400, "white", "gray");
		DrawButton(975, 550, 550, 64, TextGet("KinkyDungeonRestartNo"), "White", "");
		DrawButton(975, 650, 550, 64, TextGet("KinkyDungeonRestartWait"), "White", "");
		DrawButton(975, 750, 550, 64, TextGet("KinkyDungeonRestartCapture"),  (KDGameData.PrisonerState == 'jail' || !KinkyDungeonNearestJailPoint(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y)) ? "Pink" : "White", "");
		DrawButton(975, 850, 550, 64, TextGet("KinkyDungeonRestartYes"), "White", "");
		DrawButton(1650, 900, 300, 64, TextGet("KinkyDungeonCheckPerks"), "White", "");
		DrawButton(1075, 450, 350, 64, TextGet("GameConfigKeys"), "White", "");
	} else if (KinkyDungeonDrawState == "Perks2") {
		KinkyDungeonDrawPerks(!KDDebugPerks);
		DrawButton(1650, 920, 300, 64, TextGet("KinkyDungeonLoadBack"), "White", "");
	}

	if (KinkyDungeonStatFreeze > 0) {
		ChatRoomDrawArousalScreenFilter(0, 1000, 2000, 100, '190, 190, 255');
	} else if (KinkyDungeonStatDistraction > 0) {
		ChatRoomDrawArousalScreenFilter(0, 1000, 2000, KinkyDungeonStatDistraction * 100 / KinkyDungeonStatDistractionMax);
	}

	if (ServerURL != "foobar")
		DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");

	if ((!KDDebugMode && KinkyDungeonDrawState == "Restart") || (KDDebugMode && KinkyDungeonDrawState != "Restart")) {
		ElementRemove("DebugEnemy");
		ElementRemove("DebugItem");
	}


}

let KinkyDungeonFloaters = [];
let KinkyDungeonLastFloaterTime = 0;

let KDTimescale = 0.004;
let KDBulletSpeed = 40;

function KinkyDungeonSendFloater(Entity, Amount, Color, Time, LocationOverride, suff = "") {
	if (Entity.x && Entity.y) {
		let floater = {
			x: Entity.x + Math.random(),
			y: Entity.y + Math.random(),
			override: LocationOverride,
			speed: 20 + (Time ? Time : 0) + Math.random()*10,
			t: 0,
			color: Color,
			text: "" + ((typeof Amount === "string") ? Amount : Math.round(Amount * 10)/10) + suff,
			lifetime: Time ? Time : ((typeof Amount === "string") ? 5 : ((Amount < 3) ? 1 : (Amount > 5 ? 3 : 2))),
		};
		KinkyDungeonFloaters.push(floater);
	}
}


function KinkyDungeonDrawFloaters(CamX, CamY) {
	let delta = CommonTime() - KinkyDungeonLastFloaterTime;
	if (delta > 0) {
		for (let floater of KinkyDungeonFloaters) {
			floater.t += delta/1000;
		}
	}
	let newFloaters = [];
	for (let floater of KinkyDungeonFloaters) {
		let x = floater.override ? floater.x : canvasOffsetX + (floater.x - CamX)*KinkyDungeonGridSizeDisplay;
		let y = floater.override ? floater.y : canvasOffsetY + (floater.y - CamY)*KinkyDungeonGridSizeDisplay;
		DrawText(floater.text,
			x, y - floater.speed*floater.t,
			floater.color, "gray");
		if (floater.t < floater.lifetime) newFloaters.push(floater);
	}
	KinkyDungeonFloaters = newFloaters;

	KinkyDungeonLastFloaterTime = CommonTime();
}

let KinkyDungeonMessageToggle = false;
let KinkyDungeonMessageLog = [];
let KDLogDist = 50;
let KDLogHeight = 700;
let KDMaxLog = Math.floor(700/KDLogDist);
let KDLogTopPad = 82;

let KDLogIndex = 0;
let KDLogIndexInc = 3;

function KinkyDungeonDrawMessages(NoLog) {
	if (!NoLog)
		DrawButton(1750, 82, 100, 50, TextGet("KinkyDungeonLog"), "white");
	if (!KinkyDungeonMessageToggle || NoLog) {
		if (KinkyDungeonTextMessageTime > 0) {
			DrawTextFit(KinkyDungeonTextMessage, 500 + 1250/2+1, 82+1, 1250, "black", "black");
			DrawTextFit(KinkyDungeonTextMessage, 500 + 1250/2, 82, 1250, KinkyDungeonTextMessageColor, "gray");
		}
		if (KinkyDungeonActionMessageTime > 0) {
			DrawTextFit(KinkyDungeonActionMessage, 500 + 1250/2+1, 132+1, 1250, "black", "black");
			DrawTextFit(KinkyDungeonActionMessage, 500 + 1250/2, 132, 1250, KinkyDungeonActionMessageColor, "gray");
		}
	} else {
		DrawRect(500, KDLogTopPad, 1250, KDLogHeight, "#000000aa");
		for (let i = 0; i < KinkyDungeonMessageLog.length && i < KDMaxLog; i++) {
			let log = KinkyDungeonMessageLog[Math.max(0, KinkyDungeonMessageLog.length - 1 - (i + KDLogIndex))];
			let col = log.color;
			DrawTextFit(log.text, 500 + 1250/2, 82 + i * KDLogDist + KDLogDist/2, 1250, col, "white");
		}
		if (KinkyDungeonMessageLog.length > KDMaxLog) {
			DrawButton(500 + 1250/2 - 200, KDLogTopPad + KDLogHeight + 50, 90, 40, "", "white", KinkyDungeonRootDirectory + "Up.png");
			DrawButton(500 + 1250/2 + 100, KDLogTopPad + KDLogHeight + 50, 90, 40, "", "white", KinkyDungeonRootDirectory + "Down.png");

			if (KinkyDungeonMessageLog.length > KDMaxLog * 100) {
				KinkyDungeonMessageLog.splice(0, KDMaxLog * 100 - KinkyDungeonMessageLog.length);
			}
		}

	}
}

function KDhexToRGB(h) {
	let r = "", g = "", b = "";

	// 3 digits
	if (h.length == 4) {
		r = "#" + h[1] + h[1];
		g = "#" + h[2] + h[2];
		b = "#" + h[3] + h[3];

		// 6 digits
	} else if (h.length == 7) {
		r = "#" + h[1] + h[2];
		g = "#" + h[3] + h[4];
		b = "#" + h[5] + h[6];
	}

	return {r:r, g:g, b:b};
}

function KinkyDungeonUpdateVisualPosition(Entity, amount) {
	if (amount < 0 || !Entity.visual_x || !Entity.visual_y) {
		Entity.visual_x = Entity.x;
		Entity.visual_y = Entity.y;
		return -1;
	} else {
		let speed = 100;
		if (Entity.player && KinkyDungeonSlowLevel > 0 && KDGameData.KinkyDungeonLeashedPlayer < 2 && (KinkyDungeonFastMovePath.length < 1 || KinkyDungeonSlowLevel > 1)) speed = 100 + 80 * KinkyDungeonSlowLevel;
		if (KDGameData.SleepTurns > 0) speed = 100;
		if (speed > 500) speed = 500;
		if (Entity.scale) speed = KDBulletSpeed;
		let value = amount/speed;// How many ms to complete a move
		// xx is the true position of a bullet
		let tx = (Entity.xx) ? Entity.xx : Entity.x;
		let ty = (Entity.yy) ? Entity.yy : Entity.y;
		let dist = Math.sqrt((Entity.visual_x - tx) * (Entity.visual_x - tx) + (Entity.visual_y - ty) * (Entity.visual_y - ty));
		if (dist > 5) {
			value = 1;
		}
		if (Entity.scale != undefined) {
			if (dist > 0 || !Entity.end) {
				Entity.scale = Math.min(1.0, Entity.scale + KDTimescale*amount);
			} else {
				Entity.scale = Math.max(0.0, Entity.scale - KDTimescale*amount);
			}
		}

		if (dist == 0) return dist;
		// Increment
		let weightx = Math.abs(Entity.visual_x - tx)/(dist);
		let weighty = Math.abs(Entity.visual_y - ty)/(dist);
		//if (weightx != 0 && weightx != 1 && Math.abs(weightx - weighty) > 0.01)
		//console.log(weightx + ", " + weighty + ", " + (Entity.visual_x - tx) + ", " + (Entity.visual_y - ty) + ", dist = " + dist, "x = " + Entity.visual_x + ", y = " + Entity.visual_y)

		if (Entity.visual_x > tx) Entity.visual_x = Math.max(Entity.visual_x - value*weightx, tx);
		else Entity.visual_x = Math.min(Entity.visual_x + value*weightx, tx);

		if (Entity.visual_y > ty) Entity.visual_y = Math.max(Entity.visual_y - value*weighty, ty);
		else Entity.visual_y = Math.min(Entity.visual_y + value*weighty, ty);
		return dist;
		//console.log("x = " + Entity.visual_x + ", y = " + Entity.visual_y + ", tx = " + tx + ", ty = " + ty)
	}
}

/**
 * Sets the target location based on MOUSE location
 */
function KinkyDungeonSetTargetLocation() {
	KinkyDungeonTargetX = Math.round((MouseX - KinkyDungeonGridSizeDisplay/2 - canvasOffsetX)/KinkyDungeonGridSizeDisplay) + KinkyDungeonCamX;
	KinkyDungeonTargetY = Math.round((MouseY - KinkyDungeonGridSizeDisplay/2 - canvasOffsetY)/KinkyDungeonGridSizeDisplay) + KinkyDungeonCamY;
}

/**
 * Sets the move direction based on MOUSE location
 */
function KinkyDungeonSetMoveDirection() {

	let tx = //(MouseX - ((KinkyDungeonPlayerEntity.x - KinkyDungeonCamX)*KinkyDungeonGridSizeDisplay + canvasOffsetX + KinkyDungeonGridSizeDisplay / 2))/KinkyDungeonGridSizeDisplay
		Math.round((MouseX - KinkyDungeonGridSizeDisplay/2 - canvasOffsetX)/KinkyDungeonGridSizeDisplay) + KinkyDungeonCamX;
	let ty = //(MouseY - ((KinkyDungeonPlayerEntity.y - KinkyDungeonCamY)*KinkyDungeonGridSizeDisplay + canvasOffsetY + KinkyDungeonGridSizeDisplay / 2))/KinkyDungeonGridSizeDisplay)
		Math.round((MouseY - KinkyDungeonGridSizeDisplay/2 - canvasOffsetY)/KinkyDungeonGridSizeDisplay) + KinkyDungeonCamY;

	KDSendInput("setMoveDirection", {dir: KinkyDungeonGetDirection(
		tx - KinkyDungeonPlayerEntity.x,
		ty - KinkyDungeonPlayerEntity.y)});

}
