'use strict'

const User = require('../../models/user');
const Withdraw = require('../../models/withdraw');
const Ticker = require('../../models/ticker');
const Invest = require('../../models/invest');
const IcoSum = require('../../models/icosum');
const Ico = require('../../models/ico');
const Order = require('../../models/order');
const moment = require('moment');

function Index(req,res){
	
}
function Dahboard(req, res){
	res.render('admin/home', {
		title: 'Dashboard',
		layout: 'layout_admin.hbs'
	});
}
function Customer(req, res){
	User.find({}, function(err, user) {
		if (err){
			
			res.render('admin/customer', {
				title: 'Customer',
				layout: 'layout_admin.hbs',
				users: []
			});
		
		}else{
			// console.log(user);
			res.render('admin/customer', {
				title: 'Customer',
				layout: 'layout_admin.hbs',
				users: user
			});
		}
	})	
}

function EditCustomer(req, res){
	User.findById(req.params.id, (err, users)=>{
		if (err) {
			res.status(500).send({'message': 'Id not found'});
		}else{
			// res.status(200).send(users);
			res.render('admin/editcustomer', {
				title: 'Customer',
				layout: 'layout_admin.hbs',
				users: users
			});
		}
	})
}



function updateUser(req, res){
	console.log(req.body);
	User.findById(req.body.uid, (err, users) => {
	 	if (err){
	 		console.log('Error');

	 	}else{
	 		 User.update(
	            {_id:users._id}, 
	            {$set : {
	            'password': users.generateHash(req.body.password)
	            }}, 
	        function(err, newUser){
	           res.status(500).send({'message': 'Update Success'});
	        })
	 	}
	 });

}

module.exports = {
	Index,
	Dahboard,
	Customer,
	EditCustomer,
	
	updateUser
}