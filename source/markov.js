var order = 2;
var numChars = 120;
var prefix;
var dict;

function run() {
	var inputText = document.getElementById("input").value;
	inputText = inputText.replace(/#|"/g, '').replace(/\s+/g, ' ');
	inputText = inputText.replace(/^\s+|s+$/g,'').replace(/\s+/g, ' ');

	var len = inputText.length;
	var m = 0;

	if(inputText.length < 2) {
		alert("Need more text");
		return;
	}
	for(var i = 0; i < len; i++) {
		if(inputText.charCodeAt(i) > 255) m++;
	}

	inputText = inputText.split(" ");


	initPrefix();
	dict = new Array();

	for(var i = 0; i < inputText.length; i++) {
		add(inputText[i]);
	}
	add(" ")

	makeSentence();

}

function initPrefix() {
	prefix = new Array(order);
	for(var i = 0; i < order; i++) prefix[i] = " ";
}

function add(word) {
	var key = prefix.join("#");
	if(dict[key] == null) dict[key] = new Array();
	dict[key].push(word);
	prefix.shift();
	prefix.push(word);
}

function makeSentence() {
	initPrefix();
	var output = "";
	while( output.length < numChars) {
		var words = dict[prefix.join("#")];
		var w = words[Math.floor(Math.random() * words.length)];
		if(w == " ") break;
		output += w + " ";
		prefix.shift();
		prefix.push(w);
	}
	document.getElementById("output").innerHTML = output;
}