# -*- coding: utf-8 -*-
from yafowil.base import factory


DOC_DATE = """
Date
----

Date input.

.. code-block:: python

    date = factory('#field:datetime', props={
        'label': 'Enter date or use date picker',
        'required': 'Date Field is required',
        'locale': 'de',
        'datepicker': True,
    })
"""


def date_example():
    form = factory('fieldset', name='yafowil.widget.datetime.date')
    form['date'] = factory('#field:datetime', props={
        'label': 'Enter date or use date picker',
        'required': 'Date Field is required',
        'locale': 'de',
        'datepicker': True,
    })
    return {
        'widget': form,
        'doc': DOC_DATE,
        'title': 'Date',
    }


DOC_TIME = """
Time
----

Time input.

.. code-block:: python

    time = factory('#field:time', props={
        'label': 'Select time',
        'required': 'Time Field is required',
        'timepicker': True,
    })
"""


def time_example():
    form = factory('fieldset', name='yafowil.widget.datetime.time')
    form['time'] = factory('#field:time', props={
        'label': 'Select time',
        'required': 'Time Field is required',
        'timepicker': True,
    })
    return {
        'widget': form,
        'doc': DOC_TIME,
        'title': 'Time',
    }


DOC_DATETIME = """
Datetime
--------

Date and time input.

.. code-block:: python

    datetime = factory('#field:datetime', props={
        'label': 'Enter date and time',
        'required': 'Datetime Field is required',
        'locale': 'de',
        'datepicker': True,
        'time': True,
        'timepicker': True,
    })
"""


def datetime_example():
    form = factory('fieldset', name='yafowil.widget.datetime.datetime')
    form['datetime'] = factory('#field:datetime', props={
        'label': 'Enter date and time',
        'required': 'Datetime Field is required',
        'locale': 'de',
        'datepicker': True,
        'time': True,
        'timepicker': True,
    })
    return {
        'widget': form,
        'doc': DOC_DATETIME,
        'title': 'Datetime',
    }


def get_example():
    return [
        date_example(),
        time_example(),
        datetime_example(),
    ]
