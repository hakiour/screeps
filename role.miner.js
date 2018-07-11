var roleMiner = {
   
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.target == creep.room.name){
            //Harvest the source associated to this miner
            let sources = Game.getObjectById(creep.memory.energySource);
            if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }else{
            //Move to the target room
            let exitToTarget = creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.target));
            creep.moveTo(exitToTarget);
        }
	}
   
};

module.exports = roleMiner;