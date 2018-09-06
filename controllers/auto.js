'use strict'

const mongoose = require('mongoose');
const User = require('../models/user');
const service = require('../services');
const moment = require('moment');
const bitcoin = require('bitcoin');
var config = require('../config');
const Deposit = require('../models/deposit');
const Withdraw = require('../models/withdraw');
const cron = require('node-cron');
var _ = require('lodash');
var sleep = require('sleep');
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


cron.schedule('30 */5 * * * *', function(){
//cron.schedule('*/5 * * * * *', function(){
  Auto_Confirm_Deposit();
  
});

cron.schedule('30 */10 * * * *', function(){
	Auto_Confirm_Withdraw();
});

function update_status_deposit(_id,status,confirmations,callback){
	var query = {_id:_id};
	var data_update = {$set : {
		'status': status,
		'confirm' : confirmations
	}};
	Deposit.update(query, data_update, function(err, newUser){
		err ? callback(false) : callback(true)
	});
}

function update_status_withdraw(_id_wthidraw,status,callback)
{
	var query = {_id: _id_wthidraw};
	var data_update = {
		$set : {
			'status': status
		}
	};
	Withdraw.update(query, data_update, function(err, IcoUpdate){
		err ? callback(false) : callback(true)
	});
}

var update_balace = function(name , new_ast_balance,user_id,callback){

	var obj = null;
	if (name === 'BTC') obj =  { 'balance.bitcoin_wallet.available': parseFloat(new_ast_balance) }
	if (name === 'BTG') obj =  {'balance.bitcoingold_wallet.available' : parseFloat(new_ast_balance)};
	if (name === 'SFCC') obj = {'balance.coin_wallet.available': parseFloat(new_ast_balance)};
	User.update({ _id :user_id }, { $set : obj }, function(err, UsersUpdate){
		err ? callback(false) : callback(true);
	});
}

var get_balance =function(name,user_id,callback){
	var balance = 0;
	User.findOne({'_id' : user_id},(err,data)=>{
		(!err && data)? (
			name === 'BTC' && callback(data.balance.bitcoin_wallet.available),
			name === 'BTG' && callback(data.balance.bitcoingold_wallet.available),
			name === 'SFCC' && callback(data.balance.coin_wallet.available)
		) : callback (balance) 
	})
}

function update_wallet_user(user_id,wallet,amount,callback){
	
	get_balance(wallet,user_id,function(available){
		var new_ast_balance = parseFloat(available) + parseFloat(amount);
		update_balace(wallet , new_ast_balance,user_id,function(cb){
			!cb ? callback(false) : callback(true);
		})
	})
		
}
function gettransaction(client,txid,callback){
	
	client.getTransaction(txid, function (err, data_transaction){
		err || !data_transaction ? callback(null) : callback(data_transaction.confirmations)
	});
}
/*
function update_status_deposit(_id,status,confirmations,callback){
	var query = {_id:_id};
	var data_update = {$set : {
		'status': 1,
		'confirm' : confirmations
	}};
	Deposit.update(query, data_update, function(err, newUser){
		err ? callback(false) : callback(true)
	});
}*/

function get_coin_details(name,callback){
	var data = {};
	if (name === 'BTC') { data.confirmations = 3,  data.free = 0.001, data.client = BTCclient };
	if (name === 'BTG') { data.confirmations = 3,  data.free = 0.001, data.client =  BTGclient };
	if (name === 'SFCC') { data.confirmations = 0,  data.free = 0.001, data.client =  STCclient };
	callback(data);
}
function Auto_Confirm_Deposit(){
	Deposit.find({'status' : 0},(err,result)=>{
		(err || !result) ?  res.status(404).send({message :'Error Query'}) : (
			result.forEach(function(item){
				get_coin_details(item.type,function(detail_coin){
					gettransaction(detail_coin.client,item.txid, function(confirmations){
						confirmations !== null ? (
							parseInt(confirmations) >= parseInt(detail_coin.confirmations) ? (
								update_status_deposit(item._id,1,confirmations,function(callback){
									if (callback)
									{
										update_wallet_user(item.user_id,item.type,item.amount,function(send_callback){
											console.log("update complete "+item.type+"");
										});
									}
								})
							) : (console.log("confirmations "+item.type+" 0"))	
							
						) : (console.log("transaction "+item.type+" nul"))
					})
				});
			})
		)	
	});
	
}

var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
function get_withdraw_muti_address(name,callback){
	
	Withdraw.find({$and : [{'status' : 0},{'type' : name}]},(err,result)=>{
		var totals;
		err || !result ? callback(null) : (
			totals = result.reduce(function (r, o) {
			    (r[o.wallet])? r[o.wallet] += parseFloat(o.amount)/100000000 : r[o.wallet] = parseFloat(o.amount)/100000000;
			    return r;
			}, {}),
			callback(totals)
		)
	});
}

function sendMany(Client,account_send,muti_address,callback){
	Client.sendMany(account_send,muti_address,function (err, txid){
		console.log(err,txid,"send");
		err ? callback(null) : callback(txid)
	})
}

function update_confirm_withdraw(name,txid,callback){
	Withdraw.updateMany({
		$and : [{'type' : name},{'status' : 0}]
	}, { $set : {'txid' :txid, 'status' : 1} }, function(err, data){
		err ? callback(false) : callback(true);
	});
}

function withdraw(name,Client,account_send,callback){
	get_withdraw_muti_address(name,function(cb){

		cb === null || _.isEmpty(cb) ? callback(false) : (
			console.log(cb),
			sendMany(Client,account_send,cb,function(txid){
				txid !== null ? (
					update_confirm_withdraw(name,txid,function(result){
						callback(true)
					})
				):callback(false)
			})
		)
	});
}

function Auto_Confirm_Withdraw(){
	withdraw('SFCC',STCclient,'',function(cb){
		cb ? console.log('Send Success BBL') : console.log('Send Fail BBL')
	})
	sleep.sleep(1);

	withdraw('BTC',BTCclient,'',function(cb){
		cb ? console.log('Send Success BTC') : console.log('Send Fail BTC')
	})
	sleep.sleep(1);

	withdraw('BTG',BTGclient,'',function(cb){
		cb ? console.log('Send Success BTG') : console.log('Send Fail BTG')
	})
	sleep.sleep(1);

	/*withdraw('DASH',DASHclient,'',function(cb){
		cb ? console.log('Send Success DASH') : console.log('Send Fail DASH')
	})
	sleep.sleep(1);*/
		
}

