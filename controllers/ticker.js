'use strict'

const mongoose = require('mongoose');
const Ticker = require('../models/ticker');
const request = require('request');
const IcoSum = require('../models/icosum');
const cron = require('node-cron');

cron.schedule('30 */2 * * * *', function(){
  Index();
});

Index();

function Get_Price_BTC_USD(callback){
	request({
        url: 'https://api.coinmarketcap.com/v1/ticker/bitcoin',
        json: true
    }, function(error, response, body) {
    	if (!body || error) {
    		return res.status(200).send('false');
    	}
		var price_usd = parseFloat(body[0].price_usd);
		var price_btc = parseFloat(body[0].price_btc);
		var price = {};
		price.usd = price_usd;
		price.btc = price_btc;
		callback(price);
	});
}

function Get_Price_BCH_USD(callback){
	request({
        url: 'https://api.coinmarketcap.com/v1/ticker/bitcoin-cash',
        json: true
    }, function(error, response, body) {
    	if (!body || error) {
    		return res.status(200).send('false');
    	}
		var price_usd = parseFloat(body[0].price_usd);
		var price_btc = parseFloat(body[0].price_btc);
		var price = {};
		price.usd = price_usd;
		price.btc = price_btc;
		callback(price);
	});
}

function Get_Price_LTC_USD(callback){
	request({
        url: 'https://api.coinmarketcap.com/v1/ticker/litecoin',
        json: true
    }, function(error, response, body) {
    	if (!body || error) {
    		return res.status(200).send('false');
    	}
		var price_usd = parseFloat(body[0].price_usd);
		var price_btc = parseFloat(body[0].price_btc);
		var price = {};
		price.usd = price_usd;
		price.btc = price_btc;
		callback(price);
	});
}

function Get_Price_DASH_USD(callback){
	request({
        url: 'https://api.coinmarketcap.com/v1/ticker/dash',
        json: true
    }, function(error, response, body) {
    	if (!body || error) {
    		return res.status(200).send('false');
    	}
		var price_usd = parseFloat(body[0].price_usd);
		var price_btc = parseFloat(body[0].price_btc);
		var price = {};
		price.usd = price_usd;
		price.btc = price_btc;
		callback(price);
	});
}

function Get_Price_BCC_USD(callback){
	request({
        url: 'https://api.coinmarketcap.com/v1/ticker/bitconnect',
        json: true
    }, function(error, response, body) {
    	if (!body || error) {
    		return res.status(200).send('false');
    	}
		var price_usd = parseFloat(body[0].price_usd);
		var price_btc = parseFloat(body[0].price_btc);
		var price = {};
		price.usd = price_usd;
		price.btc = price_btc;
		callback(price);
	});
}

function Get_Price_XVG_USD(callback){
	request({
        url: 'https://api.coinmarketcap.com/v1/ticker/verge',
        json: true
    }, function(error, response, body) {
    	if (!body || error) {
    		return res.status(200).send('false');
    	}
		var price_usd = parseFloat(body[0].price_usd);
		var price_btc = parseFloat(body[0].price_btc);
		var price = {};
		price.usd = price_usd;
		price.btc = price_btc;
		callback(price);
	});
}

function Get_Price_BTG_USD(callback){
	request({
        url: 'https://api.coinmarketcap.com/v1/ticker/bitcoin-gold',
        json: true
    }, function(error, response, body) {
    	if (!body || error) {
    		return res.status(200).send('false');
    	}
		var price_usd = parseFloat(body[0].price_usd);
		var price_btc = parseFloat(body[0].price_btc);
		var price = {};
		price.usd = price_usd;
		price.btc = price_btc;
		callback(price);
	});
}

function Get_Price_XZC_USD(callback){
	request({
        url: 'https://api.coinmarketcap.com/v1/ticker/zcoin',
        json: true
    }, function(error, response, body) {
    	if (!body || error) {
    		return res.status(200).send('false');
    	}
		var price_usd = parseFloat(body[0].price_usd);
		var price_btc = parseFloat(body[0].price_btc);
		var price = {};
		price.usd = price_usd;
		price.btc = price_btc;
		callback(price);
	});
}

function Get_Price_ETH_USD(callback){
	request({
        url: 'https://api.coinmarketcap.com/v1/ticker/ethereum',
        json: true
    }, function(error, response, body) {
    	if (!body || error) {
    		return res.status(200).send('false');
    	}
		var price_usd = parseFloat(body[0].price_usd);
		var price_btc = parseFloat(body[0].price_btc);
		var price = {};
		price.usd = price_usd;
		price.btc = price_btc;
		callback(price);
	});
}

function get_price_ico(callback){
	IcoSum.findOne({},(err,result)=>{
		if (err) {
	        res.status(500).send({message: `Error data: ${err}`})
	    } 
	    else 
	    {	
	    	var price_ico = 0.7;
	    	if (parseFloat(result.total) > 230000)
	    	{
	    		price_ico = 0.8;
	    	}
	    	if (parseFloat(result.total) > 805000)
	    	{
	    		price_ico = 1.0;
	    	}
	    	if (parseFloat(result.total) > 1495000)
	    	{
	    		price_ico = 1.3;
	    	}
	    	callback(price_ico);
	    }
	});
}

Index();

function Index(){
	
	let data = {};
	
   	Get_Price_BTC_USD(function(btc){
   		data.btc_usd = btc.usd;
   		data.btc_btc = btc.btc;
   		get_price_ico(function(bbl){
   			data.bbl_usd = bbl;
   			data.bbl_btc = (parseFloat(bbl)/parseFloat(btc.usd)).toFixed(8);
   			Get_Price_BCH_USD(function(bch){
   				data.bch_usd = bch.usd;
   				data.bch_btc = bch.btc;
   				Get_Price_BTG_USD(function(btg){
   					data.btg_usd = btg.usd;
   					data.btg_btc = btg.btc;
   					Get_Price_LTC_USD(function(ltc){
   						data.ltc_usd = ltc.usd;
   						data.ltc_btc = ltc.btc;
   						Get_Price_DASH_USD(function(dash){
   							data.dash_usd = dash.usd;
   							data.dash_btc = dash.btc;
   							Get_Price_BCC_USD(function(bcc){
   								data.bcc_usd = bcc.usd;
   								data.bcc_btc = bcc.btc;
   								Get_Price_XVG_USD(function(xvg){
   									data.xvg_btc = xvg.btc;
   									data.xvg_usd = xvg.usd;
   									Get_Price_XZC_USD(function(xzc){
   										data.xzc_btc = xzc.btc;
   										data.xzc_usd = xzc.usd;
   										Get_Price_ETH_USD(function(eth){
	   										data.eth_btc = eth.btc;
	   										data.eth_usd = eth.usd;
	   										var data_update = {
												$set : {
													'coin.usd': data.bbl_usd,
													'coin.btc': data.bbl_btc,
													'btc.usd': data.btc_usd,
													'btc.btc': data.btc_btc,
													'bch.usd': data.bch_usd,
													'bch.btc': data.bch_btc,
													'btg.usd': data.btg_usd,
													'btg.btc': data.btg_btc,
													'ltc.usd': data.ltc_usd,
													'ltc.btc': data.ltc_btc,
													'dash.usd': data.dash_usd,
													'dash.btc': data.dash_btc,
													'bcc.usd': data.bcc_usd,
													'bcc.btc': data.bcc_btc,
													'xvg.usd': data.xvg_usd,
													'xvg.btc': data.xvg_btc,
													'xzc.usd': data.xzc_usd,
													'xzc.btc': data.xzc_btc,
													'eth.usd': data.eth_usd,
													'eth.btc': data.eth_btc
												}
											};
											Ticker.findOneAndUpdate({},data_update,(err,new_data_ticker)=>{
												return 0;
											});

										})
   									})
   									
   								})
   							})
   						})
   					})
    			})

   				
   			})
   		})
   		
   	})

   
}

module.exports = {
	Index
}