var genericFunctions = require('genericFunctions');
var roleMiner = {
   
    /** @param {Creep} creep **/
    run: function(creep) {
        var maxTicksToLive = 5;
			if(creep.ticksToLive > maxTicksToLive && (!creep.memory.onFlag || creep.memory.onFlag == undefined)){
                //Find some flag that is not bussy and assing it to the miner (ordered by distance). Once is assigned we mark it as bussy
                //I don't use this method because is so expensive for the CPU, once they are +7 miners, CPU got crazy
                /*for(var thisFlag of _.sortBy(Game.flags, flag => creep.pos.findPathTo(flag.pos))) {  
                    var name = thisFlag.name;
                    if (name.startsWith("EnergyFlag") && (thisFlag.memory.bussy == false || thisFlag.memory.bussy == undefined)){
                        thisFlag.memory.bussy = true;
                        creep.memory.onFlag = name;
                        creep.moveTo(Game.flags[thisFlag]);
                        break;
                    }
                }*/
                //Find some flag that is not bussy and assing it to the miner. Once is assigned we mark it as bussy
                    for(var thisFlag in Game.flags) {       
                    var name = Game.flags[thisFlag].name;      
                    if (name.startsWith("EnergyFlag") && (Game.flags[thisFlag].memory.bussy == false || Game.flags[thisFlag].memory.bussy == undefined)){
                        Game.flags[thisFlag].memory.bussy = true;
                        creep.memory.onFlag = name;
                        creep.moveTo(Game.flags[thisFlag]);
                        break;
                    }
                }
                
            }else{
                if(creep.ticksToLive <= maxTicksToLive){ //If we gonna die, assing the flag as no bussy and die peaceful
                    console.log("Is this running? I think it's running!" + creep.memory.onFlag);
                    Game.flags[creep.memory.onFlag].memory.bussy = false;
                    creep.memory.onFlag = true;
                    creep.suicide();

                } else if(creep.pos.getRangeTo(Game.flags[creep.memory.onFlag]) <= 1){ //if we are near to our assigned flag...
						genericFunctions.harvestNearSource(creep);
            	}
            	else{
            		 creep.moveTo(Game.flags[creep.memory.onFlag]);
            	}
            }
	    
	}
   
};

module.exports = roleMiner;