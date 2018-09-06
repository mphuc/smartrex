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

function ListWithdraw(req, res){
	Withdraw.find({status: '0'}, (err, data)=>{
		if (err) {
			res.status(500).send({'message': 'data not found'});
		}else{
			// res.status(200).send(users);
			res.render('admin/withdraw', {
				title: 'Withdraw',
				layout: 'layout_admin.hbs',
				history: data
			});
		}
	})
}

function ListWithdrawhistory(req, res){
	Withdraw.find({status: '1'}, (err, data)=>{
		if (err) {
			res.status(500).send({'message': 'data not found'});
		}else{
			res.render('admin/withdraw_history', {
				title: 'Withdraw',
				layout: 'layout_admin.hbs',
				history: data
			});
		}
	})
}

module.exports = {
	ListWithdraw,
	ListWithdrawhistory
	
}