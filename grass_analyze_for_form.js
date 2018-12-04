
function analyzeAndOutputResult() {
	var original = document.getElementById('original').value;
	var result = analyzeGrass(original);
	document.getElementById('result1').value = result[0];
	document.getElementById('result2').value = result[1];
}