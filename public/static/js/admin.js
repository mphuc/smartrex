'use strict'; $(document).ready(function($) {$('#btnfrmCaculateProfit').click(function(evt) {evt.preventDefault(); $.ajax({url: "/user/admin/CaculateProfit", type : 'POST', data : { 'percent' : $('#percent').val(), 'two' : $('#two').val() }, cache: false, beforeSend: function() {$('#frmCaculateProfit button').attr('disabled', 'disabled'); }, error: function(data) {alert('Error! Please try again'); }, success: function(data) {alert('Success'); setTimeout(function() {location.reload(true); }, 500); } }); }); })