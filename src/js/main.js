import G6 from '@antv/g6';
import {assignRandomOpinions, assignOpinionHue} from './Models/Opinion';
import BAGen from './Graphs/BAGen';

const graph = new G6.Graph({
    container: 'mountNode', // String | HTMLElement, required, the id of DOM element or an HTML node
    width: 800,  // Number, required, the width of the graph
    height: 500, // Number, required, the height of the graph
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

var randomBAg = BAGen(2, 2, 50);
assignRandomOpinions(randomBAg);
assignOpinionHue(randomBAg);
console.log(randomBAg);

graph.data(randomBAg);
graph.render();