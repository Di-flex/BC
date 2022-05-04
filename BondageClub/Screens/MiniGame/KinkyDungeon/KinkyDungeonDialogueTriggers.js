"use strict";

/** No dialogues will trigger when the player dist is higher than this */
let KinkyDungeonMaxDialogueTriggerDist = 5.9;

/** @type {Record<string, KinkyDialogueTrigger>} */
let KDDialogueTriggers = {
	"WeaponStop": {
		dialogue: "WeaponFound",
		allowedPrisonStates: ["parole"],
		excludeTags: ["zombie", "skeleton"],
		playRequired: true,
		blockDuringPlaytime: false,
		prerequisite: (enemy, dist) => {
			return (KinkyDungeonPlayerDamage && !KinkyDungeonPlayerDamage.unarmed && KinkyDungeonPlayerDamage.name != "Knife" && dist < 1.5 && KDRandom() < 0.25);
		},
		weight: (enemy, dist) => {
			return KDStrictPersonalities.includes(enemy.personality) ? 10 : 1;
		},
	},
	"OfferLatex": {
		dialogue: "OfferLatex",
		allowedPrisonStates: ["parole", ""],
		allowedPersonalities: ["Sub"],
		excludeTags: ["zombie", "skeleton", "robot"],
		nonHostile: true,
		blockDuringPlaytime: true,
		prerequisite: (enemy, dist) => {
			return (dist < 1.5 && KDRandom() < 0.25);
		},
		weight: (enemy, dist) => {
			return KDStrictPersonalities.includes(enemy.personality) ? 10 : 1;
		},
	},

};
