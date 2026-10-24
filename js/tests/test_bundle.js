import $ from 'jquery';
import * as bs5_widget from '../src/bootstrap5/widget.js';
import { i18n } from '../src/default/i18n.js';
import * as default_widget from '../src/default/widget.js';

/**
 * Import a bundle and capture its DOM ready callback instead of letting
 * jQuery run it once, so every registration branch can be exercised.
 */
async function import_bundle(load) {
    const orig_ready = $.fn.ready;
    let on_ready;
    $.fn.ready = function (fn) {
        on_ready = fn;
        return this;
    };
    try {
        const bundle = await load();
        return { bundle, on_ready };
    } finally {
        $.fn.ready = orig_ready;
    }
}

const variants = [
    ['default', () => import('../src/default/bundle.js'), default_widget],
    ['bootstrap5', () => import('../src/bootstrap5/bundle.js'), bs5_widget],
];

for (const [name, load, widget_module] of variants) {
    QUnit.module(`${name} bundle`, (hooks) => {
        let bundle;
        let on_ready;
        let array_events;

        hooks.before(async () => {
            ({ bundle, on_ready } = await import_bundle(load));
        });
        hooks.beforeEach(() => {
            array_events = [];
            window.yafowil_array = {
                on_array_event: (evt_name) => {
                    array_events.push(evt_name);
                },
                inside_template: () => false,
            };
        });
        hooks.afterEach(() => {
            delete window.ts;
            delete window.bdajax;
            delete window.yafowil_array;
        });

        QUnit.test('exports', (assert) => {
            assert.deepEqual(Object.keys(bundle).sort(), [
                'CronWidget',
                'cron_on_array_add',
                'i18n',
                'register_array_subscribers',
            ]);
            assert.strictEqual(bundle.i18n, i18n);
            assert.strictEqual(bundle.CronWidget, widget_module.CronWidget);
            assert.strictEqual(bundle.cron_on_array_add, widget_module.cron_on_array_add);
            assert.strictEqual(
                bundle.register_array_subscribers,
                widget_module.register_array_subscribers,
            );
        });

        QUnit.test('registers with treibstoff', (assert) => {
            const registered = [];
            window.ts = {
                ajax: {
                    register: (func, instant) => {
                        registered.push([func, instant]);
                    },
                },
            };
            on_ready();
            assert.deepEqual(registered, [[bundle.CronWidget.initialize, true]]);
            assert.deepEqual(array_events, ['on_add']);
        });

        QUnit.test('registers with bdajax', (assert) => {
            const registered = [];
            window.bdajax = {
                register: (func, instant) => {
                    registered.push([func, instant]);
                },
            };
            on_ready();
            assert.deepEqual(registered, [[bundle.CronWidget.initialize, true]]);
            assert.deepEqual(array_events, ['on_add']);
        });

        QUnit.test('initializes without ajax framework', (assert) => {
            const elem = $(
                '<div class="display-crontab widget"><code>* * * * *</code></div>',
            ).appendTo('body');
            on_ready();
            assert.ok(elem.data('yafowil-cron') instanceof bundle.CronWidget);
            assert.deepEqual(array_events, ['on_add']);
            elem.remove();
        });
    });
}
