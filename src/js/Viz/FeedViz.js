import {getColorFromScale} from './ColorHelper';


export function renderFeedItems(container_ul, graph_JSON){
	for (var n = 0; n < graph_JSON.nodes.length; n++) {
		var user_feed_list = document.createElement("li");

		var node_label = document.createElement("span");
		node_label.innerHTML = "N"+n+": ";
		user_feed_list.append(node_label);

		var feed = graph_JSON.nodes[n].feed;
		var color;
		for (var f = 0; f < feed.length; f++) {
			var feed_item = feed[f];
			color = getColorFromScale(feed_item.opinion_value);
			var new_item = document.createElement("span");
			if(feed_item.item_type == "source article"){
				new_item.innerHTML = "A";
			} else {
				new_item.innerHTML = "S"+feed_item.age;
			}
			new_item.style.backgroundColor = color;
			user_feed_list.append(new_item);
		}
		container_ul.append(user_feed_list);
	}
}