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

            getContainer: function ($el) {
                return $el.closest('label');
            },
            getMode: function ($el) {
                return yafowil.cron.getContainer($el).attr('class');
            },
            getEditarea: function ($el) {
                return $('.editarea', yafowil.cron.getContainer($el));

            },
            binder: function (context) {
                $('.crontab.widget button.edit').on('click', function (event) {
                    event.preventDefault();
                    var cnt;
                    var $el = $(this);
                    var mode = yafowil.cron.getMode($el);
                    var $editarea = yafowil.cron.getEditarea($el);

                    if ($editarea.is(':visible')) {
                        $el.removeClass('active');
                        $editarea.hide();
                        return;
                    }

                    yafowil.cron.value.parseFromInput($el);

                    var header = $('<h2 />');
                    var content = $('<div class="editcontainer" />');

                    if (mode.indexOf('minute') != -1) {
                        header.text('Select Minutes');
                        for (cnt=0; cnt <= 59; cnt++) {
                            content.append(yafowil.cron.valuebutton(cnt, cnt, mode));
                        }
                    } else if (mode.indexOf('hour') != -1) {
                        header.text('Select Hours');
                        for (cnt=0; cnt <= 23; cnt++) {
                            content.append(yafowil.cron.valuebutton(cnt, cnt, mode));
                        }
                    } else if (mode.indexOf('dow') != -1) {
                        header.text('Select Day of Week');
                        for (cnt=0; cnt <= 6; cnt++) {
                            content.append(yafowil.cron.valuebutton(cnt, cnt, mode));
                        }
                    } else if (mode.indexOf('dom') != -1) {
                        header.text('Select Day of Month');
                        for (cnt=1; cnt <= 31; cnt++) {
                            content.append(yafowil.cron.valuebutton(cnt, cnt, mode));
                        }
                    } else if (mode.indexOf('month') != -1) {
                        header.text('Select Month');
                        for (cnt=1; cnt <= 12; cnt++) {
                            content.append(yafowil.cron.valuebutton(cnt, cnt, mode));
                        }
                    } else if (mode.indexOf('year') != -1) {
                        header.text('Select Year');
                        for (cnt=1970; cnt <= 2099; cnt++) {
                            content.append(yafowil.cron.valuebutton(cnt, cnt, mode));
                        }
                    }

                    content = header.add(content);
                    $editarea.html(content);
                    $editarea.show();
                    $el.addClass('active');
                });
            },

            valuebutton: function (name, value, mode) {
                var button = $('<button name=' + value + '>' + name + '</button>');
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

            valuebutton_eventhandler: function (event, mode) {
                event.preventDefault();
                var $el = $(this);
                if ($el.attr('class') === 'active') {
                    yafowil.cron.value.remove($(this).attr('name'), yafowil.cron.getMode($el));
                    yafowil.cron.value.serializeToInput($el);
                    $el.attr('class', '');
                } else {
                    yafowil.cron.value.add($(this).attr('name'), yafowil.cron.getMode($el));
                    yafowil.cron.value.serializeToInput($el);
                    $el.attr('class', 'active');
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
                    // TODO: support for special characters.
                    this.value[mode] = {};
                    for (var cnt=0; cnt<value.length; cnt++) {
                        var val = value[cnt];
                        if (val === "") {
                            continue;
                        }
                        val = parseInt(val, 10).toString();
                        this.value[mode][val] = true;
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
                        return parseInt(a, 10) - parseInt(b, 10);
                    });
                    return vals.join(',');
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
