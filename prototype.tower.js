//New functions for StructureTower
StructureTower.prototype.attackNearEnemys =
    function () {
        // find closes hostile creep
        var target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);	
        if (target) {//If we found it, kill it
            return this.attack(target) == 0;
        }
        return false;
};
StructureTower.prototype.supportNearAllys =
    function () {
    	 //Heal near creeps
        	var target = this.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (thisCreep) => (thisCreep.hits < thisCreep.hitsMax)
            });
            
            if(target){
            	return this.heal(target) == 0;
            }
        return false;
};
StructureTower.prototype.repairNearStructures =
    function () {
    	//Repair near structures
    	if (this.energy > 600){
			var target = this.pos.findClosestByRange(FIND_STRUCTURES, {
		    filter: (structure) => (((structure.hits < structure.hitsMax/2) && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART) || (structure.hits < 10000 && (structure.hits + 1000) < structure.hitsMax))
		    });
		    
		    if(target){
		    	return this.repair(target) == 0;
		    }
		}
		return false;
};