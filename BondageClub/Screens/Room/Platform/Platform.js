"use strict";
var PlatformChar = [];
var PlatformPlayer = null;
var PlatformLastTime = null;
var PlatformKeys = [];
var PlatformFloor = 1180;
var PlatformViewX = 0;
var PlatformViewY = 200;
var PlatformRoom = null;
var PlatformGravitySpeed = 6;
var PlatformLastKeyCode = 0;
var PlatformLastKeyTime = 0;
var PlatformExperienceForLevel = [0, 10, 15, 25, 40, 60, 90, 135, 200, 300];
var PlatformShowHitBox = false;
var PlatformMessage = null;
var PlatformHeal = null;
var PlatformEvent = [];
var PlatformDrawUpArrow = [null, null];
var PlatformButtons = null;
var PlatformRunDirection = "";
var PlatformRunTime = 0;
var PlatformLastTouch = null;

// Template for characters with their animations
var PlatformTemplate = [
	{
		Name: "Melody",
		Status: "Maid",
		Health: 16,
		HealthPerLevel: 4,
		Width: 400,
		Height: 400,
		HitBox: [0.42, 0.03, 0.58, 1],
		RunSpeed: 18,
		WalkSpeed: 12,
		CrawlSpeed: 6,
		JumpForce: 50,
		CollisionDamage: 0,
		ExperienceValue: 0,
		DamageBackOdds: 0,
		DamageKnockForce: 30,
		Animation: [
			{ Name: "Idle", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 100 },
			{ Name: "Wounded", Cycle: [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1], Speed: 150 },
			{ Name: "Bound", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 120 },
			{ Name: "Walk", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], Speed: 30 },
			{ Name: "Run", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], Speed: 50 },
			{ Name: "Jump", Cycle: [0, 1, 2, 3, 4, 3, 2, 1], Speed: 150 },
			{ Name: "Crouch", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 100 },
			{ Name: "Bind", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 100 },
			{ Name: "Crawl", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39], Speed: 20 },
			{ Name: "StandAttackFast", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 13 },
			{ Name: "StandAttackSlow", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], Speed: 30 },
			{ Name: "CrouchAttackFast", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], Speed: 18 },
			{ Name: "CrouchAttackSlow", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], Speed: 43 },
		],
		Attack: [
			{ Name: "StandAttackFast", HitBox: [0.7, 0.2, 0.9, 0.3], HitAnimation: [8, 9, 10, 11, 12], Damage: [1, 2, 3, 3, 4, 5, 5, 6, 7, 7, 8], Speed: 300 },
			{ Name: "StandAttackSlow", HitBox: [0.8, 0.4, 1, 0.5], HitAnimation: [9, 10, 11, 12, 13], Damage: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], Speed: 600 },
			{ Name: "CrouchAttackFast", HitBox: [0.725, 0.65, 0.925, 0.75], HitAnimation: [5, 6, 7, 8, 9], Damage: [1, 2, 3, 3, 4, 5, 5, 6, 7, 7, 8], Speed: 300 },
			{ Name: "CrouchAttackSlow", HitBox: [0.8, 0.7, 1, 0.8], HitAnimation: [5, 6, 7, 8, 9], Damage: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], Speed: 600 }
		]
	},
	{
		Name: "Olivia",
		Status: "Chained",
		Width: 400,
		Height: 400,
		Animation: [
			{ Name: "Idle", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 130 }
		]
	},
	{
		Name: "Olivia",
		Status: "Chastity",
		Width: 400,
		Height: 400,
		Animation: [
			{ Name: "Idle", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 130 }
		]
	},
	{
		Name: "Olivia",
		Status: "Flower",
		Width: 400,
		Height: 400,
		Animation: [
			{ Name: "Idle", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61], Speed: 90 },
			{ Name: "Bound", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 110 }
		]
	},
	{
		Name: "Isabella",
		Status: "Winter",
		Width: 400,
		Height: 400,
		Animation: [
			{ Name: "Idle", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 150 }
		]
	},
	{
		Name: "Edlaran",
		Status: "Chained",
		Width: 400,
		Height: 400,
		Animation: [
			{ Name: "Idle", Cycle: [0], Speed: 130 }
		]
	},
	{
		Name: "Edlaran",
		Status: "Archer",
		Width: 400,
		Height: 400,
		Animation: [
			{ Name: "Idle", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 90 },
		]
	},
	{
		Name: "Chest",
		Status: "Metal",
		Width: 400,
		Height: 400,
		Animation: [
			{ Name: "Idle", Cycle: [0], Speed: 130 }
		]
	},
/*	{
		Name: "Kara",
		Status: "Nude",
		Health: 10,
		Width: 400,
		Height: 400,
		HitBox: [0.4, 0.05, 0.6, 1],
		RunSpeed: 12,
		WalkSpeed: 8,
		CrawlSpeed: 4,
		JumpForce: 50,
		CollisionDamage: 1,
		ExperienceValue: 1,
		JumpOdds: 0.0002,
		DamageBackOdds: 1,
		DamageKnockForce: 50,
		Animation: [
			{ Name: "Idle", Width: 200, Cycle: [0], Speed: 150 },
			{ Name: "Wounded", Cycle: [0], Speed: 1000 },
			{ Name: "Bound", Cycle: [0], Speed: 1000 },
			{ Name: "Walk", Width: 200, Cycle: [0, 1, 2, 3, 2, 1], Speed: 150 },
			{ Name: "Jump", Width: 200, Cycle: [0, 1, 2, 3, 2, 1], Speed: 250 },
			//{ Name: "Crouch", Width: 200, Cycle: [0, 1, 2, 3, 2, 1], Speed: 400 },
			//{ Name: "Crawl", Cycle: [0, 1, 2, 3, 2, 1], Speed: 300 },
			{ Name: "Bind", Width: 200, Cycle: [0, 1, 2, 3, 2, 1], Speed: 400 },
			//{ Name: "StandAttackFast", Cycle: [0, 1, 2, 3, 3, 3, 3, 2, 1, 0], Speed: 40 },
			//{ Name: "StandAttackSlow", Cycle: [0, 1, 2, 3, 3, 3, 3, 2, 1, 0], Speed: 60 },
			//{ Name: "CrouchAttackFast", Cycle: [0, 1, 2, 3, 3, 3, 3, 2, 1, 0], Speed: 40 },
			//{ Name: "CrouchAttackSlow", Cycle: [0, 1, 2, 3, 3, 3, 3, 2, 1, 0], Speed: 60 },
		],
		Attack: [
			//{ Name: "StandAttackFast", HitBox: [135, -365, 30, 30], Animation: [3], Damage: 2, Speed: 400 },
			//{ Name: "StandAttackSlow", HitBox: [135, -365, 30, 30], Animation: [3], Damage: 3, Speed: 600 },
			//{ Name: "CrouchAttackFast", HitBox: [190, -150, 55, 30], Animation: [3], Damage: 2, Speed: 400 },
			//{ Name: "CrouchAttackSlow", HitBox: [190, -150, 55, 30], Animation: [3], Damage: 3, Speed: 600 }
		]
	},
	{
		Name: "Liane",
		Status: "School",
		Health: 15,
		Width: 400,
		Height: 400,
		HitBox: [0.4, 0.05, 0.6, 1],
		RunSpeed: 15,
		WalkSpeed: 10,
		CrawlSpeed: 5,
		CollisionDamage: 2,
		ExperienceValue: 2,
		RunOdds: 0.0004,
		DamageBackOdds: 1,
		DamageKnockForce: 40,
		Animation: [
			{ Name: "Idle", Width: 200, Cycle: [0], Speed: 150 },
			{ Name: "Wounded", Cycle: [0, 1, 2, 1], Speed: 1000 },
			{ Name: "Bound", Cycle: [0], Speed: 10000 },
			{ Name: "Walk", Width: 200, Cycle: [0, 1, 2, 3, 2, 1], Speed: 150 },
			{ Name: "Run", Width: 200, Cycle: [0, 1, 2, 3, 2, 1], Speed: 100 },
			{ Name: "Bind", Width: 200, Cycle: [0], Speed: 10000 }
		],
		Attack: []

	},*/
	{
		Name: "Hazel",
		Status: "Maid",
		Health: 11,
		Width: 400,
		Height: 400,
		HitBox: [0.4, 0.05, 0.6, 1],
		RunSpeed: 12,
		WalkSpeed: 8,
		CrawlSpeed: 4,
		JumpForce: 50,
		CollisionDamage: 1,
		ExperienceValue: 1,
		JumpOdds: 0.0003,
		DamageBackOdds: 1,
		DamageKnockForce: 50,
		Animation: [
			{ Name: "Idle", Cycle: [0], Speed: 150 },
			{ Name: "Wounded", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 110 },
			{ Name: "Bound", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 100 },
			{ Name: "Walk", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], Speed: 40 },
			{ Name: "Jump", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 35 },
			{ Name: "Bind", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], Speed: 130 },
		]
	},
	{
		Name: "Yuna",
		Status: "Maid",
		Health: 17,
		Width: 400,
		Height: 400,
		HitBox: [0.4, 0.05, 0.6, 1],
		RunSpeed: 12,
		WalkSpeed: 8,
		CrawlSpeed: 4,
		JumpForce: 70,
		CollisionDamage: 2,
		ExperienceValue: 2,
		JumpOdds: 0.0006,
		RunOdds: 0.0003,
		DamageKnockForce: 40,
		Animation: [
			{ Name: "Idle", Cycle: [0], Speed: 100 },
			{ Name: "Wounded", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 100 },
			{ Name: "Bound", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 120 },
			{ Name: "Jump", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 60 },
			{ Name: "Walk", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], Speed: 40 },
			{ Name: "Run", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], Speed: 30 },
			{ Name: "Bind", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 90 },
		]
	},
	{
		Name: "Lucy",
		Status: "Armor",
		Health: 26,
		Width: 400,
		Height: 400,
		HitBox: [0.4, 0.05, 0.6, 1],
		RunSpeed: 15,
		WalkSpeed: 10,
		CrawlSpeed: 5,
		CollisionDamage: 3,
		ExperienceValue: 4,
		RunOdds: 0.0005,
		DamageBackOdds: 0,
		DamageFaceOdds: 0.5,
		DamageKnockForce: 30,
		Animation: [
			{ Name: "Idle", Cycle: [0], Speed: 150 },
			{ Name: "Walk", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], Speed: 40 },
			{ Name: "Run", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], Speed: 30 },
			{ Name: "Wounded", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 130 },
			{ Name: "Bound", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 120 },
			{ Name: "Bind", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 110 },
		],
		OnBind: function() { if (PlatformEventDone("EdlaranCurseIntro") && !PlatformEventDone("EdlaranKey") && (Math.random() >= 0.8)) { PlatformMessageSet("You found keys for shackles on the guard."); PlatformEventSet("EdlaranKey"); } }
	},
	{
		Name: "Camille",
		Status: "Armor",
		Health: 53,
		Width: 400,
		Height: 400,
		HitBox: [0.4, 0.05, 0.6, 1],
		RunSpeed: 9,
		WalkSpeed: 6,
		CrawlSpeed: 3,
		JumpForce: 60,
		CollisionDamage: 6,
		ExperienceValue: 15,
		JumpOdds: 0.0002,
		RunOdds: 0.0004,
		StandAttackSlowOdds: 0.0003,
		DamageBackOdds: 0,
		DamageFaceOdds: 0.5,
		DamageKnockForce: 20,
		Animation: [
			{ Name: "Idle", Cycle: [0], Speed: 100 },
			{ Name: "Wounded", Cycle: [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1], Speed: 100 },
			{ Name: "Bound", Cycle: [0, 1, 2, 3, 4, 3, 2, 1], Speed: 250 },
			{ Name: "Jump", Cycle: [0, 1, 2, 3, 4, 3, 2, 1], Speed: 150 },
			{ Name: "Walk", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], CycleLeft: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], Speed: 100 },
			{ Name: "Run", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], CycleLeft: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], Speed: 66 },
			{ Name: "Bind", Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], Speed: 90 },
			{ Name: "StandAttackSlow", OffsetY: 50, Width: 500, Height: 500, Cycle: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39], Speed: 25 }
		],
		Attack: [
			{ Name: "StandAttackSlow", HitBox: [0.6, 0.3, 1.3, 0.65], HitAnimation: [30, 31, 32, 33, 34, 35, 36], Damage: [12, 12], Speed: 1000 }
		],
		OnBind: function() {
			PlatformEventSet("CamilleDefeat");
			PlatformDialogStart("CamilleDefeat");
			PlatformLoadRoom();
		}
	}

];

// All available rooms
var PlatformRoomList = [
	/*{
		Name: "CollegeClass1",
		Background: "CollegeClass1",
		Width: 4000,
		Height: 1200,
		Door: [
			{ Name: "CollegeHall1", FromX: 3800, FromY: 500, FromW: 200, FromH: 700, FromType: "Up", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Kara", X: 1700 }
		]
	},
	{
		Name: "CollegeHall1",
		Background: "CollegeHall1",
		Width: 3500,
		Height: 1200,
		Door: [
			{ Name: "CollegeClass1", FromX: 0, FromY: 500, FromW: 300, FromH: 700, FromType: "Up", ToX: 3900, ToFaceLeft: true },
			{ Name: "CollegeArt1", FromX: 3200, FromY: 500, FromW: 300, FromH: 700, FromType: "Up", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Liane", X: 3000 }
		]
	},
	{
		Name: "CollegeArt1",
		Background: "CollegeArt1",
		Width: 3800,
		Height: 1200,
		Door: [
			{ Name: "CollegeHall1", FromX: 0, FromY: 500, FromW: 200, FromH: 700, FromType: "Up", ToX: 3900, ToFaceLeft: true },
			{ Name: "CastleHall1A", FromX: 3700, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 200, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Liane", X: 1400 },
			{ Name: "Kara", X: 2500 }
		]
	},*/
	{
		Name: "BedroomMelody",
		Text: "Melody's Bedroom (heal and save)",
		Background: "Castle/BedroomMelody",
		Width: 2000,
		Height: 1200,
		LimitLeft: 200,
		LimitRight: 1750,
		Heal: 500,
		Door: [
			{ Name: "CastleHall3W", FromX: 200, FromY: 0, FromW: 150, FromH: 1200, FromType: "Up", ToX: 500, ToFaceLeft: false },
		]
	},
	{
		Name: "CastleHall3W",
		Entry: function() { if (!PlatformEventDone("JealousMaid")) PlatformDialogStart("JealousMaid"); },
		Text: "3F - Bedroom Hallway - West",
		Background: "Castle/Hall3W",
		Width: 3200,
		Height: 1200,
		LimitLeft: 250,
		Door: [
			{ Name: "BedroomMelody", FromX: 350, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 275, ToFaceLeft: false },
			{ Name: "CastleHall3C", FromX: 3100, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Hazel", Status: "Maid", X: 2000 }
		]
	},
	{
		Name: "CastleHall3C",
		Entry: function() {
			if (PlatformEventDone("OliviaBath")) {
				PlatformRoom.Door.push({ Name: "CastleHall2C", FromX: 1950, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 1100, ToFaceLeft: false });
				PlatformRoom.Background = "Castle/Hall3Cv2";
			}
		},
		Text: "3F - Bedroom Hallway - Center",
		Background: "Castle/Hall3C",
		AlternateBackground: "Castle/Hall3Cv2",
		Width: 4800,
		Height: 1200,
		Door: [
			{ Name: "CastleHall3W", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 3100, ToFaceLeft: true },
			{ Name: "CastleHall4C", FromX: 2550, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 2700, ToFaceLeft: false },
			{ Name: "CastleHall3E", FromX: 4700, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false },
			{ Name: "CastleHall2E", FromX: -1000, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false } // Used for faster loading
		],
		Character: [
			{ Name: "Hazel", Status: "Maid", X: 1300 },
			{ Name: "Hazel", Status: "Maid", X: 3500 }
		]
	},
	{
		Name: "CastleHall3E",
		Text: "3F - Bedroom Hallway - East",
		Background: "Castle/Hall3E",
		Width: 3800,
		Height: 1200,
		LimitRight: 3550,
		Door: [
			{ Name: "CastleHall3C", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 4700, ToFaceLeft: true },
			{ Name: "BedroomOlivia", FromX: 750, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 100, ToFaceLeft: false },
			{ Name: "BedroomIsabella", FromX: 3150, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Yuna", Status: "Maid", X: 2100 }
		]
	},
	{
		Name: "BedroomOlivia",
		Entry: function() {
			if (!PlatformEventDone("OliviaUnchain") && !PlatformEventDone("OliviaCollarKey")) PlatformCreateCharacter("Olivia", "Chained", 2200, true, false, "IntroOliviaBeforeCollarKey");
			if (!PlatformEventDone("OliviaUnchain") && PlatformEventDone("OliviaCollarKey")) PlatformCreateCharacter("Olivia", "Chained", 2200, true, false, "IntroOliviaAfterCollarKey");
			if (PlatformEventDone("OliviaBath") && !PlatformEventDone("Curse")) { PlatformCreateCharacter("Olivia", "Flower", 2200, true, false, "OliviaAfterBath"); PlatformChar[1].FaceLeft = true; }
			if (PlatformEventDone("OliviaBath") && PlatformEventDone("Curse") && !PlatformEventDone("OliviaCurseIntro") && !PlatformEventDone("CamilleDefeat")) { PlatformCreateCharacter("Olivia", "Flower", 2200, true, false, "OliviaCurseIntro"); PlatformChar[1].Health = 0; PlatformChar[1].Bound = true; }
			if (PlatformEventDone("OliviaBath") && PlatformEventDone("Curse") && PlatformEventDone("OliviaCurseIntro") && !PlatformEventDone("CamilleDefeat")) { PlatformCreateCharacter("Olivia", "Flower", 2200, true, false, "OliviaCurse"); PlatformChar[1].Health = 0; PlatformChar[1].Bound = true; }
			if (PlatformEventDone("OliviaBath") && PlatformEventDone("Curse") && PlatformEventDone("CamilleDefeat") && !PlatformEventDone("OliviaCurseRelease")) { PlatformCreateCharacter("Olivia", "Flower", 2200, true, false, "OliviaCurseRelease"); PlatformChar[1].Health = 0; PlatformChar[1].Bound = true; }
		},
		Text: "Olivia's Bedroom (heal and save)",
		Background: "Castle/BedroomOlivia",
		Width: 3000,
		Height: 1200,
		Heal: 500,
		Door: [
			{ Name: "CastleHall3E", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 900, ToFaceLeft: false },
			{ Name: "BathroomOlivia", FromX: 2900, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false }
		]
	},
	{
		Name: "BathroomOlivia",
		Entry: function() {
			if (PlatformEventDone("OliviaUnchain") && !PlatformEventDone("OliviaBath")) PlatformCreateCharacter("Olivia", "Chastity", 1050, true, false, "OliviaBath");
		},
		Text: "Olivia's Bathroom",
		Background: "Castle/BathroomOlivia",
		Width: 2000,
		Height: 1200,
		Door: [
			{ Name: "BedroomOlivia", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 2900, ToFaceLeft: false }
		]
	},
	{
		Name: "BedroomIsabella",
		Entry: function() {
			if (!PlatformEventDone("EdlaranUnlock")) PlatformCreateCharacter("Hazel", "Maid", 2200);
			if (PlatformEventDone("EdlaranUnlock") && !PlatformEventDone("EdlaranBedroomIsabella")) PlatformCreateCharacter("Edlaran", "Archer", 2200, true, false, "EdlaranBedroomIsabella");
		},
		Text: "Isabella's Bedroom",
		Background: "Castle/BedroomIsabella",
		Width: 2400,
		Height: 1200,
		Door: [
			{ Name: "CastleHall3E", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 3300, ToFaceLeft: true }
		]
	},
	{
		Name: "CastleHall4C",
		Text: "4F - Roof Hallway - Center",
		Background: "Castle/Hall4C",
		Width: 4800,
		Height: 1200,
		Door: [
			{ Name: "CastleHall4W1", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 2300, ToFaceLeft: true },
			{ Name: "CastleHall4E", FromX: 4700, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false },
			{ Name: "CastleHall3C", FromX: 2550, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 2700, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Hazel", Status: "Maid", X: 1300 },
			{ Name: "Hazel", Status: "Maid", X: 3500 }
		]
	},
	{
		Name: "CastleHall4E",
		Text: "4F - Roof Hallway - East",
		Background: "Castle/Hall4E",
		Width: 3800,
		Height: 1200,
		LimitRight: 3550,
		Door: [
			{ Name: "CastleHall4C", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 4700, ToFaceLeft: true },
			{ Name: "CastleBalcony", FromX: 3150, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Yuna", Status: "Maid", X: 1400 },
			{ Name: "Hazel", Status: "Maid", X: 2100 }
		]
	},
	{
		Name: "CastleBalcony",
		Entry: function() {
			if (!PlatformEventDone("OliviaUnchain") && !PlatformEventDone("OliviaCollarKey")) PlatformCreateCharacter("Isabella", "Winter", 1175, true, false, "IntroIsabellaBeforeCollarKey");
			else if (!PlatformEventDone("OliviaUnchain") && PlatformEventDone("OliviaCollarKey")) PlatformCreateCharacter("Isabella", "Winter", 1175, true, false, "IntroIsabellaAfterCollarKey");
			else PlatformCreateCharacter("Yuna", "Maid", 1500);
		},
		Text: "Roof Balcony",
		Background: "Castle/Balcony",
		Width: 2000,
		Height: 1200,
		LimitRight: 1700,
		Door: [
			{ Name: "CastleHall4E", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 3300, ToFaceLeft: true }
		]
	},
	{
		Name: "CastleHall4W1",
		Text: "4F - Roof Hallway - West 1",
		Background: "Castle/Hall4W1",
		Width: 2400,
		Height: 1200,
		Door: [
			{ Name: "CastleHall4W2", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 2300, ToFaceLeft: true },
			{ Name: "CastleHall4C", FromX: 2300, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Hazel", Status: "Maid", X: 1000 },
			{ Name: "Hazel", Status: "Maid", X: 1400 }
		]
	},
	{
		Name: "CastleHall4W2",
		Text: "4F - Roof Hallway - West 2",
		Background: "Castle/Hall4W2",
		Width: 2400,
		Height: 1200,
		Door: [
			{ Name: "CastleHall4W3", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 2300, ToFaceLeft: true },
			{ Name: "CastleHall4W1", FromX: 2300, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Yuna", Status: "Maid", X: 1000 },
			{ Name: "Yuna", Status: "Maid", X: 1400 }
		]
	},
	{
		Name: "CastleHall4W3",
		Entry: function() {
			if (PlatformEventDone("Curse")) {
				PlatformCreateCharacter("Lucy", "Armor", 1000);
				PlatformCreateCharacter("Lucy", "Armor", 1400);
			}
		},
		Text: "4F - Roof Hallway - West 3",
		Background: "Castle/Hall4W1",
		Width: 2400,
		Height: 1200,
		Door: [
			{ Name: "CastleCountessHall", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 2100, ToFaceLeft: true },
			{ Name: "CastleHall4W2", FromX: 2300, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false }
		]
	},
	{
		Name: "CastleCountessHall",
		Entry: function() {
			if (PlatformEventDone("Curse") && !PlatformEventDone("CamilleDefeat")) {
				PlatformCreateCharacter("Camille", "Armor", 300);
				PlatformRoom.LimitRight = 2200;
				PlatformRoom.Background = "Castle/CountessHallClosed";
				PlatformDialogStart("CamilleIntro");
			}
			if (PlatformEventDone("Curse") && PlatformEventDone("CamilleDefeat") && !PlatformEventDone("OliviaCurseRelease")) {
				PlatformCreateCharacter("Camille", "Armor", 1100);
				PlatformChar[1].Health = 0;
				PlatformChar[1].Bound = true;
				PlatformChar[1].Dialog = "CamilleDefeatEnd";
			}
			if (PlatformEventDone("Curse") && PlatformEventDone("CamilleDefeat") && PlatformEventDone("OliviaCurseRelease")) {
				PlatformRoom.Background = "Castle/CountessHall";
				PlatformRoom.LimitLeft = 0;
				if (!PlatformEventDone("CamilleEscape")) {
					PlatformEventSet("CamilleEscape");
					PlatformDialogStart("CamilleEscape");
				}
			}
		},
		Text: "Countess Hall",
		Background: "Castle/CountessHallDeadEnd",
		AlternateBackground: "Castle/CountessHallClosed",
		Width: 2400,
		Height: 1200,
		LimitLeft: 200,
		Door: [
			{ Name: "CastleHall4W3", FromX: 2300, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false },
			{ Name: "CastleTerrace", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 1900, ToFaceLeft: true }
		]
	},
	{
		Name: "CastleTerrace",
		Entry: function() {
			if (PlatformEventDone("Curse") && PlatformEventDone("CamilleDefeat") && PlatformEventDone("OliviaCurseRelease") && !PlatformEventDone("OliviaTerrace")) PlatformCreateCharacter("Olivia", "Flower", 500, true, false, "OliviaTerrace");
			if (PlatformEventDone("Curse") && PlatformEventDone("CamilleDefeat") && PlatformEventDone("OliviaCurseRelease") && PlatformEventDone("OliviaTerrace")) PlatformCreateCharacter("Olivia", "Flower", 500, true, false, "OliviaTerraceEnd");
			if (PlatformEventDone("EdlaranJoin") && !PlatformEventDone("OliviaTerrace")) PlatformCreateCharacter("Edlaran", "Archer", 800, true, false, "EdlaranTerrace", true);
			if (PlatformEventDone("EdlaranJoin") && PlatformEventDone("OliviaTerrace")) PlatformCreateCharacter("Edlaran", "Archer", 800, true, false, "EdlaranTerraceEnd", true);
		},
		Text: "Countess Terrace",
		Background: "Castle/Terrace",
		Width: 2000,
		Height: 1200,
		LimitLeft: 200,
		Door: [
			{ Name: "CastleCountessHall", FromX: 1900, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false }
		]
	},
	{
		Name: "CastleHall2C",
		Entry: function() { if (!PlatformEventDone("CursedMaid") && PlatformEventDone("Curse")) PlatformDialogStart("CursedMaid"); },
		Text: "2F - Storehouse Hallway - Center",
		Background: "Castle/Hall2C",
		Width: 8200,
		Height: 1200,
		LimitLeft: 200,
		LimitRight: 8000,
		Door: [
			{ Name: "CastleHall3C", FromX: 950, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 2100, ToFaceLeft: false },
			{ Name: "WineCellar", FromX: 3950, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 1050, ToFaceLeft: false },
			{ Name: "CastleHall1C", FromX: 6950, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 2700, ToFaceLeft: true }
		],
		Character: [
			{ Name: "Hazel", Status: "Maid", X: 2000 },
			{ Name: "Yuna", Status: "Maid", X: 3200 },
			{ Name: "Yuna", Status: "Maid", X: 5000 },
			{ Name: "Hazel", Status: "Maid", X: 6200 }
		]
	},
	{
		Name: "WineCellar",
		Entry: function() {
			if (!PlatformEventDone("EdlaranBedroomIsabella")) PlatformCreateCharacter("Yuna", "Maid", 2500);
			if (PlatformEventDone("EdlaranBedroomIsabella") && !PlatformEventDone("EdlaranWineCellar") && !PlatformEventDone("EdlaranJoin")) PlatformCreateCharacter("Edlaran", "Archer", 2500, true, false, "EdlaranWineCellar");
		},
		Text: "Wine Cellar",
		Background: "Castle/WineCellar",
		Width: 3000,
		Height: 1200,
		Door: [
			{ Name: "CastleHall2C", FromX: 900, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 4100, ToFaceLeft: false }
		]
	},
	{
		Name: "CastleHall1C",
		Entry: function() {
			if (!PlatformEventDone("IntroGuard") && !PlatformEventDone("Curse")) PlatformDialogStart("IntroGuardBeforeCurse");
			if (!PlatformEventDone("Curse")) PlatformChar[1].Combat = false;
		},
		Text: "1F - Guard Hallway - Center",
		Background: "Castle/Hall1C",
		Width: 4000,
		Height: 1200,
		LimitRight: 3800,
		Door: [
			{ Name: "CastleHall1W", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 6300, ToFaceLeft: true },
			{ Name: "CastleHall2C", FromX: 2550, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 7100, ToFaceLeft: true }
		],
		Character: [
			{ Name: "Lucy", Status: "Armor", X: 2100 }
		]
	},
	{
		Name: "CastleHall1W",
		Entry: function() {
			if (!PlatformEventDone("Curse")) { PlatformChar[1].Combat = false; PlatformChar[2].Combat = false; }
		},
		Text: "1F - Guard Hallway - West",
		Background: "Castle/Hall1W",
		Width: 6400,
		Height: 1200,
		LimitLeft: 200,
		Door: [
			{ Name: "CastleHall1C", FromX: 6300, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false },
			{ Name: "CastleDungeon1W", FromX: 1150, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 1100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Lucy", Status: "Armor", X: 2800 },
			{ Name: "Lucy", Status: "Armor", X: 3600 }
		]
	},
	{
		Name: "CastleDungeon1W",
		Entry: function() {
			if (!PlatformEventDone("Curse")) { PlatformChar[1].Combat = false; PlatformChar[2].Combat = false; }
		},
		Text: "Dungeon Hallway - West",
		Background: "Castle/Dungeon1W",
		BackgroundFilter: "#00000040",
		Width: 6200,
		Height: 1200,
		LimitLeft: 200,
		Door: [
			{ Name: "CastleDungeon1C", FromX: 6100, FromY: 0, FromW: 100, FromH: 1200, FromType: "Right", ToX: 100, ToFaceLeft: false },
			{ Name: "CastleHall1W", FromX: 950, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 1300, ToFaceLeft: false },
			{ Name: "DungeonCell", FromX: 5150, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 100, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Lucy", Status: "Armor", X: 2800 },
			{ Name: "Lucy", Status: "Armor", X: 3600 }
		]
	},
	{
		Name: "CastleDungeon1C",
		Entry: function() {
			if (!PlatformEventDone("IntroGuardCurse") && PlatformEventDone("Curse")) PlatformDialogStart("IntroGuardAfterCurse");
			if (!PlatformEventDone("Curse")) PlatformChar[1].Combat = false;
		},
		Text: "Dungeon Hallway - East",
		Background: "Castle/Dungeon1C",
		BackgroundFilter: "#00000040",
		Width: 4400,
		Height: 1200,
		LimitRight: 4200,
		Door: [
			{ Name: "CastleDungeon1W", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 6300, ToFaceLeft: true },
			{ Name: "BedroomDungeon", FromX: 750, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 350, ToFaceLeft: false },
			{ Name: "DungeonStorage", FromX: 3150, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 350, ToFaceLeft: false }
		],
		Character: [
			{ Name: "Lucy", Status: "Armor", X: 2100 }
		]
	},
	{
		Name: "BedroomDungeon",
		Text: "Dungeon Bedroom (heal and save)",
		Background: "Castle/BedroomDungeon",
		BackgroundFilter: "#00000080",
		Width: 2200,
		Height: 1200,
		Heal: 500,
		Door: [
			{ Name: "CastleDungeon1C", FromX: 200, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 900, ToFaceLeft: false },
		]
	},
	{
		Name: "DungeonCell",
		Entry: function() {
			if (!PlatformEventDone("EdlaranFree") && !PlatformEventDone("Curse") && !PlatformEventDone("EdlaranIntro")) PlatformCreateCharacter("Edlaran", "Chained", 1800, true, false, "IntroEdlaranBeforeCurseStart");
			if (!PlatformEventDone("EdlaranFree") && !PlatformEventDone("Curse") && PlatformEventDone("EdlaranIntro")) PlatformCreateCharacter("Edlaran", "Chained", 1800, true, false, "IntroEdlaranBeforeCurseEnd");
			if (!PlatformEventDone("EdlaranFree") && PlatformEventDone("Curse") && !PlatformEventDone("EdlaranCurseIntro")) PlatformCreateCharacter("Edlaran", "Chained", 1800, true, false, "IntroEdlaranAfterCurseStart");
			if (!PlatformEventDone("EdlaranFree") && PlatformEventDone("EdlaranCurseIntro") && !PlatformEventDone("EdlaranKey")) PlatformCreateCharacter("Edlaran", "Chained", 1800, true, false, "IntroEdlaranAfterCurseEnd");
			if (!PlatformEventDone("EdlaranFree") && PlatformEventDone("EdlaranKey") && !PlatformEventDone("EdlaranUnlock")) PlatformCreateCharacter("Edlaran", "Chained", 1800, true, false, "EdlaranUnlock");
		},
		Text: "Dungeon Cell",
		Background: "Castle/DungeonCell",
		BackgroundFilter: "#00000080",
		Width: 2000,
		Height: 1200,
		Door: [
			{ Name: "CastleDungeon1W", FromX: 0, FromY: 0, FromW: 100, FromH: 1200, FromType: "Left", ToX: 5300, ToFaceLeft: true }
		]
	},
	{
		Name: "DungeonStorage",
		Entry: function() {
			if (PlatformEventDone("Curse")) PlatformChar[1].Dialog = "ChestRestraintsAfterCurse";
		},
		Text: "Dungeon Restraints Storage",
		Background: "Castle/DungeonStorage",
		BackgroundFilter: "#00000060",
		Width: 2000,
		Height: 1200,
		Door: [
			{ Name: "CastleDungeon1C", FromX: 250, FromY: 0, FromW: 300, FromH: 1200, FromType: "Up", ToX: 3300, ToFaceLeft: true }
		],
		Character: [
			{ Name: "Chest", Status: "Metal", X: 1700, Combat: false, Fix: true, Dialog: "ChestRestraintsBeforeCurse" }
		]
	},

]

/**
 * Loads a room and it's parameters
 * @param {String} CharacterName - The character name to load
 * @param {String} StatusName - The status of that character
 * @param {Number} X - The X position of the character
 * @param {Boolean} Fix - TRUE if the character won't move
 * @param {Boolean} Fix - TRUE if the character will deal and receive combat damage
 * @param {String} Dialog - The dialog name to open when talking to that character
 * @returns {Object} - Returns the platform character
 */
function PlatformCreateCharacter(CharacterName, StatusName, X, Fix  = null, Combat = null, Dialog = null, FaceLeft = null) {
	let NewChar = null;
	for (let CharTemplate of PlatformTemplate)
		if ((CharTemplate.Name == CharacterName) && (CharTemplate.Status == StatusName)) {
			NewChar = JSON.parse(JSON.stringify(CharTemplate));
			if (CharTemplate.OnBind != null) NewChar.OnBind = CharTemplate.OnBind;
			break;
		}
	if (NewChar == null) return;
	NewChar.Camera = (PlatformChar.length == 0);
	NewChar.ID = PlatformChar.length;
	NewChar.MaxHealth = NewChar.Health;
	NewChar.X = X;
	NewChar.Y = PlatformFloor;
	NewChar.ForceX = 0;
	NewChar.ForceY = 0;
	NewChar.Experience = 0;
	NewChar.Level = 1;
	if (Fix != null) NewChar.Fix = Fix;
	if (Combat != null) NewChar.Combat = Combat;
	if (Dialog != null) NewChar.Dialog = Dialog;
	if (NewChar.Fix == null) NewChar.Fix = false;
	if (NewChar.Combat == null) NewChar.Combat = true;
	NewChar.Run = false;
	NewChar.NextJump = 0;
	if ((NewChar.DamageBackOdds == null) || (NewChar.DamageBackOdds < 0) || (NewChar.DamageBackOdds > 1)) NewChar.DamageBackOdds = 1;
	if ((NewChar.DamageFaceOdds == null) || (NewChar.DamageFaceOdds < 0) || (NewChar.DamageFaceOdds > 1)) NewChar.DamageFaceOdds = 1;
	NewChar.FaceLeft = ((NewChar.Dialog == null) && (PlatformRoom != null) && (PlatformRoom.Width != null) && (X > PlatformRoom.Width / 2));
	if ((FaceLeft != null) && FaceLeft) NewChar.FaceLeft = true;
	PlatformChar.push(NewChar);
	if (NewChar.Camera) {
		PlatformPlayer = NewChar;
		PlatformPlayer.DamageBackOdds = 0;
		PlatformPlayer.DamageFaceOdds = 0;
	}
	return NewChar;
}

/**
 * Returns TRUE if a specific event is already done
 * @param {String} Event - The name of the event
 * @returns {Boolean} - TRUE if done
 */
function PlatformEventDone(Event) {
	return (PlatformEvent.indexOf(Event) >= 0);
}

/**
 * Adds an event to the list of events done
 * @param {String} Event - The name of the event
 * @returns {void} - Nothing
 */
function PlatformEventSet(Event) {
	if (!PlatformEventDone(Event)) PlatformEvent.push(Event);
}

/**
 * Sets the on screen message for 4 seconds
 * @param {String} Text - The text to show
 * @returns {void} - Nothing
 */
function PlatformMessageSet(Text) {
	PlatformMessage = { Text: Text, Timer: CommonTime() + 4000 };
}

/**
 * Loads a room and it's parameters
 * @param {Object} RoomName - The name of the room to load, can be null to reload the current room
 * @returns {void} - Nothing
 */
function PlatformLoadRoom(RoomName) {
	if (RoomName == null) RoomName = PlatformRoom.Name
	PlatformRoom = null;
	for (let Room of PlatformRoomList)
		if (Room.Name == RoomName)
			PlatformRoom = JSON.parse(JSON.stringify(Room));
	if (PlatformRoom == null) return;
	if (PlatformRoom.Text != null) PlatformMessageSet(PlatformRoom.Text);
	PlatformHeal = (PlatformRoom.Heal == null) ? null : CommonTime() + PlatformRoom.Heal;
	PlatformChar.splice(1, 100);
	if (PlatformRoom.Character != null)
		for (let Char of PlatformRoom.Character)
			PlatformCreateCharacter(Char.Name, Char.Status, Char.X, Char.Fix, Char.Battle, Char.Dialog);
	for (let Room of PlatformRoomList)
		if ((Room.Name == RoomName) && (Room.Entry != null))
			Room.Entry();
}

/**
 * Loads the screen, adds listeners for keys
 * @returns {void} - Nothing
 */
function PlatformLoad() {
	window.addEventListener("keydown", PlatformEventKeyDown);
	window.addEventListener("keyup", PlatformEventKeyUp);
	PlatformKeys = [];
	PlatformLastTime = CommonTime();
}

/**
 * Get the proper animation from the cycle to draw
 * @param {Object} C - The character to evaluate
 * @param {String} Pose - The pose we want
 * @param {Boolean} Cycle - TRUE if we must use the animation cycle
 * @returns {Object} - An object with the image, width & height to draw
 */
function PlatformGetAnim(C, Pose, Cycle = null) {
	for (let A = 0; A < C.Animation.length; A++)
		if (C.Animation[A].Name == Pose) {
			let CycleList = ((C.FaceLeft === true) && (C.Animation[A].CycleLeft != null)) ? C.Animation[A].CycleLeft : C.Animation[A].Cycle;
			let AnimPos;
			if ((Cycle == null) || Cycle) AnimPos = Math.floor(CommonTime() / C.Animation[A].Speed + C.ID) % CycleList.length;
			else AnimPos = Math.floor((CommonTime() - C.Action.Start) / C.Animation[A].Speed);
			if (AnimPos < 0) AnimPos = 0;
			if (AnimPos >= CycleList.length) AnimPos = CycleList.length - 1;
			if ((C.FaceLeft === true) && (C.Animation[A].CycleLeft != null)) Pose = Pose + "Left";
			return {
				Name: Pose,
				Image: CycleList[AnimPos],
				OffsetX: (C.Animation[A].OffsetX || 0),
				OffsetY: (C.Animation[A].OffsetY || 0),
				Width: (C.Animation[A].Width || C.Width),
				Height: (C.Animation[A].Height || C.Height),
				Mirror: ((C.FaceLeft === true) && (C.Animation[A].CycleLeft == null))
			}
		}
	return null;
}

/**
 * Returns TRUE if the current action for a character is ActionName
 * @param {Object} C - The character to validate
 * @param {String} ActionName - The action to validate (all actions are valid if "Any"
 * @returns {boolean} - TRUE if the character action is that string
 */
function PlatformActionIs(C, ActionName) {
	if ((C.Action != null) && (ActionName == "Any") && (C.Action.Expire != null) && (C.Action.Expire > CommonTime())) return true;
	if ((C.Action != null) && (C.Action.Name == ActionName) && (C.Action.Expire != null) && (C.Action.Expire > CommonTime())) return true;
	return false;
}

/**
 * Focuses the background camera and draws it
 * @returns {void} - Nothing
 */
function PlatformDrawBackground() {

	// Draws the background within the borders
	PlatformViewX = PlatformPlayer.X - 1000;
	if (PlatformViewX < 0) PlatformViewX = 0;
	if (PlatformViewX > PlatformRoom.Width - 2000) PlatformViewX = PlatformRoom.Width - 2000;
	PlatformViewY = PlatformPlayer.Y - 600;
	if (PlatformViewY < 0) PlatformViewY = 0;
	if (PlatformViewY > PlatformRoom.Height - 1000) PlatformViewY = PlatformRoom.Height - 1000;
	DrawImageZoomCanvas("Screens/Room/Platform/Background/" + PlatformRoom.Background + ".jpg", MainCanvas, PlatformViewX, PlatformViewY, 2000, 1000, 0, 0, 2000, 1000);
	if (PlatformRoom.BackgroundFilter != null) DrawRect(0, 0, 2000, 1000, PlatformRoom.BackgroundFilter);
	DrawProgressBar(10, 10, 180, 40, PlatformPlayer.Health / PlatformPlayer.MaxHealth * 100, "#00B000", "#B00000");
	DrawText(PlatformPlayer.Health.toString(), 100, 32, "White", "Black");
	DrawProgressBar(10, 60, 180, 40, PlatformPlayer.Experience / PlatformExperienceForLevel[PlatformPlayer.Level] * 100, "#0000B0", "Black");
	DrawText(PlatformPlayer.Level.toString(), 100, 82, "White", "Black");
	if (PlatformActionIs(PlatformPlayer, "Bind")) DrawProgressBar(10, 110, 180, 40, (CommonTime() - PlatformPlayer.Action.Start) / (PlatformPlayer.Action.Expire - PlatformPlayer.Action.Start) * 100, "White", "Black");

	// Preloads the next rooms
	if (PlatformRoom.Door != null)
		for (let Door of PlatformRoom.Door)
			for (let Room of PlatformRoomList)
				if ((Room.Name == Door.Name) && (Room.Background != null)) {
					let FileName = "Screens/Room/Platform/Background/" + Room.Background + ".jpg";
					let Obj = DrawCacheImage.get(FileName);
					if ((Obj == null) || (Obj.width == null) || (Obj.width <= 0))
						DrawImage(FileName, 2000, 1000);
					if (Room.AlternateBackground != null) {
						FileName = "Screens/Room/Platform/Background/" + Room.AlternateBackground + ".jpg";
						Obj = DrawCacheImage.get(FileName);
						if ((Obj == null) || (Obj.width == null) || (Obj.width <= 0))
							DrawImage(FileName, 2000, 1000);
					}
				}

}

/**
 * Draw a specific character on the screen if needed
 * @param {Object} C - The character to draw
 * @param {Number} Time - The current time when the action is done
 * @returns {void} - Nothing
 */
function PlatformDrawCharacter(C, Time) {
	let X = C.X - C.Anim.Width / 2 - PlatformViewX;
	let Y = C.Y - C.Anim.Height - PlatformViewY
	if ((X >= 2000) || (Y >= 1000)) return;
	if ((X + C.Anim.Width <= 0) || (Y + C.Anim.Height <= 0)) return;
	DrawImageEx("Screens/Room/Platform/Character/" + C.Name + "/" + C.Status + "/" + C.Anim.Name + "/" + C.Anim.Image.toString() + ".png", X + C.Anim.OffsetX, Y + C.Anim.OffsetY, { Mirror: C.Anim.Mirror, Width: C.Anim.Width, Height: C.Anim.Height } );
	if (C.Damage != null)
		for (let Damage of C.Damage)
			if (Damage.Expire >= Time) {
				DrawImageZoomCanvas("Screens/Room/Platform/" + (C.Camera ? "Enemy" : "Player") + "Hit.png", MainCanvas, 0, 0, 512, 512, X + C.Anim.Width / 2 - 50, Y - 250 + Math.floor((Damage.Expire - Time) / 10), 100, 100);
				DrawText(Damage.Value.toString(), X + C.Anim.Width / 2, Y - 200 + Math.floor((Damage.Expire - Time) / 10), (C.Camera ? "White" : "Black"), (C.Camera ? "Black" : "White"));
			}
}

/**
 * Adds experience points to the player, can also gain a level which heals fully
 * @param {Object} C - The character that will gain experience
 * @param {Number} Value - The exp value to add
 * @returns {void} - Nothing
 */
function PlatformAddExperience(C, Value) {
	C.Experience = C.Experience + Value;
	if (C.Experience >= PlatformExperienceForLevel[C.Level]) {
		if (C.Camera) PlatformMessageSet(TextGet("LevelUp").replace("CharacterName", C.Name));
		C.MaxHealth = C.MaxHealth + C.HealthPerLevel;
		C.Health = C.MaxHealth;
		C.Experience = 0;
		C.Level++;
	}
}

/**
 * Applies damage on a target, can become wounded at 0 health
 * @param {Object} Source - The character doing the damage
 * @param {Object} Target - The character getting the damage
 * @param {Number} Damage - The number of damage to apply
 * @param {Number} Time - The current time when the action is done
 * @returns {void} - Nothing
 */
function PlatformDamage(Source, Target, Damage, Time) {
	if (!PlatformActionIs(Target, "Any")) {
		if (Math.random() < Target.DamageBackOdds) Target.FaceLeft = (Source.X - Target.X > 0);
		else if (Math.random() < Target.DamageFaceOdds) Target.FaceLeft = (Source.X - Target.X <= 0);
	}
	Target.ForceX = (Target.DamageKnockForce + Math.random() * Target.DamageKnockForce) * ((Source.X - Target.X < 0) ? 1 : -1);
	Target.Immunity = Time + 500;
	Target.Health = Target.Health - Damage;
	if (Target.Damage == null) Target.Damage = [];
	Target.Damage.push({ Value: Damage, Expire: Time + 2000});
	if (Target.Health <= 0) {
		Target.Health = 0;
		Target.RiseTime = Time + 10000;
		Target.Immunity = Time + 2000;
	}
}

/**
 * Checks if the hitbox of an attack clashes with a hitbox of the target
 * @param {Object} Source - The character doing the damage
 * @param {Object} Target - The character getting the damage
 * @param {Array} HitBox - The hitbox of the attack
 * @returns {boolean} - TRUE if there's a clash
 */
function PlatformHitBoxClash(Source, Target, HitBox) {

	// Exits right away if data is invalid
	if ((Source == null) || (Target == null) || (HitBox == null)) return;

	// Finds the X and Y of the source hitbox
	let SX1 = Source.X - (Source.Width / 2) + (HitBox[0] * Source.Width);
	if (Source.FaceLeft) SX1 = Source.X + (Source.Width / 2) - (HitBox[2] * Source.Width);
	let SX2 = Source.X - (Source.Width / 2) + (HitBox[2] * Source.Width);
	if (Source.FaceLeft) SX2 = Source.X + (Source.Width / 2) - (HitBox[0] * Source.Width);
	let SY1 = Source.Y - Source.Height + (HitBox[1] * Source.Height);
	let SY2 = Source.Y - Source.Height + (HitBox[3] * Source.Height);

	// Finds the X and Y of the target hitbox
	let TX1 = Target.X - (Target.Width / 2) + (Target.HitBox[0] * Target.Width);
	if (Target.FaceLeft) TX1 = Target.X + (Target.Width / 2) - (Target.HitBox[2] * Target.Width);
	let TX2 = Target.X - (Target.Width / 2) + (Target.HitBox[2] * Target.Width);
	if (Target.FaceLeft) TX2 = Target.X + (Target.Width / 2) - (Target.HitBox[0] * Target.Width);
	let TY1 = Target.Y - Target.Height + (Target.HitBox[1] * Target.Height);
	let TY2 = Target.Y - Target.Height + (Target.HitBox[3] * Target.Height);

	// Shows the hitboxes if we debug
	if (PlatformShowHitBox) {
		DrawRect(SX1 - PlatformViewX, SY1 - PlatformViewY, SX2 - SX1, SY2 - SY1, "red");
		DrawRect(TX1 - PlatformViewX, TY1 - PlatformViewY, TX2 - TX1, TY2 - TY1, "green");
		console.log(SX1 + " " + SX2 + " " + SY1 + " " + SY2);
		console.log(TX1 + " " + TX2 + " " + TY1 + " " + TY2);
	}

	// If both hitboxes clashes, we return TRUE
	if ((SX1 >= TX1) && (SY1 >= TY1) && (SX1 <= TX2) && (SY1 <= TY2)) return true;
	if ((SX2 >= TX1) && (SY1 >= TY1) && (SX2 <= TX2) && (SY1 <= TY2)) return true;
	if ((SX1 >= TX1) && (SY2 >= TY1) && (SX1 <= TX2) && (SY2 <= TY2)) return true;
	if ((SX2 >= TX1) && (SY2 >= TY1) && (SX2 <= TX2) && (SY2 <= TY2)) return true;
	return false;

}

/**
 * Checks if the character action can attack someone else
 * @param {Object} Source - The character doing the action
 * @param {Number} Time - The current time when the action is done
 * @returns {void} - Nothing
 */
function PlatformProcessAction(Source, Time) {
	if ((Source == null) || (Source.Anim == null) || (Source.Anim.Name == null) || (Source.Anim.Image == null) || (Source.Health <= 0)) return;
	for (let Target of PlatformChar)
		if ((Target.ID != Source.ID) && (Target.Health > 0) && Target.Combat && ((Target.Immunity == null) || (Target.Immunity < Time))) {
			let HitBox = null;
			let Damage = 0;
			if (Source.Attack != null)
				for (let Attack of Source.Attack)
					if ((Attack.Name == Source.Anim.Name) && (Attack.HitAnimation != null) && (Attack.HitAnimation.indexOf(Source.Anim.Image) >= 0)) {
						Damage = Attack.Damage[Source.Level];
						HitBox = Attack.HitBox;
						break;
					}
			if (PlatformHitBoxClash(Source, Target, HitBox))
				return PlatformDamage(Source, Target, Damage, Time);
		}
}

/**
 * Calculates the X force to apply based on the time it took until the last frame and the speed of the object
 * @param {Number} Speed - The speed of the object
 * @param {Number} Frame - The number of milliseconds since the last frame
 * @returns {Number} - The force to apply
 */
function PlatformWalkFrame(Speed, Frame) {
	return Frame * Speed / 50;
}

/**
 * Does collision damage for a character
 * @param {Object} Target - The character that will be damaged
 * @param {Number} Time - The current time when the action is done
 * @returns {void} - Nothing
 */
function PlatformCollisionDamage(Target, Time) {
	if ((Target == null) || (PlatformChar == null) || (Target.Health <= 0)) return;
	for (let Source of PlatformChar)
		if ((Source.ID != Target.ID) && (Source.Health > 0) && Source.Combat && (Source.CollisionDamage > 0) && ((Target.Immunity == null) || (Target.Immunity < Time)))
			if (PlatformHitBoxClash(Source, Target, Source.HitBox))
				return PlatformDamage(Source, Target, Source.CollisionDamage, Time);
}

/**
 * Checks if an opponent can bind the player
 * @param {Object} Source - The opponent that can bind
 * @param {Number} Time - The current time when the action is done
 * @returns {void} - Nothing
 */
function PlatformBindPlayer(Source, Time) {
	if ((PlatformPlayer.Health > 0) || (Source.Health <= 0)) return;
	if (PlatformPlayer.Bound || Source.Bound) return;
	if ((PlatformPlayer.Immunity != null) && (PlatformPlayer.Immunity > Time)) return;
	if ((Source.Action != null) && (Source.Action.Name == "Bind")) return;
	if ((PlatformPlayer.Y != PlatformFloor) || (Source.Y != PlatformFloor) || (Math.abs(PlatformPlayer.X - Source.X) > 50)) return;
	PlatformPlayer.RiseTime = Time + 10000;
	Source.ForceX = 0;
	Source.Action = { Name: "Bind", Target: PlatformPlayer.ID, Start: Time, Expire: Time + 2000 };
}

/**
 * Returns TRUE if the player input is valid for a move
 * @param {Object} Move - The movement type (Crouch, jump, left, right, etc.)
 * @returns {boolean}
 */
function PlatformMoveActive(Move) {

	// Crouching can be done by down on the joystick DPAD or S on the keyboard
	if ((Move == "Crouch") && ((PlatformKeys.indexOf(83) >= 0) || (PlatformKeys.indexOf(115) >= 0))) return true;
	if ((Move == "Crouch") && ControllerActive && (PlatformButtons != null) && PlatformButtons[ControllerDPadDown].pressed) return true;
	if ((Move == "Crouch") && CommonTouchActive(150, 850, 100, 100)) return true;

	// Moving left can be done with jostick DPAD or A or Z on the keyboard
	if ((Move == "Left") && ((PlatformKeys.indexOf(65) >= 0) || (PlatformKeys.indexOf(97) >= 0) || (PlatformKeys.indexOf(81) >= 0) || (PlatformKeys.indexOf(113) >= 0))) return true;
	if ((Move == "Left") && ControllerActive && (PlatformButtons != null) && PlatformButtons[ControllerDPadLeft].pressed) return true;
	if ((Move == "Left") && CommonTouchActive(50, 750, 100, 100)) return true;

	// Moving right can be done with jostick DPAD or D on the keyboard
	if ((Move == "Right") && ((PlatformKeys.indexOf(68) >= 0) || (PlatformKeys.indexOf(100) >= 0))) return true;
	if ((Move == "Right") && ControllerActive && (PlatformButtons != null) && PlatformButtons[ControllerDPadRight].pressed) return true;
	if ((Move == "Right") && CommonTouchActive(250, 750, 100, 100)) return true;

	// Jumping can be done by B on the joystick DPAD or spacebar on the keyboard
	if ((Move == "Jump") && (PlatformKeys.indexOf(32) >= 0)) return true;
	if ((Move == "Jump") && ControllerActive && (PlatformButtons != null) && PlatformButtons[ControllerA].pressed) return true;
	if ((Move == "Jump") && CommonTouchActive(1850, 750, 100, 100)) return true;

	// If all else fails, the move is not active
	return false;

}

/**
 * Draw scenery + all characters, apply X and Y forces
 * @returns {void} - Nothing
 */
function PlatformDraw() {

	// Check if we must enter a new room
	PlatformEnterRoom(PlatformPlayer.FaceLeft ? "Left" : "Right");
	if (PlatformPlayer.Bound) PlatformMessageSet(TextGet("GameOver"));

	// Keep the last time
	let PlatformTime = CommonTime();
	if (PlatformLastTime == null) PlatformLastTime = PlatformTime;
	let Frame = PlatformTime - PlatformLastTime;

	// Only catches actions if health is greater than zero
	if (PlatformPlayer.Health > 0) {

		// Walk/Crawl left (A or Q for QWERTY and AZERTY)
		if (PlatformMoveActive("Left")) {
			PlatformPlayer.FaceLeft = true;
			if (PlatformPlayer.ForceX > 0) PlatformPlayer.ForceX = 0;
			else PlatformPlayer.ForceX = PlatformPlayer.ForceX - PlatformWalkFrame(((PlatformPlayer.Y == PlatformFloor) && PlatformMoveActive("Crouch")) ? PlatformPlayer.CrawlSpeed : (PlatformPlayer.Run ? PlatformPlayer.RunSpeed : PlatformPlayer.WalkSpeed), Frame);
		}

		// Walk/Crawl right
		if (PlatformMoveActive("Right")) {
			PlatformPlayer.FaceLeft = false;
			if (PlatformPlayer.ForceX < 0) PlatformPlayer.ForceX = 0;
			else PlatformPlayer.ForceX = PlatformPlayer.ForceX + PlatformWalkFrame(((PlatformPlayer.Y == PlatformFloor) && PlatformMoveActive("Crouch")) ? PlatformPlayer.CrawlSpeed : (PlatformPlayer.Run ? PlatformPlayer.RunSpeed : PlatformPlayer.WalkSpeed), Frame);
		}

		// Jump foces the player up on the Y axis
		if (PlatformMoveActive("Jump") && (PlatformPlayer.Y == PlatformFloor))
			PlatformPlayer.ForceY = PlatformPlayer.JumpForce * -1;

	}

	// Release jump
	if (!PlatformMoveActive("Jump") && (PlatformPlayer.ForceY < 0))
		PlatformPlayer.ForceY = PlatformPlayer.ForceY + PlatformWalkFrame(PlatformGravitySpeed * 2, Frame);

	// If we must heal 1 HP to all characters in the room
	let MustHeal = ((PlatformHeal != null) && (PlatformHeal < PlatformTime));
	if (MustHeal) PlatformHeal = (PlatformRoom.Heal == null) ? null : CommonTime() + PlatformRoom.Heal;

	// Draw each characters
	for (let C of PlatformChar) {

		// Enemies will stand up at half health if they were not restrained
		if ((C.Health == 0) && (C.RiseTime != null) && (C.RiseTime < PlatformTime) && !C.Bound)
			C.Health = Math.round(C.MaxHealth / 2);

		// Heal the character
		if (MustHeal && (C.Health > 0) && (C.Health < C.MaxHealth))
			C.Health++;

		// AI walks from left to right
		if (!C.Camera && (C.Health > 0) && !C.Fix) {
			if (C.FaceLeft) {
				if (C.X <= ((PlatformRoom.LimitLeft != null) ? PlatformRoom.LimitLeft + 50 : 100)) {
					C.FaceLeft = false;
					C.ForceX = 0;
				} else C.ForceX = C.ForceX - PlatformWalkFrame(C.Run ? C.RunSpeed : C.WalkSpeed, Frame);
			} else {
				if (C.X >= ((PlatformRoom.LimitRight != null) ? PlatformRoom.LimitRight - 50 : PlatformRoom.Width - 100)) {
					C.FaceLeft = true;
					C.ForceX = 0;
				} else C.ForceX = C.ForceX + PlatformWalkFrame(C.Run ? C.RunSpeed : C.WalkSpeed, Frame);
			}
			if ((C.JumpOdds != null) && (C.JumpOdds > 0) && (Math.random() < C.JumpOdds * Frame) && (C.Y == PlatformFloor) && (C.NextJump <= PlatformTime) && !PlatformActionIs(C, "Any"))
				C.ForceY = (C.JumpForce + Math.random() * C.JumpForce) * -0.5;
			if ((C.RunOdds != null) && (C.RunOdds > 0) && (Math.random() < C.RunOdds * Frame) && (C.Y == PlatformFloor))
				C.Run = !C.Run;
			if ((C.StandAttackSlowOdds != null) && (C.StandAttackSlowOdds > 0) && (Math.random() < C.StandAttackSlowOdds * Frame))
				PlatformAttack(C, "StandAttackSlow");
			PlatformBindPlayer(C, PlatformTime);
		}

		// If the bind action has expired, we bind or release the target
		if ((C.Action != null) && (C.Action.Name === "Bind") && (C.Action.Expire != null) && (C.Action.Target != null)) {
			C.ForceX = 0;
			if (C.Action.Expire < CommonTime()) {
				for (let Target of PlatformChar)
					if (Target.ID == C.Action.Target) {
						PlatformAddExperience(C, Target.ExperienceValue);
						if (Target.OnBind != null) Target.OnBind();
						Target.Bound = true;
					}
				C.Action = null;
			}
		}

		// Applies the forces and turns the face
		C.X = C.X + C.ForceX * Frame / 16.6667;
		if (C.X < 100) C.X = 100;
		if ((PlatformRoom.LimitLeft != null) && (C.X < PlatformRoom.LimitLeft)) C.X = PlatformRoom.LimitLeft;
		if (C.X > PlatformRoom.Width - 100) C.X = PlatformRoom.Width - 100;
		if ((PlatformRoom.LimitRight != null) && (C.X > PlatformRoom.LimitRight)) C.X = PlatformRoom.LimitRight;
		C.Y = C.Y + C.ForceY * Frame / 16.6667;
		if (C.Y > PlatformFloor) {
			C.Y = PlatformFloor;
			C.NextJump = PlatformTime + 500;
		}

		// Finds the animation based on what the character is doing
		let Crouch = (C.Camera && PlatformMoveActive("Crouch"));
		if ((C.Health <= 0) && C.Bound) C.Anim = PlatformGetAnim(C, "Bound");
		else if (C.Health <= 0) C.Anim = PlatformGetAnim(C, "Wounded");
		else if (PlatformActionIs(C, "Any")) C.Anim = PlatformGetAnim(C, C.Action.Name, false);
		else if (C.Y != PlatformFloor) C.Anim = PlatformGetAnim(C, "Jump");
		else if ((C.ForceX != 0) && Crouch) C.Anim = PlatformGetAnim(C, "Crawl");
		else if ((C.ForceX != 0) && C.Run) C.Anim = PlatformGetAnim(C, "Run");
		else if (C.ForceX != 0) C.Anim = PlatformGetAnim(C, "Walk");
		else if (Crouch) C.Anim = PlatformGetAnim(C, "Crouch");
		else C.Anim = PlatformGetAnim(C, "Idle");

		// Draws the background if we are focusing on that character
		if (C.Camera) {
			PlatformDrawBackground();
			if ((PlatformMessage != null) && (PlatformMessage.Text != null) && (PlatformMessage.Timer != null) && (PlatformMessage.Timer > CommonTime()))
				DrawText(PlatformMessage.Text, 1000, 50, "White", "Black");
		}

		// Draws the character and reduces the force for the next run
		if (!C.Camera && C.Anim != null) PlatformDrawCharacter(C, PlatformTime);
		C.ForceX = C.ForceX * (1 - 0.25 * (Frame / 16.6667));
		if (C.Y == PlatformFloor) C.ForceY = 0;
		else C.ForceY = C.ForceY + (PlatformGravitySpeed * Frame / 50);
		if ((C.ForceX > -0.5) && (C.ForceX < 0.5)) C.ForceX = 0;

	}

	// Processes the action done by the characters
	for (let C of PlatformChar)
		if (PlatformActionIs(C, "Any"))
			PlatformProcessAction(C, PlatformTime);

	// Does collision damage for the player
	PlatformCollisionDamage(PlatformPlayer, PlatformTime);

	// Draws the UpArrow
	if (PlatformDrawUpArrow[0] != null || PlatformDrawUpArrow[1] != null) {
		DrawRect(PlatformDrawUpArrow[0] - PlatformViewX - 43, PlatformDrawUpArrow[1] - PlatformViewY - 43, 86, 86, "white");
		DrawImage("Icons/North.png", PlatformDrawUpArrow[0] - PlatformViewX - 43, PlatformDrawUpArrow[1] - PlatformViewY - 43);
	}

	// Draws the player last to put her in front
	PlatformDrawCharacter(PlatformPlayer, PlatformTime);

	// Draws the mobile buttons
	if (CommonIsMobile) {
		DrawEmptyRect(50, 750, 100, 100, CommonTouchActive(50, 750, 100, 100) ? "cyan" : "#FFFFFF80", 4);
		DrawEmptyRect(250, 750, 100, 100, CommonTouchActive(250, 750, 100, 100) ? "cyan" : "#FFFFFF80", 4);
		DrawEmptyRect(150, 650, 100, 100, CommonTouchActive(150, 650, 100, 100) ? "cyan" : "#FFFFFF80", 4);
		DrawEmptyRect(150, 850, 100, 100, CommonTouchActive(150, 850, 100, 100) ? "cyan" : "#FFFFFF80", 4);
		DrawEmptyRect(1650, 750, 100, 100, CommonTouchActive(1650, 750, 100, 100) ? "cyan" : "#FFFFFF80", 4);
		DrawEmptyRect(1850, 750, 100, 100, CommonTouchActive(1850, 750, 100, 100) ? "cyan" : "#FFFFFF80", 4);
		DrawEmptyRect(1750, 650, 100, 100, CommonTouchActive(1750, 650, 100, 100) ? "cyan" : "#FFFFFF80", 4);
		DrawEmptyRect(1750, 850, 100, 100, CommonTouchActive(1750, 850, 100, 100) ? "cyan" : "#FFFFFF80", 4);
	}

	// Keeps the time of the frame for the next run
	PlatformLastTime = PlatformTime;

}

/**
 * Runs and draws the screen.
 * @returns {void} - Nothing
 */
function PlatformRun() {
	PlatformDraw();
	if (Player.CanWalk()) DrawButton(1900, 10, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
	if (CommonIsMobile) PlatformTouch();
}

/**
 * Starts an attack by the source
 * @param {Object} Source - The character doing the action
 * @param {String} Type - The action type (Punch, Kick, Sweep, etc.)
 * @returns {void} - Nothing
 */
function PlatformAttack(Source, Type) {
	if (PlatformActionIs(Source, "Any")) return;
	Source.Run = false;
	for (let Attack of Source.Attack)
		if (Attack.Name == Type)
			Source.Action = { Name: Type, Start: CommonTime(), Expire: CommonTime() + Attack.Speed };
}

/**
 * Handles clicks in the screen
 * @returns {void} - Nothing
 */
function PlatformClick() {
	if (MouseIn(1900, 10, 90, 90) && Player.CanWalk()) return PlatformLeave();
	if (!CommonIsMobile) PlatformAttack(PlatformPlayer, PlatformMoveActive("Crouch") ? "CrouchAttackFast" : "StandAttackFast");
}

/**
 * When the screens exits, we unload the listeners
 * @returns {void} - Nothing
 */
function PlatformLeave() {
	window.removeEventListener("keydown", PlatformEventKeyDown);
	window.removeEventListener("keyup", PlatformEventKeyUp);
	CommonSetScreen("Room", "MainHall");
}

/**
 * Enters a new room if the entry conditions are met
 * @param {String} FromType - The type of room enter (Up, Left, Right)
 * @returns {void} - Nothing
 */
function PlatformEnterRoom(FromType) {
	PlatformDrawUpArrow = [null,null];
	if ((PlatformRoom == null) || (PlatformRoom.Door == null)) return;
	for (let Door of PlatformRoom.Door)
		if ((PlatformPlayer.X >= Door.FromX) && (PlatformPlayer.X <= Door.FromX + Door.FromW) && (PlatformPlayer.Y >= Door.FromY) && (PlatformPlayer.Y <= Door.FromY + Door.FromH) && ("Up" === Door.FromType)) {
			PlatformDrawUpArrow = [Door.FromX + Door.FromW / 2, Door.FromY + Door.FromH / 2];
		}
	for (let Door of PlatformRoom.Door)
		if ((PlatformPlayer.X >= Door.FromX) && (PlatformPlayer.X <= Door.FromX + Door.FromW) && (PlatformPlayer.Y >= Door.FromY) && (PlatformPlayer.Y <= Door.FromY + Door.FromH) && (FromType === Door.FromType)) {
			PlatformLoadRoom(Door.Name);
			PlatformPlayer.Run = false;
			PlatformPlayer.X = Door.ToX;
			PlatformPlayer.FaceLeft = Door.ToFaceLeft;
			return;
		}
	if (FromType == "Up")
		for (let Char of PlatformChar)
			if ((Char.Dialog != null) && (Math.abs(PlatformPlayer.X - Char.X) <= 150) && (Math.abs(PlatformPlayer.Y - Char.Y) <= 450))
				return PlatformDialogStart(Char.Dialog);
}

/**
 * Checks if there's a target character to bind and starts the binding process
 * @param {Object} Source - The source character that does the binding
 * @returns {void} - Nothing
 */
function PlatformBindStart(Source) {
	if (PlatformActionIs(Source, "Any")) return;
	if (PlatformKeys.length > 0) return;
	for (let C of PlatformChar)
		if ((Source.ID != C.ID) && (C.Bound == null) && (C.Status != "Bound") && (C.Health == 0) && (Math.abs(Source.X - C.X + (Source.FaceLeft ? -75 : 75)) < 150) && (Math.abs(Source.Y - C.Y) < 150) && (Source.Y == PlatformFloor)) {
			C.RiseTime = CommonTime() + 10000;
			Source.ForceX = 0;
			Source.Action = { Name: "Bind", Target: C.ID, Start: CommonTime(), Expire: CommonTime() + 2000 };
			return;
		}
}

/**
 * Saves the game on a specific slot
 * @param {Number} Slot - The slot to use (from 0 to 9)
 * @returns {void} - Nothing
 */
function PlatformSaveGame(Slot) {
	let SaveChar = [];
	for (let Char of PlatformDialogCharacter)
		if ((Char.Love != null) || (Char.Domination != null))
			SaveChar.push({ Name: Char.Name, Love: Char.Love, Domination: Char.Domination });
	let SaveObj = {
		Character: PlatformPlayer.Name,
		Status: PlatformPlayer.Status,
		Level: PlatformPlayer.Level,
		Experience: PlatformPlayer.Experience,
		Room: PlatformRoom.Name,
		Event: PlatformEvent,
		Dialog: SaveChar
	};
	localStorage.setItem("BondageBrawlSave" + Slot.toString(), JSON.stringify(SaveObj));
	PlatformMessageSet("Game saved on slot " + Slot.toString());
}

/**
 * Loads the game on a specific slot
 * @param {Number} Slot - The slot to use (from 0 to 9)
 * @returns {void} - Nothing
 */
function PlatformLoadGame(Slot) {
	let LoadStr = localStorage.getItem("BondageBrawlSave" + Slot.toString());
	if (LoadStr == null) return;
	let LoadObj = JSON.parse(LoadStr);
	if (LoadObj.Character == null) return;
	if (LoadObj.Status == null) return;
	if (LoadObj.Room == null) return;
	PlatformChar = [];
	PlatformCreateCharacter(LoadObj.Character, LoadObj.Status, 1000);
	PlatformPlayer.Status = LoadObj.Status;
	PlatformEvent = LoadObj.Event;
	if (PlatformEvent == null) PlatformEvent = [];
	PlatformLoadRoom(LoadObj.Room);
	PlatformPlayer.X = Math.round(PlatformRoom.Width / 2);
	if (LoadObj.Level != null) PlatformPlayer.Level = LoadObj.Level;
	if (PlatformPlayer.Level > 1) PlatformPlayer.MaxHealth = PlatformPlayer.MaxHealth + PlatformPlayer.HealthPerLevel * (PlatformPlayer.Level - 1);
	PlatformPlayer.Health = PlatformPlayer.MaxHealth;
	if (LoadObj.Experience != null) PlatformPlayer.Experience = LoadObj.Experience;
	PlatformDialogCharacter = JSON.parse(JSON.stringify(PlatformDialogCharacterTemplate));
	if (LoadObj.Dialog != null)
		for (let DialogChar of LoadObj.Dialog)
			for (let Char of PlatformDialogCharacter)
				if (DialogChar.Name == Char.Name) {
					Char.Love = DialogChar.Love;
					Char.Domination = DialogChar.Domination;
				}
	CommonSetScreen("Room", "Platform");
}

/**
 * Handles keys pressed
 * @param {Object} e - The key pressed
 * @returns {void} - Nothing
 */
function PlatformEventKeyDown(e) {
	PlatformPlayer.Run = ((e.keyCode == PlatformLastKeyCode) && (CommonTime() <= PlatformLastKeyTime + 333) && ([65, 97, 68, 100].indexOf(e.keyCode) >= 0) && (PlatformKeys.indexOf(e.keyCode) < 0)) || ((e.keyCode == PlatformLastKeyCode) && PlatformPlayer.Run && (PlatformKeys.indexOf(e.keyCode) >= 0));
	if (PlatformPlayer.Health <= 0) return;
	if (PlatformActionIs(PlatformPlayer, "Bind")) PlatformPlayer.Action = null;
	if (e.keyCode == 32) PlatformPlayer.Action = null;
	if ((e.keyCode == 87) || (e.keyCode == 119) || (e.keyCode == 90) || (e.keyCode == 122)) return PlatformEnterRoom("Up");
	if ((e.keyCode == 76) || (e.keyCode == 108)) return PlatformAttack(PlatformPlayer, PlatformMoveActive("Crouch") ? "CrouchAttackFast" : "StandAttackFast");
	if ((e.keyCode == 75) || (e.keyCode == 107)) return PlatformAttack(PlatformPlayer, PlatformMoveActive("Crouch") ? "CrouchAttackSlow" : "StandAttackSlow");
	if ((e.keyCode == 79) || (e.keyCode == 111)) return PlatformBindStart(PlatformPlayer);
	if ((PlatformRoom.Heal != null) && (e.keyCode >= 48) && (e.keyCode <= 57)) return PlatformSaveGame(e.keyCode - 48);
	if (PlatformKeys.indexOf(e.keyCode) < 0) PlatformKeys.push(e.keyCode);
	PlatformLastKeyCode = e.keyCode;
	PlatformLastKeyTime = CommonTime();
}

/**
 * Handles keys released
 * @param {Object} e - The key released
 * @returns {void} - Nothing
 */
function PlatformEventKeyUp(e) {
	if (PlatformKeys.indexOf(e.keyCode) >= 0) PlatformKeys.splice(PlatformKeys.indexOf(e.keyCode), 1);
}

/**
 * Handles the controller inputs
 * @param {Object} Buttons - The buttons pressed on the controller
 * @returns {boolean} - Always TRUE to indicate that the controller is handled
 */
function PlatformController(Buttons) {

	// Double-tap management to run left
	if ((Buttons[ControllerDPadLeft].pressed == true) && (ControllerGameActiveButttons.LEFT == false)) {
		PlatformPlayer.Run = false;
		if (PlatformRunDirection != "LEFT") {
			PlatformRunDirection = "LEFT";
		} else {
			if ((CommonTime() <= PlatformRunTime + 333))
				PlatformPlayer.Run = true;
		}
		PlatformRunTime = CommonTime();
	}

	// Double-tap management to run right
	if ((Buttons[ControllerDPadRight].pressed == true) && (ControllerGameActiveButttons.RIGHT == false)) {
		PlatformPlayer.Run = false;
		if (PlatformRunDirection != "RIGHT") {
			PlatformRunDirection = "RIGHT";
		} else {
			if ((CommonTime() <= PlatformRunTime + 333))
				PlatformPlayer.Run = true;
		}
		PlatformRunTime = CommonTime();
	}

	// On a new A, X, Y or UP button, we activate the keyboard equivalent
	if ((Buttons[ControllerB].pressed == true) && (ControllerGameActiveButttons.B == false)) PlatformEventKeyDown({ keyCode: 76 });
	if ((Buttons[ControllerX].pressed == true) && (ControllerGameActiveButttons.X == false)) PlatformEventKeyDown({ keyCode: 75 });
	if ((Buttons[ControllerY].pressed == true) && (ControllerGameActiveButttons.Y == false)) PlatformEventKeyDown({ keyCode: 79 });
	if ((Buttons[ControllerDPadUp].pressed == true) && (ControllerGameActiveButttons.UP == false)) PlatformEventKeyDown({ keyCode: 90 });
	PlatformButtons = Buttons;
	return true;

}

/**
 * Handles the touched regions for mobile play
 * @returns {void}
 */
function PlatformTouch() {
	if (CommonTouchActive(150, 650, 100, 100) && !CommonTouchActive(150, 650, 100, 100, PlatformLastTouch)) PlatformEventKeyDown({ keyCode: 90 });
	if (CommonTouchActive(1750, 850, 100, 100) && !CommonTouchActive(1750, 850, 100, 100, PlatformLastTouch)) PlatformEventKeyDown({ keyCode: 76 });
	if (CommonTouchActive(1650, 750, 100, 100) && !CommonTouchActive(1650, 750, 100, 100, PlatformLastTouch)) PlatformEventKeyDown({ keyCode: 75 });
	if (CommonTouchActive(1750, 650, 100, 100) && !CommonTouchActive(1750, 650, 100, 100, PlatformLastTouch)) PlatformEventKeyDown({ keyCode: 79 });
	PlatformLastTouch = CommonTouchList;
}