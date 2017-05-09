# -*- coding: utf-8 -*-
from node.utils import UNSET
from yafowil.base import factory
from yafowil.base import fetch_value
from yafowil.compound import compound_extractor
from yafowil.compound import compound_renderer
from yafowil.tsf import TSF
from yafowil.utils import attr_value
from yafowil.utils import cssclasses
from yafowil.utils import cssid


_ = TSF('yafowil.widget.cron')


# Create actions blueprint
#
def action_edit_renderer(widget, data):
    return data.rendered or data.tag(
        'button',
        attr_value('label', widget, data),
        class_='btn btn-sm edit'
    )


factory.register(
    'action_edit',
    edit_renderers=[action_edit_renderer]
)
# don't document internal widget
factory.doc['blueprint']['action_edit'] = UNSET


def cron_extractor(widget, data):
    minute = data.get('minute', None)
    if not minute or minute.extracted is UNSET:
        # If minute not set, others are empty too.
        return UNSET
    value = '{0} {1} {2} {3} {4} {5}'.format(
        data['minute'].extracted,
        data['hour'].extracted,
        data['dom'].extracted,
        data['month'].extracted,
        data['dow'].extracted,
        data['year'].extracted
    )
    return value


def cron_edit_renderer(widget, data):
    value = fetch_value(widget, data)
    if value is not UNSET:
        value = [it.strip() for it in value.split(' ') if it.strip()]
        if len(value) == 5:
            value.append('*')
        if len(value) < 6:
            raise ValueError('Invalid cron rule')
        value = {
            'minute': value[0],
            'hour': value[1],
            'dom': value[2],
            'month': value[3],
            'dow': value[4],
            'year': value[5]
        }
    container = widget['container'] = factory(
        'div',
        name="cron",
        value=value,
        props={
            'structural': True,
            'id': cssid(widget, 'input'),
            'class': cssclasses(widget, data),
        })
    container['minute'] = factory(
        'div:hidden:action_edit',
        props={
            'label': _('label_minute', u'Minute'),
            'div.class': 'cron-value minute'
        })
    container['hour'] = factory(
        'div:hidden:action_edit',
        props={
            'label': _('label_hour', u'Hour'),
            'div.class': 'cron-value hour'
        })
    container['dom'] = factory(
        'div:hidden:action_edit',
        props={
            'label': _('label_dom', u'Day of Month'),
            'div.class': 'cron-value dom'
        })
    container['month'] = factory(
        'div:hidden:action_edit',
        props={
            'label': _('label_month', u'Month'),
            'div.class': 'cron-value month'
        })
    container['dow'] = factory(
        'div:hidden:action_edit',
        props={
            'label': _('label_dow', u'Day of Week'),
            'div.class': 'cron-value dow'
        })
    container['year'] = factory(
        'div:hidden:action_edit',
        props={
            'label': _('label_year', u'Year'),
            'div.class': 'cron-value year'
        })
    container['editarea'] = factory(
        'div',
        props={
            'structural': True,
            'class': 'editarea',
        })


def cron_display_renderer(widget, data):
    value = fetch_value(widget, data)
    attrs = {
        'id': cssid(widget, 'display'),
        'class_': 'display-%s' % attr_value('class', widget, data)
    }
    return data.tag('div', data.tag('code', value), **attrs)


factory.register(
    'cron',
    extractors=[
        compound_extractor,
        cron_extractor
    ],
    edit_renderers=[
        cron_edit_renderer,
        compound_renderer
    ],
    display_renderers=[
        cron_display_renderer
    ]
)

factory.doc['blueprint']['cron'] = "Add-on blueprint `yafowil.widget.cron <http://github.com/bluedynamics/yafowil.widget.cron/>`_ ."  # noqa

factory.defaults['cron.class'] = 'crontab widget'
