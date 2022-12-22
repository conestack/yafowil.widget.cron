import $ from 'jquery';

import {CronWidget} from './widget.js';
import {register_array_subscribers} from './widget.js';

export * from './i18n.js';
export * from './widget.js';

$(function() {
    if (window.ts !== undefined) {
        ts.ajax.register(CronWidget.initialize, true);
    } else if (window.bdajax !== undefined) {
        bdajax.register(CronWidget.initialize, true);
    } else {
        CronWidget.initialize();
    }
    register_array_subscribers();
});
