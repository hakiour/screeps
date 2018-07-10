var genericFunctions = require('genericFunctions');
var roleMiner = {
   
    /** @param {Creep} creep **/
    run: function(creep) {

		function moveToObjective(){
			if(!creep.memory.onTheObjective){
				if(!creep.memory.onFlag || creep.memory.onFlag == undefined){
				 	for(var thisFlag in Game.flags) {       
				        var name = Game.flags[thisFlag].name;
				        	//OF = ObjectiveFlag
				        if (name.startsWith("OF") && (creep.memory.onFlag == false || creep.memory.onFlag == undefined)){
				            creep.memory.onFlag = name;
				            creep.moveTo(Game.flags[thisFlag], {visualizePathStyle: {stroke: '#ffaa00'}});
				            console.log(creep.name + " moving to " + name);
				            break;
				        }
					}
				}else if(creep.pos.getRangeTo(Game.flags[creep.memory.onFlag]) <= 1){
	            	creep.memory.onTheObjective = true;
	            }else{
	            	creep.moveTo(Game.flags[creep.memory.onFlag], {visualizePathStyle: {stroke: '#ffaa00'}});
	            }
			}
		}

        function findNearEnemy(){
        	if(!creep.memory.onTheObjective){
        		moveToObjective();
        	}else{
        		attackNearEnemy();
        	}	
        }

        function attackNearEnemy(){
        	
        	//const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);//Cambiar por la sala en la q estamos
        	const target = creep.room.find(FIND_HOSTILE_CREEPS);
			if(target.length > 0) {
			    if(creep.attack(target[0]) == ERR_NOT_IN_RANGE) {
			        creep.moveTo(target[0]);
			    }
			}else{
				const target = creep.room.find(FIND_HOSTILE_SPAWNS);
				if(target.length > 0) {
				    if(creep.attack(target[0]) == ERR_NOT_IN_RANGE) {
				        creep.moveTo(target[0]);
				    }
				}else{
					const target = creep.room.find(FIND_HOSTILE_STRUCTURES);
					if(target.length > 0) {
					    if(creep.attack(target[0]) == ERR_NOT_IN_RANGE) {
					        creep.moveTo(target[0]);
					    }
					}else{
						creep.memory.onTheObjective = false;
						findNearEnemy();
					}
				}	
			}
        }

        function victoryFlag(){
        	
        }

        function backToHome(){
			if(creep.pos.getRangeTo(Game.spawns['boss']) > 5){
	    		creep.moveTo(Game.spawns['boss'], {visualizePathStyle: {stroke: '#ffaa00'}});
	    	}
        }

        findNearEnemy();
	}
   
};

module.exports = roleMiner;