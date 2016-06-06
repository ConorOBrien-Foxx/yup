"use strict";

class Stack {
	constructor(init, silent){
		init = init || [];
		this.data = {};
		for(let i = 0; i < init.length; i++){
			this.data[i] = init[i];
		}
		this.size = init.length;
		this.silent = silent;
	}
	
	push(v){
		this.data[this.size] = v;
		this.size++;
		if(arguments.length > 1)
			this.push.apply(this, [...arguments].slice(1));
	}
	
	unshift(v){
		if(arguments.length > 1)
			this.unshift.apply(this, [...arguments].slice(1));
		
		let i = this.size;
		while(--i >= 0){
			this.data[i + 1] = this.data[i];
		}
		this.data[0] = v;
		this.size++;
	}
	
	pop(n){
		n = typeof n === "undefined" ? 1 : n;
		if(n === 0)
			return;
		
		if(this.size === 0){
			if(this.silent){
				return this.silent.bind(this)("pop");
			} else
				throw new Error("popping from an empty stack");
		}
		
		if(n === 1){
			let ret = this.data[--this.size];
			delete this.data[this.size];
			return ret;
		}
		
		let res = [];
		while(n --> 0){
			res.push(this.pop());
		}
		return res.reverse();
	}
	
	shift(n){
		n = typeof n === "undefined" ? 1 : n;
		if(n === 0)
			return;
		
		if(this.size === 0){
			if(this.silent){
				return this.silent.bind(this)("shift");
			} else
				throw new Error("shifting from an empty stack");
		}
		
		if(n === 1){
			let bot = this.bottom;
			for(let i = 0; i < this.size;){
				this.data[i] = this.data[++i];
			}
			delete this.data[--this.size];
			return bot;
		}
		
		let res = [];
		while(n --> 0){
			res.push(this.shift());
		}
		return res;
	}
	
	reverse(){
		let res = new Stack();
		let i = this.size;
		while(--i >= 0){
			res.push(this.get(i));
		}
		return res;
	}
	
	get(n){
		return this.data[n];
	}
	
	get bottom(){
		return this.data[0];
	}
	
	set bottom(v){
		return this.data[0] = v;
	}
	
	get top(){
		return this.data[this.size - 1];
	}
	
	set top(v){
		this.pop();
		this.push(v);
		return v;
	}
	
	*[Symbol.iterator](){
		for(let i = 0; i < this.size; i++){
			yield this.data[i];
		}
	}
	
	toString(){
		let result = "";
		for(let i = 0; i < this.size; i++){
			result += this.data[i] + 
				(i !== this.size - 1 ? ", " : "");
		}
		return `[ ${result} ]`;
	}
}

exports.default = Stack;
module.exports = exports.default;