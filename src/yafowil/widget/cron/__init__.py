# -*- coding: utf-8 -*-
from yafowil.base import factory
from yafowil.utils import entry_point
import os


resourcedir = os.path.join(os.path.dirname(__file__), 'resources')

js = [{
    'group': 'yafowil.widget.cron.common',
    'resource': 'widget.js',
    'order': 21,
}]

default_css = [{
    'group': 'yafowil.widget.cron.common',
    'resource': 'widget.css',
    'order': 21,
}]


@entry_point(order=10)
def register():
    import widget
    factory.register_theme(
        'default',
        'yafowil.widget.cron',
        resourcedir,
        js=js,
        css=default_css
    )
