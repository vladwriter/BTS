jQuery(document).ready(function ($) {
    let url_string = window.location.href;
    let url = new URL(url_string);
    let order = url.searchParams.get("order");
    let userDetails = {};
    userDetails.user_id = order;
  
    if(order) {
      $.ajax({
        url: 'http://194.183.174.227:8080/paid',
        type: 'POST',
        data: JSON.stringify(userDetails),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: function(msg) {
            console.log(msg.status);      
        }
      });
    }
  });
  