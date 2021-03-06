"use strict";

const math = require("mathjs");
const escape = require("escape-string-regexp");
const Stack = require("./stack.js");
const entries = require("./entries.js");

// compiles yup to js
function parse(code, input, options){
	input = input || [];
	options = options || {};
	// console.log(options);
	let src = "(function(){math.config({number:'BigNumber',precision:100});let input=new Stack([],x=>0);input.push("+input.reverse()+");let stack=new Stack();";
	
	src += `let write=d=>${options.debug ? "console.log" : "process.stdout.write"}(${options.debug ? "'OUTPUT: '+" : ""}d);`;
	
	src += `let f=d=>math.re(math.round(d)).valueOf();let r=d=>${options.noRound ? "d" : `math.round(d,${options.precision})`};`;
	
	if(!options.disableComments)
		code = code.replace(/`.*$/gm, "");
	
	if(!options.whitespaceVariant)
		code = code.replace(/\s/g, "");
	
	let lines = code.split(/;/g);
	// console.log(lines);
	let cmds = {};
	for(let i = 0; i < lines.length; i++){
		if(options.cheat){
			// if you're cheating...!
			let pivot = lines[i].indexOf("=");
			// console.log(lines[i], pivot, cmds);
			
			if(pivot >= 0){
				let data = lines[i].slice(0, pivot);
				let name = lines[i].slice(pivot + 1).trim();
				cmds[name] = data;
				continue;
			}
			
			let cmdsEntries = entries(cmds);
			// sort entries by length of first key (longest keys first)
			cmdsEntries.sort((a, b) => b[0].length - a[0].length);
			// console.log(cmdsEntries);
			let oldLine;
			repl: do {
				oldLine = lines[i];
				for(let j = 0; j < cmdsEntries.length; j++){
					let entry = cmdsEntries[j];
					let key = entry[0];
					let prop = entry[1];
					// console.log(key, prop);
					lines[i] = lines[i].replace(
						RegExp(escape(key), "g"),
						prop
					);
					if(oldLine !== lines[i]) continue repl;
				};
			} while(oldLine !== lines[i]);
		}
		
		if(options.debug) console.log(`line ${i}: ${lines[i]}`);
		
		for(let j = 0; j < lines[i].length; j++){
			if(options.debug){
				src += "console.log('"+JSON.stringify(lines[i][j])+"',stack.toString(),input.toString());";
			}
			
			switch(lines[i][j]){
				case "e":
					src += "stack.top=math.exp(stack.top);";
					break;
				case "|":
					src += "stack.top=math.log(stack.top);";
					break;
				case ":":
					src += "stack.push(stack.top);";
					break;
				case "0":
					src += "stack.push(math.bignumber(0));";
					break;
				case "-":
					src += "stack.push(math.subtract.apply(math,stack.pop(2)));";
					break;
				case "~":
					src += "stack.push.apply(stack,stack.pop(2).reverse());"
					break;
				case "@":
					src += "write(String.fromCharCode(f(stack.pop())));";
					break;
				case "#":
					src += "write(r(stack.pop()).toString());";
					break;
				case "$":
					src += "stack.data=stack.reverse().data;";
					break;
				case "{":
					src += "while(math.max(stack.top,0)!=0&&!!stack.top){";
					break;
				case "}":
					src += "}";
					break;
				case "*":
					src += "stack.push(math.bignumber(input.pop()));";
					break;
				case "]":
					src += "stack.unshift(stack.pop());";
					break;
				case "[":
					src += "stack.push(stack.shift());"
					break;
				case "\\":
					src += "return stack;";
					break;
			}
			if(options.debug)
				src += "console.log(' ',stack.toString(),input.toString());console.log();";
		}
	}
	
	if(options.debugStackFinal)
		src += "console.log('\\n\\n','[',[...stack].map(r).join(', '),']');"
	
	src += "return stack;})();";
	
	return eval(src);
}

exports.default = parse;
module.exports = exports.default;