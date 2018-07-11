var genericFunctions = require('genericFunctions');
var roleHarvester = require('role.harvester');
var roleTransporter = {
   
    /** @param {Creep} creep **/
    run: function(creep) {
        //Pick up energy
        if(creep.carry.energy < creep.carryCapacity){
            //Collect energy in the targer room
           if(creep.memory.target == creep.room.name){
                genericFunctions.pickUpNearSource(creep);
            }else{
                //Move to the target room
                let exitToTarget = creep.room.findExitTo(creep.memory.target);
                creep.moveTo(creep.pos.findClosestByRange(exitToTarget));
            }
        }else{
            //Move to the origin room and fill the storage
            if(creep.memory.roomRoot == creep.room.name){
                if(creep.transfer(Game.rooms[creep.memory.roomRoot].storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.rooms[creep.memory.roomRoot].storage);
                }
            }else{ 
                let exitToTarget = creep.room.findExitTo(creep.memory.roomRoot);
                creep.moveTo(creep.pos.findClosestByRange(exitToTarget));
            }
        }		
	}
};

module.exports = roleTransporter;