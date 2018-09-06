$(function(){

    var sponsor = getCookie("affiliate");

    

    if (sponsor == undefined) {
        $('#Sponsor').val('');
    } else {
        $('#Sponsor').val(sponsor);
    }

    $('#frmRegister input[name="username"]').on("change paste keyup", function() {
        var name = $('#frmRegister input[name="username"]').val().replace(/[^A-Z0-9]/gi, '');
        $('#frmRegister input[name="username"]').val(name)
    });
    $('#Sponsor').on("change paste keyup", function() {
        var name = $('#Sponsor').val().replace(/[^A-Z0-9]/gi, '');
        $('#Sponsor').val(name)
    });

    $('#frmAuthy').submit(function(env){
        var validator = $("#frmAuthy").validate({
            rules: {
                authenticator: {
                    required: true
                },
            },
            errorElement: "span",
            messages: {
                authenticator: "Please enter authenticator code"
            }
        });
        if(validator.form()){
            $(this).ajaxSubmit({
                beforeSend: function() {
                    
                    swal({
                        title: 'Loading',
                        onOpen: function () {
                            swal.showLoading()
                        }
                    })
                },
                error: function(result) 
                {
                    
                    swal({
                        title: 'Error!',
                        text: 'Code authenticator error',
                        type: 'error',
                        confirmButtonColor: '#27C1F7'
                    }); 
                },
                success: function(result) 
                {
                    location.reload(true);
                }

            });
        }

        return false;
        /*alert("1111111111111111");
        var authenticator = $("input#authenticator").val();
            $.ajax({
                url: "/Authy",
                type: "POST",
                data: {
                    authenticator: authenticator
                },
                cache: false,
                beforeSend: function() {
                  
                    $('.login-page-right > img').show();
                    
                },
                success: function(data) {
                 
                    localStorage.setItem('token', data.token);
                    $('#frmLogin').trigger("reset");
                    setTimeout(function() {
                        location.reload();
                    }, 800);
                },
                error: function(data) {
                    $('.login-page-right > img').hide();
                    $('.errAuthy').show().html(data.responseJSON.message);
                   
                    $('#frmAuthy').trigger("reset");
                },
            })*/
    });

    $('#frmLogin').on('submit', function(env){
        
        var validator = $("#frmLogin").validate({
            rules: {
                email: {
                    required: true,
                    email: true
                },
                password: {
                    required: true
                },
            },
            errorElement: "span",
            messages: {
                email: "Please enter your email",
                password: "Please enter your password"
            }
        });
        if(validator.form()){
            $(this).ajaxSubmit({
                beforeSend: function() {
                    grecaptcha.reset();
                    swal({
                        title: 'Loading',
                        onOpen: function () {
                            swal.showLoading()
                        }
                    })
                },
                error: function(result) 
                {
                    
                    swal({
                        title: 'Error!',
                        text: result.responseJSON.error,
                        type: 'error',
                        confirmButtonColor: '#27C1F7'
                    }); 
                },
                success: function(result) 
                {
                    location.reload(true);
                }

                });
            };

        return false;
    });
        



    $('#frmRegister').on('submit', function(env){
        
        var validator = $("#frmRegister").validate({


            rules: {
                username : {
                   required: true 
                },
                email: {
                    required: true,
                    email: true
                },
                password: {
                    required: true,
                    minlength: 6,
                },
                cfpassword: {
                    required: true,
                    minlength: 6,
                    equalTo: "#password_input"
                }
            },
            errorElement: "span",
            messages: {
                email: "Please enter your email",
                newpassword: {
                    required: "Please provide a password",
                    minlength: "Your password must be at least 6 characters long"
                },
                repeatpassword: {
                    required: "Please provide a password",
                    minlength: "Your password must be at least 6 characters long",
                    equalTo: "Please enter the same password as above"
                },
            }
        });
        if(validator.form()){
            $(this).ajaxSubmit({
                beforeSend: function() {
                    grecaptcha.reset();
                    swal({
                        title: 'Loading',
                        onOpen: function () {
                            swal.showLoading()
                        }
                    })
                },
                error: function(result) 
                {
                    grecaptcha.reset();

                    if (typeof result.responseJSON.message =='object')
                    {
                        for (var item in result.responseJSON.message) {
                            swal({
                                title: 'Error!',
                                text: result.responseJSON.message[item].msg,
                                type: 'error',
                                confirmButtonColor: '#27C1F7'
                            });
                            break;
                        }
                    }
                    else
                    {
                        swal({
                            title: 'Error!',
                            text: result.responseJSON.message,
                            type: 'error',
                            confirmButtonColor: '#27C1F7'
                        });
                    }
                },
                success: function(result) 
                {
                    swal({
                        title: 'Success!',
                        text: "Account registration successful. Please check your email to verify your account",
                        type: 'success',
                        confirmButtonColor: '#4CAF50',
                        confirmButtonText: 'Yes, Login Now!'
                    }).then(function() {
                        window.location.href = "/signin";
                       
                    });
                }

                });
            };

        return false;
    });



    $('#frmForgotPass').on('submit', function(env){
        
        var validator = $("#frmForgotPass").validate({
            rules: {
                email: {
                    required: true,
                    email: true
                }
               
            },
            errorElement: "span",
            messages: {
                email: "Please enter your email"
            }
        });
        if(validator.form()){
            $(this).ajaxSubmit({
                beforeSend: function() {
                    grecaptcha.reset();
                    swal({
                        title: 'Loading',
                        onOpen: function () {
                            swal.showLoading()
                        }
                    })
                },

                error: function(result) 
                {

                    console.log(result);

                    grecaptcha.reset();
                    swal({
                        title: 'Error!',
                        text: result.responseJSON.error,
                        type: 'error',
                        confirmButtonColor: '#27C1F7'
                    }); 
                },
                success: function(result) 
                {
                    swal({
                        title: 'Success!',
                        text: "Forgot password successfully. New password sent to your mail.",
                        type: 'success',
                        confirmButtonColor: '#4CAF50',
                        confirmButtonText: 'Yes, Login Now!'
                    }).then(function() {
                        window.location.href = "/signin";
                       
                    });
                }

                });
            };

        return false;
    });
})
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}