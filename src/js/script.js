//= ../../node_modules/jquery/dist/jquery.js
//= ../../node_modules/selectric/src/jquery.selectric.js

var url = 'https://apiv2.bitcoinaverage.com/indices/global/ticker/',
    currency = $('#currency').val();
    //currentUrl = url+btc+usd;

function getData(elem) {
    currency = $('#currency').val();
    elem.type = elem.attr('id').toUpperCase();
    elem.url = url + elem.type + currency;
    var symbol;

    $.getJSON(elem.url).done(function(data) {
        switch (currency) {
            case 'RUB':
                symbol ='₽';
                break;
            case 'USD':
                symbol = '$';
                break;
            case 'GBP':
                symbol = '£';
                break;
            case 'EUR':
                symbol = '€';
                break;
            default: symbol='$';
        }
        elem.find('.crypt-item__price-value').html(symbol + data.ask);
        if(elem.find('input[type="checkbox"]').prop("checked")) {
            symbol='%';
            elem.find('[data-change="hour"]').html(data.changes.percent.hour > 0 ? '<span class="increase">' + data.changes.percent.hour + symbol + '</span>' : '<span' +
                ' class="decrease">' + data.changes.percent.hour + symbol + '</span>');
            elem.find('[data-change="day"]').html(data.changes.percent.day > 0 ? '<span class="increase">' + data.changes.percent.day + symbol + '</span>' : '<span' +
                ' class="decrease">' + data.changes.percent.day + symbol + '</span>');
            elem.find('[data-change="week"]').html(data.changes.percent.week > 0 ? '<span class="increase">' + data.changes.percent.week + symbol + '</span>' : '<span' +
                ' class="decrease">' + data.changes.percent.week + symbol + '</span>');
            elem.find('[data-change="month"]').html(data.changes.percent.month > 0 ? '<span class="increase">' + data.changes.percent.month + symbol + '</span>' : '<span' +
                ' class="decrease">' + data.changes.percent.month + symbol + '</span>');
        } else {
            elem.find('[data-change="hour"]').html(data.changes.price.hour > 0 ? '<span class="increase">' + data.changes.price.hour + symbol + '</span>' : '<span' +
                ' class="decrease">' + data.changes.price.hour + symbol + '</span>');
            elem.find('[data-change="day"]').html(data.changes.price.day > 0 ? '<span class="increase">' + data.changes.price.day + symbol + '</span>' : '<span class="decrease">' + data.changes.price.day + symbol + '</span>');
            elem.find('[data-change="week"]').html(data.changes.price.week > 0 ? '<span class="increase">' + data.changes.price.week + symbol + '</span>' : '<span' +
                ' class="decrease">' + data.changes.price.week + symbol + '</span>');
            elem.find('[data-change="month"]').html(data.changes.price.month > 0 ? '<span class="increase">' + data.changes.price.month + symbol + '</span>' : '<span' +
                ' class="decrease">' + data.changes.price.month + symbol + '</span>');
        }
    })
}


$(function(){
    $('#currency').selectric();
    $('#currency').on('change', function () {
        $('.crypt-item').each(function () {
            getData($(this));
        });
    });

    $('input[type="checkbox"]').on('change', function () {
        getData($(this).closest('.crypt-item'))
    });

    $('.crypt-item').each(function () {
        getData($(this));
    });


});
