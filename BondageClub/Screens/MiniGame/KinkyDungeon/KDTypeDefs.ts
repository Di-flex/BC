// Kinky Dungeon Typedefs
interface item {
    name?: string, // Name of the item
    type?: string, // Type of the item
    events?: any, // Events associated with the item
	looseevents?: any,
    quantity?: number, // Number of consumables in the inventory
    lock?: string, // Type of lock, Red, Blue, or Gold (potentially more in future)
    tetherToLeasher?: boolean, // Bool to describe if the item is tethered to the leashing enemy
    tetherToGuard?: boolean, // Bool to describe if the item is tethered to KinkyDungeonJailGuard()
    tx?: number, // Location of the tether
    ty?: number, // Location of the tether
    tetherLength?: number, // Length of the tether
    lockTimer?: number, // Used for Gold locks only, determines which floor the lock will release
    dynamicLink?: string[], // Stores a list of restraint names for the linked item system
    oldLock?: string[], // Stores linked item locks
    oldTightness?: number[], // Stores linked item tightness
    battery?: number, // Vibrator battery level
    cooldown?: number, // Vibrator cooldown, won't restart vibrrating until this is 0. Ticks down each turn.
    deny?: number, // Vibrator deny timer, similar to cooldown but independent. Ticks down each turn.
    pickProgress?: number, // Escape progress tracking
    struggleProgress?: number, // Escape progress tracking
    removeProgress?: number, // Escape progress tracking
    cutProgress?: number, // Escape progress tracking
    unlockProgress?: number, // Escape progress tracking
    attempts?: number, // Number of escape attempts, integer
    tightness?: number, // Can be used to make an item tighter and harder to escape, reduces with each escape attempt
    trap?: string, // Determines the current trap attached to the restraint
}

interface consumable {
	name: string,
	rarity: number,
	type: string,
	shop?: boolean,
	spell?: string,
	potion?: boolean,
	noHands?: boolean,
	mp_instant?: number,
	mp_gradual?: number,
	scaleWithMaxMP?: boolean,
	duration?: number,
	buff?: string,
	costMod?: number,
	shrine?: string,
	sfx?: string
}

interface restraint {
	name: string,
	Group: string,
	Asset: string,
	enemyTags: any,
	Color: string,
	weight: number,
	events: object[],
	escapeChance: {
		Struggle: number,
		Cut: number,
		Remove: number
	},
	shrine: string[],
	minLevel: number,
	bindarms: boolean,
	playerTags: any,
	floors: Map<any, any>,
	power: number,
	hobble: boolean,
	blockfeet: boolean,
	gag: number,
	blindfold: number
	maxstamina: number,
	Type,
	removePrison,
	failSuffix,
	remove,
	slimeLevel,
	addTag,
	OverridePriority,
	Modules,
	bindhands,
	inventory,
	strictness,
	LinkableBy,
	harness,
	struggleMinSpeed,
	struggleMaxSpeed,
	DefaultLock,
	Link,
	UnLink,
	tether,
	leash,
	AssetGroup,
	vibeType,
	intensity,
	orgasm,
	battery,
	maxbattery,
	escapeMult,
	helpChance,
	alwaysDress,
	chastitybra,
	bypass,
	minlevel,
	specStruggleTypes,
	crotchrope,
	magic,
	nonbinding,
	freeze,
	plugSize,
	teaseRate,
	chastity,
	trappable,
	teaseCooldown,
	denyChance,
	denyTime,
	denyChanceLikely,
	curse,
	difficultyBonus,
	sfx,
	divine,
	alwaysKeep,
	potionAncientCost,
	allowPotions,
	slimeWalk,
	enchantedDrain,
	enchanted,
	inventoryAs,
}

interface KinkyDungeonSave {
	level: number;
    checkpoint: number;
    rep: Record<string, number>;
    costs: Record<string, number>;
    orbs: number[];
    chests: number[];
    dress: string;
    gold: number;
    points: number;
    levels: {
        Elements: number;
        Conjure: number;
        Illusion: number;
    };
    id: number;
    choices: number[];
	choices2: boolean[];
	buffs: Record<string, any>;
	lostitems: any[];
	caches: number[];
	spells: string[];
	inventory: {
		restraint: any;
		looserestraint: any;
		weapon: any;
		consumable: any;
	}[];
	stats: {
		picks: number;
		keys: number;
		bkeys: number;
		knife: number;
		eknife: number;
		mana: number;
		stamina: number;
		arousal: number;
		wep: any;
		npp: number;
	};
}

interface KinkyDungeonShopItem {
	cost: any;
	rarity: any;
	costMod?: any;
	shoptype: string;
	consumable?: string;
	quantity?: number;
	name: any;
}

interface KinkyDungeonWeapon {
	name: string;
	dmg: number;
	chance: number;
	type: string;
	bind?: number;
	boundBonus?: number;
	tease?: boolean;
	rarity: number;
	staminacost?: number;
	magic?: boolean;
	cutBonus?: number;
	unarmed: boolean;
	shop: boolean;
	noequip?: boolean;
	sfx: string;
	events?: KinkyDungeonEvent[];
}

interface KinkyDungeonEvent {
	type: string;
	trigger: string;
	power?: number;
	damage?: string;
	dist?: number;
	aoe?: number;
	buffType?: string;
	time?: number;
	chance?: number;
	buff?: any;
}
