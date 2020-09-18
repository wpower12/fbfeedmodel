const COLORS = ["#F40101", "#F41111", "#F52222", "#F63333",
				"#F64444", "#F75555", "#F86666", "#F97777", 
				"#F98888", "#FA9999", "#FBAAAA", "#FCBBBB",
				"#FCCCCC", "#FDDDDD", "#FEEEEE", "#FFFFFF",
				"#FFFFFF", "#EEF2FF", "#DDE5FF", "#CCD8FF", 
				"#BBCCFF", "#AABFFF", "#99B2FF", "#88A5FF", 
				"#7799FF", "#668CFF", "#557FFF", "#4472FF", 
				"#3366FF", "#2259FF", "#114CFF", "#0040FF"];

export function assignOpinionsAndHue(graph_obj){
	assignRandomOpinions(graph_obj);
	assignOpinionHue(graph_obj);
}

export function assignRandomOpinions(graph_obj){
	for (var i = 0; i < graph_obj.nodes.length; i++) {
		graph_obj.nodes[i].opinion = randomRange(-1, 1);
	}
}

export function assignOpinionHue(graph_obj){
	for (var i = 0; i < graph_obj.nodes.length; i++) {
		var op_val = graph_obj.nodes[i].opinion;
		var color  = getColorFromScale(op_val, COLORS);
		graph_obj.nodes[i].style = {fill: color};
	}
}

function getColorFromScale(value, color_scale){
	return color_scale[scaleValToInt(value, -1.0, 1.0, 0, COLORS.length-1)]
}

function randomRange(min, max){
	return Math.random()*(max-min)+min;
}

function scaleValToInt(input, in_low, in_high, out_low, out_high){
	var old_range = in_high-in_low;
	var new_range = out_high-out_low;
	return Math.floor(((input-in_low)*new_range/old_range)+out_low);
}
