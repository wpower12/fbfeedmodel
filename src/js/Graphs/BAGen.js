
export default function BAGen(num_initial, edges_added, max_nodes) {
	var nodes = Array(); // Will hold edge count, index is node_id
	var edges = Array(); // List of pairs (n_id_0, n_id_1)
	var total_edges = 0;
	for (var i = 0; i < num_initial; i++) {
		nodes.push(num_initial-1);
		for (var j = nodes.length-1; j > i; j--) {
			edges.push([i, j]);
			total_edges += 1;
		}
	}

	for (var i = num_initial; i < max_nodes; i++) {
		nodes.push(0); 
		// Check to see if you add edges. 
		var added_ids = [i];
		for (var j = 0; j < edges_added; j++) {
			var edge_to_id = rouletteSelect(nodes, total_edges, added_ids);
			edges.push([i, edge_to_id]);
			added_ids.push(edge_to_id);
			nodes[i] += 1;
			nodes[edge_to_id] += 1;
			total_edges += 1;
		}
	}
	return formatG6JSON(nodes, edges);
}

function rouletteSelect(nodes, total_edges, ignore_list){
	// First we adjust total_edges by subtractin the counts for all nodes in the ignore list
	for (var i = 0; i < ignore_list.length; i++) {
		total_edges -= ignore_list[i];
	}

	var rand_val = Math.floor(2*Math.random()*total_edges);
	for (var i = 0; i < nodes.length; i++) {
		if( !ignore_list.includes(i)){
			rand_val -= nodes[i];
			if(rand_val < 0){
				return i;
			}
		}
	}
}

function formatG6JSON(node_list, edge_list){
	var graphData = {nodes: [], edges: []};
	for (var i = 0; i < node_list.length; i++) {
		graphData.nodes.push({id: i.toString(), 
							  label: i.toString(), 
							  labelCfg: {
							  	style: {
							  		// lineWidth: 1,
							  		fontSize: 14,
							  		fill: "dark grey"
							  	}
							  },
							  neighbors: [],
							  size: 25,
							  style: {
							  	stroke: "dark grey",
							  }});
	}

	for (var e = 0; e < edge_list.length; e++) {
		var edge = edge_list[e];
		graphData.edges.push({source: edge[0].toString(), 
							  target: edge[1].toString(), 
							  style: {lineWidth: 1, 
							  		  stroke: "grey"}});
		if(!(edge[0] in graphData.nodes[edge[1]].neighbors)) {
			graphData.nodes[edge[1]].neighbors.push(edge[0]);
		}
		if(!(edge[1] in graphData.nodes[edge[0]].neighbors)) {
			graphData.nodes[edge[0]].neighbors.push(edge[1]);
		}
	}
	return graphData;
}