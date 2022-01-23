"use strict";

let KinkyDungeonSlimeLevel = 0;
let KinkyDungeonSlimeLevelStart = 0;
let KinkyDungeonSlimeParts = [
	{group: "ItemHead", restraint: "SlimeHead"},
	{group: "ItemArms", restraint: "SlimeArms"},
	{group: "ItemHands", restraint: "SlimeHands"},
	{group: "ItemLegs", restraint: "SlimeLegs"},
	{group: "ItemFeet", restraint: "SlimeFeet"},
	{group: "ItemBoots", restraint: "SlimeBoots"},
];

function KinkyDungeonResetEventVariables() {
	KinkyDungeonSlimeLevel = 0;
}
function KinkyDungeonResetEventVariablesTick() {
	if (KinkyDungeonSlimeLevel < 0)
		KinkyDungeonSlimeLevel = 0;
	KinkyDungeonSlimeLevelStart = KinkyDungeonSlimeLevel;
}

function KinkyDungeonHandleInventoryEvent(Event, item, data) {
	if (Event == "tick") {
		for (let e of item.events) {
			if (e.type == "iceDrain" && e.power) {
				KinkyDungeonChangeMana(e.power);
				KinkyDungeonChangeStamina(e.power);
				KinkyDungeonSendTextMessage(1, TextGet("KinkyDungeonIceDrain"), "lightblue", 2);
			}


			if (e.type == "slimeSpread") {
				KinkyDungeonSlimeLevel = Math.max(KinkyDungeonSlimeLevel, KinkyDungeonSlimeLevelStart + e.power);
				if (KinkyDungeonSlimeLevel >= 0.99999) {
					KinkyDungeonSlimeLevel = 0;
					KinkyDungeonSlimeLevelStart = -100;
					let slimedParts = [];
					let potentialSlimeParts = [];
					for (let inv of KinkyDungeonRestraintList()) {
						if (inv.restraint && inv.restraint.slimeLevel > 0) {
							slimedParts.push({name: inv.restraint.name, group: inv.restraint.Group, level: inv.restraint.slimeLevel});
						}
					}
					for (let slime of slimedParts) {
						let index = -1;
						for (let i = 0; i < KinkyDungeonSlimeParts.length; i++) if (KinkyDungeonSlimeParts[i].group == slime.group) {index = i; break;}
						if (index >= 0) {
							let slime2 = undefined;
							let slime3 = undefined;
							if (index > 0) {
								for (let s of potentialSlimeParts) if (s.group == KinkyDungeonSlimeParts[index-1].group && !s.level > slime.level) {slime2 = s; break;}
								if (!slime2) potentialSlimeParts.push({group: KinkyDungeonSlimeParts[index-1].group, restraint: KinkyDungeonSlimeParts[index-1].restraint, level: slime.level});
							}
							if (index < KinkyDungeonSlimeParts.length - 1) {
								for (let s of potentialSlimeParts) if (s.group == KinkyDungeonSlimeParts[index+1].group && !s.level > slime.level) {slime3 = s; break;}
								if (!slime3) potentialSlimeParts.push({group: KinkyDungeonSlimeParts[index+1].group, restraint: KinkyDungeonSlimeParts[index+1].restraint, level: slime.level});
							}
						}
					}
					let slimed = false;
					if (potentialSlimeParts.length == 0) {
						KinkyDungeonSlimeLevel = Math.min(KinkyDungeonSlimeLevel, 0.5);
						KinkyDungeonSlimeLevelStart = Math.min(KinkyDungeonSlimeLevelStart, 0.5);
					} else while (potentialSlimeParts.length > 0) {
						let newSlime = potentialSlimeParts[Math.floor(Math.random() * potentialSlimeParts.length)];
						if (newSlime) {
							let added = KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(newSlime.restraint), 0, true);
							if (added) {
								KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSlimeSpread"), "#ff44ff", 3);
								potentialSlimeParts = [];
								KinkyDungeonSlimeLevel = -100;
								slimed = true;
							}
						}
						potentialSlimeParts.splice(potentialSlimeParts.indexOf(newSlime), 1);
					}
					if (!slimed && potentialSlimeParts.length == 0) {
						let slime = slimedParts[Math.floor(Math.random() * slimedParts.length)];
						if (KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("Hard" + slime.name), 0, true)) {
							KinkyDungeonSendTextMessage(5, TextGet("KinkyDungeonSlimeHarden"), "#ff44ff", 3);
							if (KinkyDungeonCurrentDress != "SlimeSuit") {
								KinkyDungeonSetDress("SlimeSuit");
								KinkyDungeonDressPlayer();
								KinkyDungeonSendTextMessage(6, TextGet("KinkyDungeonSlimeSpread"), "#ff44ff", 3);
							}
						}
						KinkyDungeonSlimeLevel = -100;
					}
				}
			}



		}
	} else if (Event == "remove") {
		for (let e of item.events) {
			if (e.type == "armbinderHarness" && data.item != item && item.restraint && item.restraint.Group) {
				let armbinder = false;
				for (let inv of KinkyDungeonRestraintList()) {
					if (inv.restraint && inv.restraint.shrine && inv.restraint.shrine.includes("Armbinders")) {
						armbinder = true;
						break;
					}
				}
				if (!armbinder) {
					KinkyDungeonRemoveRestraint(item.restraint.Group, false, false, true);
					KinkyDungeonSendTextMessage(4, TextGet("KinkyDungeonRemoveArmbinderHarness"), "lightgreen", 2);
				}
			}
			if (e.type == "slimeStop" && data.item == item) {
				KinkyDungeonSlimeLevel = 0;
			}
			if (e.type == "unlinkItem" && data.item == item && !data.add && !data.shrine) {
				let newRestraint = KinkyDungeonGetRestraintByName(data.item.restraint.UnLink);
				let oldLock = "";
				if (data.item.oldLock && data.item.oldLock.length > 0) {
					oldLock = data.item.oldLock[data.item.oldLock.length - 1];
				}
				if (newRestraint) {
					if (data.item.oldLock)
						data.item.oldLock.splice(data.item.oldLock.length-1, 1);
					KinkyDungeonAddRestraint(newRestraint, data.item.tightness ? data.item.tightness : 0, true, oldLock ? oldLock : "", false);
					let res = KinkyDungeonGetRestraintItem(newRestraint.Group);
					if (res && res.restraint && data.item.oldLock && data.item.oldLock.length > 0) {
						res.oldLock = data.item.oldLock;
					}
					KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonUnlink" + data.item.restraint.name), "lightgreen", 2);
					KinkyDungeonCancelFlag = true;
				}
			}
		}
	} else if (Event == "hit") {
		for (let e of item.events) {
			if (e.type == "linkItem" && (data.attack && data.attack.includes("Bind") && !data.attack.includes("Suicide"))) {
				for (let inv of KinkyDungeonRestraintList()) {
					if (inv.restraint && inv.restraint.Link && (!e.chance || Math.random() < e.chance)) {
						let newRestraint = KinkyDungeonGetRestraintByName(inv.restraint.Link);
						let oldLock = [];
						if (inv.oldLock) oldLock = inv.oldLock;
						let lock = inv.lock ? inv.lock : "";
						oldLock.push(lock);
						if (newRestraint) {
							KinkyDungeonAddRestraint(newRestraint, inv.tightness ? inv.tightness : 0, true, "", false);
							let newItem = KinkyDungeonGetRestraintItem(newRestraint.Group);
							if (newItem) newItem.oldLock = oldLock;
							KinkyDungeonSendTextMessage(7, TextGet("KinkyDungeonLink" + inv.restraint.name), "red", 2);
						}
					}
				}
			}
		}
	} else if (Event == "struggle") {
		for (let e of item.events) {
			if (e.type == "crotchrope" && data.restraint && data.restraint.crotchrope && data.struggletype == "Struggle") {
				KinkyDungeonChangeArousal(1);
				KinkyDungeonSendTextMessage(3, TextGet("KinkyDungeonCrotchRope").replace("RestraintName", TextGet("Restraint" + data.restraint.name)), "pink", 3);
			}
		}
	}
}

function KinkyDungeonHandleBuffEvent(Event, buff, entity, data) {

}
