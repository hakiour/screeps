module.exports = {
	/** @param {Room} room
    	@param {String} maxStructureHits **/
	setMaxStructureHits: function(room, maxStructureHits){
		room.memory.maxStructureHits = maxStructureHits;
	}
};