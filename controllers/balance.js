'use strict'

const mongoose = require('mongoose');
const User = require('../models/user');
const Invest = require('../models/invest');
const service = require('../services');
const moment = require('moment');
const nodemailer = require('nodemailer');
const Ticker = require('../models/ticker');
var _ = require('lodash');
const bitcoin = require('bitcoin');
const Withdraw = require('../models/withdraw');
const Deposit = require('../models/deposit');
const bcrypt = require('bcrypt-nodejs');

var sendpulse = require("sendpulse-api");
var sendpulse = require("../models/sendpulse.js");
var config = require('../config'); 
var speakeasy = require('speakeasy');
const amqp = require('amqplib/callback_api');
var API_USER_ID= 'e0690653db25307c9e049d9eb26e6365';
var API_SECRET= '3d7ebbb8a236cce656f8042248fc536e';
var TOKEN_STORAGE="/tmp/";
const sendRabimq = require('../rabbit_comfim');
const Order = require('../models/order');
sendpulse.init(API_USER_ID,API_SECRET,TOKEN_STORAGE);

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


BTGclient.getInfo( function (err, data){
	console.log(data);
})


function Balance(req,res){
	
	Withdraw.find({'user_id' : req.user._id},(err,result)=>{
		get_pedding_balance(req.user._id,function(data){
			check_pending_deposit(req.user._id,function(check_order){
				res.locals.title = 'Wallet';
				res.locals.menu = 'balance';
				res.locals.user = req.user;
				res.locals.withdraw_history = result;
				res.locals.balance = data;
				res.locals.check_order = check_order;
				res.render('account/balance');
			});
		});	
	});
}

function check_pending_deposit(user_id,callback){
	
	var check_order = {};
	check_order.btc = false;
	check_order.btg = false;
	
	Order.find({$and : [{'user_id' : user_id},{'status' : 0}]},(err,result_order)=>{
		(!err && result_order) && (
			result_order.forEach(function(item){
				if (item.method_payment == 'BTC')
					check_order.btc = true;
				if (item.method_payment == 'BTG')
					check_order.btg = true;
			})
		)
		callback(check_order);
	});
}

function get_pedding_balance(user_id,callback)
{
	var data = {};
	data.sfcc = 0;
	data.btc = 0;
	data.btg = 0;
	
	Deposit.find({$and : [{'user_id' : user_id}, { 'status': 0 }]},(err,result)=>{
		result.forEach(function(item){
			if (item.type == 'SFCC') data.sfcc += parseFloat(item.amount);
			if (item.type == 'BTG') data.btg += parseFloat(item.amount);
			if (item.type == 'BTC') data.btc += parseFloat(item.amount);
			
		});
		callback(data);
	});
}

function getWithdraw_user_pendding(req,res){
	Withdraw.find({$and : [{'user_id' : req.user._id}, { 'status': 0 }]},(err,result)=>{
		var new_data_user = [];
		for (var i = result.length - 1; i >= 0; i--) {
			new_data_user.push({
				'date': moment(result[i].date).format('MM/DD/YYYY LT'),
				'amount': (parseFloat(result[i].amount)/100000000).toFixed(8),
				'type': result[i].type,
				'status' : 'Pending',
				'remove_order' : '<button class="remove_order" data-id="'+result[i]._id+'"> <i class="fa fa-times "></i> </button>'

			});
		}
		return res.status(200).send({result: new_data_user});
	});
}

function getDeposit_user_pendding(req,res){
	Deposit.find({$and : [{'user_id' : req.user._id}, { 'status': 0 }]},(err,result)=>{
		var new_data_user = [];
		for (var i = result.length - 1; i >= 0; i--) {
			var status = (result[i].status == 1) ? 'Finish' : 'Cancel';

			var confirms = result[i].type == 'SFCC' ? '/1' : '/3';

			var url_exchain = result[i].txid;
			if (result[i].type == 'BTC')
				url_exchain = '<a target="_blank" href="https://blockchain.info/tx/'+result[i].txid+'" >'+result[i].txid+'</a>';
			if (result[i].type == 'BTG')
				url_exchain = '<a target="_blank" href="https://btgexplorer.com/tx/'+result[i].txid+'" >'+result[i].txid+'</a>';
			

			new_data_user.push({
				'date': moment(result[i].date).format('MM/DD/YYYY LT'),
				'amount': (parseFloat(result[i].amount)/100000000).toFixed(8),
				'type': result[i].type,
				'confirm' : result[i].confirm+confirms,
				'txid' : url_exchain

			});
		}

		return res.status(200).send({result: new_data_user});
	});
}

function getWithdraw_user_finish(req,res){
	Withdraw.find({$and : [{'user_id' : req.user._id}, {$or: [{ 'status': 1 },{ 'status': 8 }]}]},(err,result)=>{
		var new_data_user = [];
		for (var i = result.length - 1; i >= 0; i--) {
			var status = (result[i].status == 1) ? 'Finish' : 'Cancel';
			new_data_user.push({
				'date': moment(result[i].date).format('MM/DD/YYYY LT'),
				'amount': (parseFloat(result[i].amount)/100000000).toFixed(8),
				'type': result[i].type,
				'status' : status,
				'txid' : result[i].txid

			});
		}

		return res.status(200).send({result: new_data_user});
	});
}

function getDeposit_user_finish(req,res){
	Deposit.find({$and : [{'user_id' : req.user._id}, {$or: [{ 'status': 1 },{ 'status': 8 }]}]},(err,result)=>{
		var new_data_user = [];
		for (var i = result.length - 1; i >= 0; i--) {
			var status = (result[i].status == 1) ? 'Finish' : 'Cancel';

			var url_exchain = result[i].txid;
			if (result[i].type == 'BTC')
				url_exchain = '<a target="_blank" href="https://blockchain.info/tx/'+result[i].txid+'" >'+result[i].txid+'</a>';
			if (result[i].type == 'BTG')
				url_exchain = '<a target="_blank" href="https://btgexplorer.com/tx/'+result[i].txid+'" >'+result[i].txid+'</a>';
			
			new_data_user.push({
				'date': moment(result[i].date).format('MM/DD/YYYY LT'),
				'amount': (parseFloat(result[i].amount)/100000000).toFixed(8),
				'type': result[i].type,
				'status' : 'Finish',
				'txid' : url_exchain

			});
		}

		return res.status(200).send({result: new_data_user});
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

function get_coin_details(name,callback){
	var data = {};
	if (name === 'BTC') { data.confirmations = 3,  data.free = 100000, data.client = BTCclient };
	if (name === 'BTG') { data.confirmations = 3,  data.free = 100000, data.client =  BTGclient };
	if (name === 'SFCC') { data.confirmations = 3,  data.free = 3000000, data.client =  STCclient };
	callback(data);
}

function check_wallet(Client,wallet,callback){
	Client.validateAddress(wallet, function (err, valid) {
		err || !valid.isvalid ? callback(false) : callback(true)
	})
}

function SubmitWithdraw(req,res){
	var address = req.body.address;
	var amount = parseFloat(req.body.amount)*100000000;
	var user = req.user;
	var type = req.body.type;
	if (req.body.token_crt == req.session.token_crt)
	{
		if ( !address)
			return res.status(404).send({message: 'Please enter address wallet '+type+'!'});
		if ( !amount || isNaN(amount) || amount < 0.01)
			return res.status(404).send({message: 'Please enter amount > '+type+'!'});

		if (req.user.security.two_factor_auth.status == 1)
		{
			var verified = speakeasy.totp.verify({
		        secret: user.security.two_factor_auth.code,
		        encoding: 'base32',
		        token: req.body.authenticator
		    });
		    if (!verified) {
		    	return res.status(404).send({ message: 'The two-factor authentication code you specified is incorrect.'});
		    }
		}
			
		get_coin_details(type,function(coin_details){
			get_balance(type,user._id,function(ast_balance){
				if (parseFloat(ast_balance) < parseFloat(amount)+parseFloat(coin_details.free)) 
				{
					return res.status(404).send({error: 'amount', message: 'Ensure wallet has sufficient balance!'});
				}
				else
				{
					var string_sendrabit;
					check_wallet(coin_details.client,address,function(cb){
						cb ? (
							string_sendrabit = user._id.toString()+'_'+amount.toString()+'_'+address.toString(),
							sendRabimq.publish('','Withdraw_'+type+'',new Buffer(string_sendrabit)),
							res.status(200).send({error: '', status: 1, message: 'Withdraw success'})
						) : (
							res.status(404).send({message:'Error Validate Address!'})
						)
					})
				}
			})
		})
	}
}


var update_wallet = function(name ,wallet,user_id,callback){

	var obj = null;
	if (name === 'BTC') obj =  { 'balance.bitcoin_wallet.cryptoaddress': wallet }
	if (name === 'BTG') obj =  {'balance.bitcoingold_wallet.cryptoaddress' : wallet};
	if (name === 'SFCC') obj = {'balance.coin_wallet.cryptoaddress': wallet};
	User.update({ _id :user_id }, { $set : obj }, function(err, UsersUpdate){
		err ? callback(false) : callback(true);
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
function get_new_address(Client,name,user,callback){
	var wallet = '';
	if (name === 'BTC') wallet = user.balance.bitcoin_wallet.cryptoaddress;
	if (name === 'BTG') wallet = user.balance.bitcoingold_wallet.cryptoaddress;
	if (name === 'SFCC') wallet = user.balance.coin_wallet.cryptoaddress;

	wallet === "" ? (
		Client.getNewAddress('', function (err, address){
			err || !address ? (
				callback(null)
			) : (
				update_wallet(name,address,user._id,function(cb){
					cb ? callback(address) : callback(null)
				})
			)

		})
	):(
		callback(wallet)
	)
}


function GetWallet (req,res){
	req.body.type ? (
		get_coin_details(req.body.type,function(data){
			get_new_address(data.client,req.body.type,req.user,function(callback){
				callback === null ? (
					res.status(404).send({message:`Can't create new address. Please try again`})
				) : (
					res.status(200).send({ wallet: callback, message: 'Success!' })
				)
			})	
		})
	) : res.status(404).send({message:`Can't create new address. Please try again`})
}

function create_token(req,res){
	var token_withdraw = _.replace(bcrypt.hashSync(new Date(), bcrypt.genSaltSync(8), null),'?','_');
	req.session.token_crt = token_withdraw;	
	return res.status(200).send({'token': token_withdraw});				
}

function Remove_Withdraw (req,res){
	var user = req.user;

	Withdraw.findOne(
	{ $and : [{_id : req.body.id},{status : 0}]},(err,data)=>{
		if(err){
			res.status(500).send({message: `Error al crear el usuario: ${err}`})
		}
		else
		{
			if (user._id == data.user_id)
			{
				var query = {_id:req.body.id};
				var data_update = {
					$set : {
						'status': 8
					}
				}
				Withdraw.update(query, data_update, function(err, Users){
					if (err)  return res.status(404).send({message:`Can't create new address. Please try again`})
					
					get_balance(data.type,data.user_id,function(ast_balance){
						var new_ast_balance = (parseFloat(ast_balance) + parseFloat(data.amount)).toFixed(8);
						update_balace(data.type , new_ast_balance,data.user_id,function(cb){
							return res.status(200).send({
								message: 'Success'
							});
						})
					})

					
				});
			}
		}
	});

}
module.exports = {
	Balance,
	SubmitWithdraw,
	GetWallet,
	getWithdraw_user_pendding,
	getDeposit_user_pendding,
	getWithdraw_user_finish,
	getDeposit_user_finish,
	Remove_Withdraw,
	create_token
}