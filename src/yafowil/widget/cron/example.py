# -*- coding: utf-8 -*-
from yafowil.base import factory


DOC_CRON = """
Crontab widget
--------------

Cron input.

.. code-block:: python

    value = '0,10,20,30,40,50 0,6,12,18 1,15,30 3,6,9,12 1,3,5 2017,2018,2019'
    cron = factory('cron', name='cronwidget', value=value)
"""


def cron_example():
    # Minute Hour DayOfMonth Month DayOfWeek Year
    value = '0,10,20,30,40,50 0,6,12,18 1,15,30 3,6,9,12 1,3,5 2017,2018,2019'
    part = factory(u'fieldset', name='yafowil.widget.cron')
    part['cron'] = factory(
        '#field:cron',
        value=value,
        props={
            'leaf': True,
            'label': 'Cron Widget',
            'lang': 'en',
            'start_year': '2000',
            'end_year': '2099'
        })
    return {
        'widget': part,
        'doc': DOC_CRON,
        'title': 'Cron',
    }


DOC_CRON2 = """
Crontab widget example 2
------------------------

Cron input with ``*`` as values.

.. code-block:: python

    value = '* * * * * *'
    cron = factory('cron', name='cronwidget', value=value)
"""


def cron_example2():
    # Minute Hour DayOfMonth Month DayOfWeek Year
    value2 = '* * * * * *'
    cron2 = factory('cron', name='cronwidget', value=value2)
    return {
        'widget': cron2,
        'doc': DOC_CRON2,
        'title': 'Cron',
    }


DOC_CRON_DISPLAY = """
Display Mode
------------

The widget's display mode renders only the widget summary.

The wrapper div can receive additional classes via the ``display_class``
widget attribute.

.. code-block:: python

    value = '0,30 0,6,12,18 1,15,30 3,12 1,2,3,4,5 2025'
    cron = factory('cron', name='cronwidget', mode='display', value=value, props={
        # 'display_class': 'my_additional_class'
    })
"""


def cron_example_display():
    value = '0,30 0,6,12,18 1,15,30 3,12 1,2,3,4,5 2025'
    part = factory(u'fieldset', name='yafowil.widget.cron')
    part['cron'] = factory(
        '#field:cron',
        value=value,
        mode='display',
        props={
            'leaf': True,
            'label': 'Cron Widget',
            'lang': 'en',
            'start_year': '2000',
            'end_year': '2099',
        })
    return {
        'widget': part,
        'doc': DOC_CRON_DISPLAY,
        'title': 'Cron',
    }


def get_example():
    return [
        cron_example(),
        # cron_example2(),
        cron_example_display()
    ]
