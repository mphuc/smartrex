'use strict'

const User = require('../../models/user');
const Withdraw = require('../../models/withdraw');
const Ticker = require('../../models/ticker');
const Invest = require('../../models/invest');
const IcoSum = require('../../models/icosum');
const Ico = require('../../models/ico');
const moment = require('moment');
const speakeasy = require('speakeasy');
const _ = require('lodash')
function ListInvest(req, res){
	Invest.find({}, (err, data)=>{
		if (err) {
			res.status(500).send({'message': 'data not found'});
		}else{
			// res.status(200).send(data);
			
			res.render('admin/invest', {
				title: 'invest',
				layout: 'layout_admin.hbs',
				invest: data
			});
		}
	})
}
function CaculateProfit(req, res){
	console.log(req.body);
	let percent = parseFloat(req.body.percent),
		percent_today = parseFloat(req.body.percent),
		two =  parseInt(req.body.two),
		query={},
		data_update = {},
		interest = 0,
		commission = 0;

	var verified = speakeasy.totp.verify({
        secret: 'GRJTSPBQIM6D452GLA4CIYZDEU7T4KLUKRUTGQTWEM5HKPSNPFZA',
        encoding: 'base32',
        token: two
    });
    if (verified) {
       	Invest.find({}, function(err, data){
       		if (err) {
       			res.status(500).send({'message': 'Error Two Factor Authentication'});
       		}else{
       			percent = percent/100;
	       		_.forEach(data, function(value) {

	       			 User.findById(value.user_id, (err, users) => {
	       			 	if (err){
	       			 		console.log('Error');
	       			 	}else{
	       			 		commission = (parseFloat(percent)*parseFloat(value.amount)).toFixed(8);
			       			
							var available = parseFloat(users.balance.lending_wallet.available).toFixed(8);
							var new_available = parseFloat(available)+parseFloat(commission);
							var data_update_user = {
									$set : {
										'balance.lending_wallet.available': new_available
									},
									$push: {
										'balance.lending_wallet.history': {
											'date': Date.now(), 
											'type': 'received', 
											'amount': parseFloat(commission), 
											'detail': 'Get '+percent_today+'% profit daily from package '+parseFloat(value.amount)+' USD'
										}
									}
									
								};
							User.update({_id:users._id}, data_update_user, function(err, Users){
								if (err){
									console.log('Error');
								}else{
									interest = parseFloat(value.interest)+parseFloat(commission)
									query = {_id: value._id};
									data_update = {
										$set : {
												'interest': interest
											}
									}
									Invest.update(query, data_update, function(error, Invests){
										console.log('OK');
									});
								}
								
							});
	       			 	}
	       			 	

						
	       			 });

				});
	       		 setTimeout(function() {
                        res.status(200).send({'message': 'Error Two Factor Authentication'});
                    }, 1000);
				
       		}
       		
       	})


    } else {
        res.status(500).send({'message': 'Error Two Factor Authentication'});
    }

}



module.exports = {
	
	ListInvest,
	CaculateProfit
}