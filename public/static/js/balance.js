function GetFormattedDate(todayTime) {
    var todayTime = new Date(todayTime);
    var month = (todayTime .getMonth() + 1);
    var day = (todayTime .getDate());
    var year = (todayTime .getFullYear());
    
    return month + "/" + day + "/" + year;
}
$(function(){

    load_withdraw_finish();
    load_withdraw_pendding();
    load_deposit_finish();
    load_deposit_pending();
    $('button[data-target="#modalDepositSFCC"]').on('click',function(){
        $.ajax({
            url: "/account/balance/wallet",
            data: {
                type : 'SFCC'
            },
            type: "POST",
            beforeSend: function() {
                
                $('#modalDepositSFCC .modal-body .wallets').html('<img src="/static/img/ajax-loading.gif" style="margin: 0; position: absolute; top: 88%; left: 50%; transform: translate(-50%, -50%); z-index: 999; width: 60px;">');
            },
            error: function(data) {
                $('button[data-target="#modalDepositSFCC"]').button('reset');
                var message = data.responseJSON.message;
                showNotification('top', 'right', message, 'danger');
                $('#modalDepositSFCC').modal('hide');
            },
            success: function(data) {
                setTimeout(function() {
                    $('button[data-target="#modalDepositSFCC"]').button('reset');
                    $('#modalDepositSFCC .modal-body .wallets').html('');
                    var html = ` <div class="address-wallet"> <div class="AccountDepositAddress"> <div class="box-center"> <div class="img-circle" id="address-qr"></div> <div class="input-group"> <span class="input-group-btn"> <button class="btn btn-social btn-fill btn-twitter copy" data-clipboard-action="copy" data-clipboard-target="#inputaddress" type="button"> <div class="icon dripicons-copy"></div> Copy </button> </span> <input id="inputaddress" readonly="" type="text" value="" class="form-control"> </div> </div> </div> `;
                    $('#modalDepositSFCC .modal-body .wallets').html(html);
                    $('#modalDepositSFCC #inputaddress').val(data.wallet);
                    $('#modalDepositSFCC #address-qr').html('<img src="https://chart.googleapis.com/chart?chs=200x200&amp;cht=qr&amp;chl=' + data.wallet + '" alt="">');
                }, 1000);
            }
        });
    });


    
    $('button[data-target="#modalDepositDASH"]').on('click',function(){
        $.ajax({
            url: "/account/balance/wallet",
            data: {
                type : 'DASH'
            },
            type: "POST",
            beforeSend: function() {
                
                $('#modalDepositDASH .modal-body .wallets').html('<img src="/static/img/ajax-loading.gif" style="margin: 0; position: absolute; top: 88%; left: 50%; transform: translate(-50%, -50%); z-index: 999; width: 60px;">');
            },
            error: function(data) {
                $('button[data-target="#modalDepositDASH"]').button('reset');
                var message = data.responseJSON.message;
                showNotification('top', 'right', message, 'danger');
                $('#modalDepositDASH').modal('hide');
            },
            success: function(data) {
                setTimeout(function() {
                    $('button[data-target="#modalDepositDASH"]').button('reset');
                    $('#modalDepositDASH .modal-body .wallets').html('');
                    var html = ` <div class="address-wallet"> <div class="AccountDepositAddress"> <div class="box-center"> <div class="img-circle" id="address-qr"></div> <div class="input-group"> <span class="input-group-btn"> <button class="btn btn-social btn-fill btn-twitter copy" data-clipboard-action="copy" data-clipboard-target="#inputaddress" type="button"> <div class="icon dripicons-copy"></div> Copy </button> </span> <input id="inputaddress" readonly="" type="text" value="" class="form-control"> </div> </div> </div> `;
                    $('#modalDepositDASH .modal-body .wallets').html(html);
                    $('#modalDepositDASH #inputaddress').val(data.wallet);
                    $('#modalDepositDASH #address-qr').html('<img src="https://chart.googleapis.com/chart?chs=200x200&amp;cht=qr&amp;chl=' + data.wallet + '" alt="">');
                }, 1000);
            }
        });
    });

    $('button[data-target="#modalDepositLTC"]').on('click',function(){
        $.ajax({
            url: "/account/balance/wallet",
            data: {
                type : 'LTC'
            },
            type: "POST",
            beforeSend: function() {
                
                $('#modalDepositLTC .modal-body .wallets').html('<img src="/static/img/ajax-loading.gif" style="margin: 0; position: absolute; top: 88%; left: 50%; transform: translate(-50%, -50%); z-index: 999; width: 60px;">');
            },
            error: function(data) {
                $('button[data-target="#modalDepositLTC"]').button('reset');
                var message = data.responseJSON.message;
                showNotification('top', 'right', message, 'danger');
                $('#modalDepositLTC').modal('hide');
            },
            success: function(data) {
                setTimeout(function() {
                    $('button[data-target="#modalDepositLTC"]').button('reset');
                    $('#modalDepositLTC .modal-body .wallets').html('');
                    var html = ` <div class="address-wallet"> <div class="AccountDepositAddress"> <div class="box-center"> <div class="img-circle" id="address-qr"></div> <div class="input-group"> <span class="input-group-btn"> <button class="btn btn-social btn-fill btn-twitter copy" data-clipboard-action="copy" data-clipboard-target="#inputaddress" type="button"> <div class="icon dripicons-copy"></div> Copy </button> </span> <input id="inputaddress" readonly="" type="text" value="" class="form-control"> </div> </div> </div> `;
                    $('#modalDepositLTC .modal-body .wallets').html(html);
                    $('#modalDepositLTC #inputaddress').val(data.wallet);
                    $('#modalDepositLTC #address-qr').html('<img src="https://chart.googleapis.com/chart?chs=200x200&amp;cht=qr&amp;chl=' + data.wallet + '" alt="">');
                }, 1000);
            }
        });
    });

    $('button[data-target="#modalDepositBTC"]').on('click',function(){
        $.ajax({
            url: "/account/balance/wallet",
            data: {
                type : 'BTC'
            },
            type: "POST",
            beforeSend: function() {
                
                $('#modalDepositBTC .modal-body .wallets').html('<img src="/static/img/ajax-loading.gif" style="margin: 0; position: absolute; top: 88%; left: 50%; transform: translate(-50%, -50%); z-index: 999; width: 60px;">');
            },
            error: function(data) {
                $('button[data-target="#modalDepositBTC"]').button('reset');
                var message = data.responseJSON.message;
                showNotification('top', 'right', message, 'danger');
                $('#modalDepositBTC').modal('hide');
            },
            success: function(data) {
                setTimeout(function() {
                    $('button[data-target="#modalDepositBTC"]').button('reset');
                    $('#modalDepositBTC .modal-body .wallets').html('');
                    var html = ` <div class="address-wallet"> <div class="AccountDepositAddress"> <div class="box-center"> <div class="img-circle" id="address-qr"></div> <div class="input-group"> <span class="input-group-btn"> <button class="btn btn-social btn-fill btn-twitter copy" data-clipboard-action="copy" data-clipboard-target="#inputaddress" type="button"> <div class="icon dripicons-copy"></div> Copy </button> </span> <input id="inputaddress" readonly="" type="text" value="" class="form-control"> </div> </div> </div> `;
                    $('#modalDepositBTC .modal-body .wallets').html(html);
                    $('#modalDepositBTC #inputaddress').val(data.wallet);
                    $('#modalDepositBTC #address-qr').html('<img src="https://chart.googleapis.com/chart?chs=200x200&amp;cht=qr&amp;chl=' + data.wallet + '" alt="">');
                }, 1000);
            }
        });
    });

    $('button[data-target="#modalDepositBTG"]').on('click',function(){
        $.ajax({
            url: "/account/balance/wallet",
            data: {
                type : 'BTG'
            },
            type: "POST",
            beforeSend: function() {
                
                $('#modalDepositBTG .modal-body .wallets').html('<img src="/static/img/ajax-loading.gif" style="margin: 0; position: absolute; top: 88%; left: 50%; transform: translate(-50%, -50%); z-index: 999; width: 60px;">');
            },
            error: function(data) {
                $('button[data-target="#modalDepositBTG"]').button('reset');
                var message = data.responseJSON.message;
                showNotification('top', 'right', message, 'danger');
                $('#modalDepositBTG').modal('hide');
            },
            success: function(data) {
                setTimeout(function() {
                    $('button[data-target="#modalDepositBTG"]').button('reset');
                    $('#modalDepositBTG .modal-body .wallets').html('');
                    var html = ` <div class="address-wallet"> <div class="AccountDepositAddress"> <div class="box-center"> <div class="img-circle" id="address-qr"></div> <div class="input-group"> <span class="input-group-btn"> <button class="btn btn-social btn-fill btn-twitter copy" data-clipboard-action="copy" data-clipboard-target="#inputaddress" type="button"> <div class="icon dripicons-copy"></div> Copy </button> </span> <input id="inputaddress" readonly="" type="text" value="" class="form-control"> </div> </div> </div> `;
                    $('#modalDepositBTG .modal-body .wallets').html(html);
                    $('#modalDepositBTG #inputaddress').val(data.wallet);
                    $('#modalDepositBTG #address-qr').html('<img src="https://chart.googleapis.com/chart?chs=270x270&amp;cht=qr&amp;chl=' + data.wallet + '" alt="">');
                }, 1000);
            }
        });
    })


    $('#frmWihtdrawDASH').on('submit', function(){
        $('#modalWithdrawDASH').modal('toggle');

        $('#Confirm-Submit-DASH input[name="address"]').val($('#frmWihtdrawDASH #address').val());
        $('#Confirm-Submit-DASH input[name="amount"]').val($('#frmWihtdrawDASH #amount_withdraw').val());

        $('#modalWithdrawConfirmDASH').modal({
            show: 'true'
        }); 
        $('#modalWithdrawConfirmDASH .alert').hide();
        $('#Confirm-Submit-DASH').on('submit',function(){
            $('#modalWithdrawConfirmDASH .alert').hide();

            $(this).ajaxSubmit({
                beforeSend: function() {
                    $('.token_crt').val('');
                    $('#Confirm-Submit-DASH button[type="submit"]').button('loading');
                },
                error: function(result) 
                {
                    load_token();
                    if (result.responseJSON.message != 'Network Error')
                    {
                        $('#modalWithdrawConfirmDASH .alert').show().html(result.responseJSON.message);
                        $('#Confirm-Submit-DASH button[type="submit"]').button('reset');
                    }
                    else
                    {
                        setTimeout(function(){ location.reload(true); }, 4500);
                    }
                },
                success: function(result) 
                {
                    swal({
                    title: "Withdraw Success",
                        type: 'success',
                        text:"Please wait, your Withdrawal DASH is being processed.",
                        timer: 4000,
                        showConfirmButton: false
                    });
                    setTimeout(function() {
                        location.reload(true);
                    }, 5000);
                }
            });
            return false;
        })
        return false;
    });

    $('#frmWihtdrawLTC').on('submit', function(){
        $('#modalWithdrawLTC').modal('toggle');

        $('#Confirm-Submit-LTC input[name="address"]').val($('#frmWihtdrawLTC #address').val());
        $('#Confirm-Submit-LTC input[name="amount"]').val($('#frmWihtdrawLTC #amount_withdraw').val());

        $('#modalWithdrawConfirmLTC').modal({
            show: 'true'
        }); 
        $('#modalWithdrawConfirmLTC .alert').hide();
        $('#Confirm-Submit-LTC').on('submit',function(){
            $('#modalWithdrawConfirmLTC .alert').hide();

            $(this).ajaxSubmit({
                beforeSend: function() {
                    $('.token_crt').val('');
                    $('#Confirm-Submit-LTC button[type="submit"]').button('loading');
                },
                error: function(result) 
                {
                    load_token();
                    if (result.responseJSON.message != 'Network Error')
                    {
                        $('#modalWithdrawConfirmLTC .alert').show().html(result.responseJSON.message);
                        $('#Confirm-Submit-LTC button[type="submit"]').button('reset');
                    }
                    else
                    {
                        setTimeout(function(){ location.reload(true); }, 4500);
                    }
                },
                success: function(result) 
                {
                    swal({
                    title: "Withdraw Success",
                        type: 'success',
                        text:"Please wait, your Withdrawal LTC is being processed.",
                        timer: 4000,
                        showConfirmButton: false
                    });
                    setTimeout(function() {
                        location.reload(true);
                    }, 5000);
                }
            });
            return false;
        })
        return false;
    });


   
    $('#frmWihtdrawBTG').on('submit', function(){
        $('#modalWithdrawBTG').modal('toggle');

        $('#Confirm-Submit-BTG input[name="address"]').val($('#frmWihtdrawBTG #address').val());
        $('#Confirm-Submit-BTG input[name="amount"]').val($('#frmWihtdrawBTG #amount_withdraw').val());

        $('#modalWithdrawConfirmBTG').modal({
            show: 'true'
        }); 
        $('#modalWithdrawConfirmBTG .alert').hide();
        $('#Confirm-Submit-BTG').on('submit',function(){
            $('#modalWithdrawConfirmBTG .alert').hide();

            $(this).ajaxSubmit({
                beforeSend: function() {
                    $('.token_crt').val('');
                    $('#Confirm-Submit-BTG button[type="submit"]').button('loading');
                },
                error: function(result) 
                {
                    load_token();
                    if (result.responseJSON.message != 'Network Error')
                    {
                        $('#modalWithdrawConfirmBTG .alert').show().html(result.responseJSON.message);
                        $('#Confirm-Submit-BTG button[type="submit"]').button('reset');
                    }
                    else
                    {
                        setTimeout(function(){ location.reload(true); }, 4500);
                    }
                },
                success: function(result) 
                {
                    swal({
                    title: "Withdraw Success",
                        type: 'success',
                        text:"Please wait, your Withdrawal BTG is being processed.",
                        timer: 4000,
                        showConfirmButton: false
                    });
                    setTimeout(function() {
                        location.reload(true);
                    }, 5000);
                }
            });
            return false;
        })
        return false;
    });


    $('#frmWihtdrawBTC').on('submit', function(){
        $('#modalWithdrawBTC').modal('toggle');

        $('#Confirm-Submit-BTC input[name="address"]').val($('#frmWihtdrawBTC #address').val());
        $('#Confirm-Submit-BTC input[name="amount"]').val($('#frmWihtdrawBTC #amount_withdraw').val());

        $('#modalWithdrawConfirmBTC').modal({
            show: 'true'
        }); 
        $('#modalWithdrawConfirmBTC .alert').hide();
        $('#Confirm-Submit-BTC').on('submit',function(){
            $('#modalWithdrawConfirmBTC .alert').hide();
            $(this).ajaxSubmit({
                beforeSend: function() {
                    $('.token_crt').val('');
                    $('#Confirm-Submit-BTC button[type="submit"]').button('loading');
                },
                error: function(result) 
                {
                    load_token();
                    if (result.responseJSON.message != 'Network Error')
                    {
                        $('#modalWithdrawConfirmBTC .alert').show().html(result.responseJSON.message);
                        $('#Confirm-Submit-BTC button[type="submit"]').button('reset');
                    }
                    else
                    {
                        setTimeout(function(){ location.reload(true); }, 4500);
                    }
                },
                success: function(result) 
                {
                    swal({
                    title: "Withdraw Success",
                        type: 'success',
                        text:"Please wait, your Withdrawal BTC is being processed.",
                        timer: 4000,
                        showConfirmButton: false
                    });
                    setTimeout(function() {
                        location.reload(true);
                    }, 4500);
                }
            });
            return false;
        })
        return false;
    });

    $('#frmWihtdrawSFCC').on('submit', function(){
        $('#modalWithdrawSFCC').modal('toggle');
        $('#Confirm-Submit-SFCC input[name="address"]').val($('#frmWihtdrawSFCC #address').val());
        $('#Confirm-Submit-SFCC input[name="amount"]').val($('#frmWihtdrawSFCC #amount_withdraw').val());

        $('#modalWithdrawConfirmSFCC').modal({
            show: 'true'
        }); 
        
        $('#modalWithdrawConfirmSFCC .alert').hide();
        $('#Confirm-Submit-SFCC').on('submit',function(){
            
            $('#modalWithdrawConfirmSFCC .alert').hide();
           
            $('#Confirm-Submit-SFCC').ajaxSubmit({

                beforeSend: function() {
                    $('.token_crt').val('');
                    $('#Confirm-Submit-SFCC button[type="submit"]').button('loading');
                },
                error: function(result) 
                {
                    load_token();
                    if (result.responseJSON.message != 'Network Error')
                    {
                        $('#modalWithdrawConfirmSFCC .alert').show().html(result.responseJSON.message);
                        $('#Confirm-Submit-SFCC button[type="submit"]').button('reset');
                    }
                    else
                    {
                        setTimeout(function(){ location.reload(true); }, 4500);
                    }
                },
                success: function(result) 
                {
                    $('#Confirm-Submit-SFCC button[type="submit"]').button('reset');
                    swal({
                    title: "Withdraw Success",
                        type: 'success',
                        text:"Please wait, your Withdrawal SFCC is being processed.",
                        timer: 4000,
                        showConfirmButton: false
                    });
                    setTimeout(function() {
                        location.reload(true);
                    }, 5000)
                }
            });
            return false;
        })
        return false;
    });

    $('#modalWithdrawSFCC #amount').on('input propertychange',function(){
        $('#modalWithdrawSFCC #amount_withdraw').val(
            ((($('#modalWithdrawSFCC #amount').val() * 100000000) - (0.03 * 100000000)) / 100000000).toFixed(8)
        );
    });

    $('#modalWithdrawBTC #amount').on('input propertychange',function(){
         $('#modalWithdrawBTC #amount_withdraw').val(
            ((($('#modalWithdrawBTC #amount').val() * 100000000) - (0.001 * 100000000)) / 100000000).toFixed(8)
        );
    });

    $('#modalWithdrawBTG #amount').on('input propertychange',function(){
        $('#modalWithdrawBTG #amount_withdraw').val(
            ((($('#modalWithdrawBTG #amount').val() * 100000000) - (0.001 * 100000000)) / 100000000).toFixed(8)
        );
    });


    $('.crt_button').on('click',function(){
        load_token();
    });
})


function showNotification(from, align, msg, type) {
    var color = Math.floor((Math.random() * 6) + 1);
    $.notify({
        icon: "notifications",
        message: msg
    }, {
        type: type,
        timer: 3000,
        placement: {
            from: from,
            align: align
        }
    });
}

function load_token(){
    $.ajax({
        url: "/token_crt",
        data: {},
        type: "GET",
        beforeSend: function() {},
        error: function(data) {},
        success: function(data) {
            $('.token_crt').val(data.token);
        }
    });
}

function load_deposit_pending() {
    $.ajax({
        url: "/account/balance/history-deposit-pending",
        data: {},
        type: "GET",
        beforeSend: function() {
        },
        error: function() {},
        success: function(data) {
            
            var html = `<div class="material-datatables"> <table border="1" cellpadding="0" cellspacing="0"  style="border-collapse:collapse;"  id="list-yourinvestssss" class="table table-striped table-bordered table-hover" style="width:100%;cellspacing:0" > <thead> <tr> <th>Date</th>  <th>Amount </th> <th>Units</th><th>Confirmation</th><th>Tx id</th> </tr> </thead> <tbody> </tbody> </table> </div> `;
            $('#history-deposit-pending').html(html);
            $('#list-yourinvestssss').DataTable({
                "order": [
                    [0, "desc"]
                ],
                autoWidth: false,
                searching: false,
                ordering: true,
                responsive: true,
                lengthChange: false,
                destroy: true,
                paging: true,
                info: false,
                data: data.result,
                columns: [{
                    data: 'date'
                }, {
                    data: 'amount'
                }, {
                    data: 'type'
                },
                 {
                    data: 'confirm'
                }
                , {
                    data: 'txid'
                }]
            });
            
        }
    });
}

function load_deposit_finish() {
    $.ajax({
        url: "/account/balance/history-deposit-finish",
        data: {},
        type: "GET",
        beforeSend: function() {
        },
        error: function() {},
        success: function(data) {
            
            var html = `<div class="material-datatables"> <table border="1" cellpadding="0" cellspacing="0"  style="border-collapse:collapse;"  id="list-yourinvestsss" class="table table-striped table-bordered table-hover" style="width:100%;cellspacing:0" > <thead> <tr> <th>Date</th>  <th>Amount </th> <th>Units</th><th>Confirmation</th><th>Tx id</th> </tr> </thead> <tbody> </tbody> </table> </div> `;
            $('#history-deposit-finish').html(html);
            $('#list-yourinvestsss').DataTable({
                "order": [
                    [0, "desc"]
                ],
                autoWidth: false,
                searching: false,
                ordering: true,
                responsive: true,
                lengthChange: false,
                destroy: true,
                paging: true,
                info: false,
                data: data.result,
                columns: [{
                    data: 'date'
                }, {
                    data: 'amount'
                }, {
                    data: 'type'
                },
                 {
                    data: 'status'
                }
                , {
                    data: 'txid'
                }]
            });
            
        }
    });
}

function load_withdraw_finish() {
    $.ajax({
        url: "/account/balance/history-withdraw-finish",
        data: {},
        type: "GET",
        beforeSend: function() {
        },
        error: function() {},
        success: function(data) {
            
            var html = `<div class="material-datatables"> <table border="1" cellpadding="0" cellspacing="0"  style="border-collapse:collapse;"  id="list-yourinvests" class="table table-striped table-bordered table-hover" style="width:100%;cellspacing:0" > <thead> <tr> <th>Date</th>  <th>Amount </th> <th>Units</th><th>Status</th><th>Tx id</th> </tr> </thead> <tbody> </tbody> </table> </div> `;
            $('#history-withdraw-finish').html(html);
            $('#list-yourinvests').DataTable({
                "order": [
                    [0, "desc"]
                ],
                autoWidth: false,
                searching: false,
                ordering: true,
                responsive: true,
                lengthChange: false,
                destroy: true,
                paging: true,
                info: false,
                data: data.result,
                columns: [{
                    data: 'date'
                }, {
                    data: 'amount'
                }, {
                    data: 'type'
                },
                 {
                    data: 'status'
                }
                , {
                    data: 'txid'
                }]
            });
            
        }
    });
}

function load_withdraw_pendding() {
    $.ajax({
        url: "/account/balance/history-withdraw-pending",
        data: {},
        type: "GET",
        beforeSend: function() {
        },
        error: function() {},
        success: function(data) {
            
            var html = `<div class="material-datatables"> <table border="1" cellpadding="0" cellspacing="0"  style="border-collapse:collapse;"  id="list-yourinvestss" class="table table-striped table-bordered table-hover" style="width:100%;cellspacing:0" > <thead> <tr> <th>Date</th>  <th>Amount </th> <th>Units</th><th>Status</th><th><i class="fa fa-times"></i></th> </tr> </thead> <tbody> </tbody> </table> </div> `;
            $('#history-withdraw-pendding').html(html);
            $('#list-yourinvestss').DataTable({
                "order": [
                    [0, "desc"]
                ],
                autoWidth: false,
                searching: false,
                ordering: true,
                responsive: true,
                lengthChange: false,
                destroy: true,
                paging: true,
                info: false,
                data: data.result,
                columns: [{
                    data: 'date'
                }, {
                    data: 'amount'
                }, {
                    data: 'type'
                },
                 {
                    data: 'status'
                }
                , {
                    data: 'remove_order'
                }]
            });
             remove_order();
        }

    });
    
}

function remove_order(){
   
    $('.remove_order').on('click',function(){
        
        $.ajax({
            url: "/account/balance/remove-withdraw",
            data: {
                'id' : $(this).data('id')
            },
            type: "POST",
            async : true,
            beforeSend: function() {
            },
            error: function(data) {
            },
            success: function(data) {
                location.reload('true');
            }
        });
    });
}