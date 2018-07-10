module.exports = {
	pickUpNearSource: function(creep, minimumEnergy = 10) {
        var nearSource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,{
            filter: (energy) => {return (energy.amount > minimumEnergy && energy.resourceType == RESOURCE_ENERGY)}
        });
        /*DEPRECATED:
        var nearSource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES ,{
                filter: (energy) => {return energy.amount > minimumEnergy}
            });*/
        if(nearSource != undefined){
            if(creep.pickup(nearSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(nearSource);
            }
        }else{
            nearSource = creep.pos.findClosestByPath(FIND_STRUCTURES,{
            filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > minimumEnergy)}
            });
            if(creep.withdraw(nearSource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(nearSource);
            }
        }     
	},

    pickUpNearEnergyFromStorage: function(creep) {
          var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {
                if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage);
                }
            }
    },
    getNearestSafeZone: function(creep){
        for(var thisFlag in Game.flags) {       
            var name = Game.flags[thisFlag].name;
            if (name.startsWith("SafeZone")){
                return thisFlag;
            }
        }
    },

    findThisFlag: function(thisFlagNameStartsWith){
        for(var thisFlag in Game.flags) {       
            var name = Game.flags[thisFlag].name;
            if (name.startsWith(thisFlagNameStartsWith)){
                return thisFlag;
            }
        }
    },

    harvestNearSource: function(creep){
         var nearSource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if(creep.harvest(nearSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(nearSource);
            }
    },

    clearMemoryOfDeadCreeps: function(){
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
    },

    goToBase: function(creep){
            var nearestSafeZone = getNearestSafeZone(creep);
            if(creep.room != Game.flags[nearestSafeZone].room){
                creep.moveTo(Game.flags[nearestSafeZone]);
                console.log(creep.name + " moving to a safezone: " + nearestSafeZone);
            }else{
                 pickUpNearSource(creep);    
            }
        }
};
