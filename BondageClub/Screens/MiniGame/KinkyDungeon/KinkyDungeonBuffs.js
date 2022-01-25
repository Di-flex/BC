"use strict";

function KinkyDungeonSendBuffEvent(Event, data) {
	for (let buff of Object.values(KinkyDungeonPlayerBuffs)) {
		if (buff && buff.events) {
			for (let e of buff.events) {
				if (e.trigger == Event) {
					KinkyDungeonHandleBuffEvent(Event, buff, KinkyDungeonPlayerEntity, data);
				}
			}
		}
	}
	for (let ent of KinkyDungeonEntities) {
		if (ent.buffs) {
			for (let buff of Object.values(ent.buffs)) {
				if (buff && buff.events) {
					for (let e of buff.events) {
						if (e.trigger == Event) {
							KinkyDungeonHandleBuffEvent(Event, buff, e, data);
						}
					}
				}
			}
		}
	}
}

// Decreases time left in buffs and also applies effects
function KinkyDungeonTickBuffs(list, delta, endFloor) {
	for (const [key, value] of Object.entries(list)) {
		if (value) {
			if (value.endFloor && endFloor) list[key] = undefined;
			else if (value.endSleep && KinkyDungeonSleepTurns > 1) list[key] = undefined;
			else if (!value.duration || value.duration < 0) list[key] = undefined;
			else {
				if (value.type == "restore_mp") KinkyDungeonChangeMana(value.power);
				if (value.type == "restore_sp") KinkyDungeonChangeStamina(value.power);
				if (value.type == "restore_ap") KinkyDungeonChangeArousal(value.power);

				value.duration -= delta;
			}
		}
	}
}

// Updates buffs for all creatures
function KinkyDungeonUpdateBuffs(delta, endFloor) {
	// Tick down buffs the buffs
	KinkyDungeonSendBuffEvent("tick", {delta: delta});
	KinkyDungeonTickBuffs(KinkyDungeonPlayerBuffs, delta, endFloor);
	for (let EE = 0; EE < KinkyDungeonEntities.length; EE++) {
		let enemy = KinkyDungeonEntities[EE];
		if (!enemy.buffs) enemy.buffs = {};
		KinkyDungeonTickBuffs(enemy.buffs, delta);
	}

	// Apply the buffs
	for (let E = 0; E < KinkyDungeonBullets.length; E++) {
		let b = KinkyDungeonBullets[E];
		if (b.bullet.spell && b.bullet.spell.buffs) { // Apply the buff
			for (let B = 0; B < b.bullet.spell.buffs.length; B++) {
				let buff = b.bullet.spell.buffs[B];

				if (buff.player && buff.range >= Math.sqrt((KinkyDungeonPlayerEntity.x - b.x) * (KinkyDungeonPlayerEntity.x - b.x) + (KinkyDungeonPlayerEntity.y - b.y) * (KinkyDungeonPlayerEntity.y - b.y))) {
					KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, buff);
				}
				if (buff.enemies) {
					for (let EE = 0; EE < KinkyDungeonEntities.length; EE++) {
						let enemy = KinkyDungeonEntities[EE];
						if ((!enemy.Enemy.allied || !buff.noAlly) && (enemy.Enemy.allied || !buff.onlyAlly) && buff.range >= Math.sqrt((enemy.x - b.x) * (enemy.x - b.x) + (enemy.y - b.y) * (enemy.y - b.y))) {
							KinkyDungeonApplyBuff(enemy.buffs, buff);
						}
					}

				}
			}
		}
	}
}

function KinkyDungeonGetBuffedStat(list, Stat) {
	let stat = 0;
	if (list)
		for (let buff of Object.values(list)) {
			if (buff && buff.type == Stat) {
				stat += buff.power;
			}
		}
	return stat;
}

function KinkyDungeonApplyBuff(list, origbuff) {
	if (!origbuff) return;
	let buff = {};
	Object.assign(buff, origbuff);

	if (!list[buff.id] || (list[buff.id].power && buff.power > list[buff.id].power)) list[buff.id] = buff;
	if ((list[buff.id].power && buff.power == list[buff.id].power && buff.duration > list[buff.id].duration)) list[buff.id].duration = buff.duration;

	if (buff.tags)
		for (let T = 0; T < buff.tags.length; T++) {
			let tag = buff.tags[T];
			if (tag == "darkness" && list == KinkyDungeonPlayerBuffs) {
				KinkyDungeonBlindLevelBase = Math.max(KinkyDungeonBlindLevelBase, Math.floor(buff.power/0.5));
			}
		}
}

function KinkyDungeonHasBuff(list, Buff) {
	if (list && list[Buff]) return true;
	else return false;
}
