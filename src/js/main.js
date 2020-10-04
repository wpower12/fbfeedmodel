import SNSimulation from './SNSimulation'

var sns = new SNSimulation();

// New Sim Controls
const btn_newsim = document.getElementById("btn_newsim");
btn_newsim.onclick = function(){
	console.log("initializing new simulation");
	sns.NUM_USERS   = document.getElementById("num_user").value;
	sns.NUM_OUTLETS = document.getElementById("num_outlets").value;
	sns.OUTLET_VAR  = document.getElementById("var_outlets").value;

	document.getElementById("mountNode").innerHTML = "";
	document.getElementById("oa_chart").innerHTML  = "";

	sns.initializeSimulation();
};

const btn_update = document.getElementById("btn_updatefeeds");
btn_update.onclick = function(){
	console.log("updating current simulation");
	sns.updateCurrentSimulation();
};

const obj_check_bias = document.getElementById("check_bias");
const obj_value_bias = document.getElementById("value_bias");
const obj_value_intn = document.getElementById("value_intensity");
const btn_save_bias  = document.getElementById("btn_save_bias");

obj_check_bias.onchange = function(){
	if(obj_check_bias.checked){
		sns.BIASED = true;
		sns.BIAS_VALUE = obj_value_bias.value;
		sns.BIAS_INTENSITY = obj_value_intn.value;
		obj_value_bias.disabled = false;
		obj_value_intn.disabled = false;
		btn_save_bias.disabled = false;
	} else {
		sns.BIASED = false;
		obj_value_bias.disabled = true;
		obj_value_intn.disabled = true;
		btn_save_bias.disabled = true;
	}
};

btn_save_bias.onclick = function(){
	sns.BIAS_VALUE = obj_value_bias.value;
	sns.BIAS_INTENSITY = obj_value_intn.value;
}