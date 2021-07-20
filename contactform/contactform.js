jQuery(document).ready(function($) {
  "use strict";

  //check oferta checkbox and activate button
  $('#register-button').prop('disabled', true);
  $('#pay-button').prop('disabled', true);
  $('#oferta').change(function() {
    (this.checked) ? $('#register-button').prop('disabled', false) : $('#register-button').prop('disabled', true);
  });

  //Contact
  $('form.contactForm').submit(function() {
    var f = $(this).find('.form-group'),
      ferror = false,
      emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

    f.children('input').each(function() { // run all inputs

      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;

          case 'email':
            if (!emailExp.test(i.val())) {
              ferror = ierror = true;
            }
            break;

          case 'checked':
            if (! i.is(':checked')) {
              ferror = ierror = true;
            }
            break;

          case 'regexp':
            exp = new RegExp(exp);
            if (!exp.test(i.val())) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });
    f.children('textarea').each(function() { // run all inputs

      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') != undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });
    if (ferror) return false;
    else var str = $(this).serialize();
    var action = $(this).attr('action');
    if( ! action ) {
      action = 'contactform/contactform.php';
    }
    // $.ajax({
    //   type: "POST",
    //   url: action,
    //   data: str,
    //   success: function(msg) {
    //     // alert(msg);
    //     if (msg == 'OK') {
    //       $("#sendmessage").addClass("show");
    //       $("#errormessage").removeClass("show");
    //       $('.contactForm').find("input, textarea").val("");
    //     } else {
    //       $("#sendmessage").removeClass("show");
    //       $("#errormessage").addClass("show");
    //       $('#errormessage').html(msg);
    //     }

    //   }
    // });
    let dataToSend = {};
    dataToSend.name = $('form #name').val();
    dataToSend.event_id = 1;
    dataToSend.email = $('form #email').val();
    dataToSend.phone = $('form #phone').val();
    dataToSend.l_name = $('form #lname').val();
    dataToSend.total = $('#total').text();
    dataToSend.paid = 0;

    // prepare list of objects events
    dataToSend.events = [];
    let timePrepare = time => {
      if (time === '10') return '10:00-11:00'
      else if (time === '11') return '11:30-12:30'
      else if (time === '12') return '13:00-14:00'
      else if (time === '13') return '14:30-15:30'
      else return '-';
    };
    let dayPrepare = day => {
      if (day === 'day1') return '21 August 2019'
      else if (day === 'day2') return '30 November 2019'
      else return 'unknown';
    };
    $("#basket-list li").each(function(index){
      let obj = {};
      obj.name = $('.title', this).text();
      obj.date = dayPrepare($(this).attr("data-daytime").split('-')[0]);
      obj.time = timePrepare($(this).attr("data-daytime").split('-')[1]);
      obj.room = $(this).attr("data-room");
      dataToSend.events.push(obj);
      obj = {};
    });
    console.log(dataToSend.events);
    // prepare list of objects events

    
    
    // {"event_id":1,"email":"test@test.com","phone":"1234567","name":"1234","l_name":"qwerty","paid":0};

        //if basket is empty
        if ($("#basket-list li").length) {
          $.ajax({
            url: 'http://194.183.174.227:8080/subscribe',
            type: 'POST',
            data: JSON.stringify(dataToSend),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: false,
            success: function(msg) {
    
              //if user exist
              if (msg.status === 'user exist') {
                $("#userexist").addClass("show");
                $("#errormessage").removeClass("show");
              }
              else if (msg.status === 'user registered successful') {
                let fee = 2.6;
                let totalF = Number($("#total").text());
                let finalFee = totalF / 100 * fee;
                finalFee = finalFee.toFixed(2);
                $(".registration-form").hide();
                // $(".sessions-table").hide();
                // $(".sessions-title").hide();
                $(".delete-el").hide();
                $("#success-registration").removeClass("hide-el");
                $("#reg-name").text(msg.user.name);
                $("#reg-lname").text(msg.user.l_name);
                $("#reg-email").text(msg.user.email);
                $("#reg-phone").text(msg.user.phone);
                $("#reg-total").text($("#total").text());
                $("#reg-fee").text(finalFee);
                // $("#reg-event").text('List of events');

                
                  // to Platon
                  let reverseString = str => str.split("").reverse().join("");
                  let bodyFormData = {};
                  let total = $("#total").text();
                  total = Number(total).toFixed(2);
                  total = +total + +finalFee;
                  total = Number(total).toFixed(2);
                  let payment = 'CC', key = 'BZDWV2J2MY', url = 'http://events.dinternal.com.ua/100ideas/paid',
                      data = {
                        amount: total,
                        description: 'Серія семінарів "100+ fresh and practical teaching ideas for a successful academic year 2019/20"',
                        currency: 'UAH'
                      },
                      first_name = msg.user.name, last_name = msg.user.l_name, email = msg.user.email,
                      order = msg.user.ID,
                      sign = '', secretKey = 'Y3xNvYFmQ4fQNHcDzsSx59AFdW4Y4cFn';
                  data = btoa(unescape(encodeURIComponent(JSON.stringify(data)))); // шифрование и исправление ошибки кириллицы
                  let signTemp = (reverseString(key) + reverseString(payment) + reverseString(data) + reverseString(url) + reverseString(secretKey)).toUpperCase();
                  sign = $.md5(signTemp);
                  bodyFormData.payment = payment;
                  bodyFormData.key = key;
                  bodyFormData.url = url;
                  bodyFormData.email = email;
                  bodyFormData.first_name = first_name;
                  bodyFormData.last_name = last_name;
                  bodyFormData.order = order;
                  bodyFormData.data = data;
                  bodyFormData.sign = sign;
                  console.log(bodyFormData);
                  //
                  $("#platon input[name$='payment']").val(bodyFormData.payment);
                  $("#platon input[name$='key']").val(bodyFormData.key);
                  $("#platon input[name$='url']").val(bodyFormData.url);
                  $("#platon input[name$='data']").val(bodyFormData.data);
                  $("#platon input[name$='email']").val(bodyFormData.email);
                  $("#platon input[name$='first_name']").val(bodyFormData.first_name);
                  $("#platon input[name$='last_name']").val(bodyFormData.last_name);
                  $("#platon input[name$='order']").val(bodyFormData.order);
                  $("#platon input[name$='sign']").val(bodyFormData.sign);
                
              }
              else {
                console.log(msg.status);
              }
            }
          });
        }
        else {
          $("#basketempty").addClass("show");
        }
    return false;
  });

});
