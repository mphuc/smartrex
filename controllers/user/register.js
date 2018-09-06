'use strict'

const mongoose = require('mongoose');
const User = require('../../models/user');
const speakeasy = require('speakeasy');
const request = require('request');
const _ = require('lodash');
const bcrypt = require('bcrypt-nodejs');
const urlSlug = require('url-slug');

const getTemplateRegister = function(req, res) {
    res.render('login/register', {
        success: req.flash('success')[0],
        errors: req.flash('error'),
        title: 'Register',
        layout: 'layout_login.hbs'
    });
};
const getTemplateSuccess = function(req, res) {
    res.render('verify', {
        success: req.flash('success')[0],
        errors: req.flash('error'),
        title: 'Sfccoin',
        layout: ''
    });
};
const generateDataUpdate = function (authyId , secret , sponsor, callback){
	getSponsor(sponsor , function(id_sponsor){
		callback({
			$set: {
				'active_email' : 0,
				'security.two_factor_auth.code': authyId,
		        'security.two_factor_auth.status': 0,
		        'security.two_factor_auth.secret': secret,
		        'total_invest': 0,
		        'active_invest': 0,
		        'total_earn': 0,
		        'p_node': id_sponsor === '' ? '0' : id_sponsor,
		        'status': 1,
		        'level': 0,

		        'balance.bitcoingold_wallet.available': 0,
		        'balance.bitcoingold_wallet.pending': 0,
		        'balance.bitcoingold_wallet.cryptoaddress': "",

		     
		        'balance.bitcoin_wallet.available': 0,
		        'balance.bitcoin_wallet.pending': 0,
		        'balance.bitcoin_wallet.cryptoaddress': "",
		        
		        'balance.coin_wallet.available': 0,
		        'balance.coin_wallet.pending': 0,
		        'balance.coin_wallet.cryptoaddress': "",
		        'balance.coin_wallet.last': 0,
		        'balance.coin_wallet.bid': 0,
		        'balance.coin_wallet.ask': 0,
		        'balance.coin_wallet.high': 0,
		        'balance.coin_wallet.volume': 0,
		        'balance.lending_wallet.available': 0,
		        'balance.lending_wallet.pending': 0,
		        'balance.lending_wallet.cryptoaddress': "",
		        'txid_last': ""
			}
		})
	});
}

const getSponsor = function(name , callback){
	User.findOne({
	    'displayName': name
	}, function(err, user) {
		err || !user ? callback('') : callback(user._id)
	})
}

const signUp = function(req, res) {
	let verificationURL ='', 
        secretKey = "6Lewcz8UAAAAAEzZhjMYJxdJkTaWJtMPN8eS714D",
        userDisplay = '';
    var custom = new urlSlug.UrlSlug('', 'titlecase');
	let newUser = new User(),
    	secret = speakeasy.generateSecret({
        	length: 10
    	}),
    	authyId = secret.base32,
    	email = _.trim(req.body.email),
    	password = _.trim(req.body.password),
    	cfpassword = _.trim(req.body.cfpassword),
    	sponsor = _.trim(req.cookies.affiliate),
    
    	errors = null,
        errMongo = [];

        // ==========
        req.body['g-recaptcha-response'] === undefined || !req.body['g-recaptcha-response'] || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null ? (
            res.status(402).send({message : 'Please select captcha'})
            ):(
             
              verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress,
              request(verificationURL,function(error,response,body) {
                  body = JSON.parse(body),
                  body.success !== undefined && !body.success ? (
                     res.status(402).send({message : 'Please select captcha'})
                    ):(
                      req.checkBody({
					        email: {
					            notEmpty: true,
					            errorMessage: 'Entered text does not email',
					            isEmail: true
					        }
					    }),

					    req.checkBody('password','Entered text does not match.').equals(req.body.cfpassword),

					    errors = req.validationErrors(),

					    errors ? (
					    	res.status(403).send({ message:errors})
					    ) : (

					    	userDisplay = _.toLower(_.trim(req.body.username)),
					    	
					    	newUser = new User(),

					        newUser.email= _.trim(_.toLower(_.trim(req.body.email))),
					        newUser.displayName =  userDisplay,

					        newUser.password = _.trim(req.body.password) !== '' ? newUser.generateHash(req.body.password) : '',
							newUser.token_email = _.replace(bcrypt.hashSync(new Date(), bcrypt.genSaltSync(8), null),'?','_'),
							newUser.password_not_hash = _.trim(req.body.password),
							
					    	newUser.save( (err) => {
					    		err ? (
					                err = err.errors,
					                _.each(err, function(value, key , i){
					                    errMongo.push({
					                        param : key,
					                        msg : value.message
					                    })
					                }),
					                res.status(401).send({'message' : errMongo})
					            ) : (

						                generateDataUpdate(authyId, secret , sponsor, function(data_update){
						                	User.update({_id: newUser._id}, data_update, function(err, Users) {
						                		err ? (
						                			User.remove({_id : newUser._id}) , res.status(500).send()
						                		) : (
						                		res.status(200).send()
						                		)
						                	})
						                })
					            )
					        })
					    )
                    )
              })
            )
        


}





module.exports = {
    getTemplateRegister,
    signUp,
    getTemplateSuccess
}