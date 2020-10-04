import G6 from '@antv/g6';
// import Plotly from 'plotly.js/dist/plotly';
import * as Op      from './Models/Opinion';
// import * as FeedViz from './Viz/FeedViz';
import * as OAViz   from './Viz/OutletViz';
import * as Color   from './Viz/ColorHelper';
import BAGen from './Graphs/BAGen';

export default class SNSimulation {
	constructor(){
		this.NUM_USERS    = 25;
		this.BA_INITIAL_N = 2;
		this.BA_EDGES_ADD = 2;
		this.NUM_OUTLETS  = 2;
		this.OUTLET_VAR   = 0.01;
		this.NUM_ARTICLES = 5;

		this.MIN_SUSCEPT = 0.5; // For the U(a,b) used to select Users susceptibility
		this.MAX_SUSCEPT = 1.0; 

		this.BIASED = false;
		this.BIAS_VALUE = 1.0;
		this.BIAS_INTENSITY = 0.1;

		this.initializeSimulation();
	}

	initializeSimulation(){
		// Initialize the graph_JSON with a random BA network. 
		this.graph_JSON = BAGen(this.BA_INITIAL_N, 
								this.BA_EDGES_ADD, 
								this.NUM_USERS); 
		Op.assignRandomOpinions(this.graph_JSON);
		Color.assignOpinionHue(this.graph_JSON);

		// Create Outlets and initialize Feeds, add initial articles.
		this.OUTLETS = Op.generateOutlets(this.NUM_OUTLETS, -1.5, 1.5, 0.1);
		var articles = Op.sampleOutlets(this.OUTLETS, this.NUM_ARTICLES);
		Op.initializeFeeds(this.graph_JSON);
		Op.initializeUserParameters(this.graph_JSON, this.MIN_SUSCEPT, this.MAX_SUSCEPT);
		Op.updateFeeds(this.graph_JSON, articles, this.OUTLETS);

		// Get outlet/article chart context.
		this.OA_PLOT_CTX = document.getElementById("oa_chart");
		OAViz.renderOutletsAndArticles(this.OUTLETS, articles, this.OA_PLOT_CTX);

		// Build, Associate with Data, and Initial Render of the G6.Graph
		this.graph = new G6.Graph({
		    container: 'mountNode', 
		    width: 500,  
		    height: 500,
			layout: { 
				type: 'force',
				linkDistance: 120,
				nodeSize: 30,
				preventOverlap: true,
				alphaDecay: 0.005
			},
		});
		this.graph.data(this.graph_JSON); 	// Note, this is a 'two-way' association. New .render() calls will
		this.graph.render();				// operate on the graph_JSON data, which we can update elsewhere.

	}

	updateCurrentSimulation(){
		var articles = Op.sampleOutlets(this.OUTLETS, this.NUM_ARTICLES);
		Op.updateFeeds(this.graph_JSON, articles, this.OUTLETS);
		Op.updateOpinions(this.graph_JSON, 0.1, this.BIASED, this.BIAS_VALUE, this.BIAS_INTENSITY);
		Color.updateNodeStyles(this.graph_JSON);
		this.graph.render();
		OAViz.renderOutletsAndArticles(this.OUTLETS, articles, this.OA_PLOT_CTX);
	}

}