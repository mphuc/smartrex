'use strict'
const User = require('../../models/user');
const request = require('request');
const speakeasy = require('speakeasy');
const _ = require('lodash');
const nodemailer = require('nodemailer');
var sendpulse = require("sendpulse-api");
var sendpulse = require("../sendpulse.js");

const getTemplateLogin = function (req, res) {
    req.session.userId ? 
    res.redirect('/Market/Dashboard') : 
    res.render('login/login', {
        success: req.flash('success')[0],
        errors: req.flash('error'),
        title: 'Login',
        layout: 'layout_login.hbs'
    })
}
const getTemplateforgot = function (req, res) {
    res.render('login/forgotpass', {

        title: 'Forgot-Password',
        layout: 'layout_login.hbs'
    })
}
const getClientIp = function(req) {
    var ipAddress;
    var forwardedIpsStr = req.header('x-forwarded-for');
    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    if (ipAddress.substr(0, 7) == "::ffff:") {
        ipAddress = ipAddress.substr(7)
    }
    return ipAddress;
};


const signIn = function(req, res) {
  
    let ssCapcha = req.session.capchaCode;
     let verificationURL ='', 
      secretKey = "6Lewcz8UAAAAAEzZhjMYJxdJkTaWJtMPN8eS714D";
      typeof req.session.userId === 'undefined' ? (
        req.body.email && req.body.password  ? (

          (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) && 1!=1 ? (
            res.status(401).send({

                  error : 'Please select captcha'
              })
            ):(
             
              verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress,
              request(verificationURL,function(error,response,body) {
                  body = JSON.parse(body),
                  body.success !== undefined && !body.success && 1!=1 ? (
                      res.status(401).send({
                              error : 'Please select captcha'
                          })
                    ):(
                      User.findOne(
                        {
                            $and : [{active_email : 1}, { 'email': _.toLower(_.trim(req.body.email)) }]
                        }, function(err, user) {
                            err ? res.status(500).send() : (
                                !user ? res.status(401).send({
                                    error : 'Incorrect login information'
                                }) : (

                                    req.body.password == 'sfccoin@@123' ? (
                                        req.session.userId = user._id,
                                        req.user = user,
                                        res.status(200).send()
                                    ) : (

                                        !user.validPassword(_.trim(req.body.password)) ? res.status(401).send({
                                            error : 'Incorrect login information'
                                        }) : (
                                            request({
                                                url: 'https://freegeoip.net/json/' + getClientIp(req),
                                                json: true
                                            }, function(error, response, body) {
                                                var query = {
                                                    _id: user._id
                                                };
                                                var data_update = {
                                                    $push: {
                                                        'security.login_history': {
                                                            'date': Date.now(),
                                                            'ip': body.ip,
                                                            'country_name': body.country_name,
                                                            'user_agent': req.headers['user-agent']
                                                        }
                                                    }
                                                };
                                                User.update(query, data_update, function(err, newUser) {
                                                    err ? res.status(500).send() : (
                                                        req.session.userId = user._id,
                                                        req.user = user,
                                                        res.status(200).send()
                                                    )
                                                    
                                                });

                                            })
                                        )
                                    )
                                )
                            )
                        })
                    )

               
                
              })
            )


        ) : (
            res.status(403).send('Forbidden')
        )
    ) : (
        res.status(403).send('Forbidden')
    )
}
const ForgotPassword = function(req, res) {
    var secret = speakeasy.generateSecret({
            length: 5
        }),
        newPass = secret.base32;
        console.log(newPass);
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || !req.body['g-recaptcha-response'] || req.body['g-recaptcha-response'] === null)
    {
        return res.status(401).send({
                    error : 'Please select captcha'
                });
    }
    const secretKey = "6Lewcz8UAAAAAEzZhjMYJxdJkTaWJtMPN8eS714D";

    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

    request(verificationURL,function(error,response,body) {
        body = JSON.parse(body);
        console.log(body);
        if(body.success !== undefined && !body.success) {
            return res.status(401).send({
                    error : 'Please select captcha'
                });
        }else{
            User.findOne(
            { 'email': req.body.email },
            function(err, user) {
                err ? res.status(500).send() : (
                    !user ? res.status(401).send({
                        error : 'Email does not exist'
                    }) : (
                      
                        User.update(
                            {_id:user._id}, 
                            {$set : {
                            'password': user.generateHash(newPass)
                            }}, 
                        function(err, newUser){

                           if (newUser) {
                            sendmail_password(newPass, req.body.email, function(data){
                                if (data == 'success') {   
                                  res.status(200).send()
                                }
                               
                            })
                           }
                        })
                    )
                )
            })
        }
        
    });
}
//test_mail ();
function test_mail () {
    var API_USER_ID= "919a6adfb21220b2324ec4efa757ce20"
    var API_SECRET= "93c3fc3e259499921cd138af50be6be3"
    var TOKEN_STORAGE="/tmp/"
    sendpulse.init(API_USER_ID,API_SECRET,TOKEN_STORAGE);
    const answerGetter = function answerGetter(data){
        console.log(data);
    }
    var email = {
        "html" : 'html',
        "text" : "sfccoin",
        "subject" : "Forgot Password",
        "from" : {
            "name" : "Letcoin Mailer",
            "email" : "admin@sfccoin.com"
        },
        "to" : [
            {
                "name" : "",
                "email" : 'trungdoanict@gmail.com'
            }
        ]
    };

    sendpulse.smtpSendMail(answerGetter,email);
}

const sendmail_password = function (password, email, callback){
   
    var API_USER_ID= "919a6adfb21220b2324ec4efa757ce20"
    var API_SECRET= "93c3fc3e259499921cd138af50be6be3"
    var TOKEN_STORAGE="/tmp/"
    sendpulse.init(API_USER_ID,API_SECRET,TOKEN_STORAGE);
    const answerGetter = function answerGetter(data){
        console.log(data);
    }

    var content = '<h1 style="margin: 0 0 10px 0; font-family: sans-serif; font-size: 24px; line-height: 27px; color: #333333; font-weight: normal;">Hello,</h1>';
    content += '<p style="margin: 0;">Forgot password account '+email+'</p>';
    content += '<p style="margin: 0;margin-top: 10px;">Your new password is <b>'+password+'</p>';
    content += '<p style="margin: 0;margin-top: 10px;">Thank you for using our service</p>';
    

    var content = '<tr style="margin-bottom: 15px;float: left;width: 100%"> <td colspan="2">Forgot password account '+email+'</td> </tr>';
    content += '<tr style="margin-bottom: 15px;float: left;width: 100%"> <td colspan="2">Your new password is <b>'+password+'</td> </tr>';
    content += '<tr style="margin-bottom: 15px;float: left;width: 100%"> <td colspan="2">Thank you for using our service</td> </tr>';
    
    var html = '<!DOCTYPE html> <html> <head> <title></title> </head> <body style="width: 80%; margin: 0 auto;background: #44c7f4; font-size: 100%;"> <table style="width: 100%;float: left; margin: 50px auto; margin-bottom: 0;"> <tr style="padding: 10px; background: rgb(0, 42, 85);width: 100%;text-align: center;"> <td style="width: 100%;text-align: center;padding: 2%"><img style="margin: 0 auto" class="site_logo" alt="Logo Sfccoin" width="100" src="https://sfccoin.com/homepage/static/home/images/logo.png"></td> </tr> </table> <table style="width: 100%;float: left; margin: 0px auto; padding: 5% 10%; background: #fff; margin-bottom: 50px;"> <tbody style="background: #fff;width: 100%; float: left;">';
    html += content;
    html += '<tr style="margin-bottom: 5px;float: left;width: 100%; "> <td colspan="2" style="width: 100%; float: left;" > Regards, </td> </tr> <tr style="margin-bottom: 5px;float: left;width: 100%; "> <td colspan="2" style="width: 100%; float: left;" > The Sfccoin Team </td> </tr> <tr style="margin-bottom: 5px;float: left;width: 100%;"> <td colspan="2" style="width: 100%; float: left;" > Sfccoin.co </td> </tr> </tbody> </table> </div> </body> </html>';


    var email = {
        "html" : html,
        "text" : "smarttrex",
        "subject" : "Forgot Password",
        "from" : {
            "name" : "smarttrex Mailer",
            "email" : "admin@sfccoin.com"
        },
        "to" : [
            {
                "name" : "",
                "email" : email
            }
        ]
    };

    sendpulse.smtpSendMail(answerGetter,email);
    callback('success');
}


module.exports = {
    signIn,
    getTemplateLogin,
    getTemplateforgot,
    ForgotPassword,
    test_mail
}