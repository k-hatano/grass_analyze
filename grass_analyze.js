
var Process = {
	none: 0,
	app: 1,
	abs: 2,
};

var SMALL_W = 'w';
var SMALL_2BYTE_W = 'ｗ';
var LARGE_W = 'W';
var LARGE_2BYTE_W = 'Ｗ';
var SMALL_V = 'v';
var SMALL_2BYTE_V = 'ｖ';

var absArgumentsCount = 0;

function analyzeGrass(original) {
	var lines = [];
	var line = '';

	var length = original.length;
	var process = Process.none;

	for (var i = 0; i < length; i++) {
		var c = original.charAt(i);
		switch (c) {
			case SMALL_W: case SMALL_2BYTE_W: {
				if (process == Process.none) {
					absArgumentsCount = 0;
					while (i < length && ((original.charAt(i) != LARGE_W && original.charAt(i) != LARGE_2BYTE_W && original.charAt(i) != SMALL_V && original.charAt(i) != SMALL_2BYTE_V))) {
						if (original.charAt(i) == SMALL_W || original.charAt(i) == SMALL_2BYTE_W) {
							line += 'w';
							absArgumentsCount++;
						}
						i++;
					}
					line += ' ';
					i--;
					process = Process.abs;
				} else if (process == Process.app) {
					while (i < length && ((original.charAt(i) != LARGE_W && original.charAt(i) != LARGE_2BYTE_W && original.charAt(i) != SMALL_V && original.charAt(i) != SMALL_2BYTE_V))) {
						if (original.charAt(i) == SMALL_W || original.charAt(i) == SMALL_2BYTE_W) {
							line += 'w';
						}
						i++;
					}
					line += ' ';
					i--;
					lines.push(line);
					line = '';
					process = Process.none;
				} else if (process == Process.abs) {
					while (i < length && ((original.charAt(i) != LARGE_W && original.charAt(i) != LARGE_2BYTE_W && original.charAt(i) != SMALL_V && original.charAt(i) != SMALL_2BYTE_V))) {
						if (original.charAt(i) == SMALL_W || original.charAt(i) == SMALL_2BYTE_W) {
							line += 'w';
						}
						i++;
					}
					line += ' ';
					i--;
					absArgumentsCount--;
					if (absArgumentsCount == 0) {
						lines.push(line);
						line = '';
						process = Process.none;
					}
				}
				break;
			}
			case LARGE_W: case LARGE_2BYTE_W: {
				if (process == Process.none) {
					process = Process.app;
				}
				while (i < length && ((original.charAt(i) != SMALL_W && original.charAt(i) != SMALL_2BYTE_W && original.charAt(i) != SMALL_V && original.charAt(i) != SMALL_2BYTE_V))) {
					if (original.charAt(i) == LARGE_W || original.charAt(i) == LARGE_2BYTE_W) {
						line += 'W';
					}
					i++;
				}
				i--;
				break;
			}
			case SMALL_V: case SMALL_2BYTE_V: {
				if (line.length > 0) {
					line += 'v';
					lines.push(line);
					line = '';
				} else {
					lines[lines.length - 1] += 'v';
				}
				process = Process.none;
				break;
			}
			default:
				break;
		}
	}
	if (line.length > 0) {
		lines.push(line);
		line = '';
	}

	var result1 = lines.join('\n');

	var linesCount = lines.length;
	var lines2 = [];
	for (var i = 0; i < linesCount; i++) {
		var line = lines[i];
		var lineLength = line.length;
		var process = Process.none;
		if (line.charAt(0) == 'w') {
			var line2 = 'Abs(';
			for (var j = 0; j < lineLength; j++) {
				if (line.charAt(j) == 'w') {
					var tmpN = 0;
					while (j < lineLength && line.charAt(j) == 'w') {
						tmpN++;
						j++;
					}
					j--;
					if (process == Process.none) {
						line2 += '' + tmpN + ',';
						process = Process.abs;
					} else {
						line2 += '' + tmpN + ')';
					}
					tmpN = 0;
				} else if (line.charAt(j) == 'W') {
					var tmpN = 0;
					while (j < lineLength && line.charAt(j) == 'W') {
						tmpN++;
						j++;
					}
					j--;
					if (process == Process.abs) {
						line2 += 'app(' + tmpN + ',';
						process = Process.app;
					} else {
						line2 += '::app(' + tmpN + ',';
					}
					tmpN = 0;
				}
			}
			line2 += ')';
		} else if (line.charAt(0) == 'W') {
			var line2 = 'app(';
			for (var j = 0; j < lineLength; j++) {
				if (line.charAt(j) == 'w') {
					var tmpN = 0;
					while (j < lineLength && line.charAt(j) == 'w') {
						tmpN++;
						j++;
					}
					j--;
					line2 += '' + tmpN + ')';
					tmpN = 0;
				} else if (line.charAt(j) == 'W') {
					var tmpN = 0;
					while (j < lineLength && line.charAt(j) == 'W') {
						tmpN++;
						j++;
					}
					j--;
					line2 += '' + tmpN + ',';
					tmpN = 0;
				}
			}
		}
		lines2.push(line2);
	}

	var result2 = lines2.join('\n');

	return [result1, result2];
}