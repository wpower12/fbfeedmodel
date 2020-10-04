var PD = require("probability-distributions");

// ** Model Update Methods - change the state of the graph JSON based on provided state. 

export function updateFeeds(graph_JSON, articles_by_outlet, outlets){
	// Fills each users feed with new 'articles'
	// Currently has a chance to select all, or a subset, of the articles from
	// the 'nearest' outlet. 
	// TODO - need to give a chance on all articles, from all outlets
	//        with propability inversly proportional to the distance b/w user/outletmean
	// TODO - implement a 'chance this user reads an article' parameter? just reuse susceptability?
	for (var n = 0; n < graph_JSON.nodes.length; n++) {
		graph_JSON.nodes[n].feed = [];
		var cur_opinion = graph_JSON.nodes[n].opinion;
		var closest_outlet = getClosestOutlet(outlets, cur_opinion);
		for (var a = 0; a < articles_by_outlet[closest_outlet].length; a++) {
			if(Math.random() < 0.5){
				var feed_item = {item_type: "source article",
								 opinion_value: articles_by_outlet[closest_outlet][a],
								 age: 0};
				graph_JSON.nodes[n].feed.push(feed_item);
			}
		}
	}
}

export function updateOpinions(graph_JSON, mod_rate, bias_flag, bias_opinion, bias_intensity){
	// Based on the 'combined feeds' of the user and all their neighbors feeds. 
	// Each article in this set has a chance to contribute to the opinion delta
	// for this iteration of the simulation. 
	for (var i = 0; i < graph_JSON.nodes.length; i++) {
		var opinion_delta = 0.0;
		var num_articles_influenced = 0;
		var node = graph_JSON.nodes[i];

		// add all of our articles. 
		for (var a = 0; a < node.feed.length; a++) {
			if(node.susceptibility > Math.random()){
				opinion_delta += mod_rate*calculateOpinionUpdate(node.feed[a].opinion_value, node.opinion);
				num_articles_influenced += 1;
			}
		}

		// all our neighbors. 
		var neighbors = node.neighbors;
		for (var n = 0; n < neighbors.length; n++) {
			var neighbor = graph_JSON.nodes[neighbors[n]];
			for (var a = 0; a < neighbor.feed.length; a++) {
				var article_opinion = neighbor.feed[a].opinion_value;
				if ((node.susceptibility > Math.random()) && biasCheck(article_opinion, 
															 		   bias_flag, 
															 		   bias_opinion, 
															 		   bias_intensity)) {
					opinion_delta += mod_rate*calculateOpinionUpdate(article_opinion, node.opinion);
					num_articles_influenced += 1;
				}
			}
		}
		
		if(num_articles_influenced > 0){
			node.opinion += (1.0/num_articles_influenced)*opinion_delta;
		}
	}
}

export function sampleOutlets(outlets, num_outputs){
	var articles_by_outlet = [];
	for (var i = 0; i < outlets.length; i++) {
		var outlet_mean = outlets[i][0];
		var outlet_var  = outlets[i][1];
		articles_by_outlet.push(PD.rnorm(num_outputs, outlet_mean, outlet_var));
	}
	return articles_by_outlet;
}

// Returns true if the article 'can be seen' by the user. 
function biasCheck(article_opinion, bias_flag, bias_opinion, bias_intensity){
	if(bias_flag){
		// first we sample the triangular distribution
		var article_rate;
		if(article_opinion < bias_opinion){
			article_rate = (1.0-bias_intensity)*article_opinion+bias_intensity;
		} else {
			var slope = -[(1.0-bias_intensity)/(1.0-bias_opinion)];
			article_rate = slope*article_opinion+[1.0+bias_opinion*(1.0-bias_intensity)/(1.0-bias_opinion)];
		}
		// Then check against it. 
		return Math.random() < article_rate;
	} else {
		return true;
	}
}

function calculateOpinionUpdate(article, curr_opinion){
	return article-curr_opinion;
}


function getClosestOutlet(outlets, opinion){
	var distance_to_mean = 10; 
	var current_best_idx = -1;
	for (var o = 0; o < outlets.length; o++) {
		if(Math.abs(outlets[o][0]-opinion) < distance_to_mean){
			current_best_idx = o;
			distance_to_mean = Math.abs(outlets[o][0]-opinion);
		}
	}
	// return outlets[current_best_idx];
	return current_best_idx;
}


// ** Initialization Methods - For setting up a simulation and its users. 

export function generateOutlets(num_outlets, min_val, max_val, opinion_variance){
	// pick num_outlet many 'means' evenly space on the interval [min, max], including the endpoints
	// when saying 'evenly spaced', so no outlet should exist with a mean of min or max, but at 
	// min+var, max-var. 
	var outlets = [];
	var d = (max_val-min_val)/((num_outlets-1)+2); // Just to be clear that we usually have n-1 bins, then we add 2 at the ends.
	for (var i = 0; i < num_outlets; i++) {
		outlets.push([d*(i+1)+min_val, opinion_variance]);
	}
	return outlets;
}

export function assignRandomOpinions(graph_JSON){
	for (var i = 0; i < graph_JSON.nodes.length; i++) { 
		graph_JSON.nodes[i].opinion = randomRange(-1, 1);
	}
}

export function initializeFeeds(graph_JSON){
	for (var i = 0; i < graph_JSON.nodes.length; i++) {
		graph_JSON.nodes[i].old_feed = [];
		graph_JSON.nodes[i].feed = [];
	}
}

export function initializeUserParameters(graph_JSON, min_suscept, max_suscept){
	for (var n = 0; n < graph_JSON.nodes.length; n++) {
		// graph_JSON.nodes[n].susceptibility = Math.random();
		graph_JSON.nodes[n].susceptibility = randomRange(min_suscept, max_suscept);
	}
}

// ** Helpers

function randomRange(min, max){
	return Math.random()*(max-min)+min;
}

