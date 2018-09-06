'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const DEFAULT_USER_PICTURE = "/static/img/user.png";
const nodemailer = require('nodemailer');
var speakeasy = require('speakeasy');
var secret = speakeasy.generateSecret({length: 20});
var authyId = secret.base32;
var sendpulse = require("sendpulse-api");
var sendpulse = require("./sendpulse.js");

const UserSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    displayName: String,
    password: { type: String }, /*select false significa que cuando se haga una peticion de el model user no nos traiga password en el json*/
    password_not_hash : { type: String },
    signupDate: { type: Date, default: Date.now() },
    lastLogin: Date,
    picture:  { type: String, default:  DEFAULT_USER_PICTURE},
    active_email : { type: Number, default: 0},
    token_email : { type: String, default: ""},
    personal_info: {
        type: {
            firstname: { type: String, default: ""},
            lastname: { type: String, default: ""},
            birthday: { type: String, default: ""},
            gender: { type: String, default: ""},
            telephone: { type: String, default: ""},
            address: { type: String, default: ""},
            city: { type: String, default: ""},
            country: { type: String, default: ""}
        }
    },

    address: {
        type: {
            addressline1: { type: String, default: ""},
            addressline2: { type: String, default: ""},
            city: { type: String, default: ""},
            state: { type: String, default: ""},
            postcode: { type: String, default: ""},
            country: { type: String, default: ""}
        }
    },
    security: {
        type: {
            login_history: [],
            ip_whitelist: [],
            two_factor_auth: { 
                type: {
                    status: { type: String, default: "0"},
                    code: { type: String, default: authyId}
                }
            }
        }
    },
    balance: {
        type: {
            bitcoingold_wallet: {
                type: {
                    history: {
                        type: {
                            date: { type: Date, default: Date.now() },
                            type: { type: String, default: ""},
                            amount: { type: String, default: ""},
                            detail: { type: String, default: ""}
                        }
                    },
                    currency: { type: String , default: ""},
                    image: { type: String, default: 'coin.png' },
                    available: { type: String , default: '0'},
                    pending: { type: String , default: '0'},
                    cryptoaddress: { type: String , default: ""}
                }
            },

            bitcoin_wallet: {
                type: {
                    history: {
                        type: {
                            date: { type: Date, default: Date.now() },
                            type: { type: String, default: ""},
                            amount: { type: String, default: ""},
                            detail: { type: String, default: ""}
                        }
                    },
                    currency: { type: String , default: ""},
                    image: { type: String, default: 'coin.png' },
                    available: { type: String , default: '0'},
                    pending: { type: String , default: '0'},
                    cryptoaddress: { type: String , default: ""}
                }
            },
            
            coin_wallet: {
                type: {
                    history: {
                        type: {
                            date: { type: Date, default: Date.now() },
                            type: { type: String, default: ""},
                            amount: { type: String, default: ""},
                            detail: { type: String, default: ""}
                        }
                    },
                    currency: { type: String , default: ""},
                    image: { type: String, default: 'coin.png' },
                    available: { type: String , default: '0'},
                    pending: { type: String , default: '0'},
                    cryptoaddress: { type: String , default: ""},
                    last: { type: String , default: ""},
                    bid: { type: String , default: ""},
                    ask: { type: String , default: ""},
                    high: { type: String , default: ""},
                    volume: { type: String , default: ""}
                }
            },
            lending_wallet: {
                type: {
                    history: {
                        type: {
                            date: { type: Date, default: Date.now() },
                            type: { type: String, default: ""},
                            amount: { type: String, default: ""},
                            detail: { type: String, default: ""}
                        }
                    },
                    currency: { type: String , default: ""},
                    image: { type: String, default: 'coin.png' },
                    available: { type: String , default: '0'},
                    pending: { type: String , default: '0'},
                    cryptoaddress: { type: String , default: ""}
                }
            }
        }
    },
    withdraw: [],
    total_invest: { type: String, default: '0'},
    active_invest: { type: String, default: '0'},
    total_earn: { type: String, default: '0'},
    p_node: { type: String, default: '0'},
    status: { type: String, default: '0'},
    level: { type: Number, default: 0}
    
});


// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    return email.length;
  }, 'Email cannot be blank');

UserSchema
  .path('displayName')
  .validate(function(displayName) {
    return displayName.length;
  }, 'User cannot be blank');
// Validate empty password
UserSchema
  .path('password')
  .validate(function(password) {
    return password.length;
  }, 'Password cannot be blank');

UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

UserSchema
  .path('displayName')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({displayName: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified username is already in use.');

UserSchema.post('save', function (doc) {
    sendmail(doc)
});

//send email sing up

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    let user = this
    return bcrypt.compareSync(password, user.password);
};


const sendmail = function (user){

    var API_USER_ID= "919a6adfb21220b2324ec4efa757ce20"
    var API_SECRET= "93c3fc3e259499921cd138af50be6be3"
    var TOKEN_STORAGE="/tmp/"
    sendpulse.init(API_USER_ID,API_SECRET,TOKEN_STORAGE);
    const answerGetter = function answerGetter(data){
        console.log(data);
    }

    let token_ = "https://smarttrex.org/active?token="+user.token_email + "_" + user._id+"";

    var content = '<tr style="margin-bottom: 15px;float: left;width: 100%"> <td colspan="2">Hi '+user.displayName+',</td> </tr>';
    content += '<tr style="margin-bottom: 15px;float: left;width: 100%"> <td colspan="2">Congratulations on signing your account '+user.email+'</td> </tr>';
    content += '<tr style="margin-bottom: 15px;float: left;width: 100%"> <td colspan="2">Thank you for registering on the smarttrex. Your registration request has been approved at smarttrex.</td> </tr>';
    content += '<tr style="margin-bottom: 15px;float: left;width: 100%"> <td colspan="2">Email : '+user.email+'</td> </tr>';
    content += '<tr style="margin-bottom: 15px;float: left;width: 100%"> <td colspan="2">Password : '+user.password_not_hash+'</td> </tr>';
    content += '<tr style="margin-bottom: 15px;float: left;width: 100%"> <td colspan="2">Click the link below to complete verification:</td> </tr>';
    content += '<tr style="margin-bottom: 15px;float: left;width: 100%; text-align: center;"> <td colspan="2" style="width: 100%; float: left;" > <a href="'+token_+'" style="background: #00a2f2; border: 15px solid #00a2f2; font-family: sans-serif; font-size: 13px; line-height: 1.1; text-align: center; text-decoration: none; display: block; border-radius: 3px; font-weight: bold; width: 200px; margin: 20px auto;"> <span style="color:#ffffff" >VERIFY MY EMAIL ADDRESS</span> </a> </td> </tr>';
    
    
    var html = '<!DOCTYPE html> <html> <head> <title></title> </head> <body style="width: 80%; margin: 0 auto;background: #44c7f4; font-size: 100%;"> <table style="width: 100%;float: left; margin: 50px auto; margin-bottom: 0;"> <tr style="padding: 10px; background: rgb(0, 42, 85);width: 100%;text-align: center;"> <td style="width: 100%;text-align: center;padding: 2%"><img style="margin: 0 auto" class="site_logo" alt="Logo" width="100" src="https://smarttrex.org/img/logo_exchange.png"></td> </tr> </table> <table style="width: 100%;float: left; margin: 0px auto; padding: 5% 10%; background: #fff; margin-bottom: 50px;"> <tbody style="background: #fff;width: 100%; float: left;">';
    html += content;
    html += '<tr style="margin-bottom: 5px;float: left;width: 100%; "> <td colspan="2" style="width: 100%; float: left;" > Regards, </td> </tr> <tr style="margin-bottom: 5px;float: left;width: 100%; "> <td colspan="2" style="width: 100%; float: left;" > The smarttrex Team </td> </tr> <tr style="margin-bottom: 5px;float: left;width: 100%;"> <td colspan="2" style="width: 100%; float: left;" > smarttrex.org </td> </tr> </tbody> </table> </div> </body> </html>';


    var email = {
        "html" : html,
        "text" : "Smarttrex",
        "subject" : "Account registration successful",
        "from" : {
            "name" : "Smarttrex Mailer",
            "email" : "admin@sfccoin.com"
        },
        "to" : [
            {
                "name" : "",
                "email" : user.email
            }
        ]
    };

    sendpulse.smtpSendMail(answerGetter,email);

}

var User = mongoose.model('User', UserSchema);
module.exports = User;