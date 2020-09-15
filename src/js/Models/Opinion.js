function addRandomOpinions(graph_obj){
	var colors = ["#F40101",
				  "#F41111",
				  "#F52222",
				  "#F63333",
				  "#F64444",
				  "#F75555",
				  "#F86666",
				  "#F97777",
				  "#F98888",
				  "#FA9999",
				  "#FBAAAA",
				  "#FCBBBB",
				  "#FCCCCC",
				  "#FDDDDD",
				  "#FEEEEE",
				  "#FFFFFF",
				  "#EEF2FF",
				  "#DDE5FF",
				  "#CCD8FF",
				  "#BBCCFF",
				  "#AABFFF",
				  "#99B2FF",
				  "#88A5FF",
				  "#7799FF",
				  "#668CFF",
				  "#557FFF",
				  "#4472FF",
				  "#3366FF",
				  "#2259FF",
				  "#114CFF",
				  "#0040FF"];

	for (var i = 0; i < graph_obj.nodes.length; i++) {
		graph_obj.nodes[i].style = {fill: colors[Math.floor(Math.random()*colors.length)]};
	}
}

export default addRandomOpinions;