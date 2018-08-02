var genericFunctions = require('genericFunctions');
var roleUpgrader = require('role.upgrader');
var roleHarvester = {
   
    /** @param {Creep} creep **/
    run: function(creep) {

        function pickUpNearSource(creep){ 
        //Find the near droped energy, if there is no dropped energy, loock for the near container
            var minimumEnergy = (creep.carryCapacity - creep.carry[RESOURCE_ENERGY] - 150);
            var nearSource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES,{
                filter: (energy) => {return (energy.amount > minimumEnergy && energy.resourceType == RESOURCE_ENERGY)}
            });
            if(nearSource != undefined){
                if(creep.pickup(nearSource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(nearSource, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }else{//find the nearest container with energy, if there is no container, get energy from the storage (only if we have some structure to fill)
                nearSource = creep.pos.findClosestByPath(FIND_STRUCTURES,{
                filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > minimumEnergy)}
                });
                if(nearSource != undefined){
                    if(creep.withdraw(nearSource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(nearSource, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }else{//If we have some Structure to fill, get energy from the storage
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                        }
                    });
                    if(targets.length > 0) {
                        if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }else{

                    }
            }
        }
    }

        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if(creep.memory.working) {//Fill the main energy structures
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }else{//If spawner(boss) is full, but we not, let's pick up some energy
                if(creep.carry.energy < creep.carryCapacity){
                    genericFunctions.pickUpNearSource(creep);
                }else{
                                                                     
                    if(creep.room.storage && creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.storage);
                    }else{
                        //We don't have any storage, we move the creep to the spawner
                        let spawner = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return structure.structureType == STRUCTURE_SPAWN;
                            }
                        });
                        console.log(creep.moveTo(spawner[0]));
                    }                 
                }      
            }
        }
        else {
            pickUpNearSource(creep);
        }
    }
};

module.exports = roleHarvester;