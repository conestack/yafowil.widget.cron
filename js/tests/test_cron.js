import $ from 'jquery';
import {
    CronWidget as BS5CronWidget,
    register_array_subscribers as bs5_register_array_subscribers,
} from '../src/bootstrap5/widget.js';
import { i18n } from '../src/default/i18n.js';
import { CronWidget, register_array_subscribers } from '../src/default/widget';

QUnit.test('initialize', (assert) => {
    const el = $('<div />').addClass('crontab').addClass('widget');
    let widget = new CronWidget(el, 'edit');
    assert.ok(widget);

    el.remove();
    widget = null;
});

QUnit.test('register_array_subscribers', (assert) => {
    let _array_subscribers = {
        on_add: [],
    };

    // window.yafowil_array is undefined - return
    register_array_subscribers();
    assert.deepEqual(_array_subscribers.on_add, []);

    // patch yafowil_array
    window.yafowil_array = {
        on_array_event: (evt_name, evt_function) => {
            _array_subscribers[evt_name] = evt_function;
        },
        inside_template(elem) {
            return elem.parents('.arraytemplate').length > 0;
        },
    };
    register_array_subscribers();

    // create table DOM
    const table = $('<table />').append($('<tr />')).append($('<td />')).appendTo('body');

    const el = $(`<div />`).addClass('crontab widget');
    $('td', table).addClass('arraytemplate');
    el.appendTo($('td', table));

    // invoke array on_add - returns
    _array_subscribers.on_add.apply(null, $('tr', table));
    let widget = el.data('yafowil-cron');
    assert.notOk(widget);
    $('td', table).removeClass('arraytemplate');

    // invoke array on_add
    el.attr('id', '');
    _array_subscribers.on_add.apply(null, $('tr', table));
    widget = el.data('yafowil-cron');
    assert.ok(widget);
    table.remove();
    window.yafowil_array = undefined;
    _array_subscribers = undefined;
});

const modes = ['minute', 'hour', 'dom', 'month', 'dow', 'year'];

function create_edit_elem(values = {}, data = '') {
    const header = modes
        .map(
            (mode) => `
            <div class="cron-value ${mode}">
              <input class="hidden" type="hidden" value="${values[mode] || ''}" />
              <button class="btn btn-sm edit">${mode}</button>
            </div>`,
        )
        .join('');
    return $(`
        <div class="crontab widget" ${data}>
          <div class="edit-container">
            <div><div>${header}</div></div>
            <div class="editarea"></div>
          </div>
        </div>
    `);
}

function create_display_elem(value) {
    return $(`<div class="display-crontab widget"><code>${value}</code></div>`);
}

const variants = [
    ['default', CronWidget, register_array_subscribers],
    ['bootstrap5', BS5CronWidget, bs5_register_array_subscribers],
];

for (const [name, Widget, register] of variants) {
    QUnit.module(`${name} CronWidget`, (hooks) => {
        let container;

        hooks.beforeEach(() => {
            container = $('<div />').appendTo('body');
        });
        hooks.afterEach(() => {
            container.remove();
            delete window.yafowil_array;
        });

        function create_widget(values, data) {
            const elem = create_edit_elem(values, data).appendTo(container);
            return new Widget(elem, 'edit');
        }

        function edit_button(widget, mode) {
            return $(`.cron-value.${mode} button.edit`, widget.root);
        }

        function value_button(widget, value) {
            return $(`.editcontainer button[name="${value}"]`, widget.edit_area);
        }

        QUnit.test('initialize', (assert) => {
            const edit = create_edit_elem().appendTo(container);
            const display = create_display_elem('* * * * *').appendTo(container);
            Widget.initialize(container);
            assert.ok(edit.data('yafowil-cron') instanceof Widget);
            assert.strictEqual(edit.data('yafowil-cron').mode, 'edit');
            assert.ok(display.data('yafowil-cron') instanceof Widget);
            assert.strictEqual(display.data('yafowil-cron').mode, 'display');
        });

        QUnit.test('initialize skips array templates', (assert) => {
            window.yafowil_array = {
                inside_template: () => true,
            };
            const edit = create_edit_elem().appendTo(container);
            const display = create_display_elem('* * * * *').appendTo(container);
            Widget.initialize(container);
            assert.strictEqual(edit.data('yafowil-cron'), undefined);
            assert.strictEqual(display.data('yafowil-cron'), undefined);
        });

        QUnit.test('register_array_subscribers without array widget', (assert) => {
            assert.strictEqual(register(), undefined);
        });

        QUnit.test('register_array_subscribers', (assert) => {
            let on_add;
            window.yafowil_array = {
                on_array_event: (evt_name, evt_function) => {
                    assert.strictEqual(evt_name, 'on_add');
                    on_add = evt_function;
                },
                inside_template: () => false,
            };
            register();
            const edit = create_edit_elem().appendTo(container);
            on_add(null, container);
            assert.ok(edit.data('yafowil-cron') instanceof Widget);
        });

        QUnit.test('defaults', (assert) => {
            const widget = create_widget();
            const year = new Date().getFullYear();
            assert.strictEqual(widget.lang, 'en');
            assert.strictEqual(widget.start_year, year);
            assert.strictEqual(widget.end_year, year + 9);
            assert.deepEqual(widget.value, {
                minute: [],
                hour: [],
                dom: [],
                month: [],
                dow: [],
                year: [],
            });
            assert.strictEqual($('.crontab_summary .summary', widget.root).length, 1);
            assert.strictEqual(widget.editarea_cls, 'editarea');
        });

        QUnit.test('data attributes', (assert) => {
            const widget = create_widget(
                {},
                'data-lang="de" data-start_year="2020" data-end_year="2022"',
            );
            assert.strictEqual(widget.lang, 'de');
            assert.strictEqual(widget.start_year, 2020);
            assert.strictEqual(widget.end_year, 2022);
            assert.strictEqual(widget.translate('summary'), i18n.de.summary);
            assert.strictEqual(widget.monthmap(), i18n.de.monthmap);
            assert.strictEqual(widget.dowmap(), i18n.de.dowmap);
            assert.strictEqual(widget.maxlengths().year, 3);
        });

        QUnit.test('values from hidden inputs', (assert) => {
            const widget = create_widget(
                { minute: '0,15,30', hour: '*', month: '01,2', dow: '0', year: '*' },
                'data-start_year="2020" data-end_year="2022"',
            );
            assert.deepEqual(widget.value.minute, ['0', '15', '30']);
            assert.strictEqual(widget.value.hour.length, 24);
            assert.deepEqual(widget.value.dom, []);
            assert.deepEqual(widget.value.month, ['1', '2']);
            assert.deepEqual(widget.value.dow, ['0']);
            assert.deepEqual(widget.value.year, ['2020', '2021', '2022']);
        });

        QUnit.test('parse_part', (assert) => {
            const widget = create_widget({}, 'data-start_year="2020" data-end_year="2021"');
            const ranges = {
                minute: [0, 59],
                hour: [0, 23],
                dom: [1, 31],
                month: [1, 12],
                dow: [0, 6],
                year: [2020, 2021],
            };
            for (const [mode, [start, end]] of Object.entries(ranges)) {
                widget.parse_part('*', mode);
                assert.strictEqual(widget.value[mode].length, end - start + 1);
                assert.strictEqual(widget.value[mode][0], `${start}`);
                assert.strictEqual(widget.value[mode][end - start], `${end}`);
                assert.strictEqual(widget.serialize(mode), '*');
            }
            widget.parse_part(['3', '', '04'], 'minute');
            assert.deepEqual(widget.value.minute, ['3', '4']);
        });

        QUnit.test('serialize', (assert) => {
            const widget = create_widget();
            widget.value.minute = ['10', '2', '1'];
            assert.strictEqual(widget.serialize('minute'), '1,2,10');
            assert.strictEqual(widget.serialize('hour'), '');
        });

        QUnit.test('add, remove, has', (assert) => {
            const widget = create_widget();
            widget.add(5, 'minute');
            assert.true(widget.has(5, 'minute'));
            assert.false(widget.has(6, 'minute'));
            widget.remove(6, 'minute');
            assert.deepEqual(widget.value.minute, ['5']);
            widget.remove(5, 'minute');
            assert.deepEqual(widget.value.minute, []);
        });

        QUnit.test('get_mode', (assert) => {
            const widget = create_widget();
            for (const mode of modes) {
                assert.strictEqual(widget.get_mode($(`<div class="cron-value ${mode}" />`)), mode);
            }
            assert.strictEqual(widget.get_mode($('<div class="cron-value" />')), undefined);
        });

        QUnit.test('display mode', (assert) => {
            let elem = create_display_elem('0,30 12 * 1 0').appendTo(container);
            let widget = new Widget(elem, 'display');
            assert.deepEqual(widget.value.minute, ['0', '30']);
            assert.deepEqual(widget.value.hour, ['12']);
            assert.strictEqual(widget.value.dom.length, 31);
            assert.deepEqual(widget.value.month, ['1']);
            assert.deepEqual(widget.value.dow, ['0']);
            assert.strictEqual(widget.value.year.length, 10);
            assert.strictEqual(widget.edit_area, undefined);
            assert.notStrictEqual($('.crontab_summary .summary', elem).html(), '');

            elem = create_display_elem('0 12 * 1 0 2030').appendTo(container);
            widget = new Widget(elem, 'display');
            assert.deepEqual(widget.value.year, ['2030']);
        });

        QUnit.test('show_edit_section', (assert) => {
            const widget = create_widget({}, 'data-start_year="2020" data-end_year="2024"');
            const expected = {
                minute: ['select_minutes', 60, '0', '0', '59', '59'],
                hour: ['select_hours', 24, '1', '1', '0', '0'],
                dom: ['select_dom', 31, '1', '1', '31', '31'],
                month: ['select_month', 12, '1', 'January', '12', 'December'],
                dow: ['select_dow', 7, '1', 'Monday', '0', 'Sunday'],
                year: ['select_year', 5, '2020', '2020', '2024', '2024'],
            };
            for (const [mode, [msg, count, first, first_text, last, last_text]] of Object.entries(
                expected,
            )) {
                edit_button(widget, mode).trigger('click');
                const buttons = $('.editcontainer button', widget.edit_area);
                assert.strictEqual(widget.edit_area.attr('class'), `editarea ${mode}`);
                assert.strictEqual($('h4', widget.edit_area).text(), i18n.en[msg]);
                assert.strictEqual($('button.select_all', widget.edit_area).length, 1);
                assert.strictEqual(buttons.length, count);
                assert.strictEqual(buttons.first().attr('name'), first);
                assert.strictEqual(buttons.first().text(), first_text);
                assert.strictEqual(buttons.last().attr('name'), last);
                assert.strictEqual(buttons.last().text(), last_text);
                assert.ok($(`.cron-value.${mode}`, widget.root).hasClass('active'));
            }
        });

        QUnit.test('show_edit_section closes open section', (assert) => {
            const widget = create_widget();
            edit_button(widget, 'minute').trigger('click');
            assert.strictEqual(widget.edit_area.css('display'), 'block');

            edit_button(widget, 'minute').trigger('click');
            assert.strictEqual(widget.edit_area.attr('class'), 'editarea');
            assert.strictEqual(widget.edit_area.html(), '');
            assert.strictEqual(widget.edit_area.css('display'), 'none');
            assert.notOk($('.cron-value.minute', widget.root).hasClass('active'));
        });

        QUnit.test('value buttons', (assert) => {
            const widget = create_widget({ minute: '5' });
            edit_button(widget, 'minute').trigger('click');
            const input = $('.cron-value.minute input', widget.root);
            const summary = $('.crontab_summary .summary', widget.root);
            assert.ok(value_button(widget, 5).hasClass('active'));
            assert.notOk(value_button(widget, 6).hasClass('active'));

            const summary_before = summary.html();
            value_button(widget, 6).trigger('mousedown');
            assert.ok(value_button(widget, 6).hasClass('active'));
            assert.strictEqual(input.val(), '5,6');
            assert.notStrictEqual(summary.html(), summary_before);

            value_button(widget, 5).trigger('mousedown');
            assert.notOk(value_button(widget, 5).hasClass('active'));
            assert.strictEqual(input.val(), '6');

            const click = $.Event('click');
            value_button(widget, 5).trigger(click);
            assert.true(click.isDefaultPrevented());
            assert.strictEqual(input.val(), '6');
        });

        QUnit.test('drag selection', (assert) => {
            const widget = create_widget();
            edit_button(widget, 'minute').trigger('click');
            const input = $('.cron-value.minute input', widget.root);

            // hovering without pressed mouse button or shift key
            value_button(widget, 1).trigger($.Event('mouseenter', { shiftKey: false }));
            assert.strictEqual(input.val(), '');

            // hovering with pressed mouse button
            widget.edit_area.trigger('mousedown');
            assert.true(widget.pressed);
            value_button(widget, 1).trigger($.Event('mouseenter', { shiftKey: false }));
            assert.strictEqual(input.val(), '1');

            // releasing the mouse button on a value button
            value_button(widget, 1).trigger('mouseup');
            assert.false(widget.pressed);

            // releasing the mouse button anywhere
            widget.edit_area.trigger('mousedown');
            $(document).trigger('mouseup');
            assert.false(widget.pressed);

            // hovering with shift key
            value_button(widget, 2).trigger($.Event('mouseenter', { shiftKey: true }));
            assert.strictEqual(input.val(), '1,2');
        });

        QUnit.test('select all', (assert) => {
            const widget = create_widget();
            edit_button(widget, 'hour').trigger('click');
            const input = $('.cron-value.hour input', widget.root);
            const select_all = $('button.select_all', widget.edit_area);
            assert.notOk(select_all.hasClass('active'));

            select_all.trigger('click');
            assert.ok(select_all.hasClass('active'));
            assert.strictEqual($('.editcontainer button.active', widget.edit_area).length, 24);
            assert.strictEqual(input.val(), '*');
            assert.strictEqual(widget.value.hour.length, 24);

            select_all.trigger('click');
            assert.notOk(select_all.hasClass('active'));
            assert.strictEqual($('.editcontainer button.active', widget.edit_area).length, 0);
            assert.strictEqual(input.val(), '');
            assert.deepEqual(widget.value.hour, []);
        });

        QUnit.test('select all is active if all values are selected', (assert) => {
            const widget = create_widget({ dow: '*' });
            edit_button(widget, 'dow').trigger('click');
            assert.ok($('button.select_all', widget.edit_area).hasClass('active'));
        });

        QUnit.test('group_value and format_groups', (assert) => {
            const widget = create_widget();
            const groups = widget.group_value(['1', '2', '3', '5', '7', '8']);
            assert.deepEqual(groups, [['1', '2', '3'], ['5'], ['7', '8']]);
            assert.strictEqual(widget.format_groups(groups), '1-3, 5, 7-8');
            assert.strictEqual(
                widget.format_groups([['1', '2'], ['4']], widget.monthmap()),
                'January-February, April',
            );
            assert.deepEqual(widget.group_value([]), []);
        });
    });
}

QUnit.module('default CronWidget summary', (hooks) => {
    let container;

    hooks.beforeEach(() => {
        container = $('<div />').appendTo('body');
    });
    hooks.afterEach(() => {
        container.remove();
    });

    QUnit.test('summary template', (assert) => {
        const widget = new CronWidget(create_edit_elem().appendTo(container), 'edit');
        const article = $('article.crontab_summary', widget.root);
        assert.strictEqual($('strong', article).text(), 'Summary');
        assert.strictEqual($('p.summary', article).length, 1);
    });

    QUnit.test('nothing selected', (assert) => {
        const widget = new CronWidget(create_edit_elem().appendTo(container), 'edit');
        assert.strictEqual(
            widget.summarize(),
            [
                'No minutes selected',
                'No hour selected',
                'No day of month selected',
                'No month selected',
                'No day of week selected',
                'No year selected',
            ].join('<br/>'),
        );
    });

    QUnit.test('values selected', (assert) => {
        const elem = create_edit_elem(
            { minute: '1,2,3,5', hour: '*', month: '1,2', dow: '0,6', year: '2020' },
            'data-start_year="2020" data-end_year="2021"',
        ).appendTo(container);
        const widget = new CronWidget(elem, 'edit');
        assert.strictEqual(
            widget.summarize(),
            [
                'Minutes: 1-3, 5',
                'Every hour',
                'No day of month selected',
                'Month: January-February',
                'Days of week: Sunday, Saturday',
                'Years: 2020',
            ].join('<br/>'),
        );
    });

    QUnit.test('edit buttons', (assert) => {
        const widget = new CronWidget(create_edit_elem().appendTo(container), 'edit');
        $('.cron-value.minute button.edit', widget.root).trigger('click');
        assert.ok($('button.select_all', widget.edit_area).is('.btn.btn-sm'));
        assert.ok($('.editcontainer button', widget.edit_area).first().is('.btn.btn-sm'));
    });
});

QUnit.module('bootstrap5 CronWidget summary', (hooks) => {
    let container;

    hooks.beforeEach(() => {
        container = $('<div />').appendTo('body');
    });
    hooks.afterEach(() => {
        container.remove();
    });

    QUnit.test('summary template', (assert) => {
        const widget = new BS5CronWidget(create_edit_elem().appendTo(container), 'edit');
        const article = $('article.card.crontab_summary', widget.root);
        assert.strictEqual($('.card-body h5.card-title', article).text(), 'Summary');
        assert.strictEqual($('.card-body p.summary', article).length, 1);
    });

    QUnit.test('nothing selected', (assert) => {
        const widget = new BS5CronWidget(create_edit_elem().appendTo(container), 'edit');
        assert.strictEqual(widget.summarize(), '<div>No times selected</div>');
    });

    QUnit.test('values selected', (assert) => {
        const elem = create_edit_elem(
            { minute: '1,2,3,5', hour: '*', month: '1,2', dow: '0,6', year: '2020' },
            'data-start_year="2020" data-end_year="2021"',
        ).appendTo(container);
        const widget = new BS5CronWidget(elem, 'edit');
        const rows = $('.crontab_summary .summary > div', widget.root);
        assert.deepEqual(
            rows.map((_i, row) => `${$('h6', row).text()}|${$('span', row).text()}`).get(),
            [
                'Minutes: |1-3, 5',
                'Hours: |Every hour',
                'Days of month: |No day of month selected',
                'Month: |January-February',
                'Days of week: |Sunday, Saturday',
                'Years: |2020',
            ],
        );
        assert.deepEqual(rows.map((_i, row) => $(row).hasClass('opacity-25')).get(), [
            false,
            false,
            true,
            false,
            false,
            false,
        ]);
    });

    QUnit.test('edit buttons', (assert) => {
        const widget = new BS5CronWidget(create_edit_elem().appendTo(container), 'edit');
        const minute = $('.cron-value.minute button.edit', widget.root);
        const hour = $('.cron-value.hour button.edit', widget.root);

        minute.trigger('click');
        assert.ok(minute.hasClass('active'));
        assert.ok($('button.select_all', widget.edit_area).is('.btn.btn-outline-primary'));
        assert.ok(
            $('.editcontainer button', widget.edit_area).first().is('.btn.btn-outline-secondary'),
        );

        hour.trigger('click');
        assert.notOk(minute.hasClass('active'));
        assert.ok(hour.hasClass('active'));

        hour.trigger('focus');
        hour.trigger('click');
        assert.notOk(hour.hasClass('active'));
        assert.notStrictEqual(document.activeElement, hour[0]);
    });
});
