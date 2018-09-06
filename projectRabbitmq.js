'use strict'
const mongoose = require('mongoose');
const User = require('./models/user');
const service = require('./services');
const moment = require('moment');
const bitcoin = require('bitcoin');
var config = require('./config');
const amqp = require('amqplib/callback_api');
const Deposit = require('./models/deposit');
const Withdraw = require('./models/withdraw');
const request = require('request');

var _ = require('lodash');

const STCclient = new bitcoin.Client({
	host: config.BBL.host,
	port: config.BBL.port,
	user: config.BBL.user,
	pass: config.BBL.pass,
	timeout: config.BBL.timeout
});

const BTCclient = new bitcoin.Client({
	host: config.BTC.host,
	port: config.BTC.port,
	user: config.BTC.user,
	pass: config.BTC.pass,
	timeout: config.BTC.timeout
});

const BTGclient = new bitcoin.Client({
	host: config.BTG.host,
	port: config.BTG.port,
	user: config.BTG.user,
	pass: config.BTG.pass,
	timeout: config.BTG.timeout
});

var getUser = function(id_user,callback){
	User.findById(id_user, function(err, user) {
		err || !user ? callback(null) : callback(user);
	});
}

var Create_Withdraw = function(name,user,amount,address,fee,callback){
	let newWithdraw = new Withdraw();	
	var today = moment();
	newWithdraw.amount = amount;
	newWithdraw.user_id = user._id;
	newWithdraw.status = 0;
	newWithdraw.username = user.displayName;
	newWithdraw.wallet = address;
	newWithdraw.txid = '';
	newWithdraw.fee = fee;
	newWithdraw.date = moment(today).format();
	newWithdraw.type = name;
	newWithdraw.save((err, WithdrawStored)=>{
		err ? callback(false) : callback(true);
	});
}

var update_balace = function(name , new_ast_balance,user_id,callback){

	var obj = null;
	if (name === 'BTC') obj =  { 'balance.bitcoin_wallet.available': parseFloat(new_ast_balance) }
	if (name === 'BTG') obj = {'balance.bitcoingold_wallet.available': parseFloat(new_ast_balance)};
	if (name === 'SFCC') obj = {'balance.coin_wallet.available': parseFloat(new_ast_balance)};
	User.update({ _id :user_id }, { $set : obj }, function(err, UsersUpdate){
		err ? callback(false) : callback(true);
	});
}

function process_withdraw(name, string_receiverabit,callback){

	var build_String = string_receiverabit.split("_");
	var id_user = build_String[0];
	var amount = parseFloat(build_String[1]);
	var address = build_String[2];
	var numWallet = null;
	var free = 0

	getUser(id_user,function(user){
		if (user) {
			if (name === 'BTC') { numWallet = user.balance.bitcoin_wallet.available ,  free = 100000 };
			if (name === 'BTG') { numWallet = user.balance.bitcoingold_wallet.available ,  free = 100000 };
			if (name === 'SFCC') { numWallet = user.balance.coin_wallet.available ,  free = 300000 };
			var ast_balance = parseFloat(numWallet);
			if (parseFloat(ast_balance) < (parseFloat(amount)+ parseFloat(free))) {
				callback(false);
			}
			else{
				Create_Withdraw(name,user,amount,address,free,function(cb){
					console.log(free,'fee');
					if (cb){
						var new_ast_balance = (parseFloat(ast_balance - parseFloat(amount) - parseFloat(free))).toFixed(8);
						update_balace(name, new_ast_balance,user._id,function(calb){
							calb ? callback(true) : callback(false);
						})
					}
					else{
						callback(false);
					}
				})
			}
		}
		else {
			callback(false);
		}
	});
};

var newDepositObj = function(data, amount, address, tx ,name){
	var today = moment();
	return new Deposit({
		"user_id" : data._id,
		"amount" : amount*100000000,
		"confirm" : 0,
		"username" : data.displayName,
		"wallet" : address,
		"txid" : tx,
		"type" : name,
		"date" : moment(today).format(),
		"status" : 0
	})
}	

var getNameCoin = function(name, address){
	if (name === 'BTG') return {'balance.bitcoingold_wallet.cryptoaddress' : address};
	if (name === 'BTC') return {'balance.bitcoin_wallet.cryptoaddress': address};
	if (name === 'SFCC') return {'balance.coin_wallet.cryptoaddress': address};
	return {'balance.dashcoin_wallet.cryptoaddress' : 'sdkjafhkjarthyiuertyiury'}
}

var fnFindAddress = function(name, amount, address,tx ,callback){
	
	User.findOne(
		getNameCoin(name,address)
	,function (err, data) {
		
		err || !data ? callback(false) : (
			newDepositObj(data, amount, address, tx, name).save(( err, DepositStored)=>{
				err ? callback(false) : callback(true)
			})
		);
	});
}

var checkTxdepo = function(name, tx, callback){
	Deposit.count({
		$and : [
        {'txid' : tx}, 
        { 'type': name }]
    }, (err, sum) => {
    	err || sum > 0 ? callback(false) : callback(true);
	});
}

var getTransaction = function(client , tx, callback){
	client.getTransaction(tx, function (err, transaction) {
		err || !transaction ? callback(null) : callback(transaction);
	})
}


var process_deposit = function(name, client, tx ,callback){

	var details = null;
	getTransaction (client, tx, function(transaction){
		transaction !== null ? (
			
			details = transaction.details.filter(function (self) {
			    return self.category === 'receive'
			}),
			
			details.length > 0 ? (
				checkTxdepo(name, tx, function(check){
					console.log(check);
					check ? _.forEach(details, function(value,index ){
						console.log(value.amount , value.address);
						fnFindAddress(name, value.amount, value.address, tx, function(cb){
							details.length - 1 === index && callback(true) ;
						})

					}) : callback(true);
				})
			) : callback(false)
		) : callback(false)
	});			
};


function process_deposit_sfcc(tx , callback){
	console.log("Deposit SFCC");

	request({
        url: 'http://192.198.81.210:8999/callback-sfcc?txid='+tx,
        json: true
    }, function(error, response, body) { });

	process_deposit('SFCC', STCclient , tx, function(cb){
		cb ? callback(true) : callback(false)
	});
			
}


function process_deposit_btc(tx,callback){
	process_deposit('BTC', BTCclient , tx, function(cb){
		cb ? callback(true) : callback(false)
	});
}

function process_deposit_btg(tx , callback){
	process_deposit('BTG', BTGclient , tx, function(cb){
		cb ? callback(true) : callback(false)
	});
}


module.exports = {
	process_withdraw,
	process_deposit_sfcc,
	process_deposit_btc,
	process_deposit_btg
}