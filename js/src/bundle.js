import $ from 'jquery';

import {CronWidget} from './widget.js';

export * from './i18n.js';
export * from './widget.js';

$(function() {
    if (window.ts !== undefined) {
        ts.ajax.register(CronWidget.initialize, true);
    } else {
        CronWidget.initialize();
    }
});
