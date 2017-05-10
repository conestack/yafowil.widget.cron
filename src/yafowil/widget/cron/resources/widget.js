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
    });

    $.extend(yafowil, {

        cron: {

            // read max_year from widget DOM wrapper data attribute
            max_year: new Date().getFullYear() + 9,
            current_year: new Date().getFullYear(),
            instant: false,

            maxlengths: function () {
                return {
                    minute: 60,
                    hour: 24,
                    dom: 31,
                    month: 12,
                    dow: 7,
                    year: this.max_year - this.current_year + 1
                };
            },

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

            get_container: function ($el) {
                return $el.closest('.cron-value');
            },

            get_editarea: function ($el) {
                return $('.editarea', $el.closest('.crontab.widget'));
            },

            get_mode: function ($el) {
                var klass = $el.attr('class');
                if (klass.indexOf('minute') != -1) {
                    return 'minute';
                } else if (klass.indexOf('hour') != -1) {
                    return 'hour';
                } else if (klass.indexOf('dom') != -1) {
                    return 'dom';
                } else if (klass.indexOf('month') != -1) {
                    return 'month';
                } else if (klass.indexOf('dow') != -1) {
                    return 'dow';
                } else if (klass.indexOf('year') != -1) {
                    return 'year';
                }
            },

            binder: function () {
                var cron = yafowil.cron;
                var editarea = $('.crontab.widget .editarea');
                editarea.on('mousedown touchstart', function (evt) {
                    cron.instant = true;
                });
                $(document).on('mouseup touchend', function (evt) {
                    cron.instant = false;
                });
                $('.crontab.widget button.edit').on('click', function (evt) {
                    evt.preventDefault();
                    var cnt;
                    var $el = $(this);
                    var $container = cron.get_container($el);
                    var mode = cron.get_mode($container);
                    var $editarea = cron.get_editarea($el);
                    if ($editarea.is(':visible') && $editarea.hasClass(mode)) {
                        $container.removeClass('active');
                        $editarea.attr('class', 'editarea').html('').hide();
                        return;
                    }
                    cron.value.parse_from_input($el);
                    var header = $('<h4 />');
                    var content = $('<div class="editcontainer" />');
                    if (mode === 'minute') {
                        header.text('Select Minutes');
                        for (cnt=0; cnt <= 59; cnt++) {
                            content.append(cron.valuebutton(cnt, cnt, mode));
                        }
                    } else if (mode === 'hour') {
                        header.text('Select Hours');
                        for (cnt=1; cnt <= 24; cnt++) {
                            // "0" should be rendered as last element.
                            var hour = cnt < 24 ? cnt : 0;
                            content.append(cron.valuebutton(hour, hour, mode));
                        }
                    } else if (mode === 'dom') {
                        header.text('Select Day of Month');
                        for (cnt=1; cnt <= 31; cnt++) {
                            content.append(cron.valuebutton(cnt, cnt, mode));
                        }
                    } else if (mode === 'month') {
                        header.text('Select Month');
                        for (cnt=1; cnt <= 12; cnt++) {
                            content.append(cron.valuebutton(
                                cnt, cron.monthmap[cnt], mode
                            ));
                        }
                    } else if (mode === 'dow') {
                        header.text('Select Day of Week');
                        for (cnt=1; cnt <= 7; cnt++) {
                            // "0" should be rendered as last element.
                            var dow = cnt < 7 ? cnt : 0;
                            content.append(cron.valuebutton(
                                dow, cron.dowmap[dow], mode
                            ));
                        }
                    } else if (mode === 'year') {
                        header.text('Select Year');
                        for (cnt=cron.current_year; cnt <= cron.max_year; cnt++) {
                            content.append(cron.valuebutton(cnt, cnt, mode));
                        }
                    }
                    content = header.add(content);
                    $editarea.html(content).attr(
                        'class', 'editarea ' + mode
                    ).show();
                    $container.addClass('active');
                });
                var summarycontainer_template =
                    '<article class="crontab_summary">' +
                        '<strong>Summary</strong>' +
                        '<p class="summary"></p>' +
                    '</article>';
                $('.crontab.widget').each(function () {
                    $('input[type="hidden"]', $(this)).each(function () {
                        var $container = cron.get_container($(this));
                        cron.value.parse_part(
                            $(this).val(),
                            cron.get_mode($container)
                        );
                    });
                    $(this).append($(summarycontainer_template));
                    cron.update_summary($(this));
                });
                $('.display-crontab.widget').each(function () {
                    cron.value.parse(
                        $('code', $(this)).text()
                    );
                    $(this).append($(summarycontainer_template));
                    cron.update_summary($(this));
                });
            },

            valuebutton: function (value, name, mode) {
                var cron = yafowil.cron;
                var button = $(
                    '<button class="btn btn-sm" name=' +
                    value + '>' + name + '</button>'
                );
                if (cron.value.has(value, mode)) {
                    button.addClass('active');
                }
                return button.on('click', function (evt) {
                    evt.preventDefault();
                }).on('mousedown touchstart',
                    cron.valuebutton_handler
                ).on('mouseenter touchenter', function (evt) {
                    if (evt.shiftKey === false && cron.instant === false) {
                        return;
                    }
                    cron.valuebutton_handler.bind(this)(evt);
                }).on('mouseup touchend', function (evt) {
                    cron.instant = false;
                });
            },

            valuebutton_handler: function (evt) {
                evt.preventDefault();
                var $el = $(this);
                var $container = $el.closest('.editarea');
                var cron = yafowil.cron;
                if ($el.hasClass('active')) {
                    cron.value.remove(
                        $(this).attr('name'),cron.get_mode($container)
                    );
                    cron.value.serialize_to_input($el);
                    cron.update_summary($el);
                    $el.removeClass('active');
                } else {
                    cron.value.add(
                        $(this).attr('name'), cron.get_mode($container)
                    );
                    cron.value.serialize_to_input($el);
                    cron.update_summary($el);
                    $el.addClass('active');
                }
            },

            update_summary: function ($el) {
                var container = $el.closest('div.widget');
                $('.crontab_summary .summary', container).html(
                    yafowil.cron.value.summarize()
                );
            },

            value: {

                value: {
                    minute: [],
                    hour: [],
                    dom: [],
                    month: [],
                    dow: [],
                    year: []
                },

                add: function (value, mode) {
                    this.value[mode].push(value.toString());
                },

                remove: function (value, mode) {
                    var index = this.value[mode].indexOf(value.toString());
                    if (index > -1) {
                        this.value[mode].splice(index, 1);
                    }
                },

                has: function (value, mode) {
                    return this.value[mode].indexOf(value.toString()) > -1;
                },

                parse: function (value) {
                    value = value.split(' ');
                    if (value.length === 5) {
                        // year is optional
                        value.push('*');
                    }
                    this.parse_part(value[0].trim(), 'minute');
                    this.parse_part(value[1].trim(), 'hour');
                    this.parse_part(value[2].trim(), 'dom');
                    this.parse_part(value[3].trim(), 'month');
                    this.parse_part(value[4].trim(), 'dow');
                    this.parse_part(value[5].trim(), 'year');
                },

                parse_part: function (value, mode) {
                    if (typeof value === 'string') {
                        value = value.split(',');
                    }
                    this.value[mode] = [];
                    var cnt;
                    if (value[0] === '*') {
                        var start, end;
                        if (mode === 'minute') {
                            start = 0; end = 59;
                        } else if (mode === 'hour') {
                            start = 0; end = 23;
                        } else if (mode === 'dom') {
                            start = 1; end = 31;
                        } else if (mode === 'month') {
                            start = 1; end = 12;
                        } else if (mode === 'dow') {
                            start = 0; end = 6;
                        } else if (mode === 'year') {
                            start = yafowil.cron.current_year;
                            end = yafowil.cron.max_year;
                        }
                        for (cnt=start; cnt < end + 1; cnt++) {
                            this.value[mode].push(cnt);
                        }
                    } else {
                        for (cnt=0; cnt < value.length; cnt++) {
                            var val = value[cnt];
                            if (val === '') {
                                continue;
                            }
                            val = parseInt(val, 10).toString();
                            this.value[mode].push(val);
                        }
                    }
                },

                serialize: function (mode) {
                    var vals = this.value[mode];
                    vals.sort(function(a, b) {
                        // int-sort - otherwise it's a lexical sort.
                        return parseInt(a, 10) - parseInt(b, 10);
                    });
                    var maxlength = yafowil.cron.maxlengths()[mode];
                    if (vals.length >= maxlength) {
                        return '*';
                    } else {
                        return vals.join(',');
                    }
                },

                parse_from_input: function ($el) {
                    var $container = yafowil.cron.get_container($el);
                    var $input = $('input', $container);
                    var mode = yafowil.cron.get_mode($container);
                    this.parse_part($input.val(), mode);
                },

                serialize_to_input: function ($el) {
                    var $container = $el.closest('.editarea');
                    var mode = yafowil.cron.get_mode($container);
                    var $input = $(
                        '.cron.value.' + mode + ' input',
                        $container.closest('.yafowil.widget')
                    );
                    $input.val(this.serialize(mode));
                },

                group_value: function(arr) {
                    var groups = new Array();
                    var group = new Array();
                    var idx, nidx;
                    for (idx=0; idx < arr.length; idx++) {
                        nidx = idx + 1;
                        if (idx == arr.length - 1) {
                            group.push(arr[idx]);
                            groups.push(group);
                        } else if (parseInt(arr[idx]) + 1 == parseInt(arr[nidx])) {
                            group.push(arr[idx]);
                        } else {
                            group.push(arr[idx]);
                            groups.push(group);
                            group = new Array();
                        }
                    }
                    return groups;
                },

                display_value: function(value, value_map) {
                    if (value_map) {
                        return value_map[value];
                    }
                    return value;
                },

                format_groups: function(groups, value_map) {
                    var ret = '';
                    var idx, group;
                    for (idx=0; idx < groups.length; idx++) {
                        group = groups[idx];
                        if (group.length == 1) {
                            ret += this.display_value(group[0], value_map);
                        } else {
                            ret += this.display_value(group[0], value_map);
                            ret += '-';
                            ret += this.display_value(
                                group[group.length - 1],
                                value_map
                            );
                        }
                        if (idx != groups.length - 1) {
                            ret += ', ';
                        }
                    }
                    return ret;
                },

                summarize: function () {
                    var maxlengths = yafowil.cron.maxlengths();
                    var value = this.value;
                    var minute_len = value.minute.length,
                        hour_len = value.hour.length,
                        dom_len = value.dom.length,
                        month_len = value.month.length,
                        dow_len = value.dow.length,
                        year_len = value.year.length;
                    var minute, hour, dom, month, dow, year;
                    if (minute_len === 0) {
                        minute = 'No minutes selected';
                    } else if (minute_len < maxlengths.minute) {
                        minute = 'Minutes: ' + this.format_groups(
                            this.group_value(value.minute)
                        );
                    } else {
                        minute = 'Every minute';
                    }
                    if (hour_len === 0) {
                        hour = 'No hour selected';
                    } else if (hour_len < maxlengths.hour) {
                        hour = 'Hours: ' + this.format_groups(
                            this.group_value(value.hour)
                        );
                    } else {
                        hour = 'Every hour';
                    }
                    if (dom_len === 0) {
                        dom = 'No day of month selected';
                    } else if (dom_len < maxlengths.dom) {
                        dom = 'Days of month: ' + this.format_groups(
                            this.group_value(value.dom)
                        );
                    } else {
                        dom = 'Every day of month';
                    }
                    if (month_len === 0) {
                        month = 'No month selected';
                    } else if (month_len < maxlengths.month) {
                        month = 'Month: ' + this.format_groups(
                            this.group_value(value.month),
                            yafowil.cron.monthmap
                        );
                    } else {
                        month = 'Every month';
                    }
                    if (dow_len === 0) {
                        dow = 'No day of week selected';
                    } else if (dow_len < maxlengths.dow) {
                        dow = 'Days of week: ' + this.format_groups(
                            this.group_value(value.dow),
                            yafowil.cron.dowmap
                        );
                    } else {
                        dow = 'Every day of week';
                    }
                    if (year_len === 0) {
                        year = 'No year selected';
                    } else if (year_len < maxlengths.year) {
                        year = 'Years: ' + this.format_groups(
                            this.group_value(value.year)
                        );
                    } else {
                        year = 'Every year';
                    }
                    return [minute, hour, dom, month, dow, year].join('<br/>');
                }
            }
        }
    });

})(jQuery, yafowil);
