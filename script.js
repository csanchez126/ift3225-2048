$(document).ready(()=>{
	var gameSize = 4;

	generateHTMLGrid(gameSize);

	let grid = new Grid(gameSize);
	grid.spawnRandomTile();
	grid.spawnRandomTile();

	$(document).on("keydown", function(e){
		let key = e.keyCode;
		if(key === 37 || key === 65){
			grid.moveLeft();
			grid.spawnRandomTile();
			updateScore(grid.getScore());			
		}
		else if(key === 38 || key === 87){
			grid.moveUp();
			grid.spawnRandomTile();
			updateScore(grid.getScore());			
		}
		else if(key === 39 || key === 68){
			grid.moveRight();
			grid.spawnRandomTile();
			updateScore(grid.getScore());			
		}
		else if(key === 40 || key === 83){
			grid.moveDown();
			grid.spawnRandomTile();
			updateScore(grid.getScore());			
		}
		console.log(grid.getScore());
		
	});

	$("input[name='new-game']").on("click",function(){
		grid.newGame();
		updateScore(grid.getScore());

	})
})

var generateHTMLGrid = function(gameSize){
	var rowHTML = "<div class='row'>";
	for(var i=0; i< gameSize; i+=1){
		rowHTML += "<div class='tile empty-tile'></div>"
	}
	rowHTML += "</div>"

	for(var i=0; i< gameSize; i+=1){
		$(".grid").append(rowHTML);
	}
}

function updateScore(_val){
	$(".score").html(_val);
}

var Grid = function(_dim){
		this.dim = _dim;
		this.score = 0;
		this.grid = new Array(this.dim).fill(null).map(()=> Array(this.dim).fill(null));
}

Grid.prototype.incScore = function(_val){
	this.score+=_val;
}

Grid.prototype.getScore = function(){
	return this.score;
}

Grid.prototype.newGame = function(){
	this.score = 0;
	this.grid.forEach((row) => {
		row.forEach((tile) => {
			if(tile){
				tile.deleteTile();
			}
		})
	})
	this.grid = new Array(this.dim).fill(null).map(()=> Array(this.dim).fill(null));
	this.spawnRandomTile();
	this.spawnRandomTile();
}

Grid.prototype.spawnRandomTile = function() {
	//Start at random index between 0 and gameSize^2
	//and increment index until  we find a free tile
	let randI = Math.floor(Math.random()*this.dim*this.dim);
	let count = 0;
	for(var i=randI; count!==this.dim*this.dim;i+=1){
		if(i===this.dim*this.dim){
			i = -1;
		}else{
			let y = Math.floor(i/4);
			let x = i%this.dim;
			if(this.grid[x][y] === null){
				this.grid[x][y] = new GameTile(x, y, [2,4][Math.round(Math.random())]);
				this.grid[x][y].setTileColor(this.grid[x][y].getTileValue());
				return;
			}
			count += 1;
		}
	}
}

Grid.prototype.moveRight = function(){
	this.grid.forEach((row, rowI) => {
		let size = row.length;
		let newRow = new Array(size).fill(null);
		let mergeFlags = new Array(size).fill(false);
		for(var i=size-1; i>=0; i-=1){
			if(row[i] !== null){
				var y = newRow.lastIndexOf(null);
				newRow[y] = row[i]; //New row config
				//If tile next to new position exists
				if(y < size && newRow[y+1]){
					// If can be merged
					if(!mergeFlags[y+1] && 
					   row[i].getTileValue() === newRow[y+1].getTileValue()){
						mergeFlags[y+1] = true;
						//Delete node that will be combined
						newRow[y].deleteTile()
						newRow[y] = null;
						// Double row[y+1]
						newRow[y+1].setTileValue(newRow[y+1].getTileValue()*2);
						newRow[y+1].setTileColor(newRow[y+1].getTileValue());
						this.incScore(newRow[y+1].getTileValue());
					}
					// Can't merge, keep in place
					else{
						//Update CSS and DOM row tiles
						newRow[y].moveTile(rowI, y, newRow[y].getTileValue());
					}
				}

				else{
					//Update CSS and DOM row tiles
					newRow[y].moveTile(rowI, y, newRow[y].getTileValue());
				}
			}
		}
		this.grid[rowI] = newRow;
	});
}

Grid.prototype.moveLeft = function(){
	this.grid.forEach((row, rowI) => {
		let size = row.length;
		let newRow = new Array(size).fill(null);
		let mergeFlags = new Array(size).fill(false);
		for(var i=0; i<size; i+=1){
			if(row[i] !== null){
				var y = newRow.indexOf(null);
				newRow[y] = row[i]; //New row config
				//If tile next to new position exists
				if(y > 0 && newRow[y-1]){
					// If can be merged
					if(!mergeFlags[y-1] && 
					   row[i].getTileValue() === newRow[y-1].getTileValue()){
						mergeFlags[y-1] = true;
						//Delete node that will be combined
						newRow[y].deleteTile()
						newRow[y] = null;
						// Double row[y-1]
						newRow[y-1].setTileValue(newRow[y-1].getTileValue()*2);
						newRow[y-1].setTileColor(newRow[y-1].getTileValue());
						this.incScore(newRow[y-1].getTileValue());
					}
					// Can't merge, keep in place
					else{
						//Update CSS and DOM row tiles
						newRow[y].moveTile(rowI, y, newRow[y].getTileValue());
					}
				}

				else{
					//Update CSS and DOM row tiles
					newRow[y].moveTile(rowI, y, newRow[y].getTileValue());
				}			
			}
		}
		this.grid[rowI] = newRow;
	});
}

Grid.prototype.moveUp = function(){
	this.grid = this.grid.reduce((prev, next) => 
		next.map((item, i) =>
			(prev[i] || []).concat(next[i])
	), []);
	this.grid.forEach((row, rowI) => {
		let size = row.length;
		let newRow = new Array(size).fill(null);
		let mergeFlags = new Array(size).fill(false);
		for(var i=0; i<size; i+=1){
			if(row[i] !== null){
				var y = newRow.indexOf(null);
				newRow[y] = row[i]; //New row config
				//If tile next to new position exists
				if(y > 0 && newRow[y-1]){
					// If can be merged
					if(!mergeFlags[y-1] && 
					   row[i].getTileValue() === newRow[y-1].getTileValue()){
						mergeFlags[y-1] = true;
						//Delete node that will be combined
						newRow[y].deleteTile()
						newRow[y] = null;
						// Double row[y-1]
						newRow[y-1].setTileValue(newRow[y-1].getTileValue()*2);
						newRow[y-1].setTileColor(newRow[y-1].getTileValue());
						this.incScore(newRow[y-1].getTileValue());
					}
					// Can't merge, keep in place
					else{
						//Update CSS and DOM row tiles
						newRow[y].moveTile(y,rowI, newRow[y].getTileValue());
					}
				}

				else{
					//Update CSS and DOM row tiles
					newRow[y].moveTile(y,rowI, newRow[y].getTileValue());
				}			
			}
		}
		this.grid[rowI] = newRow;
	});
	this.grid = this.grid.reduce((prev, next) => 
		next.map((item, i) =>
			(prev[i] || []).concat(next[i])
		
	), []);
}

Grid.prototype.moveDown = function(){
	this.grid = this.grid.reduce((prev, next) => 
		next.map((item, i) =>
			(prev[i] || []).concat(next[i])
		
	), []);
	this.grid.forEach((row, rowI) => {
		let size = row.length;
		let newRow = new Array(size).fill(null);
		let mergeFlags = new Array(size).fill(false);
		for(var i=size-1; i>=0; i-=1){
			if(row[i] !== null){
				var y = newRow.lastIndexOf(null);
				newRow[y] = row[i]; //New row config

				//If tile next to new position exists
				if(y < size && newRow[y+1]){
					// If can be merged
					if(!mergeFlags[y+1] && 
					   row[i].getTileValue() === newRow[y+1].getTileValue()){
						mergeFlags[y+1] = true;
						//Delete node that will be combined
						newRow[y].deleteTile()
						newRow[y] = null;
						// Double row[y+1]
						newRow[y+1].setTileValue(newRow[y+1].getTileValue()*2);
						newRow[y+1].setTileColor(newRow[y+1].getTileValue());
						this.incScore(newRow[y+1].getTileValue());
					}
					// Can't merge, keep in place
					else{
						//Update CSS and DOM row tiles
						newRow[y].moveTile(y, rowI, newRow[y].getTileValue());
					}
				}

				else{
					//Update CSS and DOM row tiles
					newRow[y].moveTile(y, rowI, newRow[y].getTileValue());
				}
			}
		}
		this.grid[rowI] = newRow;
	});
	this.grid = this.grid.reduce((prev, next) => 
		next.map((item, i) =>
			(prev[i] || []).concat(next[i])
		
	), []);
}


var GameTile = function(_x, _y, _val){
	this.x = _x;
	this.y = _y;
	this.val = _val;
	this.tileSize = parseInt($(".empty-tile").css("width"));
	this.tileMove = parseInt($(".empty-tile").css("margin-right")) + this.tileSize;
	var jElement = {
		id:"tile_"+_x+"_"+_y,
		class: "tile game-tile",
		css: {
			"transform": "translate("+_y*this.tileMove+"px, "+(_x*this.tileMove)+"px)",
			"width": this.tileSize+"px",
			"height" : this.tileSize+"px"
		}
	}
	var $div = $("<div>", jElement);
	$div.html(_val);
	$(".game").append($div);
}

GameTile.prototype.moveTile = function(_x,_y,_val){
	var tile = $("#tile_"+this.x+"_"+this.y);
	$(tile).css("transform", "translate("+_y*this.tileMove+"px, "+_x*this.tileMove+"px)");
	$(tile).attr("id","tile_"+_x+"_"+_y);
	this.x = _x;
	this.y = _y;
	this.val = _val;
}

GameTile.prototype.getTileValue = function(){
	return this.val;
}

GameTile.prototype.setTileValue = function(_val){
	this.val = _val;
	$("#tile_"+this.x+"_"+this.y).html(_val);
}

GameTile.prototype.setTileColor = function(_val){
	var color = "";
	switch(_val){
		case 2:
			color = "#A2AEBB";
		break;
		case 4:
			color = "#F4D35E";
		break;
		case 8:
			color = "#EE964B";
		break;
		case 16:
			color = "#FFBA08";
		break;
		case 32:
			color = "#C73E1D";
		break;
		case 64:
			color = "#D00000";
		break;
		case 128:
			color = "#28AFB0";
		break;
		case 256:
			color = "#2E86AB";
		break;
		case 512:
			color = "#1C3144";
		break;
		case 1024:
			color = "#A23B72";
		break;
		case 2048:
			color = "#4E0250";
		break;
	}
	$("#tile_"+this.x+"_"+this.y).css("background-color",color);
}

GameTile.prototype.deleteTile = function(){
	$("#tile_"+this.x+"_"+this.y).remove();
}