# -*- coding: utf-8 -*-
from yafowil.base import factory

DOC_CRON = """
Crontab widget
--------------

Cron input.

.. code-block:: python

    cron = factory('#field:cron', )
"""


def cron_example():
    form = factory('fieldset', name='yafowil.widget.cron.default')
    form['cron'] = factory('#field:cron',)
    return {
        'widget': form,
        'doc': DOC_CRON,
        'title': 'Cron',
    }


def get_example():
    return [
        cron_example(),
    ]
