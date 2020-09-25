import G6 from '@antv/g6';
import Plotly from 'plotly.js/dist/plotly';
import * as Op      from './Models/Opinion';
import * as FeedViz from './Viz/FeedViz';
import * as OAViz   from './Viz/OutletViz';
import * as Color   from './Viz/ColorHelper';
import BAGen from './Graphs/BAGen';

// Initialize the graph_JSON with a random BA network. 
var graph_JSON = BAGen(2, 2, 50); 
Op.assignRandomOpinions(graph_JSON);
Color.assignOpinionHue(graph_JSON);

// Create Outlets and initialize Feeds, add initial articles.
const NUM_ARTICLES = 5;
const random_outlets = Op.generateOutlets(3, -1, 1, 0.1);
var articles = Op.sampleOutlets(random_outlets, NUM_ARTICLES);
Op.initializeFeeds(graph_JSON);
Op.updateFeeds(graph_JSON, articles, random_outlets);

// Setup feed 'rendering' for all the nodes in the network.
var feed_list = document.createElement("ul");
feed_list.style.columns = 3;
var feed_container = document.getElementById("feeds");
feed_container.append(feed_list);
FeedViz.renderFeedItems(feed_list, graph_JSON); // Initial rendering. 

// Build, Associate with Data, and Initial Render of the G6.Graph
const graph = new G6.Graph({
    container: 'mountNode', 
    width: 800,  
    height: 500, 
	layout: {
	    type: 'fruchterman', // TODO - Better layout possible?
	    center: [200, 200], 
	    gravity: 5,
	    speed: 2,
	    clustering: true,
	    clusterGravity: 10,
	    maxIteration: 1000,
	    workerEnabled: true, 
	  },
});
graph.data(graph_JSON); 	// Note, this is a 'two-way' association. New .render() calls will
graph.render();				// operate on the graph_JSON data, which we can update elsewhere.

// Get outlet/article chart context.
var plot_ctx = document.getElementById("oa_chart");
OAViz.renderOutletsAndArticles(random_outlets, articles, plot_ctx);

// Update Simulation Button
var button_obj = document.getElementById("btn_updatefeeds");
button_obj.onclick = function(){
	articles = Op.sampleOutlets(random_outlets, NUM_ARTICLES);
	Op.updateFeeds(graph_JSON, articles, random_outlets);
	feed_list.innerHTML = "";
	FeedViz.renderFeedItems(feed_list, graph_JSON);
	Op.updateOpinionsFromFeeds(graph_JSON, 0.1);
	Color.updateNodeStyles(graph_JSON);
	graph.render();
	OAViz.renderOutletsAndArticles(random_outlets, articles, plot_ctx);
}
