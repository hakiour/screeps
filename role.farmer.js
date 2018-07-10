var genericFunctions = require('genericFunctions');
var roleFarmer = {
   
    /** @param {Creep} creep **/
    run: function(creep) {      
        var assignetToCreep = false;
        var source;

        if(!creep.memory.sourceId || creep.memory.sourceId == undefined ){
            //Find sources that aren't assigned to other farmers and assigne it to the actual farmer     
                for(source of creep.room.find(FIND_SOURCES)){
                //For each source, we search all the creeps to find if the same id is assigned to anoter creep  
                    assignetToCreep = false;  
                    for(var thisCreep of creep.room.find(FIND_MY_CREEPS,{
                        filter: (thisRole) => (thisRole.memory.role == 'farmer')
                    })){
                        
                        if(creep.name != thisCreep.name){
                            if(thisCreep.memory.sourceId == source.id){
                                assignetToCreep = true;
                                break;
                            }
                        }
                    }
                    //If the source isn't assignet to a creep, we assign it to the actual creep
                    if (assignetToCreep == false){
                        creep.memory.sourceId = source.id;
                        break;
                    }
                }               
        //TO DO
        //If we dosen't found some free source, get the minerals             
        }else{
            var sources = Game.getObjectById(creep.memory.sourceId);
            if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};
module.exports = roleFarmer;