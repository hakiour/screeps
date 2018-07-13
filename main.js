/* Made by Hamza Akiour || www.hamza.es */
var genericFunctions = require('genericFunctions');
var masterSpawner = require('masterSpawner');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleFarmer = require('role.farmer');
var roleRepairman = require('role.repairman');
var roleMiner = require('role.miner');
var roleAssault = require('role.assault');
var roleHealer = require('role.healer');
var roleClaimer = require('role.claimer');
var roleTransporter = require('role.transporter');
var roleTester = require('role.tester');
var roleRemoteWorker = require('role.remoteWorker');
require('prototype.tower');


module.exports.loop = function () {
    const creepsLog = false;

    masterSpawner.clearMemoryOfDeadCreeps();

    for(let spawnerName in Game.spawns){
    	let spawner = Game.spawns[spawnerName];
    	let countByRole = _.countBy(spawner.room.find(FIND_MY_CREEPS), 'memory.role');
		let globalCountByRole = _.countBy(Game.creeps, 'memory.role');
	
    	//Basics rols, every room has his owns
	    var harvesters = countByRole['harvester'] || 0;
	    var builders = countByRole['builder'] || 0;
	    var upgraders = countByRole['upgrader'] || 0;
	    var farmers = countByRole['farmer'] || 0;
	    var repairman = countByRole['repairman'] || 0;

	    //Generic rols, all rooms share this units
	    var miners = globalCountByRole['miner'] || 0;
	    var assault = globalCountByRole['unit_assault'] || 0;
	    var healers = globalCountByRole['unit_healer'] || 0;
	    var claimers = globalCountByRole['claimer'] || 0;
	    var transporters = globalCountByRole['transporter'] || 0;
	    var testers = globalCountByRole['tester'] || 0;
	    var remoteWorkers = globalCountByRole['remoteWorker'] || 0;
		
		if (!spawner.spawning){
		    //If the total of creeps is less than the minimum, spawn a new creep with the suitable rol&parts
		    if(assault < spawner.memory.minUnitAssault){
		        masterSpawner.createNewCreep(spawner, "unit_assault");
		    }else if(healers < spawner.memory.minUnitHealer ){
		        masterSpawner.createNewCreep(spawner, "unit_healer");
		    }else if(farmers < spawner.memory.minFarmers) {
		        masterSpawner.createNewCreep(spawner, "farmer");
		    }else if(harvesters < spawner.memory.minHarvesters) {
		        masterSpawner.createNewCreep(spawner, "harvester");
		    }else if(upgraders < spawner.memory.minUpgraders) {
		        masterSpawner.createNewCreep(spawner, "upgrader");
		    }else if(repairman < spawner.memory.minRepairman) {
		        masterSpawner.createNewCreep(spawner, "repairman");
		    }else if(claimers < spawner.memory.minClaimers ){
		        masterSpawner.createNewCreep(spawner, "claimer");
		    }else if(builders < spawner.memory.minBuilders) {
		        masterSpawner.createNewCreep(spawner, "builder");
		    }else if(testers < spawner.memory.minTesters){
		        masterSpawner.createNewCreep(spawner, "tester");
		    }else if(remoteWorkers < spawner.memory.minRemoteWorkers){
		        masterSpawner.createNewCreep(spawner, "remoteWorker");
		    }else if(miners < spawner.memory.minMiners){
		        masterSpawner.createNewCreep(spawner, "miner");
		    }else if(transporters < spawner.memory.minTransporters){
		        masterSpawner.createNewCreep(spawner, "transporter");
		    }
		}

		//Room information
        if (creepsLog){
	  	console.log("SPAWNER: " + spawnerName);
	    console.log('Harvesters: ' + harvesters + ' Builders: ' + builders + ' Upgraders: ' + upgraders  + ' Farmers: ' + farmers + ' Repairman: ' + repairman + ' Miners: ' + miners+ ' Transporter: ' + transporters + ' Claimers: ' + claimers);
	    console.log('ARMY -- ASSAULT: ' + assault + ' HEALERS: ' + healers);
	    console.log('TESTER: ' + testers);
	    console.log("-------------------------");
        }
        
	    //Draw a message with the crep role
	    if(spawner.spawning) { 
	        spawner.room.visual.text(
	            '🛠️' + Game.creeps[spawner.spawning.name].memory.role,
	            spawner.pos.x + 1, 
	            spawner.pos.y, 
	            {align: 'left', opacity: 0.8});
	    }  

	}
    //Find all towers
    var towers = _.filter(Game.structures, Tower => Tower.structureType == STRUCTURE_TOWER);
    //For each tower
    for (let tower of towers) {
        if (!tower.attackNearEnemys()) {
            tower.supportNearAllys();
        }
    }

    //Find all creeps and call for their methods
	for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        switch(creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'farmer':
                roleFarmer.run(creep);
                break;
            case 'repairman':
                roleRepairman.run(creep);
                break;
            case 'miner':
                roleMiner.run(creep);
                break;
            case 'transporter':
                roleTransporter.run(creep);
                break;
            case 'claimer':
                roleClaimer.run(creep);
                break;
            case 'unit_assault':
                roleAssault.run(creep);
                break;
            case 'unit_healer':
                roleHealer.run(creep);
                break;
            case 'tester':
                roleTester.run(creep);
                break;
            case 'remoteWorker':
            	roleRemoteWorker.run(creep);
            	break;
	        }
	    }
}