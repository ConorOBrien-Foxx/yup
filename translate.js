"use strict";

const escape = require("escape-string-regexp");

const translate = (code, removeExcessTranslate) => {
	let lines = code.split(/;/g);
	let replacements = [];
	for(let i = 0; i < lines.length; i++){
		let pivot = lines[i].indexOf("=");
		if(pivot >= 0){
			let data = lines[i].slice(0, pivot).trim();
			let name = lines[i].slice(pivot + 1).trim();
			replacements.push([name, data]);
			lines[i] = "";
		} else {
			let oldLine;
			do {
				oldLine = lines[i];
				replacements.forEach(repl => {
					lines[i] = lines[i].replace(
						RegExp(escape(repl[0]), "g"),
						repl[1]
					);
				});
			} while(oldLine !== lines[i]);
		}
	}
	
	let result = lines.filter(x => x).join(";");
	if(removeExcessTranslate)
		result = result.replace(/[^-~|e0:]/g, "");
	return result;
}

exports.default = translate;
module.exports = exports.default;