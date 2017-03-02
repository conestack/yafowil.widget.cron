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
            binder: function (context) {
                $('.crontab.widget button.edit').on('click', function (event) {
                    event.preventDefault();
                    var cnt;
                    var $el = $(this);
                    var $container = $el.closest('label');
                    var mode = $container.attr('class');
                    var $editarea = $('.editarea', $container);

                    if ($editarea.is(':visible')) {
                        $el.removeClass('active');
                        $editarea.hide();
                        return;
                    }

                    var header = $('<h2 />');
                    var content = $('<div class="editcontainer" />');

                    if (mode.indexOf('minute') != -1) {
                        header.text('Select Minutes');
                        for (cnt=0; cnt < 60; cnt++) {
                            content.append(yafowil.cron.valuebutton(cnt));
                        }
                    } else if (mode.indexOf('hour') != -1) {
                        header.text('Select Hours');
                        for (cnt=1; cnt <= 24; cnt++) {
                            content.append(yafowil.cron.valuebutton(cnt));
                        }
                    } else if (mode.indexOf('dow') != -1) {
                        header.text('Select Day of Week');
                        for (cnt=1; cnt <= 7; cnt++) {
                            content.append(yafowil.cron.valuebutton(cnt));
                        }
                    } else if (mode.indexOf('dom') != -1) {
                        header.text('Select Day of Month');
                        for (cnt=1; cnt <= 31; cnt++) {
                            content.append(yafowil.cron.valuebutton(cnt));
                        }
                    } else if (mode.indexOf('month') != -1) {
                        header.text('Select Month');
                        for (cnt=1; cnt <= 12; cnt++) {
                            content.append(yafowil.cron.valuebutton(cnt));
                        }
                    }

                    content = header.add(content);
                    $editarea.html(content);
                    $editarea.show();
                    $el.addClass('active');
                });
            },

            valuebutton: function (name, value) {
                if (typeof value === 'undefined') {
                    value = name;
                }
                return $('<button name=' + value + '>' + name + '</button>')
                    .on('click', function (event) {
                        event.preventDefault();
                        var $el = $(this);
                        if ($el.attr('class') === 'active') {
                            $el.attr('class', '');
                        } else {
                            $el.attr('class', 'active');
                        }
                    });
            }
        }
    });

})(jQuery, yafowil);
