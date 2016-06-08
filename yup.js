"use strict";

let args = process.argv.slice(2);

if(args.length === 0){
	help();
	return;
}

// load everything since we're going to be doing something

const parse = require("./parse.js");
const translate = require("./translate.js");
const fs = require("fs");

const flagOf = f => f[0] === "/" || f[0] === "-" ? f.slice(1) : false; 

let mode = 0;
let code;
let input = [];
let doTranslate = false;
let removeExcessTranslate = false;
let options = {
	debug: false,
	whitespaceVariant: false,
	noRound: false,
	cheat: false,
	disableComments: false,
	precision: 16
};

for(let i = 0; i < args.length; i++){
	let flag = flagOf(args[i]);
	if(flag === "l"){
		mode = 1;
	} else if(flag === "n"){
		input.push(parseInt(args[++i], 10));
	} else if(flag === "s"){
		let nextArg = args[++i];
		let parsedInput = [...nextArg]
							.map(e => e.charCodeAt());
		input = input.concat(parsedInput);
	} else if(flag === "d"){
		options.debug = true;
	} else if(flag === "w"){
		options.whitespaceVariant = true;
	} else if(flag === "r"){
		options.noRound = true;
	} else if(flag === "cheat"){
		options.cheat = true;
	} else if(flag === "c"){
		options.disableComments = true;
	} else if(flag === "p"){
		options.debugStackFinal = true;
	} else if(flag === "t" || flag === "te"){
		doTranslate = true;
		if(flag === "te")
			removeExcessTranslate = true;
	} else if(flag === "x"){
		options.precision = parseInt(args[++i], 10);
	} else if(flag === "?"){
		help();
		return;
	} else if(!code){
		code = args[i];
	}
}

// console.log(options, input, code);

if(doTranslate){
	switch(mode){
		// run from a file path
		case 0:
			fs.readFile(code, (e, d) => {
				if(e) throw e;
				let trad = translate(d.toString(), removeExcessTranslate);
				console.log(trad,"\n",trad.length);
			});
			break;
		
		// run locally
		case 1:
			let trad = translate(code, removeExcessTranslate);
			console.log(trad,"\n",trad.length);
			break;
	}
} else {
	switch(mode){
		// run from a file path
		case 0:
			fs.readFile(code, (e, d) => {
				if(e) throw e;
				parse(d.toString(), input, options);
			});
			break;
		
		// run locally
		case 1:
			parse(code, input, options);
			break;
	}
}

function help(){
	console.log(`
yup.js by Conor O'Brien

  flag name  | purpose
  ===========+===============================================
  -l         | "local"; runs following arg as yup code
  -d         | "debug"; display stack at each step
  -s         | "string input"; designates the next item as a
             | string, interpreted as series of ASCII cha
             | codes
  -n         | "numeric input"; designates the next item as
             | a number
  -w         | "whitespacevariant"; notices extra spaces
             | in code
  -r         | "no round"; does not round long decimals
  -c         | "disable comments"
  -p         | "print stack"; prints the contents of the
             | stack in the end
  -x         | set decimal place to which to round
  -cheat     | ...
  -t         | translate a cheat program to a regular one
  -te        | -t, but eliminates excess characters`);
}