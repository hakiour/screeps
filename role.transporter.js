var genericFunctions = require('genericFunctions');
var roleHarvester = require('role.harvester');
var roleTransporter = {
   
    /** @param {Creep} creep **/
    run: function(creep) {
		if((!creep.memory.onFlag ||creep.memory.onFlag == undefined) && creep.ticksToLive > 5){

            for(var thisFlag in Game.flags) {
                var name = Game.flags[thisFlag].name;   
                var maxTransporters = 3;
                if (Game.flags[thisFlag].room && Game.flags[thisFlag].room.controller && Game.flags[thisFlag].room.controller.my ){
                    maxTransporters = 5;
                }      
                if (name.startsWith("EnergyFlag") && Game.flags[thisFlag].memory.bussy == true && (Game.flags[thisFlag].memory.transporters < maxTransporters || Game.flags[thisFlag].memory.transporters == undefined )){
                    Game.flags[thisFlag].memory.transporters++; 
                    creep.memory.onFlag = name;
                    creep.moveTo(Game.flags[thisFlag]);
                    break;
                }
            }
            if(!creep.memory.onFlag){
                console.log(Game.time + "I'm unassigned " + creep.name);
                roleHarvester.run(creep);
            }
        }else{
            if(creep.ticksToLive <= 5){
                Game.flags[creep.memory.onFlag].memory.transporters--;
                creep.memory.onFlag = true;
                creep.suicide();
            } else if(creep.carry.energy < creep.carryCapacity){
                if(creep.pos.getRangeTo(Game.flags[creep.memory.onFlag]) <= 2){
                    genericFunctions.pickUpNearSource(creep, 10);
                }else{
                    creep.moveTo(Game.flags[creep.memory.onFlag]);
                }
            }else{
                if(creep.transfer(Game.rooms["W42N47"].storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.rooms["W42N47"].storage);
                } 
            }      
        }
	}
   
};

module.exports = roleTransporter;