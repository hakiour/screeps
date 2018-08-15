var genericFunctions = require('genericFunctions');
//New functions for rooms
/** @param {String} Room name
    @param {int} maxStructureHits**/
Room.prototype.setMaxStructureHits =
    function(roomName, maxStructureHits){
    	let room = genericFunctions.getRoomByName(roomName);
    	if (room && maxStructureHits)
			room.memory.maxStructureHits = maxStructureHits;
		else
			console.log("setMaxStructureHits need two valid arguments: room and maxStructureHits");
};
/** @param {String} StructureSpawn name
	@param {String} Room name
    @param {int} Stage**/
Room.prototype.adquireRemoteRoom =
    function(spawnerName,roomName, stage){
    	let spawner = genericFunctions.getSpawnerByName(spawnerName);
    	let room = genericFunctions.getRoomByName(roomName);
    	if (!(spawner && room && stage)){
			console.log("adquireRemoteRoom need three valid arguments: spawner, room and stage");
			return false;
		}
		else{
			if (!spawner.room){
				console.log("Spawner room dosen't exist (or is not visible)");
				return false;
			}
			if (!spawner.room.memory.remote){
				spawner.room.memory.remote = {};

				//Creating the energies JSON
				let energiesID = Room.prototype.getEnergiesID(roomName);
				let energies = {};
				for (var i = energiesID.length - 1; i >= 0; i--) {
					let energyId = energiesID[i].toString();
					energies[energyId] = {};
					energies[energyId].mining = false;
					energies[energyId].maxTransporters = 3;
					energies[energyId].transporters = 0;
				}
				//Creating the remote room JSON
				let remoteRoom = {};
				remoteRoom[roomName] = {
					claimed: false,
					"energies": energies
				};

				//console.log(JSON.stringify(remoteRoom));
				/*Example output:
				{
				   "W01S02":{
				      "claimed":false,
				      "energies":{
				         "59f19f5282100e1594777777":{
				            "mining":false,
				            "maxTransporters":3,
				            "transporters":0
				         },
				         "59f19f5282100e1594777778":{
				            "mining":false,
				            "maxTransporters":3,
				            "transporters":0
				         }
				      }
				   }
				}
				*/
				console.log(spawner.room.memory.remote);
				spawner.room.memory.remote[roomName] = {
					claimed: false,
					"energies": energies
				};
				console.log("·");
			}
		}

};
// @param {String} Room name
Room.prototype.getEnergiesID = 
	function(roomName){
		let room = genericFunctions.getRoomByName(roomName);
		if (!room)
			return false;

		let totalEnergies = [];
		let roomEnergies = room.find(FIND_SOURCES);
		roomEnergies.forEach(function(energy){
			totalEnergies.push(energy.id);
		});
		
		return totalEnergies;
};