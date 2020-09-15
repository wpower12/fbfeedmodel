function rouletteSelect(nodes, total_edges){
	var rand_val = Math.floor(2*Math.random()*total_edges);
	for (var i = 0; i < nodes.length; i++) {
		rand_val -= nodes[i];
		if(rand_val < 0){
			return i;
		}
	}
}

function formatG6JSON(node_list, edge_list){
	var graphData = {nodes: [], edges: []};
	for (var i = 0; i < node_list.length; i++) {
		graphData.nodes.push({id: i.toString(), label: "n"+i.toString()});
	}

	for (var e = 0; e < edge_list.length; e++) {
		var edge = edge_list[e];
		graphData.edges.push({source: edge[0].toString(), 
							  target: edge[1].toString(), 
							  style: {lineWidth: 3, 
							  		  stroke: "black"}}); 
	}
	return graphData;
}

function BAGen(num_initial, edges_added, max_nodes) {
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
		for (var j = 0; j < edges_added; j++) {
			// Todo - Handle duplicate edges?
			var edge_to_id = rouletteSelect(nodes, total_edges);
			edges.push([i, edge_to_id]);
			nodes[i] += 1;
			nodes[edge_to_id] += 1;
			total_edges += 1;
		}
	}
	return formatG6JSON(nodes, edges);
}
export default BAGen;