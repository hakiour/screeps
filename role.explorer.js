var roleExplorer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.target == creep.room.name){
            //Save the room in Memory.rooms, thein suicide to save CPU
            if (!Game.spawns[creep.memory.queen].memory.remote || !Game.spawns[creep.memory.queen].memory.remote[creep.memory.target]){
                Room.prototype.adquireRemoteRoom(creep.memory.queen,creep.memory.target,1);
                //Add the workers of this new remote room to the Spawner Queen
                Game.spawns[creep.memory.queen].memory.minClaimers +=1;
                Game.spawns[creep.memory.queen].memory.minMiners +=1;
                Game.spawns[creep.memory.queen].memory.minTransporters +=3;
                creep.suicide();
            }
        }else{
            //Move to the target room
            let exitToTarget = creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.target));
            creep.moveTo(exitToTarget);
        }
	}
};

module.exports = roleExplorer;