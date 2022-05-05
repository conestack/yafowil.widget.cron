var yafowil_cron = (function (exports, $) {
    'use strict';

    let i18n = {
        en: {
            select_minutes: 'Select Minutes',
            select_hours: 'Select Hours',
            select_dom: 'Select Day of Month',
            select_month: 'Select Month',
            select_dow: 'Select Day of Week',
            select_year: 'Select Year',
            select_all: 'Select All',
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
            select_all: 'Alle auswählen',
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
    };

    class CronWidget {
        static initialize(context) {
            $('.crontab.widget', context).each(function () {
                new CronWidget($(this), 'edit');
            });
            $('.display-crontab.widget', context).each(function () {
                new CronWidget($(this), 'display');
            });
        }
        constructor(root, mode) {
            this.root = root;
            this.mode = mode;
            let lang = root.data('lang');
            this.lang = lang ? lang : 'en';
            let start_year = root.data('start_year');
            this.start_year = start_year ? start_year : new Date().getFullYear();
            let end_year = root.data('end_year');
            this.end_year = end_year ? end_year : new Date().getFullYear() + 9;
            this.pressed = false;
            this.value = {
                minute: [],
                hour: [],
                dom: [],
                month: [],
                dow: [],
                year: []
            };
            let summary_container_template =
                '<article class="crontab_summary">' +
                    '<strong>' + this.translate('summary') + '</strong>' +
                    '<p class="summary"></p>' +
                '</article>';
            if (mode === 'display') {
                this.parse($('code', root).text());
                root.append($(summary_container_template));
                this.update_summary();
                return;
            }
            let that = this;
            $('input[type="hidden"]', root).each(function () {
                that.parse_from_input($(this));
            });
            root.append($(summary_container_template));
            this.update_summary();
            this.edit_area = $('.editarea', root);
            this.edit_area.on('mousedown touchstart', function (evt) {
                that.pressed = true;
            });
            $(document).on('mouseup touchend', function (evt) {
                that.pressed = false;
            });
            $('button.edit', root).on('click', function(evt) {
                evt.preventDefault();
                that.show_edit_section($(this));
            });
        }
        show_edit_section(trigger) {
            let cnt,
                edit_area = this.edit_area,
                container = this.get_edit_section(trigger),
                mode = this.get_mode(container);
            if (edit_area.is(':visible') && edit_area.hasClass(mode)) {
                container.removeClass('active');
                edit_area.attr('class', 'editarea').html('').hide();
                return;
            }
            let header = $('<h4 />'),
                content = $('<div class="editcontainer" />');
            if (mode === 'minute') {
                header.text(this.translate('select_minutes'));
                for (cnt=0; cnt <= 59; cnt++) {
                    content.append(this.make_button(cnt, cnt, mode));
                }
            } else if (mode === 'hour') {
                header.text(this.translate('select_hours'));
                let hour;
                for (cnt=1; cnt <= 24; cnt++) {
                    hour = cnt < 24 ? cnt : 0;
                    content.append(this.make_button(hour, hour, mode));
                }
            } else if (mode === 'dom') {
                header.text(this.translate('select_dom'));
                for (cnt=1; cnt <= 31; cnt++) {
                    content.append(this.make_button(cnt, cnt, mode));
                }
            } else if (mode === 'month') {
                header.text(this.translate('select_month'));
                let monthmap = this.monthmap();
                for (cnt=1; cnt <= 12; cnt++) {
                    content.append(this.make_button(cnt, monthmap[cnt], mode));
                }
            } else if (mode === 'dow') {
                header.text(this.translate('select_dow'));
                let dowmap = this.dowmap(),
                    dow;
                for (cnt=1; cnt <= 7; cnt++) {
                    dow = cnt < 7 ? cnt : 0;
                    content.append(this.make_button(dow, dowmap[dow], mode));
                }
            } else if (mode === 'year') {
                header.text(this.translate('select_year'));
                for (cnt=this.start_year; cnt <= this.end_year; cnt++) {
                    content.append(this.make_button(cnt, cnt, mode));
                }
            }
            header = header.add(this.make_button_all(mode));
            content = header.add(content);
            edit_area.html(content).attr('class', 'editarea ' + mode).show();
            container.addClass('active');
        }
        make_button_all(mode) {
            let button = $(
                '<button class="btn btn-sm select_all">' +
                    this.translate('select_all') +
                '</button>'
            );
            if (this.value[mode].length >= this.maxlengths()[mode]) {
                button.addClass('active');
            }
            let that = this;
            button.on('click', function(evt) {
                evt.preventDefault();
                let $this = $(this);
                if ($this.hasClass('active')) {
                    $this.parent().find('.editcontainer button').each(function () {
                        $(this).removeClass('active');
                    });
                    $this.removeClass('active');
                    that.parse_part('', mode);
                } else {
                    $this.parent().find('.editcontainer button').each(function () {
                        $(this).removeClass('active').addClass('active');
                    });
                    $this.removeClass('active').addClass('active');
                    that.parse_part('*', mode);
                }
                that.serialize_to_input();
                that.update_summary();
            });
            return button;
        }
        make_button(value, name, mode) {
            let button = $(
                '<button class="btn btn-sm" name=' + value + '>' +
                    name +
                '</button>'
            );
            if (this.has(value, mode)) {
                button.addClass('active');
            }
            let that = this;
            let handler = function(evt) {
                evt.preventDefault();
                let elem = $(this);
                let container = that.edit_area;
                if (elem.hasClass('active')) {
                    that.remove(elem.attr('name'), that.get_mode(container));
                    that.serialize_to_input();
                    elem.removeClass('active');
                } else {
                    that.add(elem.attr('name'), that.get_mode(container));
                    that.serialize_to_input();
                    elem.addClass('active');
                }
                that.update_summary();
            };
            button.on('click', function (evt) {
                evt.preventDefault();
            }).on('mousedown touchstart',
                handler
            ).on('mouseenter touchenter', function (evt) {
                if (evt.shiftKey === false && that.pressed === false) {
                    return;
                }
                handler.bind(this)(evt);
            }).on('mouseup touchend', function (evt) {
                that.pressed = false;
            });
            return button;
        }
        maxlengths() {
            return {
                minute: 60,
                hour: 24,
                dom: 31,
                month: 12,
                dow: 7,
                year: this.end_year - this.start_year + 1
            };
        }
        translate(msg) {
            return i18n[this.lang][msg];
        }
        monthmap() {
            return i18n[this.lang].monthmap;
        }
        dowmap() {
            return i18n[this.lang].dowmap;
        }
        get_edit_section(elem) {
            return elem.closest('.cron-value');
        }
        get_mode(elem) {
            let klass = elem.attr('class');
            if (klass.indexOf('minute') !== -1) {
                return 'minute';
            } else if (klass.indexOf('hour') !== -1) {
                return 'hour';
            } else if (klass.indexOf('dom') !== -1) {
                return 'dom';
            } else if (klass.indexOf('month') !== -1) {
                return 'month';
            } else if (klass.indexOf('dow') !== -1) {
                return 'dow';
            } else if (klass.indexOf('year') !== -1) {
                return 'year';
            }
        }
        add(value, mode) {
            this.value[mode].push(value.toString());
        }
        remove(value, mode) {
            let index = this.value[mode].indexOf(value.toString());
            if (index > -1) {
                this.value[mode].splice(index, 1);
            }
        }
        has(value, mode) {
            return this.value[mode].indexOf(value.toString()) > -1;
        }
        parse(value) {
            value = value.split(' ');
            if (value.length === 5) {
                value.push('*');
            }
            this.parse_part(value[0].trim(), 'minute');
            this.parse_part(value[1].trim(), 'hour');
            this.parse_part(value[2].trim(), 'dom');
            this.parse_part(value[3].trim(), 'month');
            this.parse_part(value[4].trim(), 'dow');
            this.parse_part(value[5].trim(), 'year');
        }
        parse_part(value, mode) {
            if (typeof value === 'string') {
                value = value.split(',');
            }
            this.value[mode] = [];
            let cnt;
            if (value[0] === '*') {
                let start, end;
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
                    start = this.start_year;
                    end = this.end_year;
                }
                for (cnt=start; cnt < end + 1; cnt++) {
                    this.value[mode].push(cnt.toString());
                }
            } else {
                let val;
                for (cnt=0; cnt < value.length; cnt++) {
                    val = value[cnt];
                    if (val === '') {
                        continue;
                    }
                    val = parseInt(val, 10).toString();
                    this.value[mode].push(val);
                }
            }
        }
        serialize(mode) {
            let vals = this.value[mode];
            vals.sort(function(a, b) {
                return parseInt(a, 10) - parseInt(b, 10);
            });
            let maxlength = this.maxlengths()[mode];
            if (vals.length >= maxlength) {
                return '*';
            } else {
                return vals.join(',');
            }
        }
        parse_from_input(input) {
            this.parse_part(
                input.val(),
                this.get_mode(this.get_edit_section(input))
            );
        }
        serialize_to_input() {
            let container = this.edit_area,
                mode = this.get_mode(container),
                input = $('.cron-value.' + mode + ' input', this.root);
            input.val(this.serialize(mode));
        }
        group_value(arr) {
            let groups = [],
                group = [],
                idx,
                nidx;
            for (idx=0; idx < arr.length; idx++) {
                nidx = idx + 1;
                if (idx === arr.length - 1) {
                    group.push(arr[idx]);
                    groups.push(group);
                } else if (parseInt(arr[idx]) + 1 === parseInt(arr[nidx])) {
                    group.push(arr[idx]);
                } else {
                    group.push(arr[idx]);
                    groups.push(group);
                    group = [];
                }
            }
            return groups;
        }
        update_summary() {
            $('.crontab_summary .summary', this.root).html(this.summarize());
        }
        summarize() {
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
                    'selected_dom', 'all_dom_selected'
                ),
                this.format_part(
                    'month', 'no_month_selected',
                    'selected_month', 'all_month_selected',
                    this.monthmap()
                ),
                this.format_part(
                    'dow', 'no_dow_selected',
                    'selected_dow', 'all_dow_selected',
                    this.dowmap()
                ),
                this.format_part(
                    'year', 'no_year_selected',
                    'selected_years', 'all_years_selected'
                )
            ].join('<br/>');
        }
        format_part(value_name, no_values_selected, values_selected,
                    all_values_selected, value_map) {
            let value = this.value[value_name],
                value_len = value.length,
                max_len = this.maxlengths()[value_name],
                ret;
            if (value_len === 0) {
                ret = this.translate(no_values_selected);
            } else if (value_len < max_len) {
                ret = this.translate(values_selected) + this.format_groups(
                    this.group_value(value),
                    value_map
                );
            } else {
                ret = this.translate(all_values_selected);
            }
            return ret;
        }
        format_groups(groups, value_map) {
            let ret = '',
                idx,
                group;
            for (idx=0; idx < groups.length; idx++) {
                group = groups[idx];
                if (group.length === 1) {
                    ret += this.display_value(group[0], value_map);
                } else {
                    ret += this.display_value(group[0], value_map);
                    ret += '-';
                    ret += this.display_value(
                        group[group.length - 1],
                        value_map
                    );
                }
                if (idx !== groups.length - 1) {
                    ret += ', ';
                }
            }
            return ret;
        }
        display_value(value, value_map) {
            if (value_map) {
                return value_map[value];
            }
            return value;
        }
    }

    $(function() {
        if (window.ts !== undefined) {
            ts.ajax.register(CronWidget.initialize, true);
        } else {
            CronWidget.initialize();
        }
    });

    exports.CronWidget = CronWidget;
    exports.i18n = i18n;

    Object.defineProperty(exports, '__esModule', { value: true });


    if (window.yafowil === undefined) {
        window.yafowil = {};
    }
    window.yafowil.cron = exports;


    return exports;

})({}, jQuery);
