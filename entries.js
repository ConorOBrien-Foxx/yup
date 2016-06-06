"use strict";

// Object.entries polyfill
const entries = obj => {
	let result = [];
	for(let prop in obj){
		if(!obj.propertyIsEnumerable(prop)) continue;
		result.push([prop, obj[prop]]);
	}
	return result;
};

exports.default = entries;
module.exports = exports.default;