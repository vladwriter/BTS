jQuery(document).ready(function($) {

    // Header fixed and Back to top button
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
            $('#header').addClass('header-fixed');
        } else {
            $('.back-to-top').fadeOut('slow');
            $('#header').removeClass('header-fixed');
        }
    });
    $('.back-to-top').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 1500, 'easeInOutExpo');
        return false;
    });

    // Initiate the wowjs
    new WOW().init();

    // Initiate superfish on nav menu
    $('.nav-menu').superfish({
        animation: {
            opacity: 'show'
        },
        speed: 400
    });

    // Mobile Navigation
    if ($('#nav-menu-container').length) {
        var $mobile_nav = $('#nav-menu-container').clone().prop({
            id: 'mobile-nav'
        });
        $mobile_nav.find('> ul').attr({
            'class': '',
            'id': ''
        });
        $('body').append($mobile_nav);
        $('body').prepend('<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>');
        $('body').append('<div id="mobile-body-overly"></div>');
        $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

        $(document).on('click', '.menu-has-children i', function(e) {
            $(this).next().toggleClass('menu-item-active');
            $(this).nextAll('ul').eq(0).slideToggle();
            $(this).toggleClass("fa-chevron-up fa-chevron-down");
        });

        $(document).on('click', '#mobile-nav-toggle', function(e) {
            $('body').toggleClass('mobile-nav-active');
            $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
            $('#mobile-body-overly').toggle();
        });

        $(document).click(function(e) {
            var container = $("#mobile-nav, #mobile-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                if ($('body').hasClass('mobile-nav-active')) {
                    $('body').removeClass('mobile-nav-active');
                    $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
                    $('#mobile-body-overly').fadeOut();
                }
            }
        });
    } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
        $("#mobile-nav, #mobile-nav-toggle").hide();
    }

    // Smoth scroll on page hash links
    $('a[href*="#"]:not([href="#"])').on('click', function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {

            var target = $(this.hash);
            if (target.length) {
                var top_space = 0;

                if ($('#header').length) {
                    top_space = $('#header').outerHeight();

                    if (!$('#header').hasClass('header-fixed')) {
                        top_space = top_space - 20;
                    }
                }

                $('html, body').animate({
                    scrollTop: target.offset().top - top_space
                }, 1500, 'easeInOutExpo');

                if ($(this).parents('.nav-menu').length) {
                    $('.nav-menu .menu-active').removeClass('menu-active');
                    $(this).closest('li').addClass('menu-active');
                }

                if ($('body').hasClass('mobile-nav-active')) {
                    $('body').removeClass('mobile-nav-active');
                    $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
                    $('#mobile-body-overly').fadeOut();
                }
                return false;
            }
        }
    });

    // Portfolio filter
    $("#portfolio-flters li").click(function() {
        $("#portfolio-flters li").removeClass('filter-active');
        $(this).addClass('filter-active');

        var selectedFilter = $(this).data("filter");
        $("#portfolio-wrapper").fadeTo(100, 0);

        $(".portfolio-item").fadeOut().css('transform', 'scale(0)');

        setTimeout(function() {
            $(selectedFilter).fadeIn(100).css('transform', 'scale(1)');
            $("#portfolio-wrapper").fadeTo(300, 1);
        }, 300);
    });

    // jQuery counterUp
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 1000
    });

    // custom code
    //for bootstrap popover
    $(function() {
        $('[data-toggle="popover"]').popover({
            trigger: 'focus'
        })
    });

    $('.nav-tabs a').on('click', function(e) {
        e.preventDefault()
        $(this).tab('show')
    })

    //disable button Apply if promocode is correct
    let checkIsAppliedPromocode = () => {
        if (localStorage.getItem('promocodeJune1Applied')) {
            $("#promocode-button-apply").html('Applied');
            $("#promocode-button-apply").addClass('disabled');
            $(".alert-success").removeClass('hide-el');
        }
    }

    checkIsAppliedPromocode();

    //Promocode
    let applyPromocode = () => {
        let total = $('#total').text();
        let promocode50 = 'june1';
        let promo = $('#promocode').val().toLowerCase();
        if (total && promo === promocode50) {
            localStorage.setItem('promocode', promo);
            $('#total').text(total / 2);
            localStorage.setItem('promocodeJune1Applied', 1);
        } else if (localStorage.getItem('promocodeJune1Applied')) {
            $('#total').text(total / 2);
        }

        checkIsAppliedPromocode();
    }

    let countTotal = () => {
        let quantity = $("#basket-list li").length;
        let total = 0;
        if (quantity === 2) { total = 300 } else if (quantity === 3 || quantity === 4) { total = 500 } else if (quantity === 1) { total = 200 } else { total = 0 };
        $(".choose-title").show();
        $(".choose-message").hide();
        $(".check-sessions").removeClass('hide-el');
        $("#total").text(total);
        // applyPromocode();
    }

    let deselectSessions = (title) => {

        let cards = $(".title-block span:contains(" + title + ")").closest('.card');
        cards.each(function(index) {
            let button = $(this).find('button');
            $(this).removeClass('bg-info text-white');
            $(button).removeClass('btn-danger').addClass('btn-outline-danger');
            // ($('.ua')) ? $(button).html('Обрати') : $(button).html('I choose')
            $(button).html('I choose')
        });
    }

    //old version because this
    function deleteFromBasketList() {
        let tempTitle = $(this).parents('.basket-item').find('.title').text();
        deselectSessions(tempTitle);
        //delete session from list
        $(this).parents('.basket-item').remove();
        countTotal();
    }

    let deleteFromBasketListIfChosen = (elem) => {
        let tempTitle = $(elem).closest('.card-body').find('.card-title').text();
        $("#basket-list span:contains(" + tempTitle + ")").closest('.basket-item').remove();
    }

    let createListInLocalStorage = (title) => {
        let arr = [];
        arr.push(title);
        localStorage.setItem('titles', JSON.stringify(arr));
    }

    let updateTitlesInLocalStorage = (title) => {

        let titles = JSON.parse(localStorage.getItem('titles'));
        titles.push(title);
        localStorage.setItem('titles', JSON.stringify(titles));

    };

    let isTitleChosen = (title) => {
        let titles = (localStorage.getItem('titles')) ? JSON.parse(localStorage.getItem('titles')) : [];
        let findElement = (elem) => {
            return (elem === title) ? true : false;
        }
        return (titles.find(findElement)) ? true : false;
    }

    //buttons Add
    let addToBasketList = (obj) => {
        let daytime = obj.closest('.card-body').find('.card-title').attr('data-daytime');
        let price = obj.closest('.card-body').find('.card-title').attr('data-price');
        let room = obj.closest('.card-body').find('.card-title').attr('data-room');
        let title = obj.closest('.card-body').find('.card-title').text();

        deleteFromBasketListIfChosen(obj);

        if ($("#basket-list > [data-daytime*='" + daytime + "']").length) {
            $("#basket-list > [data-daytime*='" + daytime + "']").remove();
        }
        $("#basket-list").append("<li data-daytime='" + daytime + "' data-price='" + price + "' class='list-group-item basket-item' data-room='" + room + "'><div class='row'><div class='col-md-11'><span class='title'>" + title + "</span> | <span><strong>" + price + "</strong> грн</span></div><div class='col-md-1 text-right'><button type='button' class='delete-el btn btn-light btn-sm'><i class='fas fa-times-circle'></i></button></div></div></li>");

        // delete element from basket
        $(".delete-el").click(deleteFromBasketList);

        countTotal();
        //remove message in the form "Please choose the session"
        $("#basketempty").removeClass("show");
    };

    $('form#discount').submit(function() {
        if (!localStorage.getItem('promocodeJune1Applied')) {
            // applyPromocode();
        }
        return false;
    })

    // events 2020
    $('.more').click(function(e) {
        // modal
        var details = $(e.target).closest('.card-body').children('.event-details');
        var color = $(details).closest('.card').attr('data-color');
        var title = $(details).children('.title').html();
        var content = $(details).children('.content').html();
        var date = $(details).children('.date').html();
        var time = $(details).closest('.table-time').attr('data-time');
        var timeMobile = $(details).closest('.card').find('.badge strong').html();
        var speakerName = $(details).children('.presenter').html();
        var link = $(details).closest('.card-body').find('a.btn').attr('href');

        var speaker = $('#' + speakerName).html();
        $('.modal-date').html(date);
        time ? $('.modal-time').html(time) : $('.modal-time').html(timeMobile);
        $('.modal-topic').html(title);
        $('.modal-details').html(content);
        $('.modal-speaker').html(speaker);
        $('.modal-link').prop('href', link);
        $('.modal-content').removeClass("red orange blue green").addClass(color);


    });

    //button pause youtube
    $(document).on('click', '#close_vid', function() {
        jQuery("iframe").each(function() {
            jQuery(this)[0].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
        });
    });





    /////////////////////

    // $(document).ready(function() {
    //     $(".test").hide();
    //     $(".collapse").show();
    //     $('.collapse').click(function() {
    //         $(".test").slideToggle();
    //     });
    // });



    // filter

    function getValue() {
        // get type events info
        var typesValues = [];
        $('#types-events input').each(function() {
            typesValues.push({ id: this.id, checked: this.checked, attr: this.value });
        });

        // get classes info
        var classesValues = [];
        $('#classes-events input').each(function() {
            classesValues.push({ id: this.id, checked: this.checked, attr: this.value });
        });

        // get presenter info (select)
        var presentersSelectValues = [];
        $('select#presenters option').each(function() {
            if (this.value !== '') {
                presentersSelectValues.push({ id: this.value, checked: this.selected, attr: this.value });
            }
        });

        function checked(el) {
            return el.checked ? true : false;
        }
        // if all unckecked show all
        if (!typesValues.find(checked) && !classesValues.find(checked) && !presentersSelectValues.find(checked)) {
            $('.sessions-table .card, .sessions-table .card a, #mobile-days .mb-2, #mobile-days .mb-2 a, .more').removeClass('disabled');
            //close collapse mobile
            $('#mobile-weeks .card .card .collapse').removeClass('show');
        }

        var filterTypes = [];

        typesValues.forEach(function(el) {
            if (el.checked) {
                filterTypes.push({ attr: 'type', value: el.attr });
            }
        });

        classesValues.forEach(function(el) {
            if (el.checked) {
                filterTypes.push({ attr: 'classes', value: el.attr });
            }
        });

        presentersSelectValues.forEach(function(el) {
            if (el.checked) {
                filterTypes.push({ attr: 'presenter', value: el.attr });
            }

        });
        var obj = {};
        filterTypes.forEach(function(el) {
            if (!obj[el.attr]) { obj[el.attr] = `[data-${el.attr}*='${el.value}']`; } else { obj[el.attr] = `${obj[el.attr]},[data-${el.attr}*='${el.value}']` };
        });

        var y = $('.sessions-table .card, #mobile-days .mb-2');

        for (var prop in obj) {
            y = y.filter(`${obj[prop]}`);
        }


        $(y).each(function() {
            $(this).removeClass('disabled');
            $(this).find('a').removeClass('disabled');
        });

        // Filter. Mobile cards. If all unckecked hide all collapse
        if (!typesValues.find(checked) && !classesValues.find(checked) && !presentersSelectValues.find(checked)) {
            //close collapse mobile
            $('#mobile-weeks .card .card .collapse').removeClass('show');
            $('#mobile-weeks .card .card .collapse').siblings('.card-header').find('button').removeClass('disabled').attr('data-toggle', 'collapse');
            $('#mobile-weeks .card .card .collapse').siblings('.card-header').find('button span.text-muted').addClass('text-info').removeClass('text-muted');
        } else {
            showCollapse();
        }

    };

    function changeWeeksMobileView() {
        var weeks = $('#mobile-weeks > .card');
        weeks.each( function() {
            $(this).children('.card-header').removeClass('bg-secondary');
            $(this).children('.card-header').addClass('bg-info');
            
            $(this).children('.collapse').removeClass('show');
            if ($(this).find('.card button').not('.disabled').length) {
                $(this).children('.collapse').addClass('show');
                return false;
            }
             else {
                $(this).children('.card-header').addClass('bg-secondary');
                $(this).children('.card-header').removeClass('bg-info');
            }
        });

    };

    function showCollapse() {
        // $('#mobile-weeks .card .card .collapse').addClass('show');
        var days = $('#mobile-weeks .card .card .collapse');
        days.each(function() {
            if ($(this).find('.card').not('.disabled').length) {
                $(this).addClass('show');
                $(this).siblings('.card-header').find('button span.text-muted').removeClass('text-muted').addClass('text-info');
            } else {
                $(this).siblings('.card-header').find('button').addClass('disabled').attr('data-toggle', 'disallow');
                $(this).siblings('.card-header').find('button span.text-info').addClass('text-muted').removeClass('text-info');
            };
        });
        console.log('showCollapseFinal');
    };


    // add change event listener to filter fields
    $('#types-events input').change(function() {
        $('.sessions-table .card, .sessions-table .card a, #mobile-days .mb-2, #mobile-days .mb-2 a, .more').addClass('disabled');
        $('#mobile-weeks .card .card .collapse').removeClass('show');
        $('#mobile-weeks .card .card .collapse').siblings('.card-header').find('button').removeClass('disabled').attr('data-toggle', 'collapse');
        $('#mobile-weeks .card .card .collapse').siblings('.card-header').find('button span.text-info').addClass('text-muted').removeClass('text-info');
        getValue();
        changeWeeksMobileView();
    });

    $('#classes-events input').change(function() {
        $('.sessions-table .card, .sessions-table .card a, #mobile-days .mb-2, #mobile-days .mb-2 a, .more').addClass('disabled');
        $('#mobile-weeks .card .card .collapse').removeClass('show');
        $('#mobile-weeks .card .card .collapse').siblings('.card-header').find('button').removeClass('disabled').attr('data-toggle', 'collapse');
        $('#mobile-weeks .card .card .collapse').siblings('.card-header').find('button span.text-info').addClass('text-muted').removeClass('text-info');
        getValue();
        changeWeeksMobileView();
    });

    $("select#presenters").change(function() {
        $('.sessions-table .card, .sessions-table .card a, #mobile-days .mb-2, #mobile-days .mb-2 a, .more').addClass('disabled');
        $('#mobile-weeks .card .card .collapse').removeClass('show');
        $('#mobile-weeks .card .card .collapse').siblings('.card-header').find('button').removeClass('disabled').attr('data-toggle', 'collapse');
        $('#mobile-weeks .card .card .collapse').siblings('.card-header').find('button span.text-info').addClass('text-muted').removeClass('text-info');
        getValue();
        changeWeeksMobileView();
    });

    // clear filters button 
    $('#clear-filter').click(function() {
        $('.sessions-table .card, .sessions-table .card a, #mobile-days .mb-2, #mobile-days .mb-2 a, .more').removeClass('disabled');
        $('#types-events input, #classes-events input, select#presenters').prop('checked', false);
        $('select#presenters').val('');
        $('#mobile-weeks .card .card .collapse').removeClass('show');
        $('#mobile-weeks .card .card .collapse').siblings('.card-header').find('button').removeClass('disabled').attr('data-toggle', 'collapse');
        $('#mobile-weeks .card .card .collapse').siblings('.card-header').find('button span.text-muted').addClass('text-info').removeClass('text-muted');
        //clear parents accordion state
        $('#mobile-weeks > .card').children('.card-header').removeClass('bg-secondary');
        $('#mobile-weeks > .card').children('.card-header').addClass('bg-info');
    });

});