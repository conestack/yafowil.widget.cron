/* jslint browser: true */
/* global jQuery, yafowil */
/* 
 * yafowil datepicker widget
 * 
 * Requires: jquery ui datepicker
 * Optional: bdajax
 */

if (window.yafowil === undefined) {
    window.yafowil = {};
}

(function($, yafowil) {
    "use strict";

    $(document).ready(function() {
        // initial binding
        yafowil.datepicker.binder();

        // add after ajax binding if bdajax present
        if (window.bdajax !== undefined) {
            $.extend(window.bdajax.binders, {
                datepicker_binder: yafowil.datepicker.binder
            });
        }

        // add binder to yafowil.widget.array hooks
        if (yafowil.array !== undefined) {
            $.extend(yafowil.array.hooks.add, {
                datepicker_binder: yafowil.datepicker.binder
            });
        }
    });

    $.extend(yafowil, {

        datepicker: {

            binder: function(context) {
                $('input.datepicker', context).datepicker({
                    showAnim: null,
                    showOn: 'both'
                });
                $('input.timepicker', context).timepicker({
                    showPeriodLabels: false,
                    showOn: 'both'
                });
            }
        }
    });

    // Configure jQuery.UI datepicker languages.
    $(function() {
        $.datepicker.regional.de = {
            clearText: 'löschen',
            clearStatus: 'aktuelles Datum löschen',
            closeText: 'schließen',
            closeStatus: 'ohne Änderungen schließen',
            prevText: '&#x3c;zurück',
            prevStatus: 'letzten Monat zeigen',
            nextText: 'Vor&#x3e;',
            nextStatus: 'nächsten Monat zeigen',
            currentText: 'heute',
            currentStatus: '',
            monthNames: [
                'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
            ],
            monthNamesShort: [
                'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
                'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'
            ],
            monthStatus: 'anderen Monat anzeigen',
            yearStatus: 'anderes Jahr anzeigen',
            weekHeader: 'Wo',
            weekStatus: 'Woche des Monats',
            dayNames: [
                'Sonntag', 'Montag', 'Dienstag', 'Mittwoch',
                'Donnerstag', 'Freitag', 'Samstag'
            ],
            dayNamesShort: [
                'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'
            ],
            dayNamesMin: [
                'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'
            ],
            dayStatus: 'Setze DD als ersten Wochentag',
            dateStatus: 'Wähle D, M d',
            dateFormat: 'dd.mm.yy',
            firstDay: 1, 
            initStatus: 'Wähle ein Datum',
            isRTL: false
        };
        $.datepicker.setDefaults($.datepicker.regional.de);

        $.timepicker.regional.de = {
            hourText: 'Stunde',
            minuteText: 'Minuten',
            amPmText: ['AM', 'PM'] ,
            closeButtonText: 'Beenden',
            nowButtonText: 'Aktuelle Zeit',
            deselectButtonText: 'Wischen'
        };
        $.timepicker.setDefaults($.timepicker.regional.de);
    });

})(jQuery, yafowil);
