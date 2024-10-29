import {CronWidget} from "../src/widget";
import {register_array_subscribers} from "../src/widget";
import $ from 'jquery';

QUnit.test('initialize', assert => {
    let el = $('<div />').addClass('crontab').addClass('widget');
    let widget = new CronWidget(el, 'edit');
    assert.ok(widget);

    el.remove();
    widget = null;
});

QUnit.test('register_array_subscribers', assert => {
    let _array_subscribers = {
        on_add: []
    };

    // window.yafowil_array is undefined - return
    register_array_subscribers();
    assert.deepEqual(_array_subscribers['on_add'], []);

    // patch yafowil_array
    window.yafowil_array = {
        on_array_event: function(evt_name, evt_function) {
            _array_subscribers[evt_name] = evt_function;
        },
        inside_template(elem) {
            return elem.parents('.arraytemplate').length > 0;
        }
    };
    register_array_subscribers();

    // create table DOM
    let table = $('<table />')
        .append($('<tr />'))
        .append($('<td />'))
        .appendTo('body');

    let el = $(`<div />`).addClass('crontab widget');
    $('td', table).addClass('arraytemplate');
    el.appendTo($('td', table));

    // invoke array on_add - returns
    _array_subscribers['on_add'].apply(null, $('tr', table));
    let widget = el.data('yafowil-cron');
    assert.notOk(widget);
    $('td', table).removeClass('arraytemplate');

    // invoke array on_add
    el.attr('id', '');
    _array_subscribers['on_add'].apply(null, $('tr', table));
    widget = el.data('yafowil-cron');
    assert.ok(widget);
    table.remove();
    window.yafowil_array = undefined;
    _array_subscribers = undefined;
});