var genericFunctions = require('genericFunctions');
var roleUpgrader = require('role.upgrader');
var roleTester = {
   
    /** @param {Creep} creep **/
    run: function(creep) {
    	
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

    	if (creep.memory.working){
    		var thisFlag = genericFunctions.findThisFlag("remoteWorkers");
            if(creep.room != Game.flags[thisFlag].room){
                creep.moveTo(Game.flags[thisFlag]);
            }else{
                roleUpgrader.run(creep);
            }
    	}else{
            genericFunctions.pickUpNearSource(creep);   	
    	}   
    }
};

module.exports = roleTester;