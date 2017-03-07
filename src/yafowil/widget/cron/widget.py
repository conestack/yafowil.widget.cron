# -*- coding: utf-8 -*-
from node.utils import UNSET
from odict import odict
from yafowil.base import ExtractionError
from yafowil.base import factory
from yafowil.base import fetch_value
from yafowil.common import generic_extractor
from yafowil.common import generic_required_extractor
from yafowil.compound import compound_extractor
from yafowil.compound import compound_renderer
from yafowil.tsf import TSF
from yafowil.utils import attr_value
from yafowil.utils import css_managed_props
from yafowil.utils import cssclasses
from yafowil.utils import cssid
from yafowil.utils import managedprops


_ = TSF('yafowil.widget.cron')


# Create actions blueprint
#
def action_edit_renderer(widget, data):
    return data.rendered or '' +\
        data.tag(
            'button',
            data.tag('span', u'', class_='icon-plus-sign'),
            _('label_edit', u'Edit'),
            class_='btn btn-sm edit'
        ) + data.tag('div', u'', class_='editarea')


factory.register(
    'action_edit',
    edit_renderers=[action_edit_renderer]
)
# don't document internal widget
factory.doc['blueprint']['action_edit'] = UNSET


def cron_extractor(widget, data):
    # XXX: translate to cron rule
    pass


def make_cron_summary(value):
    return 'summary: blabla'


def cron_edit_renderer(widget, data):
    # XXX: cron rule expected as value, translate to dict
    value = fetch_value(widget, data)
    if value is UNSET:
        value = dict()
    container = widget['container'] = factory('div', props={
        'structural': True,
        'id': cssid(widget, 'input'),
        'class': cssclasses(widget, data)
    })
    container['minute'] = factory(
        'label:text:action_edit',
        props={
            'label': _('label_minute', u'Minute'),
            'label.class': 'minute',
            'label.position': 'inner-before',
            'text.disabled': True
        }
    )
    container['hour'] = factory(
        'label:text:action_edit',
        props={
            'label': _('label_hour', u'Hour'),
            'label.class': 'hour',
            'label.position': 'inner-before',
            'text.disabled': True
        }
    )
    container['dow'] = factory(
        'label:text:action_edit',
        props={
            'label': _('label_dow', u'Day of Week'),
            'label.class': 'dow',
            'label.position': 'inner-before',
            'text.disabled': True
        }
    )
    container['dom'] = factory(
        'label:text:action_edit',
        props={
            'label': _('label_dom', u'Day of Month'),
            'label.class': 'dom',
            'label.position': 'inner-before',
            'text.disabled': True
        }
    )
    container['month'] = factory(
        'label:text:action_edit',
        props={
            'label': _('label_month', u'Month'),
            'label.class': 'month',
            'label.position': 'inner-before',
            'text.disabled': True
        }
    )
    container['year'] = factory(
        'label:text:action_edit',
        props={
            'label': _('label_year', u'Year'),
            'label.class': 'year',
            'label.position': 'inner-before',
            'text.disabled': True
        }
    )
    container['summary'] = factory('tag', props={
        'structural': True,
        'tag': 'p',
        'text': make_cron_summary(value=UNSET)
    })


def cron_display_renderer(widget, data):
    # value = data.value
    # TODO: Convert to summary and display.
    attrs = {
        'id': cssid(widget, 'display'),
        'class_': 'display-%s' % attr_value('class', widget, data)
    }
    return data.tag('p', u'TODO', **attrs),


factory.register(
    'cron',
    extractors=[
        #cron_extractor,
        compound_extractor
    ],
    edit_renderers=[
        cron_edit_renderer,
        compound_renderer
    ],
    display_renderers=[
        cron_display_renderer,
        compound_renderer
    ]
)

factory.doc['blueprint']['cron'] = "Add-on blueprint `yafowil.widget.cron <http://github.com/bluedynamics/yafowil.widget.cron/>`_ ."  # noqa

factory.defaults['cron.class'] = 'crontab widget'
