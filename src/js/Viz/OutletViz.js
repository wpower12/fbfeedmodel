// import Plotly from 'plotly.js/dist/plotly';
import * as Color   from './ColorHelper';

export function renderOutletsAndArticles(outlets, articles, ctx){
	var outlet_dists = getOutletDistShapeData(outlets);
	var article_data = getArticleData(articles, outlets);
	var full_data = outlet_dists.concat(article_data);
	var config = {
					margin: { t: 0 }, 
					paper_bgcolor: "#e6e6e6",
					plot_bgcolor:   "#e6e6e6",
					staticPlot: true,
					showLegend: false,
					xaxis: {range: [-1.1, 1.1]},
					yaxis: {range: [ 0.0, 1.1]},
				};
	Plotly.newPlot( ctx, full_data, config);
}

function getOutletDistShapeData(outlets){
	var ret = [];
	for (var o = 0; o < outlets.length; o++) {
		var o_mean = outlets[o][0];
		var o_var  = outlets[o][1];
		var data = apprxNormal(o_mean, o_var, 20);
		var dataset = {
			name: "Outlet "+o,
			mode: 'lines',
			x: data[0],
			y: data[1],
			line: {
				color: Color.getColorFromScale(o_mean),
			}
		};
		ret[o] = dataset;
	}
	return ret
}

function getArticleData(articles_by_outlet, outlets){
	var ret = [];
	for (var i = 0; i < articles_by_outlet.length; i++) {
		var articles = articles_by_outlet[i];
		var x_data = [];
		var y_data = [];
		for (var a = 0; a < articles.length; a++) {
			y_data.push(0.25);
			x_data.push(articles[a]);
		}
		var dataset = {
			name: "Articles "+i,
			mode: 'markers',
			x: x_data,
			y: y_data,
			marker: {
				color: Color.getColorFromScale(outlets[i][0]),
			},
		}
		ret.push(dataset);
	}
	return ret;
}

function apprxNormal(mean, sigma, num_samples){
	// Get 100 values between -3*sigma+mean, 3*sigma+mean
	// So thats a full 'range' of 6sigma/num_samples
	var step = 6*sigma/num_samples;
	var domain = [];
	var values = [];
	for (var i = 0; i < num_samples; i++) {
		var x_i = (mean-3*sigma) + i*step; 
		domain[i] = x_i;
		values[i] = pdfNormal(x_i, mean, sigma);
	}
	return [domain, values]; 
}

function pdfNormal(x, mu, sigma){
	const c1 = 1.0/(sigma*Math.sqrt(2*Math.PI));
	return Math.exp(-0.5*Math.pow((x-mu)/sigma, 2));
}

