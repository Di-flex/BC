"use strict";

function KinkyDungeonGetSprite(code) {
	let sprite = "Floor";
	if (code == "1") sprite = "Wall";
	if (code == "2") sprite = "Brickwork";
	else if (code == "B") sprite = "Bed";
	else if (code == "b") sprite = "Bars";
	else if (code == "X") sprite = "Doodad";
	else if (code == "C") sprite = "Chest";
	else if (code == "c") sprite = "ChestOpen";
	else if (code == "D") sprite = "Door";
	else if (code == "G") sprite = "Ghost";
	else if (code == "d") sprite = "DoorOpen";
	else if (code == "R") sprite = "Rubble";
	else if (code == "T") sprite = "Trap";
	else if (code == "r") sprite = "RubbleLooted";
	else if (code == "g") sprite = "Grate";
	else if (code == "S") sprite = "StairsUp";
	else if (code == "s") sprite = "StairsDown";
	else if (code == "H") sprite = "StairsDown"; // Shortcut
	else if (code == "A") sprite = "Shrine";
	else if (code == "O") sprite = "Orb";
	else if (code == "o") sprite = "OrbEmpty";
	else if (code == "a") sprite = "ShrineBroken";
	else if (code == "w") sprite = "Water";
	return sprite;
}

// Draw function for the game portion
function KinkyDungeonDrawGame() {

	if (KinkyDungeonDrawState == "Game")
		KinkyDungeonListenKeyMove();

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



	DrawText(TextGet("CurrentLevel") + MiniGameKinkyDungeonLevel, 750, 42, "white", "black");
	DrawText(TextGet("DungeonName" + KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]), 1500, 42, "white", "black");

	// Draw the stats
	KinkyDungeonDrawStats(canvasOffsetX + KinkyDungeonCanvas.width+10, canvasOffsetY, 1975 - (canvasOffsetX + KinkyDungeonCanvas.width+5), KinkyDungeonStatBarHeight);

	// Draw the quick inventory
	if (KinkyDungeonShowInventory) {
		KinkyDungeonDrawQuickInv();
	}

	if (KinkyDungeonDrawState == "Game") {
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
						let sprite = KinkyDungeonGetSprite(rows[RY][RX]);

						DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Floor" + KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint] + "/" + sprite + ".png", KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
							(-CamX_offset + X)*KinkyDungeonGridSizeDisplay, (-CamY_offset+R)*KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
					}
				}

				// Get lighting grid
				if (KinkyDungeonUpdateLightGrid) {
					KinkyDungeonUpdateLightGrid = false;
					KinkyDungeonMakeLightMap(KinkyDungeonGridWidth, KinkyDungeonGridHeight, [ {x: KinkyDungeonPlayerEntity.x, y:KinkyDungeonPlayerEntity.y, brightness: KinkyDungeonGetVisionRadius() }]);
				}



				KinkyDungeonDrawItems(canvasOffsetX, canvasOffsetY, CamX+CamX_offset, CamY+CamY_offset);
				KinkyDungeonContext.drawImage(KinkyDungeonCanvasPlayer,  (KinkyDungeonPlayerEntity.visual_x - CamX - CamX_offset)*KinkyDungeonGridSizeDisplay, (KinkyDungeonPlayerEntity.visual_y - CamY - CamY_offset)*KinkyDungeonGridSizeDisplay);

				if (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax*0.9) {
					KinkyDungeonBar(canvasOffsetX + (KinkyDungeonPlayerEntity.visual_x - CamX)*KinkyDungeonGridSizeDisplay, canvasOffsetY + (KinkyDungeonPlayerEntity.visual_y - CamY)*KinkyDungeonGridSizeDisplay,
						KinkyDungeonGridSizeDisplay, 12, KinkyDungeonStatStamina / KinkyDungeonStatStaminaMax, "#44ff44", "#000000");
				}

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
				rows = KinkyDungeonLightGrid.split('\n');
				for (let R = -1; R <= KinkyDungeonGridHeightDisplay; R++)  {
					for (let X = -1; X <= KinkyDungeonGridWidthDisplay; X++)  {

						let RY = Math.max(0, Math.min(R+CamY, KinkyDungeonGridHeight));
						let RX = Math.max(0, Math.min(X+CamX, KinkyDungeonGridWidth));

						KinkyDungeonContext.beginPath();
						KinkyDungeonContext.fillStyle = "rgba(0,0,0," + Math.max(0, 1-Number(rows[RY][RX])/3) + ")";

						KinkyDungeonContext.fillRect((-CamX_offset + X)*KinkyDungeonGridSizeDisplay, (-CamY_offset + R)*KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay);
						KinkyDungeonContext.fill();
					}
				}

				// Draw targeting reticule
				if (!KinkyDungeonShowInventory && MouseIn(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height) && KinkyDungeonIsPlayer()) {
					if (KinkyDungeonTargetingSpell) {
						KinkyDungeonSetTargetLocation();

						KinkyDungeonContext.beginPath();
						KinkyDungeonContext.rect((KinkyDungeonTargetX - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonTargetY - CamY)*KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay);
						KinkyDungeonContext.lineWidth = 3;
						KinkyDungeonContext.strokeStyle = "#88AAFF";
						KinkyDungeonContext.stroke();

						KinkyDungeonSpellValid = (KinkyDungeonTargetingSpell.projectileTargeting || KinkyDungeonTargetingSpell.range >= Math.sqrt((KinkyDungeonTargetX - KinkyDungeonPlayerEntity.x) *(KinkyDungeonTargetX - KinkyDungeonPlayerEntity.x) + (KinkyDungeonTargetY - KinkyDungeonPlayerEntity.y) * (KinkyDungeonTargetY - KinkyDungeonPlayerEntity.y))) &&
							(KinkyDungeonTargetingSpell.projectileTargeting || KinkyDungeonTargetingSpell.CastInWalls || KinkyDungeonOpenObjects.includes(KinkyDungeonMapGet(KinkyDungeonTargetX, KinkyDungeonTargetY))) &&
							(!KinkyDungeonTargetingSpell.WallsOnly || !KinkyDungeonOpenObjects.includes(KinkyDungeonMapGet(KinkyDungeonTargetX, KinkyDungeonTargetY)));
						if (KinkyDungeonTargetingSpell.noTargetEnemies && KinkyDungeonEnemyAt(KinkyDungeonTargetX, KinkyDungeonTargetY)) KinkyDungeonSpellValid = false;
						if (KinkyDungeonTargetingSpell.noTargetDark && KinkyDungeonLightGet(KinkyDungeonTargetX, KinkyDungeonTargetY) < 1) KinkyDungeonSpellValid = false;
						if (KinkyDungeonTargetingSpell.noTargetPlayer && KinkyDungeonPlayerEntity.x == KinkyDungeonTargetX && KinkyDungeonPlayerEntity.y == KinkyDungeonTargetY) KinkyDungeonSpellValid = false;
						if (KinkyDungeonTargetingSpell.mustTarget && KinkyDungeonNoEnemy(KinkyDungeonTargetX, KinkyDungeonTargetY, true)) KinkyDungeonSpellValid = false;

						if (KinkyDungeonSpellValid)
							if (KinkyDungeonTargetingSpell.projectileTargeting)
								DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Target.png",
									KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
									(KinkyDungeonMoveDirection.x + KinkyDungeonPlayerEntity.x - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonMoveDirection.y + KinkyDungeonPlayerEntity.y - CamY)*KinkyDungeonGridSizeDisplay,
									KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
							else
								DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Target.png",
									KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
									(KinkyDungeonTargetX - CamX)*KinkyDungeonGridSizeDisplay, (KinkyDungeonTargetY - CamY)*KinkyDungeonGridSizeDisplay,
									KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
					} else if (KinkyDungeonFastMove && (KinkyDungeonMoveDirection.x != 0 || KinkyDungeonMoveDirection.y != 0)) {
						KinkyDungeonSetTargetLocation();

						if (KinkyDungeonLightGet(KinkyDungeonTargetX, KinkyDungeonTargetY) > 0) {
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
				MainCanvas.drawImage(KinkyDungeonCanvas, canvasOffsetX, canvasOffsetY);
			}
			if (KinkyDungeonSleepiness) {
				CharacterSetFacialExpression(KinkyDungeonPlayer, "Emoticon", "Sleep");
			} else CharacterSetFacialExpression(KinkyDungeonPlayer, "Emoticon", null);

			if (KinkyDungeonPlayer.CanTalk() && KinkyDungeonSleepTurns > 0) CharacterSetFacialExpression(KinkyDungeonPlayer, "Drool", null);

			// Draw the player no matter what
			KinkyDungeonContextPlayer.clearRect(0, 0, KinkyDungeonCanvasPlayer.width, KinkyDungeonCanvasPlayer.height);
			DrawCharacter(KinkyDungeonPlayer, -KinkyDungeonGridSizeDisplay/2, KinkyDungeonPlayer.Pose.includes("Hogtied") ? -165 : (KinkyDungeonPlayer.IsKneeling() ? -78 : 0), KinkyDungeonGridSizeDisplay/250, false, KinkyDungeonContextPlayer);

			KinkyDungeonDrawEnemiesHP(canvasOffsetX, canvasOffsetY, CamX+CamX_offset, CamY+CamY_offset);
			KinkyDungeonDrawFloaters(CamX+CamX_offset, CamY+CamY_offset);

			if (KinkyDungeonIsPlayer()) {
				KinkyDungeonDrawInputs();
			}

			KinkyDungeonDrawMessages();
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
		MainCanvas.textAlign = "center";
		DrawText(TextGet("KinkyDungeonRestartConfirm"), 1250, 400, "white", "black");
		DrawButton(875, 750, 350, 64, TextGet("KinkyDungeonRestartYes"), "White", "");
		DrawButton(1275, 750, 350, 64, TextGet("KinkyDungeonRestartNo"), "White", "");
		DrawButton(975, 850, 550, 64, TextGet("KinkyDungeonRestartCapture"),  (KinkyDungeonSpawnJailers + 1 == KinkyDungeonSpawnJailersMax && !KinkyDungeonJailTransgressed) ? "Pink" : "White", "");
		DrawButton(1075, 650, 350, 64, TextGet("GameConfigKeys"), "White", "");
	}

	if (KinkyDungeonStatFreeze > 0) {
		ChatRoomDrawArousalScreenFilter(0, 1000, 2000, 100, '190, 190, 255');
	} else if (KinkyDungeonStatArousal > 0) {
		ChatRoomDrawArousalScreenFilter(0, 1000, 2000, KinkyDungeonStatArousal * 100 / KinkyDungeonStatArousalMax);
	}



}

let KinkyDungeonFloaters = [];

function KinkyDungeonSendFloater(Entity, Amount, Color, Time, LocationOverride, suff = "") {
	if (Entity.x && Entity.y) {
		let floater = {
			x: Entity.x + Math.random(),
			y: Entity.y + Math.random(),
			override: LocationOverride,
			speed: 25,
			t: 0,
			color: Color,
			text: "" + ((typeof Amount === "string") ? Amount : Math.round(Amount * 10)/10) + suff,
			lifetime: Time ? Time : ((typeof Amount === "string") ? 5 : ((Amount < 3) ? 1 : (Amount > 5 ? 3 : 2))),
		};
		KinkyDungeonFloaters.push(floater);
	}
}

let KinkyDungeonLastFloaterTime = 0;

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
		if (KinkyDungeonTextMessageTime > 0)
			DrawText(KinkyDungeonTextMessage, 1150, 82, KinkyDungeonTextMessageColor, "black");
		if (KinkyDungeonActionMessageTime > 0)
			DrawText(KinkyDungeonActionMessage, 1150, 132, KinkyDungeonActionMessageColor, "black");
	} else {
		let extra = 200;
		DrawRect(canvasOffsetX, 82, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height/2 + extra, "#000000");
		let Dist = 50;
		for (let i = 0; i < KinkyDungeonMessageLog.length && i < Math.floor((KinkyDungeonCanvas.height/2 + extra)/Dist); i++) {
			let log = KinkyDungeonMessageLog[KinkyDungeonMessageLog.length - 1 - i];
			DrawText(log.text, 1150, 82 + i * Dist + Dist/2, log.color, "white");
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
		if (Entity.player && KinkyDungeonSlowLevel > 0 && KinkyDungeonLeashedPlayer < 2) speed = 190 * KinkyDungeonSlowLevel;
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
