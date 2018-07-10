var genericFunctions = require('genericFunctions');
var roleClaimer = {
   
    /** @param {Creep} creep **/
    run: function(creep) {

		function moveToObjective(){
			if(!creep.memory.onTheObjective){
				if(!creep.memory.onFlag || creep.memory.onFlag == undefined && creep.ticksToLive > 10){
				 	for(var thisFlag in Game.flags) {       
				        var name = Game.flags[thisFlag].name;
				        if (name.startsWith("ClaimFlag") && (Game.flags[thisFlag].memory.bussy == false || Game.flags[thisFlag].memory.bussy == undefined)){
				            Game.flags[thisFlag].memory.bussy = true;
				            creep.memory.onFlag = name;
				            creep.moveTo(Game.flags[thisFlag], {visualizePathStyle: {stroke: '#ffaa00'}});
				            break;
				        }
					}
				}else if(creep.pos.getRangeTo(Game.flags[creep.memory.onFlag]) <= 1){
	            	creep.memory.onTheObjective = true;
	            }else{
	            	creep.moveTo(Game.flags[creep.memory.onFlag]);
	            }
			}
		}

        function findNearClaimFlag(){

        	if(!creep.memory.onTheObjective){
        		moveToObjective();
        	}else{
        		claimSpot();
        	}	
        }

        function claimSpot(){
			if(creep.room.controller) {
				var claimControllerResult = creep.claimController(creep.room.controller);	
				if(claimControllerResult == ERR_NOT_IN_RANGE) {
			        creep.moveTo(creep.room.controller);
			    }else if(claimControllerResult == ERR_GCL_NOT_ENOUGH){
			    	creep.reserveController(creep.room.controller);
			    }
			}else{
				creep.memory.onTheObjective = false;
				creep.memory.onFlag = false;
				findNearClaimFlag();
			}
        }
		if(creep.ticksToLive < 10 && creep.memory.onFlag){
            Game.flags[creep.memory.onFlag].memory.bussy = false;
            creep.suicide();
		}
        findNearClaimFlag();
	}
   
};

module.exports = roleClaimer;