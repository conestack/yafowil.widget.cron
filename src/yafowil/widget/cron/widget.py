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
        props={
            'structural': True,
            'id': cssid(widget, 'input'),
            'class': cssclasses(widget, data),
        },
        value=value
    )
    container['minute'] = factory(
        'label:text:action_edit',
        props={
            'label': _('label_minute', u'Minute'),
            'label.class': 'minute',
            'label.position': 'inner-before',
            #'text.readonly': True
        }
    )
    container['hour'] = factory(
        'label:text:action_edit',
        props={
            'label': _('label_hour', u'Hour'),
            'label.class': 'hour',
            'label.position': 'inner-before',
            #'text.readonly': True
        }
    )
    container['dom'] = factory(
        'label:text:action_edit',
        props={
            'label': _('label_dom', u'Day of Month'),
            'label.class': 'dom',
            'label.position': 'inner-before',
            #'text.readonly': True
        }
    )
    container['month'] = factory(
        'label:text:action_edit',
        props={
            'label': _('label_month', u'Month'),
            'label.class': 'month',
            'label.position': 'inner-before',
            #'text.readonly': True
        }
    )
    container['dow'] = factory(
        'label:text:action_edit',
        props={
            'label': _('label_dow', u'Day of Week'),
            'label.class': 'dow',
            'label.position': 'inner-before',
            #'text.readonly': True
        }
    )
    container['year'] = factory(
        'label:text:action_edit',
        props={
            'label': _('label_year', u'Year'),
            'label.class': 'year',
            'label.position': 'inner-before',
            #'text.readonly': True
        }
    )


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
