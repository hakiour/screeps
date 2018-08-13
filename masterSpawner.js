var genericFunctions = require('genericFunctions');
module.exports = {
	/** @param {Spawn} Spawn
        @param {String} role **/
	createNewCreep: function(spawner, role) {
		let parts = [];
		let minimumParts = 2; //The minimum parts that one creep can be created with	
		let target = undefined;
		let energySource = undefined;
		let memoryRemoteRooms;
		//Get the energy avaiable from near extensions that have energy
		let energyAvaiable = spawner.room.find(FIND_STRUCTURES, {
			filter: (structure) => (structure.structureType == STRUCTURE_EXTENSION && structure.energy == structure.energyCapacity)
		}).length * 50;

		//add the energy of Spawner and substract the backup part (200 energy)
		energyAvaiable += spawner.energy - 100;
		console.log(spawner.name + " has " + energyAvaiable + " energy on his room");
		if (energyAvaiable <= 0)	{
			return;
		}

		const numberOfParts = [
		/*[NamePart,PercentDedicated,TotalParts,EnergyCostForEachPart]*/
		    [TOUGH,0,0,10],
		    [WORK,0,0,100],
		    [CARRY,0,0,50],
		    [CLAIM,0,0,600],
		    [MOVE,0,0,50],
		    [ATTACK,0,0,80],
		    [HEAL,0,0,250]
		];		

		switch(role) {
            case 'harvester':
            	energyAvaiable = getEnergyLimit(energyAvaiable,700);
            	minimumParts = 2;
 				//We set up the % of energy that we want to spend on each part
            	numberOfParts[4][1] = 50; //MOVE
				numberOfParts[2][1] = 50; //CARRY
                break;
            case 'upgrader':
            	energyAvaiable = getEnergyLimit(energyAvaiable,1000);
 				numberOfParts[1][1] = 70; //WORK
				numberOfParts[2][1] = 15; //CARRY
				numberOfParts[4][1] = 15; //MOVE
                break;
            case 'builder':
            	energyAvaiable = getEnergyLimit(energyAvaiable,850);
 				numberOfParts[1][1] = 50; //WORK
				numberOfParts[2][1] = 20; //CARRY
				numberOfParts[4][1] = 30; //MOVE
                break;
            case 'farmer':
            	energyAvaiable = getEnergyLimit(energyAvaiable,500);
            	minimumParts = 2;
            	numberOfParts[1][1] = 100; //WORK
 				numberOfParts[4][1] = 0.1; //MOVE
                break;
            case 'repairman':
            	energyAvaiable = getEnergyLimit(energyAvaiable,1150);
                numberOfParts[1][1] = 50; //WORK
                numberOfParts[2][1] = 35; //CARRY
 				numberOfParts[4][1] = 15; //MOVE
                break;
            case 'miner':
            	energyAvaiable = getEnergyLimit(energyAvaiable,700);
            	minimumParts = 6;
 				numberOfParts[1][1] = 75; //WORK
 				numberOfParts[4][1] = 25; //MOVE
                break;
            case 'transporter':
            	energyAvaiable = getEnergyLimit(energyAvaiable,700);
           		numberOfParts[1][1] = 0.1; //WORK
           		numberOfParts[2][1] = 50; //CARRY
  				numberOfParts[4][1] = 50; //MOVE
                break;
            case 'claimer':
            	energyAvaiable = getEnergyLimit(energyAvaiable,650);
 				numberOfParts[3][1] = 92; //CLAIM
				numberOfParts[4][1] = 8; //MOVE

                break;
            case 'unit_assault':
            	energyAvaiable = getEnergyLimit(energyAvaiable,1450);
 				numberOfParts[0][1] = 5.2; //TOUGH
  				numberOfParts[4][1] = 52; //MOVE
  				numberOfParts[5][1] = 42; //ATTACK
                break;
            case 'unit_healer':
             	energyAvaiable = getEnergyLimit(energyAvaiable,1700);
 				numberOfParts[0][1] = 2; //TOUGH
 				numberOfParts[4][1] = 41; //MOVE
  				numberOfParts[6][1] = 56; //HEAL
                break;
            case 'tester':
                energyAvaiable = getEnergyLimit(energyAvaiable,350);
           		numberOfParts[1][1] = 28; //WORK
           		numberOfParts[2][1] = 36; //CARRY
  				numberOfParts[4][1] = 36; //MOVE
                break;
            case 'remoteWorker':
 				energyAvaiable = getEnergyLimit(energyAvaiable,650);
           		numberOfParts[1][1] = 28; //WORK
           		numberOfParts[2][1] = 36; //CARRY
  				numberOfParts[4][1] = 36; //MOVE
            	break;
	    }

	    parts = getNumberOfParts(numberOfParts);
		if (minimumParts > parts.length){
			console.log("INSUFFICIENT ENERGY FOR CREATE A " + role + ", MINIMUM PARTS CAN'T BE DONE");
			return;
			}

		//Their are rols that need some extra configuration
		switch(role){
			case "claimer":
				//Find the room target
  				memoryRemoteRooms = getRemoteRooms(spawner,role);
  				if(memoryRemoteRooms == false)
  					return;

  				//find an unclaimed room
				let allRoomsAreClaimed = true;
				for(let remoteRoom in memoryRemoteRooms) {
		            if(memoryRemoteRooms[remoteRoom].claimed == false) {
		                allRoomsAreClaimed = false;
		                target = remoteRoom;
		                memoryRemoteRooms[remoteRoom].claimed = true;
		                break;
		            }
		        }
		        if (checkInvalidValue(!allRoomsAreClaimed,role,"there is no free remote room to spawn a claimer.")){
					return;
				}
				break;
			case "miner":
  				//Find the room target
  				memoryRemoteRooms = getRemoteRooms(spawner,role);
  				if(memoryRemoteRooms == false)
  					return;

  				//Find a free energy source and save it in memory
				let allEnergiesAreTaken = true;
				for(let remoteRoom in memoryRemoteRooms) {
					for (let energy in memoryRemoteRooms[remoteRoom].energies){
						if (memoryRemoteRooms[remoteRoom].energies[energy].mining == false){
							allEnergiesAreTaken = false;
							target = remoteRoom;
							energySource = energy;
							memoryRemoteRooms[remoteRoom].energies[energy].mining = true;
							break;
						}
					}
		        }
		        
		        if (checkInvalidValue(!allEnergiesAreTaken,role,"there is no remote room with free energy.")){
					return;
				}
				break;
			case "transporter":
				//Find the room target
  				memoryRemoteRooms = getRemoteRooms(spawner,role);
  				if(memoryRemoteRooms == false)
  					return;

  				//Find a room with free slots for transporters
				let allEnergiesSlotsAreTaken = true;
				for(let remoteRoom in memoryRemoteRooms) {
					for (let energy in memoryRemoteRooms[remoteRoom].energies){
						let thisEnergy = memoryRemoteRooms[remoteRoom].energies[energy];
						if (thisEnergy.maxTransporters > thisEnergy.transporters){
							allEnergiesSlotsAreTaken = false;
							thisEnergy.transporters += 1;
							energySource = energy;
							target = remoteRoom;
							break;
						}
					}
		        }
		        
		        if (checkInvalidValue(!allEnergiesSlotsAreTaken,role,"there is no remote room with free slots.")){
					return;
				}
				break;
		}


		console.log("SPAWNING: " + role + " with: " + parts + " parts.");
		console.log("Spawner result error code: " + spawner.spawnCreep(parts, role + "-" + Game.time, {
			memory: {
				role: role,
				working: false,
				onFlag: false,
				roomRoot: spawner.room.name,
				target: target,
				energySource: energySource
			}
		}));

		function getEnergyLimit(energyAvaiable,energyLimit){
			//If we have more energy than the limit, set the energy avaiable as the limit.
			if (energyAvaiable > energyLimit)
	            return energyLimit;
	        else
	        	return energyAvaiable;
		}

		function checkInvalidValue(booleanVar, role, errorMessage){
			if (booleanVar == false){
  					console.log("ERROR: can't spawn " + role + ", "+ errorMessage);
  					return true;
  			}
			return false;
		}

		function getNumberOfParts(numberOfParts){
			let parts = [];
			//We calculate how much parts we can do by rule of three (rounding to floor with ~~)
			for (let i = numberOfParts.length - 1; i >= 0; i--) {
				if(numberOfParts[i][1] == 0){ //Delete the parts that don't have %
					numberOfParts.splice(i,1);
					continue;
				}
				numberOfParts[i][2] = ~~((energyAvaiable*numberOfParts[i][1]/100)/numberOfParts[i][3]);
				if (numberOfParts[i][2] == 0){ //Minimum one item of each part, we have a backup storage that can afford this
					numberOfParts[i][2] = 1;
				}
			}
			//Add the parts to the body: EX: [WORK,WORK] + [CARRY,CARRY] = [WORK,WORK,CARRY,CARRY]
			numberOfParts.forEach(function(dataParts) {
				for (let i = dataParts[2]; i > 0; i--) {
					parts.push(dataParts[0]);
				}
			});
			return parts;
		}

		function getRemoteRooms(spawner,role){
			let memoryRemoteRooms = Memory.rooms[spawner.room.name].remote;
			if (checkInvalidValue(memoryRemoteRooms, role,"there is no 'remote' field on memory room")){
  				return false;
  			}
  			return memoryRemoteRooms;
		}
	},
    clearMemoryOfDeadCreeps: function(){
        //Clear the memory of dead creeps
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
            	let creepMemory = Memory.creeps[name];
                //Specific actions depending on the creep rol
				switch(Memory.creeps[name].role){
                    case "claimer":
	                    //On claimers, we set the target room as not claimed
	                    Memory.rooms[creepMemory.roomRoot].remote[creepMemory.target].claimed = false;
                   		break;
                    case "miner":
	                    //On miners, free the energy
	                    Memory.rooms[creepMemory.roomRoot].remote[creepMemory.target].energies[creepMemory.energySource].mining = false;
	                    break;
	                case "transporter":
	                    //minus this transporter form the total of their energySource
	                    Memory.rooms[creepMemory.roomRoot].remote[creepMemory.target].energies[creepMemory.energySource].transporters -= 1;
                    	break;
            	}
                delete Memory.creeps[name];            

            }
        }
    },
	/** @param {String} Spawn name
    	@param {int} Stage
    	Console usage: require('masterSpawner').createSpawnMemory(String spawnerName,int Stage); **/
    createSpawnMemory: function(spawnerName, stage = 0){
    	let spawner = genericFunctions.getSpawnerByName(spawnerName);
    	if (!spawner)
    		return;

    	let newSpawnerMemory = {
			minUnitAssault : 0,
			minUnitHealer : 0,
			minFarmers : 0,
			minHarvesters : 0,
			minUpgraders : 0,
			minRepairman : 0,
			minClaimers : 0,
			minBuilders : 0,
			minTesters : 0,
			minRemoteWorkers : 0,
			minMiners : 0,
			minTransporters : 0,
			maxStructureHits : 0
    	}

    	//Set the memory values based on the actual stage
		switch(stage){
			case 5:
				newSpawnerMemory.maxStructureHits = updateMaxStructurehits(newSpawnerMemory.maxStructureHits,200000);
				newSpawnerMemory.minRepairman += 1;
			case 4:
				newSpawnerMemory.maxStructureHits = updateMaxStructurehits(newSpawnerMemory.maxStructureHits,100000);
			case 3:
				newSpawnerMemory.maxStructureHits = updateMaxStructurehits(newSpawnerMemory.maxStructureHits,10000);
				newSpawnerMemory.minBuilders += 1;
			case 2:
				newSpawnerMemory.maxStructureHits = updateMaxStructurehits(newSpawnerMemory.maxStructureHits,5000);
				newSpawnerMemory.minRepairman += 1;
			case 1:
				newSpawnerMemory.maxStructureHits = updateMaxStructurehits(newSpawnerMemory.maxStructureHits,1000);
				newSpawnerMemory.minFarmers += 2;
				newSpawnerMemory.minUpgraders += 2;
				newSpawnerMemory.minHarvesters += 4;
				break;
		}

		//Update the memory values to the new ones
		spawner.memory.minUnitAssault = newSpawnerMemory.minUnitAssault;
		spawner.memory.minUnitHealer  = newSpawnerMemory.minUnitHealer;
		spawner.memory.minFarmers = newSpawnerMemory.minFarmers;
	    spawner.memory.minHarvesters = newSpawnerMemory.minHarvesters;
	    spawner.memory.minUpgraders = newSpawnerMemory.minUpgraders;
	    spawner.memory.minRepairman = newSpawnerMemory.minRepairman;
	    spawner.memory.minClaimers  = newSpawnerMemory.minClaimers;
	    spawner.memory.minBuilders = newSpawnerMemory.minBuilders;
	    spawner.memory.minTesters = newSpawnerMemory.minTesters;
	    spawner.memory.minRemoteWorkers = newSpawnerMemory.minRemoteWorkers;
	    spawner.memory.minMiners = newSpawnerMemory.minMiners;
	    spawner.memory.minTransporters = newSpawnerMemory.minTransporters;      

	    //If we set a new maxStructreHits, we assing it to spawner room memory
	    if (spawner.room.memory && newSpawnerMemory.maxStructureHits > 0)
	    	spawner.room.memory.maxStructureHits = newSpawnerMemory.maxStructureHits;

    	console.log("Setting " + spawnerName + " memory to stage " + stage);

    	function updateMaxStructurehits(maxStructureHits, newMax) {
    		if (maxStructureHits > newMax)
    			return maxStructureHits;
    		else
    			return newMax;
    	}
    },
    /** @param {String} Spawn name
    	@param {String} Room name
    	@param {int} Stage
    	Console usage: require('masterSpawner').claimRemoteRoom(String spawnerName,String roomName,int Stage); **/
    claimRemoteRoom: function(spawnerName, roomName, stage = 0){
    	let spawner = genericFunctions.getSpawnerByName(spawnerName);
    	if (!spawner)
    		return;
    	//Check if we have this roomName in the spawnMemory
    	
    }
};