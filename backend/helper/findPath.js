class BinaryHeap {
    constructor(scoreFunction) {
        this.content = [];
        this.scoreFunction = scoreFunction;
    }
    push(element) {
        this.content.push(element);

        this.sinkDown(this.content.length - 1);
    }
    pop() {
        var result = this.content[0];
        var end = this.content.pop();
        if (this.content.length > 0) {
            this.content[0] = end;
            this.bubbleUp(0);
        }
        return result;
    }
    remove(node) {
        var i = this.content.indexOf(node);

        var end = this.content.pop();

        if (i !== this.content.length - 1) {
            this.content[i] = end;

            if (this.scoreFunction(end) < this.scoreFunction(node)) {
                this.sinkDown(i);
            } else {
                this.bubbleUp(i);
            }
        }
    }
    size() {
        return this.content.length;
    }
    rescoreElement(node) {
        this.sinkDown(this.content.indexOf(node));
    }
    sinkDown(n) {
        var element = this.content[n];

        while (n > 0) {
            var parentN = ((n + 1) >> 1) - 1;
            var parent = this.content[parentN];
            if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                this.content[parentN] = element;
                this.content[n] = parent;
                n = parentN;
            }

            else {
                break;
            }
        }
    }
    bubbleUp(n) {
        var length = this.content.length;
        var element = this.content[n];
        var elemScore = this.scoreFunction(element);

        while (true) {
            var child2N = (n + 1) << 1;
            var child1N = child2N - 1;
            var swap = null;
            var child1Score;
            if (child1N < length) {
                var child1 = this.content[child1N];
                child1Score = this.scoreFunction(child1);

                if (child1Score < elemScore) {
                    swap = child1N;
                }
            }

            if (child2N < length) {
                var child2 = this.content[child2N];
                var child2Score = this.scoreFunction(child2);
                if (child2Score < (swap === null ? elemScore : child1Score)) {
                    swap = child2N;
                }
            }
            if (swap !== null) {
                this.content[n] = this.content[swap];
                this.content[swap] = element;
                n = swap;
            }
            else {
                break;
            }
        }
    }
}


var astar = {
    init: function(grid) {
        for(var x = 0, xl = grid.length; x < xl; x++) { 
            for(var y = 0, yl = grid[x].length; y < yl; y++) {
                var node = grid[x][y];
                node.f = 0; 
                node.g = 0; 
                node.h = 0;
                node.cost = 1;
                node.visited = false;
                node.closed = false;
                node.parent = null;
            }
        }
    },
    heap: function() {
        return new BinaryHeap(function(node) {
            return node.f;
        });
    },
    search: function(grid, start, end, heuristic) {
        astar.init(grid);
        heuristic = heuristic || astar.manhattan;
    
        var openHeap = astar.heap();
    
        openHeap.push(start);
    
        while(openHeap.size() > 0) {
    
            var currentNode = openHeap.pop();
    
            if(currentNode === end) {
                var curr = currentNode;
                var ret = [];
                while(curr.parent) {
                    ret.push(curr);
                    curr = curr.parent;
                }
                return ret.reverse();
            }
    
            currentNode.closed = true;
    
            var neighbors = astar.neighbors(grid, currentNode);
    
            for(var i=0, il = neighbors.length; i < il; i++) {
                var neighbor = neighbors[i];
    
                if(neighbor.closed || neighbor.isWall()) {
                    continue;
                }
    
                var gScore = currentNode.g + neighbor.cost;
                var beenVisited = neighbor.visited;
    
                if(!beenVisited || gScore < neighbor.g) {
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.h = neighbor.h || heuristic(neighbor.pos, end.pos);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.pos = {x: neighbor.x, y: neighbor.y};
    
                    if (!beenVisited) {
                        openHeap.push(neighbor);
                    }
                    else {
                        openHeap.rescoreElement(neighbor);
                    }
                }
            }
        }
        return [];
    },    
    manhattan: function(pos0, pos1) {
        var d1 = Math.abs (pos1.x - pos0.x);
        var d2 = Math.abs (pos1.y - pos0.y);
        return d1 + d2;
    },
    neighbors: function(grid, node) {
        var ret = [];
        var x = node.x;
        var y = node.y;

        if(grid[x-1] && grid[x-1][y]) {
            ret.push(grid[x-1][y]);
        }
        if(grid[x+1] && grid[x+1][y]) {
            ret.push(grid[x+1][y]);
        }
        if(grid[x] && grid[x][y-1]) {
            ret.push(grid[x][y-1]);
        }
        if(grid[x] && grid[x][y+1]) {
            ret.push(grid[x][y+1]);
        }
        return ret;
    }
}

class Node {
    constructor(x, y, isWall) {
        this.x = x;
        this.y = y;
        this.pos = { x: x, y: y };
        this.isWall = function () {
            return isWall;
        };
    }
}

function manhattan(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

// choose for every waypoint a missplace by 1 since waypoint itself is a wall
function adjustWaypoint(waypoint, start, layout) {
    let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    let validDirections = [];

    for (let direction of directions) {
        let newX = waypoint[0] + direction[0];
        let newY = waypoint[1] + direction[1];

        if (newX >= 0 && newX < layout.length && newY >= 0 && newY < layout[0].length && layout[newX][newY].type === 'empty') {
            validDirections.push([newX, newY]);
        }
    }

    if (validDirections.length === 1) {
        return validDirections[0];
    }

    return validDirections.reduce((a, b) => manhattan(start, a) < manhattan(start, b) ? a : b);
}


// greedy algorithm
function distance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function findPath(layout, start, end, waypoints) {
    let grid = [];
    for(let x = 0; x < layout.length; x++) {
        grid[x] = [];
        for(let y = 0; y < layout[x].length; y++) {
            grid[x][y] = new Node(x, y, (x !== end[0] || y !== end[1]) && layout[x][y].type !== 'empty');
        }
    }

    waypoints = waypoints.map((waypoint, i) => adjustWaypoint(waypoint, start, layout));
    waypoints = [start, ...waypoints];
    
    // convert to node
    let waypointNodes = waypoints.map(point => grid[point[0]][point[1]]);
    let endNode = grid[end[0]][end[1]];

    let path = [];
    let current = waypointNodes[0];
    while (waypointNodes.length > 0) {
        waypointNodes = waypointNodes.filter(node => node !== current);
        if (waypointNodes.length === 0) break;

        let closest = waypointNodes.reduce((a, b) => distance(current, a) < distance(current, b) ? a : b);
        let segmentPath = astar.search(grid, current, closest);
        if (segmentPath.length === 0) {
            return [];
        }

        path = path.concat(segmentPath);
        current = closest;
    }

    // after visiting all waypoints go to end
    let finalSegmentPath = astar.search(grid, current, endNode);
    if (finalSegmentPath.length === 0) {
        return [];
    }
    path = path.concat(finalSegmentPath);
    path = path.map(node => [node.pos.x, node.pos.y]);
    path.unshift(start);

    return path;
}
module.exports = findPath;