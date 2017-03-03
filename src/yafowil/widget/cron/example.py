# -*- coding: utf-8 -*-
from yafowil.base import factory

DOC_CRON = """
Crontab widget
--------------

Cron input.

.. code-block:: python

    cron = factory('#field:cron')
"""


def cron_example():

    dottedpath = 'yafowil.widget.cron.default.yafowil.widget.cron.default.cron'
    value = {
        dottedpath + '.minute': [0, 10, 20, 30, 40, 50],
        dottedpath + '.hour': [0, 6, 12, 18],
        dottedpath + '.dow': [1, 3, 5],
        dottedpath + '.dom': [1, 15, 30],
        dottedpath + '.month': [3, 6, 9, 12],
        dottedpath + '.year': [2017, 2018, 2019, 2020]
    }

    form = factory('fieldset', name='yafowil.widget.cron.default')
    form['cron'] = factory('#field:cron', value=value)
    return {
        'widget': form,
        'doc': DOC_CRON,
        'title': 'Cron',
    }


def get_example():
    return [
        cron_example(),
    ]
