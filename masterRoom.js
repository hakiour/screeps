module.exports = {
	createNewCreep: function(spawner, role) {
		const parts = [];
		let minimumParts = 2; //The minimum parts that one creep can be created with	

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
		/*[NamePart,PercentDedicated(Ex: 50 means 50% of energyAvaiable spended on this part),TotalParts,EnergyCostForEachPart]*/
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
            	energyAvaiable = getEnergyLimit(energyAvaiable,1000);
            	minimumParts = 6;
 				numberOfParts[1][1] = 60; //WORK
 				numberOfParts[4][1] = 40; //MOVE
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
		if (minimumParts > parts.length){
			console.log("INSUFFICIENT ENERGY FOR CREATE A " + role + ", MINIMUM PARTS CAN'T BE DONE");
			return;
			}
		console.log("SPAWNING: " + role + " with: " + parts + " parts.");
		console.log("Spawner result error code: " + spawner.spawnCreep(parts, role + "-" + Game.time, {
			memory: {
				role: role,
				working: false,
				onFlag: false,
				roomRoot: spawner.room.name
			}
		}));

		function getEnergyLimit(energyAvaiable,energyLimit){
			//If we have more energy than the limit, set the energy avaiable as the limit.
			if (energyAvaiable > energyLimit)
	            return energyLimit;
	        else
	        	return energyAvaiable;
		}
	},
	setMaxStructureHits: function(room, maxStructureHits){
		room.memory.maxStructureHits = maxStructureHits;
	}
};