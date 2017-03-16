# -*- coding: utf-8 -*-
from node.utils import UNSET
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
    cron = factory('cron', name='cronwidget', value=value)

    return {
        'widget': cron,
        'doc': DOC_CRON,
        'title': 'Cron',
    }


def get_example():
    return [
        cron_example(),
    ]
