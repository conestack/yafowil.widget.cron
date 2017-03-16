/* jslint browser: true */
/* global jQuery, yafowil */
/*
 * yafowil cron widget
 *
 * Optional: bdajax
 */

if (window.yafowil === undefined) {
    window.yafowil = {};
}

(function($, yafowil) {
    "use strict";

    $(document).ready(function() {
        // initial binding
        yafowil.cron.binder();

        // add after ajax binding if bdajax present
        if (window.bdajax !== undefined) {
            $.extend(window.bdajax.binders, {
                cron_binder: yafowil.cron.binder
            });
        }

        // add binder to yafowil.widget.array hooks
        if (yafowil.array !== undefined) {
            $.extend(yafowil.array.hooks.add, {
                cron: yafowil.cron.binder
            });
        }
    });

    $.extend(yafowil, {

        cron: {

            max_year: 2099,
            current_year: new Date().getFullYear(),

            monthmap: {
                1: 'January',
                2: 'February',
                3: 'March',
                4: 'April',
                5: 'May',
                6: 'June',
                7: 'July',
                8: 'August',
                9: 'September',
                10: 'October',
                11: 'November',
                12: 'December'
            },

            dowmap: {
                1: 'Monday',
                2: 'Tuesday',
                3: 'Wednesday',
                4: 'Thursday',
                5: 'Friday',
                6: 'Saturday',
                0: 'Sunday'
            },

            getContainer: function ($el) {
                return $el.closest('label');
            },
            getMode: function ($el) {
                var klass = yafowil.cron.getContainer($el).attr('class');
                if (klass.indexOf('minute') != -1) {
                    return 'minute';
                } else if (klass.indexOf('hour') != -1) {
                    return 'hour';
                } else if (klass.indexOf('dow') != -1) {
                    return 'dow';
                } else if (klass.indexOf('dom') != -1) {
                    return 'dom';
                } else if (klass.indexOf('month') != -1) {
                    return 'month';
                } else if (klass.indexOf('year') != -1) {
                    return 'year';
                }
            },
            getEditarea: function ($el) {
                return $('.editarea', yafowil.cron.getContainer($el));
            },

            binder: function (context) {
                $('.crontab.widget button.edit').on('click', function (event) {
                    event.preventDefault();
                    var cnt;
                    var $el = $(this);
                    var $container = yafowil.cron.getContainer($el);
                    var mode = yafowil.cron.getMode($el);
                    var $editarea = yafowil.cron.getEditarea($el);

                    if ($editarea.is(':visible')) {
                        $container.removeClass('active');
                        $editarea.hide();
                        return;
                    }

                    yafowil.cron.value.parseFromInput($el);

                    var header = $('<h2 />');
                    var content = $('<div class="editcontainer" />');

                    if (mode === 'minute') {
                        header.text('Select Minutes');
                        for (cnt=0; cnt <= 59; cnt++) {
                            content.append(yafowil.cron.valuebutton(cnt, cnt, mode));
                        }
                    } else if (mode === 'hour') {
                        header.text('Select Hours');
                        for (cnt=1; cnt <= 24; cnt++) {
                            var hour = cnt < 24 ? cnt : 0;  // "0" should be rendered as last element.
                            content.append(yafowil.cron.valuebutton(hour, hour, mode));
                        }
                    } else if (mode === 'dow') {
                        header.text('Select Day of Week');
                        for (cnt=1; cnt <= 7; cnt++) {
                            var dow = cnt < 7 ? cnt : 0;  // "0" should be rendered as last element.
                            content.append(yafowil.cron.valuebutton(
                                dow,
                                yafowil.cron.dowmap[dow],
                                mode
                            ));
                        }
                    } else if (mode === 'dom') {
                        header.text('Select Day of Month');
                        for (cnt=1; cnt <= 31; cnt++) {
                            content.append(yafowil.cron.valuebutton(cnt, cnt, mode));
                        }
                    } else if (mode === 'month') {
                        header.text('Select Month');
                        for (cnt=1; cnt <= 12; cnt++) {
                            content.append(yafowil.cron.valuebutton(
                                cnt,
                                yafowil.cron.monthmap[cnt],
                                mode
                            ));
                        }
                    } else if (mode === 'year') {
                        header.text('Select Year');
                        for (cnt=yafowil.cron.current_year; cnt <= yafowil.cron.max_year; cnt++) {
                            content.append(yafowil.cron.valuebutton(cnt, cnt, mode));
                        }
                    }

                    content = header.add(content);
                    $editarea.html(content);
                    $editarea.show();
                    $container.addClass('active');
                });
            },

            valuebutton: function (value, name, mode) {
                var button = $('<button class="btn btn-sm" name=' + value + '>' + name + '</button>');
                if (yafowil.cron.value.has(value, mode)) {
                    button.addClass('active');
                }
                button.on('click', yafowil.cron.valuebutton_eventhandler);
                button.on('mouseenter', function (event) {
                    // support multiple selection by holding down the "shift" key.
                    if (event.shiftKey === false) {
                        return;
                    }
                    yafowil.cron.valuebutton_eventhandler.bind(this)(event);
                });
                return button;
            },

            valuebutton_eventhandler: function (event) {
                event.preventDefault();
                var $el = $(this);
                if ($el.hasClass('active')) {
                    yafowil.cron.value.remove($(this).attr('name'), yafowil.cron.getMode($el));
                    yafowil.cron.value.serializeToInput($el);
                    $el.removeClass('active');
                } else {
                    yafowil.cron.value.add($(this).attr('name'), yafowil.cron.getMode($el));
                    yafowil.cron.value.serializeToInput($el);
                    $el.addClass('active');
                }
            },

            value: {
                value: {
                    'minute': {},
                    'hour': {},
                    'dow': {},
                    'dom': {},
                    'month': {},
                    'year': {}
                },
                add: function (value, mode) {
                    this.value[mode][value.toString()] = true;
                },
                remove: function (value, mode) {
                    delete this.value[mode][value.toString()];
                },
                has: function (value, mode) {
                    return this.value[mode][value.toString()] === true;
                },
                parse: function (value, mode) {
                    if (typeof value === 'string') {
                        value = value.split(',');
                    }
                    this.value[mode] = {};
                    var cnt;
                    if (value[0] === '*') {
                        var start, end;
                        if (mode === 'minute') {
                            start = 0; end = 59;
                        } else if (mode === 'hour') {
                            start = 0; end = 23;
                        } else if (mode === 'dow') {
                            start = 0; end = 6;
                        } else if (mode === 'dom') {
                            start = 1; end = 31;
                        } else if (mode === 'month') {
                            start = 1; end = 12;
                        } else if (mode === 'year') {
                            start = yafowil.cron.current_year;
                            end = yafowil.cron.max_year;
                        }
                        for (cnt=start; cnt<end+1; cnt++) {
                            this.value[mode][cnt] = true;
                        }
                    } else {
                        for (cnt=0; cnt<value.length; cnt++) {
                            var val = value[cnt];
                            if (val === '') {
                                continue;
                            }
                            val = parseInt(val, 10).toString();
                            this.value[mode][val] = true;
                        }
                    }
                },
                serialize: function (mode) {
                    var vals = [];
                    for (var prop in this.value[mode]) {
                        if (this.value[mode].hasOwnProperty(prop)) {
                            vals.push(prop);
                        }
                    }
                    vals.sort(function(a, b) {
                        // int-sort - otherwise it's a lexical sort.
                        return parseInt(a, 10) - parseInt(b, 10);
                    });
                    var maxlength;
                    if (mode === 'minute') {
                        maxlength = 60;
                    } else if (mode === 'hour') {
                        maxlength = 24;
                    } else if (mode === 'dow') {
                        maxlength = 7;
                    } else if (mode === 'dom') {
                        maxlength = 31;
                    } else if (mode === 'month') {
                        maxlength = 12;
                    } else if (mode === 'year') {
                        maxlength = yafowil.cron.max_year - yafowil.cron.current_year + 1;
                    }

                    if (vals.length >= maxlength) {
                        return '*';
                    } else {
                        return vals.join(',');
                    }
                },
                parseFromInput: function ($el) {
                    var $input = $('input', yafowil.cron.getContainer($el));
                    var mode = yafowil.cron.getMode($el);
                    this.parse($input.val(), mode);
                },
                serializeToInput: function ($el) {
                    var $input = $('input', yafowil.cron.getContainer($el));
                    var mode = yafowil.cron.getMode($el);
                    $input.val(this.serialize(mode));
                }
            }
        }
    });

})(jQuery, yafowil);
