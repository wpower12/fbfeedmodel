var PD = require("probability-distributions");

// ** Model Methods
export function tick(graph_JSON, outlets, mod_rate){
	// 1. Select Feed Content for each User
	//  - Generate items for each user based on a set of distributions (collect a set of opinion vectors)
	//  	* News Distribution - Sample the articles from the outlets, biased by their opinion
	//  		- Generate opinion vectors from distributions associated with each outlet
	//		* Other Users - Sample friends prior feeds for 'shares'
	//			- Will need to save the old feed?
	//  - Each distribution should have a ~bias~ value that somehow controls manipulation in one direction 
	//    or the other. So a bias towards -1 on the news distribution would somehow force all selections to
	//    be near -1, and vice versa. TODO - MATH ON THIS PART.
	// 2. Update User Opinion Based on Selected Items
	//
	var sampledArticles = sampleOutlets(outlets, 3);
	updateFeeds(graph_JSON, sampledArticles, outlets);
	updateOpinionsFromFeeds(graph_JSON, mod_rate);
}

export function updateOpinionsFromFeeds(graph_JSON, mod_rate){
	for (var i = 0; i < graph_JSON.nodes.length; i++) {
		var node = graph_JSON.nodes[i];
		for (var f = 0; f < node.feed.length; f++) {
			var item_opinion = node.feed[f].opinion_value;
			// Perceptron Update
			graph_JSON.nodes[i].opinion = node.opinion+(mod_rate*(item_opinion-node.opinion));
		}
	}
}

export function updateFeeds(graph_JSON, articles_by_outlet, outlets){
	// Base the selection of an article from articles_by_outlet based on the difference between
	// the opinion of a user and the mean of the outlets distribution (outlets[i][0]).

	// First pass to swap feed to old_feed
	for (var i = 0; i < graph_JSON.nodes.length; i++) {
		graph_JSON.nodes[i].old_feed = graph_JSON.nodes[i].feed;
		graph_JSON.nodes[i].feed = [];
	}

	// Second pass to add from outlets, and from neighbors old_feeds 
	for (var n = 0; n < graph_JSON.nodes.length; n++) {
		// TODO - Allow selection from more than closest outlet. 
		var cur_opinion = graph_JSON.nodes[n].opinion;
		var closest_outlet = getClosestOutlet(outlets, cur_opinion);
		// TODO - have parameters that deteremine how many articles are pulled
		// represent how 'active' the user is in terms of reading and sharing. 
		for (var a = 0; a < articles_by_outlet[closest_outlet].length; a++) {
			if(Math.random() < 0.5){
				var feed_item = {item_type: "source article",
								 opinion_value: articles_by_outlet[closest_outlet][a],
								 age: 0};
				graph_JSON.nodes[n].feed.push(feed_item);
			}
		}
		// Randomly sample some from old feeds of neighbors. 
		var neighbors = graph_JSON.nodes[n].neighbors;
		for (var b = 0; b < neighbors.length; b++) {
			var neighbor = graph_JSON.nodes[neighbors[b]];
			for (var f = 0; f < neighbor.old_feed.length; f++) {
				if(Math.random() < 0.05){
					var feed_item = {item_type: "shared article",
								     opinion_value: neighbor.old_feed[f].opinion_value,
								 	 age: neighbor.old_feed[f].age + 1};
					graph_JSON.nodes[n].feed.push(feed_item);
				}
			}
		}
	}
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

export function sampleOutlets(outlets, num_outputs){
	var articles_by_outlet = [];
	for (var i = 0; i < outlets.length; i++) {
		var outlet_mean = outlets[i][0];
		var outlet_var  = outlets[i][1];
		articles_by_outlet.push(PD.rnorm(num_outputs, outlet_mean, outlet_var));
	}
	return articles_by_outlet;
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

function randomRange(min, max){
	return Math.random()*(max-min)+min;
}

