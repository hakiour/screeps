var genericFunctions = require('genericFunctions');
var roleHealer = {
    
    run: function(creep){
    		//Find my creeps that are hurt. If they're hurt, heal them.
    		//If there aren't any hurt, we're going to the basse
    		var target = creep.pos.findClosestByPath(Game.creeps, {
    			filter: (totalLife) => {
    				return totalLife.hits < totalLife.hitsMax
    			}
    		});

    		if(target){
                if(creep.heal(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                } 
    		}else {
                var target = creep.pos.findClosestByPath(Game.creeps, {
                filter: (thisCreep) => {
                    return thisCreep.memory.role == 'unit_assault'
                }
                });
                if (!target){
                    for(var name in Game.creeps) {
                        var thisCreep = Game.creeps[name];
                        if(thisCreep.memory.role == 'unit_assault'){
                            target = thisCreep;
                        }
                    }
                }
                if(target){
                    if (creep.pos.getRangeTo(target) >= 2){
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
    			var thisFlag = genericFunctions.getNearestSafeZone(creep);
                if(creep.room != Game.flags[thisFlag].room){
                    creep.moveTo(Game.flags[thisFlag]);
                }
    		}
    }
};

module.exports = roleHealer;