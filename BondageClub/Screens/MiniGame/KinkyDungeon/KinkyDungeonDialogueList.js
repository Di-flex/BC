"use strict";


/**
 * @type {{name: string, tags: string[], singletag: string[], chance: number}[]}
 */
let KDShops = [];


/**
 * @type {{name: string, outfit: string, tags: string[], singletag: string[], excludeTags: string[], chance: number}[]}
 */
let KDRecruitDialog = [];

/**
 * @type {{name: string, tags: string[], singletag: string[], excludeTags: string[], weight: number}[]}
 */
let KDAllyDialog = [];

/** @type {Record<string, KinkyDialogue>} */
let KDDialogue = {
	"GhostInfo": {
		response: "Default",
		options: {
			"Continue" : {
				clickFunction: (gagged) => {
					KinkyDungeonTargetTile = null;
					KinkyDungeonTargetTileLocation = "";
					return false;
				},
				playertext: "Default", exitDialogue: true,
			},
			//"Nice" : {gag: true, playertext: "Default", exitDialogue: true},
			//"Snark" : {playertext: "Default", exitDialogue: true},
			//"Brash" : {gag: true, playertext: "Default", exitDialogue: true},
		},
	},
	"Tutorial1": {
		response: "Default",
		options: {
			"Continue" : {
				clickFunction: (gagged) => {
					KinkyDungeonTargetTile = null;
					KinkyDungeonTargetTileLocation = "";
					let zombie = DialogueCreateEnemy(KinkyDungeonStartPosition.x + 7, 3, "FastZombie");
					zombie.AI = "guard";
					zombie.gxx = KinkyDungeonStartPosition.x + 8;
					zombie.gyy = KinkyDungeonGridHeight - 2;
					return false;
				},
				playertext: "GhostInfo_Continue", exitDialogue: true,
			},
			//"Nice" : {gag: true, playertext: "Default", exitDialogue: true},
			//"Snark" : {playertext: "Default", exitDialogue: true},
			//"Brash" : {gag: true, playertext: "Default", exitDialogue: true},
		},
	},
	"Tutorial2_mp3": {
		response: "Default",
		options: {
			"Continue" : {
				clickFunction: (gagged) => {
					KinkyDungeonTargetTile = null;
					KinkyDungeonTargetTileLocation = "";
					DialogueCreateEnemy(KinkyDungeonStartPosition.x + 22, 3, "FastZombie");
					return false;
				},
				playertext: "GhostInfo_Continue", exitDialogue: true,
			},
			//"Nice" : {gag: true, playertext: "Default", exitDialogue: true},
			//"Snark" : {playertext: "Default", exitDialogue: true},
			//"Brash" : {gag: true, playertext: "Default", exitDialogue: true},
		},
	},
	"Tutorial2_dp2": {
		response: "Default",
		options: {
			"Continue" : {
				clickFunction: (gagged) => {
					KinkyDungeonTargetTile = null;
					KinkyDungeonTargetTileLocation = "";
					DialogueCreateEnemy(KinkyDungeonStartPosition.x + 32, 4, "FastZombie");
					return false;
				},
				playertext: "GhostInfo_Continue", exitDialogue: true,
			},
			//"Nice" : {gag: true, playertext: "Default", exitDialogue: true},
			//"Snark" : {playertext: "Default", exitDialogue: true},
			//"Brash" : {gag: true, playertext: "Default", exitDialogue: true},
		},
	},
	"WeaponFound": {
		response: "WeaponFound",
		personalities: ["Robot"],
		options: {
			"Accept": {gag: true, playertext: "WeaponFoundAccept", response: "GoodGirl", personalities: ["Dom", "Sub", "Robot"],
				clickFunction: (gagged) => {
					KinkyDungeonSendTextMessage(10, TextGet("KDWeaponConfiscated"), "red", 2);
					let weapon = KinkyDungeonPlayerDamage.name;
					if (weapon && weapon != "Unarmed") {
						KinkyDungeonChangeRep("Ghost", 3);
						let item = KinkyDungeonInventoryGetWeapon(weapon);
						KDSetWeapon(null);
						KinkyDungeonAddLostItems([item], false);
						KinkyDungeonInventoryRemove(item);
					}
					return false;
				},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}}},
			"Bluff": {playertext: "", response: "",
				prerequisiteFunction: (gagged) => {return false;},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}}},
			"Deny": {gag: true, playertext: "WeaponFoundDeny", response: "Punishment", personalities: ["Dom", "Sub", "Robot"],
				clickFunction: (gagged) => {KinkyDungeonStartChase(undefined, "Refusal"); return false;},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}}},
			"Illusion": {gagDisabled: true, playertext: "WeaponFoundIllusion", response: "Disbelief", personalities: ["Dom", "Sub", "Robot"],
				prerequisiteFunction: (gagged) => {return KinkyDungeonGoddessRep.Illusion >= 51;},
				clickFunction: (gagged) => {
					if (KDGameData.CurrentDialogMsgSpeaker == "MaidforceHead") {
						KDGameData.CurrentDialogStage = "Deny";
						KDGameData.CurrentDialogMsg = "HeadMaidExcuseMe";
						KinkyDungeonStartChase(undefined, "Refusal");
					} else {
						let diff = KDPersonalitySpread(40, 60, 80);
						if (KDBasicCheck(["Illusion", "Ghost"], ["Prisoner"]) > diff) {
							KDGameData.CurrentDialogStage = "Bluff";
							KDGameData.CurrentDialogMsg = "Bluffed";
							KinkyDungeonChangeRep("Ghost", -2);
						}
						KDDialogueApplyPersonality(["Dom", "Sub", "Robot"]);
					}
					return false;
				},
				options: {"Back": {playertext: "Pause", leadsToStage: ""}}},
			"Conjure": {gagDisabled: true, playertext: "WeaponFoundConjure", response: "Disbelief", personalities: ["Dom", "Sub", "Robot"],
				prerequisiteFunction: (gagged) => {return KinkyDungeonGoddessRep.Conjure >= 51;},
				clickFunction: (gagged) => {
					let diff = KDPersonalitySpread(40, 60, 80);
					if (KDBasicCheck(["Conjure", "Ghost"], ["Prisoner"]) > diff) {
						KDGameData.CurrentDialogStage = "Bluff";
						KDGameData.CurrentDialogMsg = "Bluffed";
						KinkyDungeonChangeRep("Ghost", -2);
					}
					KDDialogueApplyPersonality(["Dom", "Sub", "Robot"]);
					return false;
				},
				options: {"Back": {playertext: "Pause", leadsToStage: ""}}},
			"Elements": {gagDisabled: true, playertext: "WeaponFoundElements", response: "Disbelief", personalities: ["Dom", "Sub", "Robot"],
				prerequisiteFunction: (gagged) => {return KinkyDungeonGoddessRep.Elements >= 51;},
				clickFunction: (gagged) => {
					let diff = KDPersonalitySpread(40, 60, 80);
					if (KDBasicCheck(["Elements", "Ghost"], ["Prisoner"]) > diff) {
						KDGameData.CurrentDialogStage = "Bluff";
						KDGameData.CurrentDialogMsg = "Bluffed";
						KinkyDungeonChangeRep("Ghost", -2);
					}
					KDDialogueApplyPersonality(["Dom", "Sub", "Robot"]);
					return false;
				},
				options: {"Back": {playertext: "Pause", leadsToStage: ""}}},
			"Rope": {gagDisabled: true, playertext: "WeaponFoundRope", response: "Disbelief", personalities: ["Dom", "Sub", "Robot"],
				prerequisiteFunction: (gagged) => {return KinkyDungeonGoddessRep.Rope >= 51;},
				clickFunction: (gagged) => {
					let diff = KDPersonalitySpread(40, 60, 80);
					if (KDBasicCheck(["Rope", "Ghost"], ["Prisoner"]) > diff) {
						KDGameData.CurrentDialogStage = "Bluff";
						KDGameData.CurrentDialogMsg = "Bluffed";
						KinkyDungeonChangeRep("Ghost", -2);
					}
					KDDialogueApplyPersonality(["Dom", "Sub", "Robot"]);
					return false;
				},
				options: {"Back": {playertext: "Pause", leadsToStage: ""}}},
			"Leather": {gagDisabled: true, playertext: "WeaponFoundLeather", response: "Disbelief", personalities: ["Dom", "Sub", "Robot"],
				prerequisiteFunction: (gagged) => {return KinkyDungeonGoddessRep.Leather >= 51;},
				clickFunction: (gagged) => {
					let diff = KDPersonalitySpread(40, 60, 80);
					if (KDBasicCheck(["Leather", "Ghost"], ["Prisoner"]) > diff) {
						KDGameData.CurrentDialogStage = "Bluff";
						KDGameData.CurrentDialogMsg = "Bluffed";
						KinkyDungeonChangeRep("Ghost", -2);
					}
					KDDialogueApplyPersonality(["Dom", "Sub", "Robot"]);
					return false;
				},
				options: {"Back": {playertext: "Pause", leadsToStage: ""}}},
		}
	},
	"PrisonIntro": {
		response: "Default",
		options: {
			"NewLife": {playertext: "Default", response: "Default",
				options: {
					"Pout": {playertext: "Default", response: "Default", options: {"Continue" : {playertext: "Continue", leadsToStage: "Rules"}}},
					"Brat": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KinkyDungeonChangeRep("Ghost", -10);
							KinkyDungeonChangeRep("Prisoner", 10);
							return false;
						},
						options: {"Continue" : {playertext: "Continue", leadsToStage: "Rules"}}},
					"Sub": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KinkyDungeonChangeRep("Ghost", 10);
							return false;
						},
						options: {"Continue" : {playertext: "Continue", leadsToStage: "Rules"}}},
				}
			},
			"Rules": {playertext: "Default", response: "Default",
				options: {
					"Pout": {playertext: "Default", response: "Default", options: {"Continue" : {playertext: "Continue", exitDialogue: true}}},
					"Brat": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KinkyDungeonChangeRep("Ghost", -10);
							KinkyDungeonChangeRep("Prisoner", 10);
							return false;
						},
						options: {"Continue" : {playertext: "Continue", exitDialogue: true}}},
					"Sub": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KinkyDungeonChangeRep("Ghost", 10);
							return false;
						},
						options: {"Continue" : {playertext: "Continue", exitDialogue: true}}},
				}
			},
		}
	},
	"PrisonRepeat": {
		response: "Default",
		options: {
			"Smile": {playertext: "Default", response: "Default",
				prerequisiteFunction: (gagged) => {return !(KinkyDungeonGetRestraintItem("ItemVulva"));},
				clickFunction: (gagged) => {
					KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapBelt"), 0, true);
					KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("TrapPlug2"), 0, true);
					KinkyDungeonChangeRep("Ghost", 3);
					return false;
				},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}},
			},
			"Smile2": {playertext: "Default", response: "Default",
				prerequisiteFunction: (gagged) => {return KinkyDungeonGetRestraintItem("ItemVulva") != undefined;},
				clickFunction: (gagged) => {
					KinkyDungeonChangeRep("Ghost", 5);
					return false;
				},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}},
			},
			"Struggle": {playertext: "Default", response: "Default",
				prerequisiteFunction: (gagged) => {return KinkyDungeonGetRestraintItem("ItemArms") != undefined;},
				clickFunction: (gagged) => {
					KinkyDungeonChangeRep("Prisoner", 3);
					return false;
				},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}},
			},
			"Pout": {playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					KinkyDungeonChangeRep("Ghost", -3);
					return false;
				},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}},
			},
		}
	},
	"OfferDress": KDYesNoSingle("OfferDress", ["Rope"], ["Ghost"], ["bindingDress"], [0, 60, 0, 75], [-25, 0, 15, 40]),
	"OfferLatex": KDYesNoTemplate(
		(refused) => { // Setup function. This is run when you click Yes or No in the start of the dialogue
			// This is the restraint that the dialogue offers to add. It's selected from a set of tags. You can change the tags to change the restraint
			let r = KinkyDungeonGetRestraint({tags: ["latexRestraints", "latexRestraintsHeavy"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
			if (r) {
				KDGameData.CurrentDialogMsgData = {
					"Data_r": r.name,
					"RESTRAINT": TextGet("Restraint" + r.name),
				};

				// Percent chance your dominant action ("Why don't you wear it instead?") succeeds
				// Based on a difficulty that is the sum of four lines
				// Dominant perk should help with this
				KDGameData.CurrentDialogMsgValue.PercentOff =
					KDOffensiveDialogueSuccessChance(KDBasicCheck(["Latex"], [])
					- (KDDialogueGagged() ? 60 : 40)
					- (KinkyDungeonStatsChoice.has("Dominant") ? 0 : 40)
					- KDPersonalitySpread(-25, 0, KinkyDungeonStatsChoice.has("Dominant") ? 15 : 35));
				// Set the string to replace in the UI
				KDGameData.CurrentDialogMsgData.OFFPERC = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.PercentOff)}%`;
			}

			// If the player hits No first, this happens
			if (refused) {
				// Set up the difficulty of the check
				// This check basically determines if we switch to the Force stage where the speaker tries to force you
				let diff = KinkyDungeonStatsChoice.has("Dominant") ? 0 : 60;
				// Failure condition
				if (KDBasicCheck(["Latex"], ["Ghost"]) <= diff) {
					KDGameData.CurrentDialogStage = "Force";
					KDGameData.CurrentDialogMsg = "OfferLatexForceYes"; // This is different from OfferLatexForce_Yes, it's a more reluctant dialogue...
					// Set up percentage chance to resist
					KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck(["Latex"], ["Ghost"]));
					KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
				}
				KinkyDungeonChangeRep("Ghost", -1); // Reduce submission because of refusal
			}
			return false;
		},(refused) => { // Yes function. This happens if the user submits willingly
			KinkyDungeonChangeRep("Latex", 1);
			KDPleaseSpeaker(refused ? 0.004 : 0.005); // Less reputation if you refused
			KinkyDungeonChangeRep("Ghost", refused ? 1 : 2); // Less submission if you refused
			KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(KDGameData.CurrentDialogMsgData.Data_r), 0, true, "Red");
			return false;
		},(refused) => { // No function. This happens when the user refuses.
			// The first half is basically the same as the setup function, but only if the user did not refuse the first yes/no
			if (!refused) {
				// This check basically determines if we switch to the Force stage where the speaker tries to force you
				let diff = KinkyDungeonStatsChoice.has("Dominant") ? 15 : 75; // Slightly harder because we refused
				// Failure condition
				if (KDBasicCheck(["Latex"], ["Ghost"]) <= diff) {
					KDGameData.CurrentDialogStage = "Force";
					KDGameData.CurrentDialogMsg = "";
					// Set up percentage chance to resist
					KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck(["Latex"], ["Ghost"]));
					KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
				}
				KinkyDungeonChangeRep("Ghost", -1);
			} else { // If the user refuses we use the already generated success chance and calculate the result
				let percent = KDGameData.CurrentDialogMsgValue.Percent;
				if (KDRandom() > percent) { // We failed! You get tied tight
					KDIncreaseOfferFatigue(-20);
					KDGameData.CurrentDialogMsg = "OfferLatexForce_Failure";
					KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(KDGameData.CurrentDialogMsgData.Data_r), 0, true, "Red");
				} else {
					KDIncreaseOfferFatigue(10);
				}
			}
			return false;
		},(refused) => { // Dom function. This is what happens when you try the dominant option
			// We use the already generated percent chance
			let percent = KDGameData.CurrentDialogMsgValue.PercentOff;
			if (KDRandom() > percent) {
				// If we fail, we aggro the enemy
				KDIncreaseOfferFatigue(-20);
				KDGameData.CurrentDialogMsg = "OfferDominantFailure";
				KDAggroSpeaker(10);
			} else {
				// If we succeed, we get the speaker enemy and bind them
				KDIncreaseOfferFatigue(10);
				let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
				if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
					enemy.playWithPlayer = 0;
					enemy.playWithPlayerCD = 999;
					let amount = 10;
					if (!enemy.boundLevel) enemy.boundLevel = amount;
					else enemy.boundLevel += amount;
				}
				KinkyDungeonChangeRep("Ghost", -4); // Reduce submission because dom
			}
			return false;
		}),
	"OfferChastity": {
		response: "Default",
		clickFunction: (gagged) => {
			KinkyDungeonSetFlag("BondageOffer",  5);
			KinkyDungeonSetFlag("ChastityOffer",  50);
			return false;
		},
		options: {
			"Yes": {gag: true, playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					let r = KinkyDungeonGetRestraint({tags: ["genericChastity"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
					if (r) {
						KDGameData.CurrentDialogMsgData = {
							"Data_r": r.name,
							"RESTRAINT": TextGet("Restraint" + r.name),
							"ChastityLock": MiniGameKinkyDungeonLevel + KDRandom()*3 > 3 ? (MiniGameKinkyDungeonLevel + KDRandom()*6 > 9 ? "Gold" : "Blue") : "Red",
						};

						KDGameData.CurrentDialogMsgValue.PercentOff = KDOffensiveDialogueSuccessChance(KDBasicCheck(["Metal"], [])
							- (KDDialogueGagged() ? 60 : 40)
							- (KinkyDungeonStatsChoice.has("Dominant") ? 0 : 40)
							- KDPersonalitySpread(-25, 0, KinkyDungeonStatsChoice.has("Dominant") ? 15 : 35));
						KDGameData.CurrentDialogMsgData.OFFPERC = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.PercentOff)}%`;
					}
					return false;
				},
				options: {
					"Yes": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KinkyDungeonChangeRep("Metal", 1);
							KDAllySpeaker(9999, true);
							KinkyDungeonChangeRep("Ghost", 2);
							KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(KDGameData.CurrentDialogMsgData.Data_r), 0, true, KDGameData.CurrentDialogMsgData.ChastityLock);
							return false;
						},
						options: {
							"Leave": {playertext: "Leave", prerequisiteFunction: (gagged) => {return KDGameData.CurrentDialogMsgData.ChastityLock == "Red";}, exitDialogue: true},
							"Observe": {playertext: "OfferChastityObserve", prerequisiteFunction: (gagged) => {return KDGameData.CurrentDialogMsgData.ChastityLock != "Red";}, leadsToStage: "Glow"},
						},
					},
					"No": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							let diff = 75;
							if (KinkyDungeonStatsChoice.has("Dominant")) diff = 0;
							if (KDBasicCheck(["Metal"], ["Ghost"]) <= diff) {
								KDGameData.CurrentDialogStage = "Force";
								KDGameData.CurrentDialogMsg = "OfferChastityForceYes";
								KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck(["Metal"], ["Ghost"]));
								KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
							}
							KinkyDungeonChangeRep("Ghost", -1);
							return false;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
					"Dominant": {gag: true, playertext: "OfferDominant", response: "OfferDominantSuccess",
						clickFunction: (gagged) => {
							//KDAllySpeaker(30, true);
							let percent = KDGameData.CurrentDialogMsgValue.PercentOff;
							if (KDRandom() > percent) {
								// Fail
								KDIncreaseOfferFatigue(-20);
								KDGameData.CurrentDialogMsg = "OfferDominantFailure";
								KDAggroSpeaker(10);
							} else {
								KDIncreaseOfferFatigue(10);
								let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
								if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
									enemy.playWithPlayer = 0;
									enemy.playWithPlayerCD = 999;
									let amount = 10;
									if (!enemy.boundLevel) enemy.boundLevel = amount;
									else enemy.boundLevel += amount;
								}
								KinkyDungeonChangeRep("Ghost", -4);
							}
							return false;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
				},
			},
			"No": {gag: true, playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					let diff = 60;
					if (KinkyDungeonStatsChoice.has("Dominant")) diff = 0;
					let r = KinkyDungeonGetRestraint({tags: ["genericChastity"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
					if (r) {
						KDGameData.CurrentDialogMsgData = {
							"Data_r": r.name,
							"RESTRAINT": TextGet("Restraint" + r.name),
							"ChastityLock": MiniGameKinkyDungeonLevel + KDRandom()*3 > 3 ? (MiniGameKinkyDungeonLevel + KDRandom()*6 > 9 ? "Gold" : "Blue") : "Red",
						};

						KDGameData.CurrentDialogMsgValue.PercentOff = KDOffensiveDialogueSuccessChance(KDBasicCheck(["Metal"], [])
							- (KDDialogueGagged() ? 60 : 40)
							- (KinkyDungeonStatsChoice.has("Dominant") ? 0 : 40)
							- KDPersonalitySpread(-25, 0, KinkyDungeonStatsChoice.has("Dominant") ? 15 : 35));
						KDGameData.CurrentDialogMsgData.OFFPERC = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.PercentOff)}%`;
					}
					if (KDBasicCheck(["Metal"], ["Ghost"]) <= diff) {
						KDGameData.CurrentDialogStage = "Force";
						KDGameData.CurrentDialogMsg = "";
						KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck(["Metal"], ["Ghost"]));
						KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
					}
					KinkyDungeonChangeRep("Ghost", -1);
					return false;
				},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}},
			},
			"Force": {gag: true, playertext: "Default", response: "Default",
				prerequisiteFunction: (gagged) => {return false;},
				options: {
					"Yes": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KDAllySpeaker(9999, true);
							KinkyDungeonChangeRep("Ghost", 1);
							KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(KDGameData.CurrentDialogMsgData.Data_r), 0, true, KDGameData.CurrentDialogMsgData.ChastityLock);
							return false;
						},
						options: {
							"Leave": {playertext: "Leave", prerequisiteFunction: (gagged) => {return KDGameData.CurrentDialogMsgData.ChastityLock == "Red";}, exitDialogue: true},
							"Observe": {playertext: "OfferChastityObserve", prerequisiteFunction: (gagged) => {return KDGameData.CurrentDialogMsgData.ChastityLock != "Red";}, leadsToStage: "Glow"},
						},
					},
					"No": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							//KDAllySpeaker(30, true);
							let percent = KDGameData.CurrentDialogMsgValue.Percent;
							if (KDRandom() > percent) {
								// Fail
								KDIncreaseOfferFatigue(-20);
								KDGameData.CurrentDialogMsg = "OfferChastityForce_Failure";
								KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(KDGameData.CurrentDialogMsgData.Data_r), 0, true, KDGameData.CurrentDialogMsgData.ChastityLock);
							} else {
								KDIncreaseOfferFatigue(10);
							}
							return false;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
					"Dominant": {gag: true, playertext: "OfferDominant", response: "OfferDominantSuccess",
						clickFunction: (gagged) => {
							//KDAllySpeaker(30, true);
							let percent = KDGameData.CurrentDialogMsgValue.PercentOff;
							if (KDRandom() > percent) {
								// Fail
								KDIncreaseOfferFatigue(-20);
								KDGameData.CurrentDialogMsg = "OfferDominantFailure";
								KDAggroSpeaker(10);
							} else {
								KDIncreaseOfferFatigue(10);
								let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
								if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
									enemy.playWithPlayer = 0;
									enemy.playWithPlayerCD = 999;
									let amount = 10;
									if (!enemy.boundLevel) enemy.boundLevel = amount;
									else enemy.boundLevel += amount;
								}
								KinkyDungeonChangeRep("Ghost", -4);
							}
							return false;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
				},
			},
			"Glow": {playertext: "Default", response: "OfferChastityGlow",
				prerequisiteFunction: (gagged) => {return false;},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}},
			},
		}
	},
	"OfferLeather": {
		response: "Default",
		clickFunction: (gagged) => {
			KinkyDungeonSetFlag("BondageOffer",  5);
			return false;
		},
		options: {
			"Yes": {gag: true, playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					let r = KinkyDungeonGetRestraint({tags: ["leatherRestraintsHeavy"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
					if (r) {
						KDGameData.CurrentDialogMsgData = {
							"Data_r": r.name,
							"RESTRAINT": TextGet("Restraint" + r.name),
						};

						KDGameData.CurrentDialogMsgValue.PercentOff = KDOffensiveDialogueSuccessChance(KDBasicCheck(["Leather"], [])
							- (KDDialogueGagged() ? 60 : 40)
							- (KinkyDungeonStatsChoice.has("Dominant") ? 0 : 40)
							- KDPersonalitySpread(-25, 0, KinkyDungeonStatsChoice.has("Dominant") ? 15 : 35));
						KDGameData.CurrentDialogMsgData.OFFPERC = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.PercentOff)}%`;
					}
					return false;
				},
				options: {
					"Yes": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KDPleaseSpeaker(0.005);
							KinkyDungeonChangeRep("Leather", 1);
							KinkyDungeonChangeRep("Ghost", 2);
							KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(KDGameData.CurrentDialogMsgData.Data_r), 0, true, "Red");
							return false;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
					"No": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							let diff = 75;
							if (KinkyDungeonStatsChoice.has("Dominant")) diff = 0;
							if (KDBasicCheck(["Leather"], ["Ghost"]) <= diff) {
								KDGameData.CurrentDialogStage = "Force";
								KDGameData.CurrentDialogMsg = "OfferLeatherForceYes";
								KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck(["Leather"], ["Ghost"]));
								KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
							}
							KinkyDungeonChangeRep("Ghost", -1);
							return false;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
					"Dominant": {gag: true, playertext: "OfferDominant", response: "OfferDominantSuccess",
						clickFunction: (gagged) => {
							//KDAllySpeaker(30, true);
							let percent = KDGameData.CurrentDialogMsgValue.PercentOff;
							if (KDRandom() > percent) {
								// Fail
								KDIncreaseOfferFatigue(-20);
								KDGameData.CurrentDialogMsg = "OfferDominantFailure";
								KDAggroSpeaker(10);
							} else {
								KDIncreaseOfferFatigue(10);
								let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
								if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
									enemy.playWithPlayer = 0;
									enemy.playWithPlayerCD = 999;
									let amount = 10;
									if (!enemy.boundLevel) enemy.boundLevel = amount;
									else enemy.boundLevel += amount;
								}
								KinkyDungeonChangeRep("Ghost", -4);
							}
							return false;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
				},
			},
			"No": {gag: true, playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					let diff = 60;
					if (KinkyDungeonStatsChoice.has("Dominant")) diff = 0;
					let r = KinkyDungeonGetRestraint({tags: ["leatherRestraintsHeavy"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
					if (r) {
						KDGameData.CurrentDialogMsgData = {
							"Data_r": r.name,
							"RESTRAINT": TextGet("Restraint" + r.name),
						};

						KDGameData.CurrentDialogMsgValue.PercentOff = KDOffensiveDialogueSuccessChance(KDBasicCheck(["Leather"], [])
							- (KDDialogueGagged() ? 60 : 40)
							- (KinkyDungeonStatsChoice.has("Dominant") ? 0 : 40)
							- KDPersonalitySpread(-25, 0, KinkyDungeonStatsChoice.has("Dominant") ? 15 : 35));
						KDGameData.CurrentDialogMsgData.OFFPERC = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.PercentOff)}%`;
					}
					if (KDBasicCheck(["Leather"], ["Ghost"]) <= diff) {
						KDGameData.CurrentDialogStage = "Force";
						KDGameData.CurrentDialogMsg = "";
						KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck(["Leather"], ["Ghost"]));
						KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
					}
					KinkyDungeonChangeRep("Ghost", -1);
					return false;
				},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}},
			},
			"Force": {gag: true, playertext: "Default", response: "Default",
				prerequisiteFunction: (gagged) => {return false;},
				options: {
					"Yes": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KDPleaseSpeaker(0.004);
							KinkyDungeonChangeRep("Ghost", 1);
							KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(KDGameData.CurrentDialogMsgData.Data_r), 0, true, "Red");
							return false;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},},
					"No": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							let percent = KDGameData.CurrentDialogMsgValue.Percent;
							if (KDRandom() > percent) {
								// Fail
								KDIncreaseOfferFatigue(-20);
								KDGameData.CurrentDialogMsg = "OfferLeatherForce_Failure";
								KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(KDGameData.CurrentDialogMsgData.Data_r), 0, true, "Red");
							} else {
								KDIncreaseOfferFatigue(10);
							}
							return false;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
					"Dominant": {gag: true, playertext: "OfferDominant", response: "OfferDominantSuccess",
						clickFunction: (gagged) => {
							//KDAllySpeaker(30, true);
							let percent = KDGameData.CurrentDialogMsgValue.PercentOff;
							if (KDRandom() > percent) {
								// Fail
								KDIncreaseOfferFatigue(-20);
								KDGameData.CurrentDialogMsg = "OfferDominantFailure";
								KDAggroSpeaker(10);
							} else {
								KDIncreaseOfferFatigue(10);
								let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
								if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
									enemy.playWithPlayer = 0;
									enemy.playWithPlayerCD = 999;
									let amount = 10;
									if (!enemy.boundLevel) enemy.boundLevel = amount;
									else enemy.boundLevel += amount;
								}
								KinkyDungeonChangeRep("Ghost", -4);
							}
							return false;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
				},
			},
		}
	},
	"OfferRopes": {
		response: "Default",
		clickFunction: (gagged) => {
			if (KinkyDungeonGetRestraintsWithShrine("Rope").length > 0) {
				KDGameData.CurrentDialogMsg = "OfferRopesExtra";
			}
			KinkyDungeonSetFlag("BondageOffer",  5);
			return false;
		},
		options: {
			"Yes": {gag: true, playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					return false;
				},
				options: {
					"Yes": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KDPleaseSpeaker(0.005);
							KinkyDungeonChangeRep("Rope", 1);
							KinkyDungeonChangeRep("Ghost", 2);
							for (let i = 0; i < 3; i++) {
								let r = KinkyDungeonGetRestraint({tags: ["ropeRestraints", "ropeRestraints", "ropeRestraintsWrist"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
								if (r) KinkyDungeonAddRestraintIfWeaker(r, 0, true);
							}
							KDGameData.CurrentDialogMsgData = {
							};
							KDGameData.CurrentDialogMsgValue.PercentOff = KDOffensiveDialogueSuccessChance(KDBasicCheck(["Rope"], [])
								- (KDDialogueGagged() ? 60 : 40)
								- (KinkyDungeonStatsChoice.has("Dominant") ? 0 : 40)
								- KDPersonalitySpread(-25, 0, KinkyDungeonStatsChoice.has("Dominant") ? 15 : 35));
							KDGameData.CurrentDialogMsgData.OFFPERC = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.PercentOff)}%`;
							return false;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
					"No": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							let diff = 75;
							if (KinkyDungeonStatsChoice.has("Dominant")) diff = 0;
							if (KDBasicCheck(["Rope"], ["Ghost"]) <= diff) {
								KDGameData.CurrentDialogStage = "Force";
								KDGameData.CurrentDialogMsg = "OfferRopesForceYes";
								KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck(["Rope"], ["Ghost"]));
								KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
							}
							KinkyDungeonChangeRep("Ghost", -1);
							return false;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
					"Dominant": {gag: true, playertext: "OfferDominant", response: "OfferDominantSuccess",
						clickFunction: (gagged) => {
							//KDAllySpeaker(30, true);
							let percent = KDGameData.CurrentDialogMsgValue.PercentOff;
							if (KDRandom() > percent) {
								// Fail
								KDIncreaseOfferFatigue(-20);
								KDGameData.CurrentDialogMsg = "OfferDominantFailure";
								KDAggroSpeaker(10);
							} else {
								KDIncreaseOfferFatigue(10);
								let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
								if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
									enemy.playWithPlayer = 0;
									enemy.playWithPlayerCD = 999;
									let amount = 10;
									if (!enemy.boundLevel) enemy.boundLevel = amount;
									else enemy.boundLevel += amount;
								}
								KinkyDungeonChangeRep("Ghost", -4);
							}
							return false;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
				},
			},
			"No": {gag: true, playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					let diff = 60;
					if (KinkyDungeonStatsChoice.has("Dominant")) diff = 0;
					if (KDBasicCheck(["Rope"], ["Ghost"]) <= diff) {
						KDGameData.CurrentDialogStage = "Force";
						KDGameData.CurrentDialogMsg = "";
						KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck(["Rope"], ["Ghost"]));
						KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
					}

					KDGameData.CurrentDialogMsgValue.PercentOff = KDOffensiveDialogueSuccessChance(KDBasicCheck(["Rope"], [])
						- (KDDialogueGagged() ? 60 : 40)
						- (KinkyDungeonStatsChoice.has("Dominant") ? 0 : 40)
						- KDPersonalitySpread(-25, 0, KinkyDungeonStatsChoice.has("Dominant") ? 15 : 35));
					KDGameData.CurrentDialogMsgData.OFFPERC = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.PercentOff)}%`;
					KinkyDungeonChangeRep("Ghost", -1);
					return false;
				},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}},
			},
			"Force": {gag: true, playertext: "Default", response: "Default",
				prerequisiteFunction: (gagged) => {return false;},
				options: {
					"Yes": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KDPleaseSpeaker(0.004);
							KinkyDungeonChangeRep("Ghost", 2);
							for (let i = 0; i < 3; i++) {
								let r = KinkyDungeonGetRestraint({tags: ["ropeRestraints", "ropeRestraints", "ropeRestraintsWrist"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
								if (r) KinkyDungeonAddRestraintIfWeaker(r, 0, true);
							}
							return false;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},},
					"No": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							let percent = KDGameData.CurrentDialogMsgValue.Percent;
							KinkyDungeonChangeRep("Ghost", -1);
							if (KDRandom() > percent) {
								// Fail
								KDIncreaseOfferFatigue(-20);
								KDGameData.CurrentDialogMsg = "OfferRopesForce_Failure";
								for (let i = 0; i < 5; i++) {
									let r = KinkyDungeonGetRestraint({tags: ["ropeRestraints", "ropeRestraints", "ropeRestraintsWrist"]}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
									if (r) KinkyDungeonAddRestraintIfWeaker(r, 0, true);
								}
							} else {
								KDIncreaseOfferFatigue(10);
							}
							return false;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
					"Dominant": {gag: true, playertext: "OfferDominant", response: "OfferDominantSuccess",
						clickFunction: (gagged) => {
							//KDAllySpeaker(30, true);
							let percent = KDGameData.CurrentDialogMsgValue.PercentOff;
							if (KDRandom() > percent) {
								// Fail
								KDIncreaseOfferFatigue(-20);
								KDGameData.CurrentDialogMsg = "OfferDominantFailure";
								KDAggroSpeaker(10);
							} else {
								KDIncreaseOfferFatigue(10);
								let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
								if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
									enemy.playWithPlayer = 0;
									enemy.playWithPlayerCD = 999;
									let amount = 10;
									if (!enemy.boundLevel) enemy.boundLevel = amount;
									else enemy.boundLevel += amount;
								}
								KinkyDungeonChangeRep("Ghost", -4);
							}
							return false;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
				},
			},
		}
	},
	"OfferWolfgirl": KDRecruitDialogue("OfferWolfgirl", "Nevermere", "Wolfgirl", "Metal", ["wolfGear"], 5, ["wolfGear", "wolfRestraints"], 8, ["wolfgirl", "trainer"], undefined, undefined, 0.5),
	"OfferMaid": KDRecruitDialogue("OfferMaid", "Maidforce", "Maid", "Illusion", ["maidVibeRestraints"], 5, ["maidRestraints"], 13, ["maid"], undefined, ["submissive"], 0.5),
	"AngelHelp": {
		response: "Default",
		clickFunction: (gagged) => {
			KinkyDungeonSetFlag("AngelHelp", 55);
			return false;
		},
		options: {
			"Knife": {
				playertext: "Default", response: "AngelHelpKnife",
				prerequisiteFunction: (gagged) => {
					return !KinkyDungeonFlags.get("AngelHelped") && !KinkyDungeonInventoryGet("Knife");
				},
				clickFunction: (gagged) => {
					KinkyDungeonInventoryAddWeapon("Knife");
					KinkyDungeonSetFlag("AngelHelped", 5);
					return false;
				},
				leadsToStage: "", dontTouchText: true,
			},
			"Pick": {
				playertext: "Default", response: "AngelHelpPick",
				prerequisiteFunction: (gagged) => {
					return !KinkyDungeonFlags.get("AngelHelped");
				},
				clickFunction: (gagged) => {
					KinkyDungeonLockpicks += 3;
					KinkyDungeonSetFlag("AngelHelped", 5);
					return false;
				},
				leadsToStage: "", dontTouchText: true,
			},
			"BlueKey": {
				playertext: "Default", response: "AngelHelpBlueKey",
				prerequisiteFunction: (gagged) => {
					return !KinkyDungeonFlags.get("AngelHelped");
				},
				clickFunction: (gagged) => {
					KinkyDungeonBlueKeys += 1;
					KinkyDungeonSetFlag("AngelHelped", 5);
					return false;
				},
				leadsToStage: "", dontTouchText: true,
			},
			"Leave": {playertext: "Leave", exitDialogue: true},
		}
	},
	"Fuuka": {
		response: "Default",
		clickFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				enemy.hostile = 9999;
				enemy.AI = 'hunt';
				KinkyDungeonSetFlag("BossDialogueFuuka", -1);
			}
			return false;
		},
		options: {
			"Aggressive": { gag: true,
				playertext: "Default", response: "Default",
				options: {
					"Question": {gagDisabled: true,
						playertext: "Default", response: "Default",
						options: {
							"Brat": {
								playertext: "Default", response: "Default",
								options: {
									"Proceed": {
										playertext: "Default", response: "Default",
										leadsToStage: "PostIntro",
									}
								}
							},
							"Proceed": {
								playertext: "Default", response: "Default",
								leadsToStage: "PostIntro",
							},
						}
					},
					"Proceed": {gagDisabled: true,
						playertext: "Default", response: "Default",
						leadsToStage: "PostIntro",
					},
					"ProceedGag": {gagRequired: true,
						playertext: "Default", response: "Default",
						options: {
							"Proceed": {
								playertext: "Default", response: "Default",
								leadsToStage: "PostIntro",
							},
						}
					},
					"Brat": {gagDisabled: true,
						playertext: "Default", response: "Default",
						options: {
							"Proceed": {gag: true,
								playertext: "Default", response: "Default",
								leadsToStage: "PostIntro",
							},
							"Proceed2": {
								playertext: "Default", response: "Default",
								leadsToStage: "PostIntro",
							},
						}
					},
				}
			},
			"Defensive": { gag: true,
				playertext: "Default", response: "Default",
				options: {
					"Question": {gagDisabled: true,
						playertext: "Default", response: "Default",
						options: {
							"Question": {
								playertext: "Default", response: "Default",
								options: {
									"Proceed": {
										playertext: "Default", response: "Default",
										leadsToStage: "PostIntro",
									}
								}
							},
							"Proceed": {
								playertext: "Default", response: "Default",
								leadsToStage: "PostIntro",
							},
						}
					},
					"Proceed": {gagDisabled: true,
						playertext: "Default", response: "Default",
						leadsToStage: "PostIntro",
					},
					"ProceedGag": {gagRequired: true,
						playertext: "Default", response: "Default",
						options: {
							"Proceed": {
								playertext: "Default", response: "Default",
								leadsToStage: "PostIntro",
							},
						}
					},
					"Brat": {gagDisabled: true,
						playertext: "Default", response: "Default",
						options: {
							"Proceed": {gag: true,
								playertext: "Default", response: "Default",
								leadsToStage: "PostIntro",
							},
							"Proceed2": {
								playertext: "Default", response: "Default",
								leadsToStage: "PostIntro",
							},
						}
					},
				}
			},
			"Brat": { gag: true,
				playertext: "Default", response: "Default",
				options: {
					"Question": {gagDisabled: true,
						playertext: "Default", response: "Default",
						options: {
							"Question": {
								playertext: "Default", response: "Default",
								options: {
									"Proceed": {
										playertext: "Default", response: "Default",
										leadsToStage: "PostIntro",
									}
								}
							},
							"Proceed": {
								playertext: "Default", response: "Default",
								leadsToStage: "PostIntro",
							},
						}
					},
					"Proceed": {gagDisabled: true,
						playertext: "Default", response: "Default",
						leadsToStage: "PostIntro",
					},
					"ProceedGag": {gagRequired: true,
						playertext: "Default", response: "Default",
						options: {
							"Proceed": {
								playertext: "Default", response: "Default",
								leadsToStage: "PostIntro",
							},
						}
					},
					"Brat": {gagDisabled: true,
						playertext: "Default", response: "Default",
						options: {
							"Proceed": {gag: true,
								playertext: "Default", response: "Default",
								leadsToStage: "PostIntro",
							},
							"Proceed2": {
								playertext: "Default", response: "Default",
								leadsToStage: "PostIntro",
							},
						}
					},
				}
			},
			"Dom": { gag: true,
				playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					KinkyDungeonChangeRep("Ghost", -2);
					return false;
				},
				options: {
					"Question": {gagDisabled: true,
						playertext: "Default", response: "Default",
						options: {
							"Question": {
								playertext: "Default", response: "Default",
								options: {
									"Proceed": {
										playertext: "Default", response: "Default",
										leadsToStage: "PostIntro",
									}
								}
							},
							"Proceed": {
								playertext: "Default", response: "Default",
								leadsToStage: "PostIntro",
							},
						}
					},
					"Proceed": {gagDisabled: true,
						playertext: "Default", response: "Default",
						leadsToStage: "PostIntro",
					},
					"ProceedGag": {gagRequired: true,
						playertext: "Default", response: "Default",
						options: {
							"Proceed": {
								playertext: "Default", response: "Default",
								leadsToStage: "PostIntro",
							},
						}
					},
					"Brat": {gag: true,
						playertext: "Default", response: "Default",
						options: {
							"Proceed": {gag: true,
								playertext: "Default", response: "Default",
								leadsToStage: "PostIntro",
							},
							"Proceed2": {
								playertext: "Default", response: "Default",
								leadsToStage: "PostIntro",
							},
						}
					},
				}
			},
			"Sub": { gag: true,
				playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					KinkyDungeonChangeRep("Ghost", 2);
					return false;
				},
				options: {
					"Question": {gagDisabled: true,
						playertext: "Default", response: "Default",
						options: {
							"Question": {
								playertext: "Default", response: "Default",
								options: {
									"Proceed": {
										playertext: "Default", response: "Default",
										leadsToStage: "PostIntro",
									}
								}
							},
							"Proceed": {
								playertext: "Default", response: "Default",
								leadsToStage: "PostIntro",
							},
						}
					},
					"Proceed": {gagDisabled: true,
						playertext: "Default", response: "Default",
						leadsToStage: "PostIntro",
					},
					"ProceedGag": {gagRequired: true,
						playertext: "Default", response: "Default",
						options: {
							"Proceed": {
								playertext: "Default", response: "Default",
								leadsToStage: "PostIntro",
							},
						}
					},
					"Brat": {gag: true,
						playertext: "Default", response: "Default",
						options: {
							"Proceed": {gag: true,
								playertext: "Default", response: "Default",
								leadsToStage: "PostIntro",
							},
							"Proceed2": {
								playertext: "Default", response: "Default",
								leadsToStage: "PostIntro",
							},
						}
					},
				}
			},
			"Attack": {playertext: "Default", exitDialogue: true},

			"PostIntro": {
				prerequisiteFunction: (gagged) => {return false;},
				playertext: "Default", response: "Default",
				options: {
					"Brat": {gag: true,
						playertext: "Default", response: "FuukaPostIntro_Brat",
						leadsToStage: "Fight",
					},
					"Dom": {gag: true,
						playertext: "Default", response: "FuukaPostIntro_Dom",
						leadsToStage: "Fight",
						clickFunction: (gagged) => {
							KinkyDungeonChangeRep("Ghost", -2);
							return false;
						}
					},
					"Sub": {gag: true,
						playertext: "Default", response: "FuukaPostIntro_Sub",
						leadsToStage: "Fight",
						clickFunction: (gagged) => {
							KinkyDungeonChangeRep("Ghost", 2);
							return false;
						}
					},
					"Normal": {gag: true,
						playertext: "Default", response: "FuukaPostIntro_Normal",
						leadsToStage: "Fight",
					},
				}
			},
			"Fight": {
				prerequisiteFunction: (gagged) => {return false;},
				playertext: "Default", dontTouchText: true,
				options: {
					"Fight1": {gag: true,
						playertext: "Default", exitDialogue: true,
					},
					"Fight2": {gag: true,
						playertext: "Default", exitDialogue: true,
					},
					"Fight3": {gag: true,
						playertext: "Default", exitDialogue: true,
					},
				}
			}
		}
	},
	"FuukaLose": { // Player loses to Fuuka
		response: "Default",
		clickFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				enemy.hostile = 0;
				enemy.ceasefire = 4;
				KinkyDungeonSetFlag("BossUnlocked", -1);
			}
			return false;
		},
		options: {
			"Accept": { gag: true,
				playertext: "Default", response: "Default",
				options: {
					"Continue1": {
						playertext: "FuukaLose_Continue1", response: "Default",
						leadsToStage: "Finish",
						clickFunction: (gagged) => {
							KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("MikoCollar"), 0, true);
							return false;
						},
					},
					"Continue2": {
						playertext: "FuukaLose_Continue2", response: "Default",
						leadsToStage: "Finish",
						clickFunction: (gagged) => {
							KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("MikoCollar"), 0, true);
							return false;
						},
					},
					"Continue3": {
						playertext: "FuukaLose_Continue3", response: "Default",
						leadsToStage: "Finish",
						clickFunction: (gagged) => {
							KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("MikoCollar"), 0, true);
							return false;
						},
					},
				}
			},
			"Deny": { gag: true,
				playertext: "Default", response: "Default",
				options: {
					"Continue1": {
						playertext: "FuukaLose_Continue1", response: "Default",
						leadsToStage: "Finish",
						clickFunction: (gagged) => {
							KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("MikoCollar"), 0, true);
							return false;
						},
					},
					"Continue2": {
						playertext: "FuukaLose_Continue2", response: "Default",
						leadsToStage: "Finish",
						clickFunction: (gagged) => {
							KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("MikoCollar"), 0, true);
							return false;
						},
					},
					"Continue3": {
						playertext: "FuukaLose_Continue3", response: "Default",
						leadsToStage: "Finish",
						clickFunction: (gagged) => {
							KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("MikoCollar"), 0, true);
							return false;
						},
					},
				}
			},
			"Finish": {
				prerequisiteFunction: (gagged) => {return false;},
				playertext: "Default", response: "FuukaLoseFinish",
				options: {
					"Leave": {
						playertext: "Leave", response: "Default",
						exitDialogue: true,
					},
				}
			}
		}
	},
	"FuukaStage2": { // Player defeats fuuka's first form
		response: "Default",
		options: {
			"Leave": {
				playertext: "Leave", response: "Default",
				exitDialogue: true,
			},
		}
	},
	"FuukaWin": { // Player beats Fuuka
		response: "Default",
		clickFunction: (gagged) => {
			KinkyDungeonSetFlag("BossUnlocked", -1);
			return false;
		},
		options: {
			"Leave": {
				playertext: "Leave", response: "Default",
				exitDialogue: true,
			},
			"Accept": {
				playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("MikoCollar"), 0, true);
					KinkyDungeonAddGold(1000);
					if (KinkyDungeonIsPlayer()) {
						KDUnlockPerk("FuukaCollar");
					}
					return false;
				},
				options: {
					"Leave": {
						playertext: "Leave", response: "Default",
						exitDialogue: true,
					},
				}
			},
			"Gag": {
				playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					KinkyDungeonChangeRep("Ghost", -5);
					return false;
				},
				options: {
					"Leave": {
						playertext: "Leave", response: "Default",
						exitDialogue: true,
					},
				}
			},
		}
	},
	"PotionSell": KDShopDialogue("PotionSell", ["PotionFrigid", "PotionStamina", "PotionMana", "PotionInvisibility"], [], ["witch", "apprentice", "alchemist", "human", "dragon"], 0.2),
	"ElfCrystalSell": KDShopDialogue("ElfCrystalSell", ["PotionMana", "ElfCrystal", "EarthRune", "WaterRune", "IceRune"], [], ["elf"], 0.25),
	"ScrollSell": KDShopDialogue("ScrollSell", ["ScrollArms", "ScrollVerbal", "ScrollLegs", "ScrollPurity"], [], ["witch", "apprentice", "elf", "wizard", "dressmaker"], 0.15),
	"WolfgirlSell": KDShopDialogue("WolfgirlSell", ["MistressKey", "AncientPowerSource", "AncientPowerSourceSpent", "EnchantedGrinder"], [], ["trainer", "alchemist", "human"], 0.2),
	"NinjaSell": KDShopDialogue("NinjaSell", ["SmokeBomb", "Bola", "Bomb", "PotionInvisibility"], [], ["ninja", "bountyhunter"], 0.2),
	"GhostSell": KDShopDialogue("GhostSell", ["Ectoplasm", "PotionInvisibility", "ElfCrystal"], [], ["alchemist", "witch", "apprentice", "dressmaker", "dragon"], 0.1),
	// TODO magic book dialogue in which you can read forward and there are traps
	"GenericAlly": KDAllyDialogue("GenericAlly", [], [], [], 1),
};



function KDAllyDialogue(name, requireTags, requireSingleTag, excludeTags, weight) {
	/**
		 * @type {KinkyDialogue}
		 */
	let dialog = {
		response: "Default",
		options: {},
	};
	dialog.options.Leave = {playertext: "Leave", exitDialogue: true,
		clickFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				KinkyDungeonSetEnemyFlag(enemy, "NoShop", 9999);
			}
			return false;
		},
	};
	dialog.options.Attack = {playertext: name + "Attack", response: "Default",
		options: {
			"Confirm": {playertext: name + "Attack_Confirm", response: "Default",
				clickFunction: (gagged) => {
					let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
					if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
						if (!enemy.Enemy.allied) {
							enemy.hostile = 100;
							if (!KinkyDungeonHiddenFactions.includes(KDGetFactionOriginal(enemy))) {
								KinkyDungeonChangeRep("Ghost", -5);
								KinkyDungeonChangeFactionRep(KDGetFactionOriginal(enemy), -0.06);
							}
						} else {
							enemy.hp = 0;
						}
					}
					return false;
				},
				exitDialogue: true,
			},
			"Leave": {playertext: name + "Attack_Leave", response: "Default",
				leadsToStage: "",
			},
		}
	};
	/*dialog.options.LetMePass = {playertext: name + "LetMePass", response: "Default",
		prerequisiteFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				return !KinkyDungeonFlags.has("passthrough");
			}
			return false;
		},
		clickFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				if (KinkyDungeonFlags.has("LetMePass")) {
					KinkyDungeonSetEnemyFlag(enemy, "passthrough", 8);
					KDGameData.CurrentDialog = "";
					KDGameData.CurrentDialogStage = "";
					KinkyDungeonSetFlag("LetMePass", 30);
				}
			}
			return false;
		},
		options: {
			"Confirm": {playertext: name + "LetMePass_Confirm", response: "Default",
				clickFunction: (gagged) => {
					let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
					if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
						KinkyDungeonSetEnemyFlag(enemy, "passthrough", 8);
						if (KinkyDungeonFlags.has("LetMePass")) {
							KDGameData.CurrentDialog = "";
							KDGameData.CurrentDialogStage = "";
						}
						KinkyDungeonSetFlag("LetMePass", 30);
					}
					return false;
				},
				exitDialogue: true,
			},
			"ConfirmAll": {playertext: name + "LetMePass_ConfirmAll", response: "Default",
				clickFunction: (gagged) => {
					let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
					if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
						KinkyDungeonSetFlag("Passthrough", 8);
					}
					return false;
				},
				exitDialogue: true,
			},
			"Leave": {playertext: name + "LetMePass_Leave", response: "Default",
				leadsToStage: "",
			},
		}
	};*/
	dialog.options.StopFollowingMe = {playertext: name + "StopFollowingMe", response: "Default",
		prerequisiteFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				return KDAllied(enemy) && !KDEnemyHasFlag(enemy, "NoFollow");
			}
			return false;
		},
		clickFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				KinkyDungeonSetEnemyFlag(enemy, "NoFollow", 9999);
			}
			return false;
		},
		leadsToStage: "", dontTouchText: true,
	};
	dialog.options.FollowMe = {playertext: name + "FollowMe", response: "Default",
		prerequisiteFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				return KDAllied(enemy) && KDEnemyHasFlag(enemy, "NoFollow") && !KDEnemyHasFlag(enemy, "Shop");
			}
			return false;
		},
		clickFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				if (!KDEnemyHasFlag(enemy, "NoStay") && (KDRandom() < (70 - KinkyDungeonGoddessRep.Ghost)/100 * 0.35 * KDEnemyHelpfulness(enemy) || enemy.Enemy.allied)) {
					KinkyDungeonSetEnemyFlag(enemy, "NoFollow", 0);
				} else {
					KDGameData.CurrentDialogMsg = name + "StayHere_Fail";
					KinkyDungeonSetEnemyFlag(enemy, "NoStay", 100);
				}
			}
			return false;
		},
		leadsToStage: "", dontTouchText: true,
	};
	dialog.options.DontStayHere = {playertext: name + "DontStayHere", response: "Default",
		prerequisiteFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				return !KDHostile(enemy) && KDEnemyHasFlag(enemy, "StayHere");
			}
			return false;
		},
		clickFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				KinkyDungeonSetEnemyFlag(enemy, "StayHere", 0);
			}
			return false;
		},
		leadsToStage: "", dontTouchText: true,
	};
	dialog.options.StayHere = {playertext: name + "StayHere", response: "Default",
		prerequisiteFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				return !KDHostile(enemy) && !KDEnemyHasFlag(enemy, "StayHere") && !KDEnemyHasFlag(enemy, "Shop");
			}
			return false;
		},
		clickFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				if (!KDEnemyHasFlag(enemy, "NoStay") && (KDRandom() < (50 - KinkyDungeonGoddessRep.Ghost)/100 * KDEnemyHelpfulness(enemy) * (KDAllied(enemy) ? 4.0 : 0.25) || enemy.Enemy.allied)) {
					KinkyDungeonSetEnemyFlag(enemy, "StayHere", -1);
					enemy.gx = enemy.x;
					enemy.gy = enemy.y;
				} else {
					KDGameData.CurrentDialogMsg = name + "StayHere_Fail";
					KinkyDungeonSetEnemyFlag(enemy, "NoStay", 100);
				}
			}
			return false;
		},
		leadsToStage: "", dontTouchText: true,
	};
	dialog.options.Aggressive = {playertext: name + "Aggressive", response: "Default",
		prerequisiteFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				return !KDHostile(enemy) && KDEnemyHasFlag(enemy, "Defensive");
			}
			return false;
		},
		clickFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				KinkyDungeonSetEnemyFlag(enemy, "Defensive", 0);
			}
			return false;
		},
		leadsToStage: "", dontTouchText: true,
	};
	dialog.options.Defensive = {playertext: name + "Defensive", response: "Default",
		prerequisiteFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				return !KDHostile(enemy) && !KDEnemyHasFlag(enemy, "Defensive") && !KDEnemyHasFlag(enemy, "Shop");
			}
			return false;
		},
		clickFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				KinkyDungeonSetEnemyFlag(enemy, "Defensive", -1);
			}
			return false;
		},
		leadsToStage: "", dontTouchText: true,
	};
	dialog.options.HelpMe = {playertext: name + "HelpMe", response: "Default",
		prerequisiteFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				return !KDHostile(enemy) && enemy.Enemy.bound && !enemy.Enemy.tags.has("nohelp") && !KDEnemyHasFlag(enemy, "NoHelp") && !KDEnemyHasFlag(enemy, "HelpMe") && KinkyDungeonAllRestraint().length > 0;
			}
			return false;
		},
		options: {
			"Confirm": {playertext: name + "HelpMe_Confirm", response: "Default",
				clickFunction: (gagged) => {
					let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
					if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
						if (!KDEnemyHasFlag(enemy, "NoHelp") && KDRandom() < (75 - KinkyDungeonGoddessRep.Ghost)/100 * (KDAllied(enemy) ? 2.0 : 1.0)) {
							KinkyDungeonChangeRep("Ghost", 3);
							KinkyDungeonSetEnemyFlag(enemy, "HelpMe", 20);
						} else {
							KDGameData.CurrentDialogMsg = name + "HelpMe_Fail";
							KinkyDungeonSetEnemyFlag(enemy, "NoHelp", 100);
							KinkyDungeonChangeRep("Ghost", 1);
						}
					}
					return false;
				},
				leadsToStage: "",
				dontTouchText: true,
			},
			"Leave": {playertext: name + "HelpMe_Leave", response: "Default",
				leadsToStage: "",
			},
		}
	};
	dialog.options.DontHelpMe = {playertext: name + "DontHelpMe", response: "Default",
		prerequisiteFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				return enemy.Enemy.bound && !enemy.Enemy.tags.has("nohelp") && KDEnemyHasFlag(enemy, "NoHelp") && KDEnemyHasFlag(enemy, "HelpMe") && KinkyDungeonAllRestraint().length > 0;
			}
			return false;
		},
		options: {
			"Confirm": {playertext: name + "DontHelpMe_Confirm", response: "Default",
				clickFunction: (gagged) => {
					let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
					if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
						KinkyDungeonSetEnemyFlag(enemy, "HelpMe", 0);
					}
					return false;
				},
				exitDialogue: true,
			},
			"Leave": {playertext: name + "DontHelpMe_Leave", response: "Default",
				leadsToStage: "",
			},
		}
	};
	dialog.options.Shop = {playertext: name + "Shop", response: "Default",
		prerequisiteFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				return KDEnemyHasFlag(enemy, "Shop");
			}
			return false;
		},
		clickFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				for (let shop of KDShops) {
					if (KDEnemyHasFlag(enemy, shop.name)) {
						KDStartDialog(shop.name, enemy.Enemy.name, true, enemy.personality, enemy);
						return true;
					}
				}
			}
		},
		exitDialogue: true,
	};
	KDAllyDialog.push({name: name, tags: requireTags, singletag: requireSingleTag, excludeTags: excludeTags, weight: weight});
	return dialog;
}

// ["wolfGear", "wolfRestraints"]
function KDRecruitDialogue(name, faction, outfitName, goddess, restraints, restraintscount, restraintsAngry, restraintscountAngry, requireTags, requireSingleTag, excludeTags, chance) {
	/**
	 * @type {KinkyDialogue}
	 */
	let recruit = {
		response: "Default",
		clickFunction: (gagged) => {
			KinkyDungeonSetFlag(name, 100);
			return false;
		},
		options: {
			"Yes": {gag: true, playertext: "Default", response: "Default",
				options: {
					"Yes": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KDPleaseSpeaker(0.1);
							KinkyDungeonChangeRep("Ghost", 2);
							for (let i = 0; i < restraintscount; i++) {
								let r = KinkyDungeonGetRestraint({tags: restraints}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
								if (r) KinkyDungeonAddRestraintIfWeaker(r, 0, true);
							}
							let outfit = {name: outfitName, type: Outfit};
							if (!KinkyDungeonInventoryGet(outfitName)) KinkyDungeonInventoryAdd(outfit);
							if (KinkyDungeonInventoryGet("OutfitDefault")) KinkyDungeonInventoryRemove(KinkyDungeonInventoryGet("OutfitDefault"));
							KinkyDungeonSetDress(outfitName, outfitName);
							KDChangeFactionRelation("Player", faction, 0.4, true);
							KDChangeFactionRelation("Player", faction, -0.2);
							KinkyDungeonSlowMoveTurns = 3;
							KinkyDungeonSleepTime = CommonTime() + 200;
							KinkyDungeonSetFlag(name, 100);
							return false;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
					"No": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							let diff = KinkyDungeonStatsChoice.has("Dominant") ? 0 : 35;
							if (KDBasicCheck([goddess], ["Ghost"]) <= diff) {
								KDGameData.CurrentDialogStage = "Force";
								KDGameData.CurrentDialogMsg = name + "ForceYes";
								KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck([goddess], ["Ghost"]));
								KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
							}
							KinkyDungeonChangeRep("Ghost", -1);
							KinkyDungeonSetFlag(name, 100);
							return false;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
				},
			},
			"No": {gag: true, playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					let diff = KinkyDungeonStatsChoice.has("Dominant") ? 0 : 45;
					if (KDBasicCheck(["Metal"], ["Ghost"]) <= diff) {
						KDGameData.CurrentDialogStage = "Force";
						KDGameData.CurrentDialogMsg = "";
						KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck([goddess], ["Ghost"]));
						KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
					}
					KinkyDungeonChangeRep("Ghost", -1);
					KinkyDungeonSetFlag(name, 100);
					return false;
				},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}},
			},
			"Force": {gag: true, playertext: "Default", response: "Default",
				prerequisiteFunction: (gagged) => {return false;},
				options: {
					"Yes": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							KDPleaseSpeaker(0.08);
							KinkyDungeonChangeRep("Ghost", 2);
							for (let i = 0; i < restraintscount; i++) {
								let r = KinkyDungeonGetRestraint({tags: restraints}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
								if (r) KinkyDungeonAddRestraintIfWeaker(r, 0, true);
							}
							let outfit = {name: outfitName, type: Outfit};
							if (!KinkyDungeonInventoryGet(outfitName)) KinkyDungeonInventoryAdd(outfit);
							if (KinkyDungeonInventoryGet("OutfitDefault")) KinkyDungeonInventoryRemove(KinkyDungeonInventoryGet("OutfitDefault"));
							KinkyDungeonSetDress(outfitName, outfitName);
							KDChangeFactionRelation("Player", faction, 0.4, true);
							KDChangeFactionRelation("Player", faction, -0.2);
							KinkyDungeonSlowMoveTurns = 3;
							KinkyDungeonSleepTime = CommonTime() + 200;
							KinkyDungeonSetFlag(name, 100);
							return false;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},},
					"No": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							let percent = KDGameData.CurrentDialogMsgValue.Percent;
							KinkyDungeonChangeRep("Ghost", -1);
							if (KDRandom() > percent) {
								// Fail
								KDIncreaseOfferFatigue(-20);
								KDGameData.CurrentDialogMsg = name + "Force_Failure";
								for (let i = 0; i < restraintscountAngry; i++) {
									let r = KinkyDungeonGetRestraint({tags: restraintsAngry}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
									if (r) KinkyDungeonAddRestraintIfWeaker(r, 0, true);
								}
								let outfit = {name: outfitName, type: Outfit};
								if (!KinkyDungeonInventoryGet(outfitName)) KinkyDungeonInventoryAdd(outfit);
								if (KinkyDungeonInventoryGet("OutfitDefault")) KinkyDungeonInventoryRemove(KinkyDungeonInventoryGet("OutfitDefault"));
								KinkyDungeonSetDress(outfitName, outfitName);
								KinkyDungeonSlowMoveTurns = 3;
								KinkyDungeonSleepTime = CommonTime() + 200;
							} else {
								KDIncreaseOfferFatigue(10);
								let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
								if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
									enemy.hostile = 100;
									KinkyDungeonChangeRep(goddess, -2);
								}
							}
							KinkyDungeonSetFlag(name, 100);
							return false;
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},},
				},
			},
		}
	};

	KDRecruitDialog.push({name: name, outfit: outfitName, tags: requireTags, singletag: requireSingleTag, excludeTags: excludeTags, chance: chance});
	return recruit;
}

let KDMaxSellItems = 6;
function KDShopDialogue(name, items, requireTags, requireSingleTag, chance) {
	/**
	 * @type {KinkyDialogue}
	 */
	let shop = {
		shop: true,
		response: "Default",
		clickFunction: (gagged) => {
			/*let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				KinkyDungeonSetEnemyFlag(enemy, "Shop", 0);
			}*/
			for (let i = 0; i < items.length; i++) {
				let item = items[i];
				if (KinkyDungeonGetRestraintByName(item)) {
					KDGameData.CurrentDialogMsgData["Item"+i] = TextGet("Restraint" + item);
					let power = KinkyDungeonGetRestraintByName(item).power;
					if (!power || power < 1) power = 1;
					KDGameData.CurrentDialogMsgValue["ItemCost"+i] = 5 * Math.round((10 + 2 * Math.pow(power, 1.5))/5);
					KDGameData.CurrentDialogMsgData["ItemCost"+i] = "" + KDGameData.CurrentDialogMsgValue["ItemCost"+i];
				} else {
					KDGameData.CurrentDialogMsgData["Item"+i] = TextGet("KinkyDungeonInventoryItem" + item);
					KDGameData.CurrentDialogMsgValue["ItemCost"+i] = Math.round(KinkyDungeonItemCost(KinkyDungeonFindConsumable(item) ? KinkyDungeonFindConsumable(item) : KinkyDungeonFindWeapon(item), true, true) * 0.75);
					KDGameData.CurrentDialogMsgData["ItemCost"+i] = "" + KDGameData.CurrentDialogMsgValue["ItemCost"+i];
				}
			}
			return false;
		},
		options: {},
	};
	shop.options.Leave = {playertext: "Leave", exitDialogue: true,
		clickFunction: (gagged) => {
			let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
			if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
				KinkyDungeonSetEnemyFlag(enemy, "NoShop", 9999);
				KinkyDungeonSetEnemyFlag(enemy, "NoTalk", 8);
			}
			return false;
		},
	};
	shop.options.Attack = {gag: true, playertext: "ItemShopAttack", response: "Default",
		options: {
			"Confirm": {playertext: "ItemShopAttack_Confirm", response: "Default",
				clickFunction: (gagged) => {
					let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
					if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
						enemy.hostile = 100;
						KinkyDungeonChangeRep("Ghost", -5);
						if (!KinkyDungeonHiddenFactions.includes(KDGetFactionOriginal(enemy)))
							KinkyDungeonChangeFactionRep(KDGetFactionOriginal(enemy), -0.06);
					}
					return false;
				},
				exitDialogue: true,
			},
			"Leave": {playertext: "ItemShopAttack_Leave", response: "Default",
				leadsToStage: "",
			},
		}
	};

	for (let i = 0; i < items.length; i++) {
		let item = items[i];
		shop.options["Item" + i] = {playertext: "ItemShop" + i, response: name + item,
			prerequisiteFunction: (gagged) => {
				return KinkyDungeonInventoryGet(item) != undefined;
			},
			clickFunction: (gagged) => {
				let itemInv = KinkyDungeonInventoryGet(item);
				if (itemInv.type == Consumable)
					KinkyDungeonChangeConsumable(KDConsumable(itemInv), -1);
				else KinkyDungeonInventoryRemove(itemInv);
				let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
				if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
					let faction = KDGetFactionOriginal(enemy);
					if (!KinkyDungeonHiddenFactions.includes(faction)) {
						KinkyDungeonChangeFactionRep(faction, Math.max(0.0001, KDGameData.CurrentDialogMsgValue["ItemCost"+i] * 0.00005));
					}
				}
				KinkyDungeonAddGold(KDGameData.CurrentDialogMsgValue["ItemCost"+i]);
				return false;
			},
			leadsToStage: "", dontTouchText: true,
		};
	}
	KDShops.push({name: name, tags: requireTags, singletag: requireSingleTag, chance: chance});
	return shop;
}

/**
 *
 * @param {(firstRefused) => boolean} setupFunction - firstRefused is if the player said no first. Happens after the user clicks
 * @param {(firstRefused) => boolean} yesFunction - firstRefused is if the player said no then yes. Happens whenever the user submits
 * @param {(firstRefused) => boolean} noFunction - firstRefused is if the player said no then no. Happens whenever the user successfully avoids
 * @param {(firstRefused) => boolean} domFunction - firstRefused is if the player said no then no. Happens when the user clicks the Dominant response
 * @returns {KinkyDialogue}
 */
function KDYesNoTemplate(setupFunction, yesFunction, noFunction, domFunction) {
	/**
	 * @type {KinkyDialogue}
	 */
	let dialogue = {
		response: "Default",
		clickFunction: (gagged) => {
			KinkyDungeonSetFlag("BondageOffer", 5);
			return false;
		},
		options: {
			"Yes": {gag: true, playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					return setupFunction(false);
				},
				options: {
					"Yes": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							return yesFunction(false);
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
					"No": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							return noFunction(false);
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
					"Dominant": {gag: true, playertext: "OfferDominant", response: "OfferDominantSuccess",
						clickFunction: (gagged) => {
							return domFunction(false);
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
				},
			},
			"No": {gag: true, playertext: "Default", response: "Default",
				clickFunction: (gagged) => {
					return setupFunction(true);
				},
				options: {"Leave": {playertext: "Leave", exitDialogue: true}},
			},
			"Force": {gag: true, playertext: "Default", response: "Default",
				prerequisiteFunction: (gagged) => {return false;},
				options: {
					"Yes": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							return yesFunction(true);
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},},
					"No": {gag: true, playertext: "Default", response: "Default",
						clickFunction: (gagged) => {
							return noFunction(true);
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
					"Dominant": {gag: true, playertext: "OfferDominant", response: "OfferDominantSuccess",
						clickFunction: (gagged) => {
							return domFunction(true);
						},
						options: {"Leave": {playertext: "Leave", exitDialogue: true}},
					},
				},
			},
		}
	};


	return dialogue;
}

/**
 *
 * @param {string} name
 * @param {string[]} goddess
 * @param {string[]} antigoddess
 * @param {string[]} restraint
 * @param {number[]} diffSpread
 * @param {number[]} OffdiffSpread
 * @returns {KinkyDialogue}
 */
function KDYesNoSingle(name, goddess, antigoddess, restraint, diffSpread, OffdiffSpread) {
	return KDYesNoTemplate(
		(refused) => { // Setup function. This is run when you click Yes or No in the start of the dialogue
			// This is the restraint that the dialogue offers to add. It's selected from a set of tags. You can change the tags to change the restraint
			let r = KinkyDungeonGetRestraint({tags: restraint}, MiniGameKinkyDungeonLevel * 2, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
			if (r) {
				KDGameData.CurrentDialogMsgData = {
					"Data_r": r.name,
					"RESTRAINT": TextGet("Restraint" + r.name),
				};

				// Percent chance your dominant action ("Why don't you wear it instead?") succeeds
				// Based on a difficulty that is the sum of four lines
				// Dominant perk should help with this
				KDGameData.CurrentDialogMsgValue.PercentOff =
					KDOffensiveDialogueSuccessChance(KDBasicCheck(goddess, [])
					- (KDDialogueGagged() ? 60 : 40)
					- (KinkyDungeonStatsChoice.has("Dominant") ? 0 : 40)
					- KDPersonalitySpread(OffdiffSpread[0], OffdiffSpread[1], KinkyDungeonStatsChoice.has("Dominant") ? OffdiffSpread[3] : OffdiffSpread[2]));
				// Set the string to replace in the UI
				KDGameData.CurrentDialogMsgData.OFFPERC = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.PercentOff)}%`;
			}

			// If the player hits No first, this happens
			if (refused) {
				// Set up the difficulty of the check
				// This check basically determines if we switch to the Force stage where the speaker tries to force you
				let diff = KinkyDungeonStatsChoice.has("Dominant") ? diffSpread[1] : diffSpread[0];
				// Failure condition
				if (KDBasicCheck(goddess, antigoddess) <= diff) {
					KDGameData.CurrentDialogStage = "Force";
					KDGameData.CurrentDialogMsg = name + "ForceYes"; // This is different from OfferLatexForce_Yes, it's a more reluctant dialogue...
					// Set up percentage chance to resist
					KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck(goddess, antigoddess));
					KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
				}
				KinkyDungeonChangeRep(antigoddess[0], -1); // Reduce submission because of refusal
			}
			return false;
		},(refused) => { // Yes function. This happens if the user submits willingly
			KinkyDungeonChangeRep(goddess[0], 1);
			KDPleaseSpeaker(refused ? 0.004 : 0.005); // Less reputation if you refused
			KinkyDungeonChangeRep(antigoddess[0], refused ? 1 : 2); // Less submission if you refused
			KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(KDGameData.CurrentDialogMsgData.Data_r), 0, true, "Red");
			return false;
		},(refused) => { // No function. This happens when the user refuses.
			// The first half is basically the same as the setup function, but only if the user did not refuse the first yes/no
			if (!refused) {
				// This check basically determines if we switch to the Force stage where the speaker tries to force you
				let diff = KinkyDungeonStatsChoice.has("Dominant") ? diffSpread[3] : diffSpread[2]; // Slightly harder because we refused
				// Failure condition
				if (KDBasicCheck(goddess, antigoddess) <= diff) {
					KDGameData.CurrentDialogStage = "Force";
					KDGameData.CurrentDialogMsg = "";
					// Set up percentage chance to resist
					KDGameData.CurrentDialogMsgValue.Percent = KDAgilityDialogueSuccessChance(KDBasicCheck(goddess, antigoddess));
					KDGameData.CurrentDialogMsgData.PERCENT = `${Math.round(100 * KDGameData.CurrentDialogMsgValue.Percent)}%`;
				}
				KinkyDungeonChangeRep(antigoddess[0], -1);
			} else { // If the user refuses we use the already generated success chance and calculate the result
				let percent = KDGameData.CurrentDialogMsgValue.Percent;
				if (KDRandom() > percent) { // We failed! You get tied tight
					KDIncreaseOfferFatigue(-20);
					KDGameData.CurrentDialogMsg = name + "Force_Failure";
					KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(KDGameData.CurrentDialogMsgData.Data_r), 0, true, "Red");
				} else {
					KDIncreaseOfferFatigue(10);
				}
			}
			return false;
		},(refused) => { // Dom function. This is what happens when you try the dominant option
			// We use the already generated percent chance
			let percent = KDGameData.CurrentDialogMsgValue.PercentOff;
			if (KDRandom() > percent) {
				// If we fail, we aggro the enemy
				KDIncreaseOfferFatigue(-20);
				KDGameData.CurrentDialogMsg = "OfferDominantFailure";
				KDAggroSpeaker(10);
			} else {
				// If we succeed, we get the speaker enemy and bind them
				KDIncreaseOfferFatigue(10);
				let enemy = KinkyDungeonFindID(KDGameData.CurrentDialogMsgID);
				if (enemy && enemy.Enemy.name == KDGameData.CurrentDialogMsgSpeaker) {
					enemy.playWithPlayer = 0;
					enemy.playWithPlayerCD = 999;
					let amount = 10;
					if (!enemy.boundLevel) enemy.boundLevel = amount;
					else enemy.boundLevel += amount;
				}
				KinkyDungeonChangeRep(antigoddess[0], -4); // Reduce submission because dom
			}
			return false;
		});
}


/*

					"Leave": {playertext: "Leave", exitDialogue: true}
				clickFunction: (gagged) => {KinkyDungeonStartChase(undefined, "Refusal");},

clickFunction: (gagged) => {
	KinkyDungeonChangeRep("Ghost", 3);
},*/