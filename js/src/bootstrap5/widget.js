import $ from 'jquery';
import {i18n} from '../default/i18n.js';

export class CronWidget {

    /**
     * Initializes each widget in the given DOM context.
     * 
     * @param {HTMLElement} context - DOM context for initialization.
     */
    static initialize(context) {
        $('.crontab.widget', context).each(function () {
            let elem = $(this);
            if (window.yafowil_array !== undefined &&
                window.yafowil_array.inside_template(elem)) {
                return;
            }
            new CronWidget(elem, 'edit');
        });
        $('.display-crontab.widget', context).each(function () {
            let elem = $(this);
            if (window.yafowil_array !== undefined &&
                window.yafowil_array.inside_template(elem)) {
                return;
            }
            new CronWidget(elem, 'display');
        });
    }

    /**
     * @param {jQuery} root - The root element for this widget.
     * @param {string} mode - The mode of the widget ('edit' or 'display').
     */
    constructor(root, mode) {
        root.data('yafowil-cron', this);
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
            '<article class="card crontab_summary">' +
                '<div class="card-body">' +
                    '<h5 class="card-title">' + this.translate('summary') + '</h5>' +
                    '<p class="summary"></p>' + 
                '</div>' +
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
        this.editarea_cls = this.edit_area.attr('class');

        this.edit_area.on('mousedown touchstart', function (evt) {
            that.pressed = true;
        });

        $(document).on('mouseup touchend', function (evt) {
            that.pressed = false;
        });

        $('button.edit', root).on('click', function(evt) {
            evt.preventDefault();
            $('button.edit', root).removeClass('active');
            that.show_edit_section($(this));
        });
    }

    /**
     * Displays the edit section corresponding to the clicked button.
     * 
     * @param {jQuery} trigger - The button that triggered this action.
     */
    show_edit_section(trigger) {
        trigger.addClass('active');
        let cnt,
            edit_area = this.edit_area,
            container = this.get_edit_section(trigger),
            mode = this.get_mode(container);
        if (edit_area.is(':visible') && edit_area.hasClass(mode)) {
            container.removeClass('active');
            trigger.removeClass('active');
            trigger.blur();
            edit_area.attr('class', this.editarea_cls).html('').hide();
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
                // "0" should be rendered as last element.
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
                // "0" should be rendered as last element.
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
        edit_area.html(content).attr('class', this.editarea_cls + ' ' + mode).show();
        container.addClass('active');
    }

    /**
     * Creates a button that selects or clears all options for a given mode.
     * 
     * @param {string} mode - The mode for which to create the button.
     * @returns {jQuery} - The button element.
     */
    make_button_all(mode) {
        let button = $(
            '<button class="btn btn-outline-primary select_all">' +
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
                // clear
                $this.parent().find('.editcontainer button').each(function () {
                    $(this).removeClass('active');
                });
                $this.removeClass('active');
                that.parse_part('', mode);
            } else {
                // select all
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

    /**
     * Creates a button for a specific value.
     * 
     * @param {string} value - The value for the button.
     * @param {string} name - The text to display on the button.
     * @param {string} mode - The mode for which the button is created.
     * @returns {jQuery} - The button element.
     */
    make_button(value, name, mode) {
        let button = $(
            '<button class="btn btn-outline-secondary" name=' + value + '>' +
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

    /**
     * Returns the maximum number of selectable values for each mode.
     * 
     * @returns {Object} - An object containing maximum values for each mode.
     */
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

    /**
     * Translates a message key into the corresponding language string.
     * 
     * @param {string} msg - The message key to translate.
     * @returns {string} - The translated string.
     */
    translate(msg) {
        return i18n[this.lang][msg];
    }


    /**
     * Gets the month mapping for the current language.
     * 
     * @returns {Object} - An object mapping month numbers to their names
     *                     in the current language.
     */
    monthmap() {
        return i18n[this.lang].monthmap;
    }

    /**
     * Gets the day of the week mapping for the current language.
     * 
     * @returns {Object} - An object mapping day of week numbers to their names
     *                     in the current language.
     */
    dowmap() {
        return i18n[this.lang].dowmap;
    }

    /**
     * Gets the closest edit section for the specified element.
     * 
     * @param {jQuery} elem - The jQuery element from which to find
     *                        the closest section.
     * @returns {jQuery} - The closest section element.
     */
    get_edit_section(elem) {
        return elem.closest('.cron-value');
    }

    /**
     * Acquires the mode of the specified edit section element.
     * 
     * @param {jQuery} elem - The jQuery element to check the mode for.
     * @returns {string} - The mode of the element.
     */
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

    /**
     * Adds a value to the specified mode.
     * 
     * @param {string} value - The value to add.
     * @param {string} mode - The mode to add the value to.
     */
    add(value, mode) {
        this.value[mode].push(value.toString());
    }

    /**
     * Removes a value from the specified mode.
     * 
     * @param {string} value - The value to remove.
     * @param {string} mode - The mode to remove the value from.
     */
    remove(value, mode) {
        let index = this.value[mode].indexOf(value.toString());
        if (index > -1) {
            this.value[mode].splice(index, 1);
        }
    }

    /**
     * Checks if a value exists in the specified mode.
     * 
     * @param {string} value - The value to check for.
     * @param {string} mode - The mode to check against.
     * @returns {boolean} - True if the value exists, otherwise false.
     */
    has(value, mode) {
        return this.value[mode].indexOf(value.toString()) > -1;
    }

    /**
     * Parses a cron expression string and updates the widget values.
     * 
     * @param {string} value - The cron expression to parse.
     */
    parse(value) {
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
    }

    /**
     * Parses a specific part of the cron expression and updates the
     * corresponding mode values.
     * 
     * @param {string} value - The value to parse for the mode.
     * @param {string} mode - The mode to update with the parsed values.
     */
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

    /**
     * Serializes the values of a specified mode into a cron expression format.
     * 
     * @param {string} mode - The mode to serialize.
     * @returns {string} - The serialized part for the mode.
     */
    serialize(mode) {
        let vals = this.value[mode];
        vals.sort(function(a, b) {
            // int-sort - otherwise it's a lexical sort.
            return parseInt(a, 10) - parseInt(b, 10);
        });
        let maxlength = this.maxlengths()[mode];
        if (vals.length >= maxlength) {
            return '*';
        } else {
            return vals.join(',');
        }
    }

    /**
     * Parses values from an input element.
     * 
     * @param {jQuery} input - The input element to parse values from.
     */
    parse_from_input(input) {
        this.parse_part(
            input.val(),
            this.get_mode(this.get_edit_section(input))
        );
    }

    /**
     * Serializes the current values into hidden input elements.
     */
    serialize_to_input() {
        let container = this.edit_area,
            mode = this.get_mode(container),
            input = $('.cron-value.' + mode + ' input', this.root);
        input.val(this.serialize(mode));
    }

    /**
     * Groups consecutive values in an array into sub-arrays.
     * 
     * @param {Array} arr - The array of values to group.
     * @returns {Array} - An array of grouped value arrays.
     */
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

    /**
     * Updates the summary display in the widget.
     */
    update_summary() {
        $('.crontab_summary .summary', this.root).html(this.summarize());
    }

    /**
     * Summarizes and formats the current values.
     * 
     * @returns {string} - HTML string containing the summary of values.
     */
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
        ].join('');
    }

    /**
     * Formats a specific part of the summary display.
     * 
     * @param {string} value_name - The name of the value category.
     * @param {string} no_values_selected - Translation key for no values selected message.
     * @param {string} values_selected - Translation key for selected values message.
     * @param {string} all_values_selected - Translation key for all values selected message.
     * @param {Object} [value_map] - An optional map for displaying value names.
     * @returns {string} - The formatted HTML string for the value part.
     */
    format_part(value_name, no_values_selected, values_selected,
                all_values_selected, value_map) {
        let value = this.value[value_name],
            value_len = value.length,
            max_len = this.maxlengths()[value_name],
            ret,
            ret_values = '';
        if (value_len === 0) {
            ret = this.translate(no_values_selected);
        } else if (value_len < max_len) {
            ret = this.translate(values_selected);
            ret_values = this.format_groups(
                this.group_value(value),
                value_map
            );
        } else {
            ret = this.translate(all_values_selected);
        }
        return '<div class="d-flex gap-3">' +
                `<h6 class="col-3 m-0">${ret}</h6>` +
                `<span class="col-9">${ret_values}</span>` +
            '</div>';
    }

    /**
     * Formats groups of values into a display string.
     * 
     * @param {Array} groups - The grouped values to format.
     * @param {Object} value_map - A mapping for displaying value names.
     * @returns {string} - The formatted string for the groups.
     */
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

    /**
     * Displays the value using the value map or returns the original value.
     * 
     * @param {string} value - The value to display.
     * @param {Object} [value_map] - An optional map for displaying value names.
     * @returns {string} - The display string for the value.
     */
    display_value(value, value_map) {
        if (value_map) {
            return value_map[value];
        }
        return value;
    }
};

//////////////////////////////////////////////////////////////////////////////
// yafowil.widget.array integration
//////////////////////////////////////////////////////////////////////////////

/**
 * Re-initializes widget on array add event.
 */
export function cron_on_array_add(inst, context) {
    CronWidget.initialize(context);
}

/**
 * Registers subscribers to yafowil array events.
 */
export function register_array_subscribers() {
    if (window.yafowil_array === undefined) {
        return;
    }
    window.yafowil_array.on_array_event('on_add', cron_on_array_add);
}
