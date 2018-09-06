'use strict'

const User = require('../../models/user');
const Withdraw = require('../../models/withdraw');
const Ticker = require('../../models/ticker');
const Invest = require('../../models/invest');
const IcoSum = require('../../models/icosum');
const Ico = require('../../models/ico');
const moment = require('moment');
const speakeasy = require('speakeasy');
const _ = require('lodash');
const Order = require('../../models/order');

function ListIco(req, res){
	IcoSum.findOne({},(err,total_ico)=>{
		Order.find({status: '0'}, (err, data)=>{
			if (err) {
				res.status(500).send({'message': 'data not found'});
			}else{
				// res.status(200).send(users);
				res.render('admin/ico', {
					title: 'Ico',
					layout: 'layout_admin.hbs',
					ico: data,
					total_ico : total_ico
				});
			}
		})
	})
}

function ListIcohistory(req, res){
	Order.find({status: '1'}, (err, data)=>{
		if (err) {
			res.status(500).send({'message': 'data not found'});
		}else{
			// res.status(200).send(users);
			res.render('admin/ico_history', {
				title: 'Ico',
				layout: 'layout_admin.hbs',
				ico: data
			});
		}
	})
}

function FindOrder(order_id,callback){
	Order.findById(order_id, (err, data) => {
		err || !data ? callback(false) : callback(data);
	 });
}

function CanelICO(req, res){
	var query;
	var data;
	FindOrder(req.params.id,function(data){
		data && data.status == 0 ? (
			query = {_id:data._id},
			data = {$set : {'status': 3}},
			Order.update(query,data,function(err, newUser){
	           res.redirect('/user/admin/ico#success')
	        })
		): res.redirect('/user/admin/ico#error')
	})
}

function EndICO(req, res){
	IcoSum.update({},{$set : {'status' : 0}},(err,result_order)=>{
		res.redirect('/user/admin/ico');
	}); 
}
function StartICO(req, res){
	IcoSum.update({},{$set : {'status' : 1}},(err,result_order)=>{
		res.redirect('/user/admin/ico');
	}); 
}
function TotalBuy(req, res){
	IcoSum.update({},{$set : {'total' :parseFloat(req.body.total)}},(err,result_order)=>{
		res.redirect('/user/admin/ico');
	}); 
}

var getUser = function(id_user,callback){
	User.findById(id_user, function(err, user) {
		err || !user ? callback(null) : callback(user);
	});
}
var update_balace_bbl = function(new_ast_balance,user_id,callback){
	var query = {_id:user_id};
	var data_update = {
		$set : {
			'balance.coin_wallet.available': parseFloat(new_ast_balance)
		}
	};
	User.update(query, data_update, function(err, UsersUpdate){
		err ? callback(false) : callback(true);
	});
}
var update_balance_ico_add = function(user_id,amount,callback){
	getUser(user_id,function(user){
		if (user) 
		{
			var ast_balance = parseFloat(user.balance.coin_wallet.available);
			var new_ast_balance = parseFloat(ast_balance + amount).toFixed(8);
			update_balace_bbl(new_ast_balance,user._id,function(calb){
				calb ? callback(true) : callback(false);
			})
		}
		else
		{
			callback(false)
		}
	});
}


var update_balace_btg = function(new_ast_balance,user_id,callback){
	var query = {_id:user_id};
	var data_update = {
		$set : {
			'balance.bitcoingold_wallet.available': parseFloat(new_ast_balance)
		}
	};
	User.update(query, data_update, function(err, UsersUpdate){
		err ? callback(false) : callback(true);
	});
}

var update_balace_btc = function(new_ast_balance,user_id,callback){
	var query = {_id:user_id};
	var data_update = {
		$set : {
			'balance.bitcoin_wallet.available': parseFloat(new_ast_balance)
		}
	};
	User.update(query, data_update, function(err, UsersUpdate){
		err ? callback(false) : callback(true);
	});
}

var update_balance_wallet = function(name_coin,amount_payment,user_id,callback){
	getUser(user_id,function(user){
		if (user) 
		{
			if (name_coin == 'BTC')
			{
				var ast_balance = parseFloat(user.balance.bitcoin_wallet.available);
				var new_ast_balance = parseFloat(ast_balance - amount_payment).toFixed(8);
				update_balace_btc(new_ast_balance,user._id,function(calb){
					calb ? callback(true) : callback(false);
				})
			}
			else if (name_coin == 'BTG')
			{
				var ast_balance = parseFloat(user.balance.bitcoingold_wallet.available);
				var new_ast_balance = parseFloat(ast_balance - amount_payment).toFixed(8);
				update_balace_btg(new_ast_balance,user._id,function(calb){
					calb ? callback(true) : callback(false);
				})
			}
		}
		else
		{
			callback(false)
		}
	});
}

var	commision_referral = function(user_id,amount_coin,callback){
	var coin_balance;
	var new_ast_balance;
	var query;
	var data_update;
	User.findById(user_id, function(err, user_curent) {
		(!err && user_curent) || parseInt(user_curent.p_node) != 0  ? (
			
			User.findById(user_curent.p_node, function(err, user) {
				!err && user ? (
					coin_balance = parseFloat(user.balance.coin_wallet.available),
					new_ast_balance = parseFloat(coin_balance + amount_coin*0.05),
					query = {_id:user_curent.p_node},
					data_update = {
						$set : {
							'balance.coin_wallet.available': parseFloat(new_ast_balance)
						},
						$push: {
							'balance.coin_wallet.history': {
								'date': Date.now(), 
								'type': 'refferalico', 
								'amount': parseFloat(amount_coin*0.05)/100000000, 
								'detail': 'Get '+amount_coin*0.05/100000000+' SFCC from '+user_curent.displayName+' to buy '+parseFloat(amount_coin)/100000000+' SFCC'
							}
						}
					},
					User.update(query, data_update, function(err, UsersUpdate){
						err ? callback(false) : callback(true);
					})
				) : callback(false)
			})
		): callback(false)
	});
}


function MatchedICO(req, res){
	var query;
	var data_update;
	FindOrder(req.params.id,function(result_order){
		result_order && result_order.status == 0 ? (
			query = {_id:result_order._id},
			data_update = {$set : {'status': 1}},
			Order.update(query,data_update,function(err, newUser){
				update_balance_ico_add(result_order.user_id,parseFloat(result_order.amount_coin),function(cb_add){
					if (cb_add)
					{
						update_balance_wallet(result_order.method_payment,parseFloat(result_order.amount_payment),result_order.user_id,function(){
							commision_referral(result_order.user_id,parseFloat(result_order.amount_coin),function(callback){
								IcoSum.findOne({}, (err, sum) => { 
									var total = (parseFloat(sum.total) + (parseFloat(result_order.amount_coin)/100000000)).toFixed(8);
							    	sum.total = parseFloat(total);
							        sum.save((err, sum) => {
							        	res.redirect('/user/admin/ico#success')
							        });
								});


							})
							
						})
					}
				})
	        })
		): res.redirect('/user/admin/ico#error')
	})
}
module.exports = {
	ListIco,
	CanelICO,
	MatchedICO,
	ListIcohistory,
	EndICO,
	StartICO,
	TotalBuy
	
}