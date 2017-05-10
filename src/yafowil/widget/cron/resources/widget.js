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

            i18n: {
                en: {
                    select_minutes: 'Select Minutes',
                    select_hours: 'Select Hours',
                    select_dom: 'Select Day of Month',
                    select_month: 'Select Month',
                    select_dow: 'Select Day of Week',
                    select_year: 'Select Year',
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
                    summary: 'Summary',
                    no_minutes_selected: 'No minutes selected',
                    selected_minutes: 'Minutes: ',
                    all_minutes_selected: 'Every minute',
                    no_hours_selected: 'No hour selected',
                    selected_hours: 'Hours: ',
                    all_hours_selected: 'Every hour',
                    no_dom_selected: 'No day of month selected',
                    selected_dom: 'Days of month: ',
                    all_dom_selected: 'Every day of month',
                    no_month_selected: 'No month selected',
                    selected_month: 'Month: ',
                    all_month_selected: 'Every month',
                    no_dow_selected: 'No day of week selected',
                    selected_dow: 'Days of week: ',
                    all_dow_selected: 'Every day of week',
                    no_year_selected: 'No year selected',
                    selected_years: 'Years: ',
                    all_years_selected: 'Every year'
                },
                de: {
                    select_minutes: 'Minuten auswählen',
                    select_hours: 'Stunden auswählen',
                    select_dom: 'Monatstage auswählen',
                    select_month: 'Monate auswählen',
                    select_dow: 'Wochentage auswählen',
                    select_year: 'Jahre auswählen',
                    monthmap: {
                        1: 'Jänner',
                        2: 'Feber',
                        3: 'März',
                        4: 'April',
                        5: 'Mai',
                        6: 'Juni',
                        7: 'Juli',
                        8: 'August',
                        9: 'September',
                        10: 'Oktober',
                        11: 'November',
                        12: 'Dezember'
                    },
                    dowmap: {
                        1: 'Montag',
                        2: 'Dienstag',
                        3: 'Mittwoch',
                        4: 'Donnerstag',
                        5: 'Freitag',
                        6: 'Samstag',
                        0: 'Sonntag'
                    },
                    summary: 'Zusammenfassung',
                    no_minutes_selected: 'Keine Minuten ausgewählt',
                    selected_minutes: 'Minuten: ',
                    all_minutes_selected: 'Jede Minute',
                    no_hours_selected: 'Keine Stunden ausgewählt',
                    selected_hours: 'Stunden: ',
                    all_hours_selected: 'Jede Stunde',
                    no_dom_selected: 'Keine Monatstage ausgewählt',
                    selected_dom: 'Monatstage: ',
                    all_dom_selected: 'Alle Monatstage',
                    no_month_selected: 'Keine Monate ausgewählt',
                    selected_month: 'Monate: ',
                    all_month_selected: 'Jedes Monat',
                    no_dow_selected: 'Keine Wochentage ausgewählt',
                    selected_dow: 'Wochentage: ',
                    all_dow_selected: 'Jeder Wochentag',
                    no_year_selected: 'Kein Jahr ausgewählt',
                    selected_years: 'Jahre: ',
                    all_years_selected: 'Jedes Jahr'
                }
            },

            // read lang from widget DOM wrapper data attribute
            lang: 'de',
            // read start_year from widget DOM wrapper data attribute
            start_year: new Date().getFullYear(),
            // read end_year from widget DOM wrapper data attribute
            end_year: new Date().getFullYear() + 9,
            instant: false,

            maxlengths: function () {
                return {
                    minute: 60,
                    hour: 24,
                    dom: 31,
                    month: 12,
                    dow: 7,
                    year: this.end_year - this.start_year + 1
                };
            },

            translate: function(msg) {
                var that = yafowil.cron;
                return that.i18n[that.lang][msg];
            },

            monthmap: function() {
                var that = yafowil.cron;
                return that.i18n[that.lang].monthmap;
            },

            dowmap: function() {
                var that = yafowil.cron;
                return that.i18n[that.lang].dowmap;
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

            binder: function (context) {
                var cron = yafowil.cron;
                var editarea = $('.crontab.widget .editarea', context);
                editarea.on('mousedown touchstart', function (evt) {
                    cron.instant = true;
                });
                $(document).on('mouseup touchend', function (evt) {
                    cron.instant = false;
                });
                $('.crontab.widget button.edit',
                  context).on('click', function (evt) {
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
                        header.text(cron.translate('select_minutes'));
                        for (cnt=0; cnt <= 59; cnt++) {
                            content.append(cron.valuebutton(cnt, cnt, mode));
                        }
                    } else if (mode === 'hour') {
                        header.text(cron.translate('select_hours'));
                        for (cnt=1; cnt <= 24; cnt++) {
                            // "0" should be rendered as last element.
                            var hour = cnt < 24 ? cnt : 0;
                            content.append(cron.valuebutton(hour, hour, mode));
                        }
                    } else if (mode === 'dom') {
                        header.text(cron.translate('select_dom'));
                        for (cnt=1; cnt <= 31; cnt++) {
                            content.append(cron.valuebutton(cnt, cnt, mode));
                        }
                    } else if (mode === 'month') {
                        header.text(cron.translate('select_month'));
                        var monthmap = cron.monthmap();
                        for (cnt=1; cnt <= 12; cnt++) {
                            content.append(cron.valuebutton(
                                cnt, monthmap[cnt], mode
                            ));
                        }
                    } else if (mode === 'dow') {
                        header.text(cron.translate('select_dow'));
                        var dowmap = cron.dowmap();
                        for (cnt=1; cnt <= 7; cnt++) {
                            // "0" should be rendered as last element.
                            var dow = cnt < 7 ? cnt : 0;
                            content.append(cron.valuebutton(
                                dow, dowmap[dow], mode
                            ));
                        }
                    } else if (mode === 'year') {
                        header.text(cron.translate('select_year'));
                        for (cnt=cron.start_year; cnt <= cron.end_year; cnt++) {
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
                        '<strong>' + cron.translate('summary') + '</strong>' +
                        '<p class="summary"></p>' +
                    '</article>';
                $('.crontab.widget', context).each(function () {
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
                $('.display-crontab.widget', context).each(function () {
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
                            start = yafowil.cron.start_year;
                            end = yafowil.cron.end_year;
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
                    var groups = new Array(),
                        group = new Array(),
                        idx,
                        nidx;
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
                    var ret = '',
                        idx,
                        group;
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

                format_part: function(value_name, no_values_selected,
                                      values_selected, all_values_selected,
                                      value_map) {
                    var value = this.value[value_name],
                        value_len = value.length,
                        max_len = yafowil.cron.maxlengths()[value_name],
                        translate = yafowil.cron.translate,
                        ret;
                    if (value_len === 0) {
                        ret = translate(no_values_selected);
                    } else if (value_len < max_len) {
                        ret = translate(values_selected) + this.format_groups(
                            this.group_value(value),
                            value_map
                        );
                    } else {
                        ret = translate(all_values_selected);
                    }
                    return ret;
                },

                summarize: function () {
                    return [
                        this.format_part(
                            'minute', 'no_minutes_selected',
                            'selected_minutes','all_minutes_selected'
                        ),
                        this.format_part(
                            'hour', 'no_hours_selected',
                            'selected_hours', 'all_hours_selected'
                        ),
                        this.format_part(
                            'dom', 'no_dom_selected',
                            'selected_dom', 'all_dom_selected',
                        ),
                        this.format_part(
                            'month', 'no_month_selected',
                            'selected_month', 'all_month_selected',
                            yafowil.cron.monthmap()
                        ),
                        this.format_part(
                            'dow', 'no_dow_selected',
                            'selected_dow', 'all_dow_selected',
                            yafowil.cron.dowmap()
                        ),
                        this.format_part(
                            'year', 'no_year_selected',
                            'selected_years', 'all_years_selected'
                        )
                    ].join('<br/>');
                }
            }
        }
    });

})(jQuery, yafowil);
