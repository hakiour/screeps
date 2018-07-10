var genericFunctions = require('genericFunctions');
var roleClaimer = {
   
    /** @param {Creep} creep **/
    run: function(creep) {
    	if (creep.memory.target == creep.room.name){
    		// Try to claim the controller
            if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
			}
    	}else{
    		//Move to the target room
    		var exitToTarget = creep.room.findExitTo(creep.memory.target);
			creep.moveTo(creep.pos.findClosestByRange(exitToTarget));
    	}
	}
   
};

module.exports = roleClaimer;