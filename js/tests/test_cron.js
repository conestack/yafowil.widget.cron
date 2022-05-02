import { CronWidget } from "../src/widget";

QUnit.test('initialize', assert => {
    let el = $('<div />').addClass('crontab').addClass('widget');
    let widget = new CronWidget(el, 'edit');
    assert.ok(widget);

    el.remove();
    widget = null;
});