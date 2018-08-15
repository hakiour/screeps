var genericFunctions = require('genericFunctions');
var roleBuilder = require('role.builder');
var roleRepairman = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //Seting max structure hits
        let  maxStructureHits = 10000; //Default structure hits

        //Try to take the room memory maxStructureHits value
        if(creep.room.memory.maxStructureHits){
            maxStructureHits = creep.room.memory.maxStructureHits;
        }

        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if(creep.memory.working) {     

            var nearStructure;
            if(creep.memory.reparingThis){
                nearStructure = Game.getObjectById(creep.memory.reparingThis);
            }else{
                nearStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => (((structure.hits < structure.hitsMax/2) && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART) || (structure.hits < maxStructureHits && (structure.hits + 1000) < structure.hitsMax))
                });         
                if(nearStructure){
                    creep.memory.reparingThis = nearStructure.id;
                }
            }
	        
        	if (nearStructure != undefined){
        		if(creep.repair(nearStructure) == ERR_NOT_IN_RANGE) {
               		creep.moveTo(nearStructure, {visualizePathStyle: {stroke: '#ffaa00'}});
        		}
                if (nearStructure.hits == nearStructure.hitsMax || ((nearStructure.structureType == STRUCTURE_WALL || nearStructure.structureType == STRUCTURE_RAMPART ) && nearStructure.hits > maxStructureHits)){
                    creep.memory.reparingThis = false;
                }
        	}else{
                roleBuilder.run(creep);
        	}
        }
        else {
            genericFunctions.pickUpNearEnergy(creep);
        }
    }
};

module.exports = roleRepairman;