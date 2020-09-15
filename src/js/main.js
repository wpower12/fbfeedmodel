import G6 from '@antv/g6';

var BA = require("./Graphs/BAGen").default;
var addRandomOpinions = require("./Models/Opinion").default;

var randomBAg = BA(2, 2, 50);


const graph = new G6.Graph({
    container: 'mountNode', // String | HTMLElement, required, the id of DOM element or an HTML node
    width: 800, // Number, required, the width of the graph
    height: 500, // Number, required, the height of the graph
 //    layout: {
	//     type: 'force',
	//     width: 600,
	//     height: 600,
	//     preventOverlap: true,
	//     nodeSpacing: 5,
	//     linkDistance: 100,
	// },
	layout: {
	    type: 'fruchterman',
	    center: [200, 200], // The center of the graph by default
	    gravity: 5,
	    speed: 2,
	    clustering: true,
	    clusterGravity: 10,
	    maxIteration: 2000,
	    workerEnabled: true, // Whether to activate web-worker
	  },
});

addRandomOpinions(randomBAg);
console.log(randomBAg);
graph.data(randomBAg);
graph.render();