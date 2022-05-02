"use strict";



/**
 * Returns whether or not the enemy is ALLIED, i.e it will follow the player
 * @param {entity} enemy
 * @returns {boolean}
 */
function KDAllied(enemy) {
	return !(enemy.rage > 0) && !(enemy.hostile > 0) && KDFactionAllied("Player", enemy);
}

/**
 * Returns whether the enemy is HOSTILE to the player (if no optional argument) or the optional enemy
 * @param {entity} enemy
 * @param {entity} [enemy2]
 * @returns {boolean}
 */
function KDHostile(enemy, enemy2) {
	if (enemy == enemy2) return false;
	return (enemy.rage > 0) || (!enemy2 && KDFactionHostile("Player", enemy) || (enemy2 && KDFactionHostile(KDGetFaction(enemy), KDGetFaction(enemy2))));
}

/**
 * Gets the faction of the enemy, returning "Player" if its an ally, or "Enemy" if no faction
 * @param {entity} enemy
 * @returns {string}
 */
function KDGetFaction(enemy) {
	let E = enemy.Enemy;
	if (enemy.rage > 0) return "Rage";
	if (enemy.faction) return enemy.faction;
	if ((E && E.allied) || enemy.allied) return "Player";
	if (E && E.faction) return E.faction;
	return "Enemy";
}

/**
 * Consults the faction table and decides if the two mentioned factions are hostile
 * @param {string} a - Faction 1
 * @param {string | entity} b - Faction 2
 * @returns {boolean}
 */
function KDFactionHostile(a, b) {
	if (a == "Player" && !(typeof b === "string") && b.hostile > 0) return true;
	if (a == "Player" && !(typeof b === "string") && b.rage > 0) return true;
	if (!(typeof b === "string")) b = KDGetFaction(b);
	if (a == "Rage" || b == "Rage") return true;
	if (a == "Player" && b == "Enemy") return true;
	if (b == "Player" && a == "Enemy") return true;
	return false;
}

/**
 * Consults the faction table and decides if the two mentioned factions are allied
 * @param {string} a - Faction 1
 * @param {string | entity} b - Faction 2
 * @returns {boolean}
 */
function KDFactionAllied(a, b) {
	if (a == "Player" && !(typeof b === "string") && b.hostile > 0) return false;
	if (!(typeof b === "string") && b.rage > 0) return false;
	if (!(typeof b === "string")) b = KDGetFaction(b);
	if (a == "Rage" || b == "Rage") return false;
	if (a == "Player" && b == "Player") return true;
	if (b == "Enemy" && a == "Enemy") return true;
	return false;
}

