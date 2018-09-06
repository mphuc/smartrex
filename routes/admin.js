'use strict'

const express = require('express');
const AdminCtrl = require('../controllers/admin');
const InvestCtrl = require('../controllers/admin/invest');
const IcoAdminCtrl = require('../controllers/admin/ico');
const WithdrawAdminCtrl = require('../controllers/admin/withdraw');
const DepositAdminCtrl = require('../controllers/admin/deposit');
const auth = require('../middlewares/authAdmin');
const router = express.Router();

/*RUTAS*/
router.get('/admin', auth, AdminCtrl.Index);


router.get('/admin/dashboard', auth, AdminCtrl.Dahboard);
router.get('/admin/customer', auth, AdminCtrl.Customer);
router.get('/admin/edit/customer/:id', auth, AdminCtrl.EditCustomer);


/*ICO*/
router.get('/admin/ico', auth, IcoAdminCtrl.ListIco);
router.get('/admin/ico-history', auth, IcoAdminCtrl.ListIcohistory);
router.get('/admin/ico/cancel/:id', auth, IcoAdminCtrl.CanelICO);
router.get('/admin/ico/matched/:id', auth, IcoAdminCtrl.MatchedICO);

router.get('/admin/ico/endico/', auth, IcoAdminCtrl.EndICO);
router.get('/admin/ico/startico/', auth, IcoAdminCtrl.StartICO);

router.post('/admin/ico/totalbuy', auth, IcoAdminCtrl.TotalBuy);
/*END ICO*/

/*Withdraw*/
router.get('/admin/withdraw', auth, WithdrawAdminCtrl.ListWithdraw);
router.get('/admin/withdraw-history', auth, WithdrawAdminCtrl.ListWithdrawhistory);
/*End Withdraw*/

/*Deposit*/
router.get('/admin/deposit', auth, DepositAdminCtrl.ListDeposit);

/*End Deposit*/

router.get('/admin/invest', auth, InvestCtrl.ListInvest);
router.post('/admin/CaculateProfit', auth, InvestCtrl.CaculateProfit);
router.post('/admin/updateUser', auth, AdminCtrl.updateUser);

module.exports = router;