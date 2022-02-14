"use strict";


let KDRecentRepIndex = 0;

function KinkyDungeonGetSprite(code, x, y, Fog) {
	let sprite = "Floor";
	if (code == "1") sprite = "Wall";
	else if (code == "2") sprite = "Brickwork";
	else if (code == "3") sprite = Fog ? "Doodad" : "MimicBlock";
	else if (code == "b") sprite = "Bars";
	else if (code == "X") sprite = "Doodad";
	else if (code == "D") sprite = "Door";
	else if (code == "d") sprite = Fog ? "Door" : "DoorOpen";
	else if (code == "R") sprite = "RubbleLooted";
	else if (code == "T") sprite = "Trap";
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
	return sprite;
}

function KinkyDungeonGetSpriteOverlay(code, x, y, Fog) {
	let sprite = "";
	if (code == "G") sprite = "Ghost";
	else if (code == "R") sprite = "Rubble";
	else if (code == "B") sprite = "Bed";
	else if (code == "O") sprite = "Orb";
	else if (code == "w") sprite = Fog ? "" : "Water";
	else if (code == "]") sprite = "HappyGas";
	else if (code == "C") sprite = (KinkyDungeonTiles.get(x + "," + y) && (KinkyDungeonTiles.get(x + "," + y).Loot == "gold" || KinkyDungeonTiles.get(x + "," + y).Loot == "lessergold")) ? "ChestGold" :
		((KinkyDungeonTiles.get(x + "," + y) && (KinkyDungeonTiles.get(x + "," + y).Loot == "silver")) ? "ChestSilver" : "Chest");
	else if (code == "c") sprite = (KinkyDungeonTiles.get(x + "," + y) && (KinkyDungeonTiles.get(x + "," + y).Loot == "gold" || KinkyDungeonTiles.get(x + "," + y).Loot == "lessergold")) ? "ChestGoldOpen" :
		((KinkyDungeonTiles.get(x + "," + y) && (KinkyDungeonTiles.get(x + "," + y).Loot == "silver")) ? "ChestSilverOpen" : "ChestOpen");
	return sprite;
}

// Draw function for the game portion
function KinkyDungeonDrawGame() {
	if (ServerURL == "foobar") {
		MainCanvas.textAlign = "right";
		DrawTextFit(TextGet("KinkyDungeon"), 1980, 20, 200, "white", "black");
		MainCanvas.textAlign = "center";
	}


	if (KinkyDungeonDrawState == "Game")
		KinkyDungeonListenKeyMove();
	if ((KinkyDungeonGameKey.keyPressed[9])) {
		KinkyDungeonDrawState = "Game";
		KinkyDungeonTargetingSpell = null;
		KinkyDungeonSpellPress = 0;
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



	DrawText(TextGet("CurrentLevel") + MiniGameKinkyDungeonLevel, 750+1, 42+1, "black", "black");
	DrawText(TextGet("DungeonName" + KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]), 1500+1, 42+1, "black", "black");
	DrawText(TextGet("CurrentLevel") + MiniGameKinkyDungeonLevel, 750, 42, "white", "black");
	DrawText(TextGet("DungeonName" + KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]), 1500, 42, "white", "black");

	// Draw the stats
	KinkyDungeonDrawStats(canvasOffsetX + KinkyDungeonCanvas.width+10, canvasOffsetY, 1975 - (canvasOffsetX + KinkyDungeonCanvas.width+5), KinkyDungeonStatBarHeight);

	if (KinkyDungeonDrawState == "Game") {
		let tooltip = "";
		if ((KinkyDungeonIsPlayer() || (KinkyDungeonGameData && CommonTime() < KinkyDungeonNextDataLastTimeReceived + KinkyDungeonNextDataLastTimeReceivedTimeout))) {


			KinkyDungeonUpdateVisualPosition(KinkyDungeonPlayerEntity, KinkyDungeonDrawDelta);

			let CamX = Math.max(0, Math.min(KinkyDungeonGridWidth - KinkyDungeonGridWidthDisplay, KinkyDungeonPlayerEntity.x - Math.floor(KinkyDungeonGridWidthDisplay/2)));
			let CamY = Math.max(0, Math.min(KinkyDungeonGridHeight - KinkyDungeonGridHeightDisplay, KinkyDungeonPlayerEntity.y - Math.floor(KinkyDungeonGridHeightDisplay/2)));
			let CamX_offset = Math.max(0, Math.min(KinkyDungeonGridWidth - KinkyDungeonGridWidthDisplay, KinkyDungeonPlayerEntity.visual_x - Math.floor(KinkyDungeonGridWidthDisplay/2))) - CamX;
			let CamY_offset = Math.max(0, Math.min(KinkyDungeonGridHeight - KinkyDungeonGridHeightDisplay, KinkyDungeonPlayerEntity.visual_y - Math.floor(KinkyDungeonGridHeightDisplay/2))) - CamY;

			KinkyDungeonCamX = CamX;
			KinkyDungeonCamY = CamY;

			KinkyDungeonSetMoveDirection();

			if (KinkyDungeonCanvas) {
				KinkyDungeonContext.fillStyle = "rgba(20,20,20.0,1.0)";
				KinkyDungeonContext.fillRect(0, 0, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height);
				KinkyDungeonContext.fill();
				// Draw the grid and tiles
				let rows = KinkyDungeonGrid.split('\n');
				for (let R = -1; R <= KinkyDungeonGridHeightDisplay; R++)  {
					for (let X = -1; X <= KinkyDungeonGridWidthDisplay; X++)  {
						let RY = Math.max(0, Math.min(R+CamY, KinkyDungeonGridHeight));
						let RX = Math.max(0, Math.min(X+CamX, KinkyDungeonGridWidth));
						let sprite = KinkyDungeonGetSprite(rows[RY][RX], RX, RY, KinkyDungeonLightGet(RX, RY) == 0);
						let sprite2 = KinkyDungeonGetSpriteOverlay(rows[RY][RX], RX, RY, KinkyDungeonLightGet(RX, RY) == 0);
						let floor = KinkyDungeonTilesSkin.get(RX + "," + RY) ? KinkyDungeonTilesSkin.get(RX + "," + RY).skin : KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint];

						DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Floor" + floor + "/" + sprite + ".png", KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
							(-CamX_offset + X)*KinkyDungeonGridSizeDisplay, (-CamY_offset+R)*KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
						if (sprite2)
							DrawImageZoomCanvas(KinkyDungeonRootDirectory + "FloorGeneric/" + sprite2 + ".png", KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
								(-CamX_offset + X)*KinkyDungeonGridSizeDisplay, (-CamY_offset+R)*KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);

						if (rows[RY][RX] == "A") {
							let color = "";
							if (KinkyDungeonTiles.get(RX + "," + RY)) {
								if (KinkyDungeonTiles.get(RX + "," + RY).Name == "Illusion") color = "#8154FF";
								else if (KinkyDungeonTiles.get(RX + "," + RY).Name == "Conjure") color = "#D4AAFF";
								else if (KinkyDungeonTiles.get(RX + "," + RY).Name == "Elements") color = "#FF5D00";
								else if (KinkyDungeonTiles.get(RX + "," + RY).Name == "Latex") color = "#2667FF";
								else if (KinkyDungeonTiles.get(RX + "," + RY).Name == "Leather") color = "#442E1E";
								else if (KinkyDungeonTiles.get(RX + "," + RY).Name == "Metal") color = "#808080";
								else if (KinkyDungeonTiles.get(RX + "," + RY).Name == "Rope") color = "#7C4926";
								else if (KinkyDungeonTiles.get(RX + "," + RY).Name == "Will") color = "#23FF44";
							}
							if (color)
								DrawImageCanvasColorize(KinkyDungeonRootDirectory + "ShrineAura.png",  KinkyDungeonContext,
									(-CamX_offset + X)*KinkyDungeonGridSizeDisplay, (-CamY_offset+R)*KinkyDungeonGridSizeDisplay,
									KinkyDungeonGridSizeDisplay/KinkyDungeonSpriteSize, color, true, []);
						}
						if (KinkyDungeonLightGet(RX, RY) > 0 && rows[RY][RX] == "A" && MouseIn(canvasOffsetX + (-CamX_offset + X)*KinkyDungeonGridSizeDisplay, canvasOffsetY + (-CamY_offset+R)*KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay)) {
							tooltip = TextGet("KinkyDungeonShrine" + KinkyDungeonTiles.get(RX + "," + RY).Name);
						}
					}
				}

				// Get lighting grid
				if (KinkyDungeonUpdateLightGrid) {
					KinkyDungeonUpdateLightGrid = false;
					KinkyDungeonMakeLightMap(KinkyDungeonGridWidth, KinkyDungeonGridHeight, [ {x: KinkyDungeonPlayerEntity.x, y:KinkyDungeonPlayerEntity.y, brightness: KinkyDungeonGetVisionRadius() }], KDVisionUpdate);
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

				if (KinkyDungeonMovePoints < 0) {
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
				if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Sneak") > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Sneak.png",
						KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
						(KinkyDungeonPlayerEntity.visual_x - CamX - CamX_offset)*KinkyDungeonGridSizeDisplay,
						(KinkyDungeonPlayerEntity.visual_y - CamY - CamY_offset)*KinkyDungeonGridSizeDisplay,
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

				KinkyDungeonDrawFight(canvasOffsetX, canvasOffsetY, CamX+CamX_offset, CamY+CamY_offset);
				KinkyDungeonDrawEnemiesWarning(canvasOffsetX, canvasOffsetY, CamX+CamX_offset, CamY+CamY_offset);
				KinkyDungeonDrawEnemies(canvasOffsetX, canvasOffsetY, CamX+CamX_offset, CamY+CamY_offset);

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

				KinkyDungeonSendEvent("draw",{update: KDDrawUpdate, CamX:CamX, CamY:CamY, CamX_offset: CamX_offset, CamY_offset: CamY_offset});
				KDDrawUpdate = 0;

				// Draw targeting reticule
				if (!KinkyDungeonAutoWait && !KinkyDungeonShowInventory && MouseIn(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height) && KinkyDungeonIsPlayer()) {
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
							if (enemy && enemy.Enemy && enemy.Enemy.allied)
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
									if (KinkyDungeonLightGet(xx + KinkyDungeonPlayerEntity.x, yy + KinkyDungeonPlayerEntity.y) > 0)
										DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Target.png",
											KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
											(xx + KinkyDungeonPlayerEntity.x - CamX)*KinkyDungeonGridSizeDisplay, (yy + KinkyDungeonPlayerEntity.y - CamY)*KinkyDungeonGridSizeDisplay,
											KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
								}
							}
							else
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
			if (KinkyDungeonSleepiness) {
				CharacterSetFacialExpression(KinkyDungeonPlayer, "Emoticon", "Sleep");
			} else CharacterSetFacialExpression(KinkyDungeonPlayer, "Emoticon", null);

			// Draw the player no matter what
			KinkyDungeonContextPlayer.clearRect(0, 0, KinkyDungeonCanvasPlayer.width, KinkyDungeonCanvasPlayer.height);
			DrawCharacter(KinkyDungeonPlayer, -KinkyDungeonGridSizeDisplay/2, KinkyDungeonPlayer.Pose.includes("Hogtied") ? -165 : (KinkyDungeonPlayer.IsKneeling() ? -78 : 0), KinkyDungeonGridSizeDisplay/250, false, KinkyDungeonContextPlayer);

			KinkyDungeonDrawEnemiesHP(canvasOffsetX, canvasOffsetY, CamX+CamX_offset, CamY+CamY_offset);
			KinkyDungeonDrawFloaters(CamX+CamX_offset, CamY+CamY_offset);

			if (KinkyDungeonCanvas) {
				if (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax*0.9) {
					KinkyDungeonBar(canvasOffsetX + (KinkyDungeonPlayerEntity.visual_x - CamX-CamX_offset)*KinkyDungeonGridSizeDisplay, canvasOffsetY + (KinkyDungeonPlayerEntity.visual_y - CamY-CamY_offset)*KinkyDungeonGridSizeDisplay - 12,
						KinkyDungeonGridSizeDisplay, 12, 100 * KinkyDungeonStatStamina / KinkyDungeonStatStaminaMax, "#44ff44", "#000000");
				}
				if (KinkyDungeonCurrentEscapingItem && KinkyDungeonLastTurnAction == "Struggle") {
					let item = KinkyDungeonCurrentEscapingItem;
					let value = 0;
					if (KinkyDungeonCurrentEscapingMethod == "Struggle" && item.struggleProgress) {
						value = item.struggleProgress;
					} else if (KinkyDungeonCurrentEscapingMethod == "Pick" && item.pickProgress) {
						value = item.pickProgress;
					} else if (KinkyDungeonCurrentEscapingMethod == "Remove" && item.removeProgress) {
						value = item.removeProgress;
					} else if (KinkyDungeonCurrentEscapingMethod == "Cut" && item.cutProgress) {
						value = item.cutProgress;
					} else if (KinkyDungeonCurrentEscapingMethod == "Unlock" && item.unlockProgress) {
						value = item.unlockProgress;
					}
					let xAdd = 0;
					let yAdd = 0;
					if (KinkyDungeonStruggleTime > CommonTime()) {
						xAdd = Math.round(-1 + 2*Math.random());
						yAdd = Math.round(-1 + 2*Math.random());
					}
					if (value <= 1)
						KinkyDungeonBar(canvasOffsetX + xAdd + (KinkyDungeonPlayerEntity.visual_x - CamX-CamX_offset)*KinkyDungeonGridSizeDisplay, canvasOffsetY + yAdd + (KinkyDungeonPlayerEntity.visual_y - CamY-CamY_offset)*KinkyDungeonGridSizeDisplay - 24,
							KinkyDungeonGridSizeDisplay, 12, Math.max(7, 100 * value), "#aaaaaa", "#000000");
				}

				KinkyDungeonDrawTether(KinkyDungeonPlayerEntity, CamX+CamX_offset, CamY+CamY_offset);

				if (tooltip) {
					DrawTextFit(TextGet("KinkyDungeonShrineTooltip") + tooltip, 1 + MouseX, 1 + MouseY - KinkyDungeonGridSizeDisplay/2, 200, "black", "black");
					DrawTextFit(TextGet("KinkyDungeonShrineTooltip") + tooltip, MouseX, MouseY - KinkyDungeonGridSizeDisplay/2, 200, "white", "black");
				}
			}

			if (KinkyDungeonIsPlayer()) {
				KinkyDungeonDrawInputs();
			}


			KinkyDungeonDrawMessages();
			// Draw the quick inventory
			if (KinkyDungeonShowInventory) {
				KinkyDungeonDrawQuickInv();
			}
		} else {
			DrawText(TextGet("KinkyDungeonLoading"), 1100, 500, "white", "black");
			if (CommonTime() > KinkyDungeonGameDataNullTimerTime + KinkyDungeonGameDataNullTimer) {
				ServerSend("ChatRoomChat", { Content: "RequestFullKinkyDungeonData", Type: "Hidden", Target: KinkyDungeonPlayerCharacter.MemberNumber });
				KinkyDungeonGameDataNullTimerTime = CommonTime();
			}
		}
	} else if (KinkyDungeonDrawState == "Orb") {
		KinkyDungeonDrawOrb();
	} else if (KinkyDungeonDrawState == "Magic") {
		DrawButton(1030, 925, 165, 60, TextGet("KinkyDungeonGame"), "White", "", "");
		KinkyDungeonDrawMagic();
	} else if (KinkyDungeonDrawState == "MagicSpells") {
		DrawButton(1030, 925, 165, 60, TextGet("KinkyDungeonGame"), "White", "", "");
		KinkyDungeonDrawMagicSpells();
	} else if (KinkyDungeonDrawState == "Inventory") {
		DrawButton(650, 925, 165, 60, TextGet("KinkyDungeonGame"), "White", "", "");
		KinkyDungeonDrawInventory();
	} else if (KinkyDungeonDrawState == "Reputation") {
		DrawButton(840, 925, 165, 60, TextGet("KinkyDungeonGame"), "White", "", "");
		KinkyDungeonDrawReputation();
	} else if (KinkyDungeonDrawState == "Lore") {
		DrawButton(650, 925, 250, 60, TextGet("KinkyDungeonGame"), "White", "", "");
		KinkyDungeonDrawLore();
	} else if (KinkyDungeonDrawState == "Restart") {
		MainCanvas.textAlign = "left";
		DrawCheckbox(600, 100, 64, 64, TextGet("KinkyDungeonSound"), KinkyDungeonSound, false, "white");
		DrawCheckbox(600, 180, 64, 64, TextGet("KinkyDungeonDrool"), KinkyDungeonDrool, false, "white");
		if (ServerURL == "foobar")
			DrawCheckbox(600, 260, 64, 64, TextGet("KinkyDungeonGraphicsQuality"), KinkyDungeonGraphicsQuality, false, "white");
		DrawCheckbox(600, 650, 64, 64, TextGet("KinkyDungeonFastWait"), KinkyDungeonFastWait, false, "white");
		MainCanvas.textAlign = "center";
		DrawText(TextGet("KinkyDungeonRestartConfirm"), 1250, 400, "white", "black");
		DrawButton(975, 550, 550, 64, TextGet("KinkyDungeonRestartNo"), "White", "");
		DrawButton(975, 650, 550, 64, TextGet("KinkyDungeonRestartWait"), "White", "");
		DrawButton(975, 750, 550, 64, TextGet("KinkyDungeonRestartCapture"),  (KDGameData.KinkyDungeonSpawnJailers + 1 == KDGameData.KinkyDungeonSpawnJailersMax && !KinkyDungeonJailTransgressed) ? "Pink" : "White", "");
		DrawButton(975, 850, 550, 64, TextGet("KinkyDungeonRestartYes"), "White", "");
		DrawButton(1075, 450, 350, 64, TextGet("GameConfigKeys"), "White", "");
	}

	if (KinkyDungeonStatFreeze > 0) {
		ChatRoomDrawArousalScreenFilter(0, 1000, 2000, 100, '190, 190, 255');
	} else if (KinkyDungeonStatArousal > 0) {
		ChatRoomDrawArousalScreenFilter(0, 1000, 2000, KinkyDungeonStatArousal * 100 / KinkyDungeonStatArousalMax);
	}



}

let KinkyDungeonFloaters = [];
let KinkyDungeonLastFloaterTime = 0;

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
			floater.color, "black");
		if (floater.t < floater.lifetime) newFloaters.push(floater);
	}
	KinkyDungeonFloaters = newFloaters;

	KinkyDungeonLastFloaterTime = CommonTime();
}

let KinkyDungeonMessageToggle = false;
let KinkyDungeonMessageLog = [];

function KinkyDungeonDrawMessages(NoLog) {
	if (!NoLog)
		DrawButton(1750, 82, 100, 50, TextGet("KinkyDungeonLog"), "white");
	if (!KinkyDungeonMessageToggle || NoLog) {
		if (KinkyDungeonTextMessageTime > 0) {
			DrawTextFit(KinkyDungeonTextMessage, canvasOffsetX + KinkyDungeonCanvas.width/2+1, 82+1, KinkyDungeonCanvas.width, "black", "black");
			DrawTextFit(KinkyDungeonTextMessage, canvasOffsetX + KinkyDungeonCanvas.width/2, 82, KinkyDungeonCanvas.width, KinkyDungeonTextMessageColor, "black");
		}
		if (KinkyDungeonActionMessageTime > 0) {
			DrawTextFit(KinkyDungeonActionMessage, canvasOffsetX + KinkyDungeonCanvas.width/2+1, 132+1, KinkyDungeonCanvas.width, "black", "black");
			DrawTextFit(KinkyDungeonActionMessage, canvasOffsetX + KinkyDungeonCanvas.width/2, 132, KinkyDungeonCanvas.width, KinkyDungeonActionMessageColor, "black");
		}
	} else {
		let extra = 200;
		DrawRect(canvasOffsetX, 82, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height/2 + extra, "#000000");
		let Dist = 50;
		for (let i = 0; i < KinkyDungeonMessageLog.length && i < Math.floor((KinkyDungeonCanvas.height/2 + extra)/Dist); i++) {
			let log = KinkyDungeonMessageLog[KinkyDungeonMessageLog.length - 1 - i];
			DrawTextFit(log.text, canvasOffsetX + KinkyDungeonCanvas.width/2, 82 + i * Dist + Dist/2, KinkyDungeonCanvas.width, log.color, "white");
		}
		if (KinkyDungeonMessageLog.length > Math.floor((KinkyDungeonCanvas.height/2 + extra)/Dist))
			KinkyDungeonMessageLog.splice(0, Math.floor((KinkyDungeonCanvas.height/2 + extra)/Dist) - KinkyDungeonMessageLog.length);
	}
}

function KinkyDungeonUpdateVisualPosition(Entity, amount) {
	if (amount < 0 || !Entity.visual_x || !Entity.visual_y) {
		Entity.visual_x = Entity.x;
		Entity.visual_y = Entity.y;
	} else {
		let speed = 100;
		if (Entity.player && KinkyDungeonSlowLevel > 0 && KDGameData.KinkyDungeonLeashedPlayer < 2 && (KinkyDungeonFastMovePath.length < 1 || KinkyDungeonSlowLevel > 1)) speed = 100 + 80 * KinkyDungeonSlowLevel;
		if (KDGameData.SleepTurns > 0) speed = 500;
		let value = amount/speed;// How many ms to complete a move
		// xx is the true position of a bullet
		let tx = (Entity.xx) ? Entity.xx : Entity.x;
		let ty = (Entity.yy) ? Entity.yy : Entity.y;
		let dist = Math.sqrt((Entity.visual_x - tx) * (Entity.visual_x - tx) + (Entity.visual_y - ty) * (Entity.visual_y - ty));
		if (dist == 0) return;
		// Increment
		let weightx = Math.abs(Entity.visual_x - tx)/(dist);
		let weighty = Math.abs(Entity.visual_y - ty)/(dist);
		//if (weightx != 0 && weightx != 1 && Math.abs(weightx - weighty) > 0.01)
		//console.log(weightx + ", " + weighty + ", " + (Entity.visual_x - tx) + ", " + (Entity.visual_y - ty) + ", dist = " + dist, "x = " + Entity.visual_x + ", y = " + Entity.visual_y)

		if (Entity.visual_x > tx) Entity.visual_x = Math.max(Entity.visual_x - value*weightx, tx);
		else Entity.visual_x = Math.min(Entity.visual_x + value*weightx, tx);

		if (Entity.visual_y > ty) Entity.visual_y = Math.max(Entity.visual_y - value*weighty, ty);
		else Entity.visual_y = Math.min(Entity.visual_y + value*weighty, ty);

		//console.log("x = " + Entity.visual_x + ", y = " + Entity.visual_y + ", tx = " + tx + ", ty = " + ty)
	}
}

function KinkyDungeonSetTargetLocation() {
	KinkyDungeonTargetX = Math.round((MouseX - KinkyDungeonGridSizeDisplay/2 - canvasOffsetX)/KinkyDungeonGridSizeDisplay) + KinkyDungeonCamX;
	KinkyDungeonTargetY = Math.round((MouseY - KinkyDungeonGridSizeDisplay/2 - canvasOffsetY)/KinkyDungeonGridSizeDisplay) + KinkyDungeonCamY;
}

function KinkyDungeonSetMoveDirection() {
	KinkyDungeonMoveDirection = KinkyDungeonGetDirection(
		(MouseX - ((KinkyDungeonPlayerEntity.x - KinkyDungeonCamX)*KinkyDungeonGridSizeDisplay + canvasOffsetX + KinkyDungeonGridSizeDisplay / 2))/KinkyDungeonGridSizeDisplay,
		(MouseY - ((KinkyDungeonPlayerEntity.y - KinkyDungeonCamY)*KinkyDungeonGridSizeDisplay + canvasOffsetY + KinkyDungeonGridSizeDisplay / 2))/KinkyDungeonGridSizeDisplay);
}
