var genericFunctions = require('genericFunctions');
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if(creep.memory.working) {  
            if (creep.room.name == creep.memory.roomRoot){
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }else{
                creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(Game.rooms[creep.memory.roomRoot])));
            }
        }
        else {
            genericFunctions.pickUpNearEnergy(creep);   
        }
    }
};

module.exports = roleUpgrader;