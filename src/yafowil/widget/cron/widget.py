# -*- coding: utf-8 -*-
from node.utils import UNSET
from yafowil.base import ExtractionError
from yafowil.base import factory
from yafowil.base import fetch_value
from yafowil.common import generic_extractor
from yafowil.common import generic_required_extractor
from yafowil.compound import compound_extractor
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
    tag = data.tag
    return tag(
        'button',
        _('label_edit', u'Edit'),
        class_='edit icon-plus-sign'
    )


factory.register(
    'action_edit',
    edit_renderers=[action_edit_renderer]
)
# don't document internal widget
factory.doc['blueprint']['action_edit'] = UNSET


# compound_extractor vor eigenem extractor reinhängen
# child_widget
# builder ----
# widget_minute = factory(...
# yafowil factory


def cron_extractor(widget, data):
    extracted = data.extracted
    if extracted == UNSET or extracted == '':
        return UNSET
    return extracted


def make_cron_summary(value):
    return 'summary: blabla'


def cron_edit_renderer(widget, data):

    tag = data.tag
    widgetname = widget.dottedpath

    value = data.request.get(widgetname) if data.request else UNSET

    compound = factory(
        'compound',
        name=widgetname,
    )
    compound['minute'] = factory(
        'label:text:action_edit',
        props={
            'label': _('label_minute', u'Minute'),
        }
    )
    compound['hour'] = factory(
        'label:text:action_edit',
        props={
            'label': _('label_hour', u'Hour'),
        }
    )
    compound['dow'] = factory(
        'label:text:action_edit',
        props={
            'label': _('label_dow', u'Day of Week'),
        }
    )
    compound['dom'] = factory(
        'label:text:action_edit',
        props={
            'label': _('label_dom', u'Day of Month'),
        }
    )
    compound['month'] = factory(
        'label:text:action_edit',
        props={
            'label': _('label_month', u'Month'),
        }
    )

    summary = make_cron_summary(value)

    return\
        tag('div',
            compound(),
            tag('p', summary, class_='summary'),
            id=cssid(widget, 'input'),
            class_=cssclasses(widget, data) or '' + ' crontab widget'
            )


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
        generic_extractor,
        generic_required_extractor,
        compound_extractor,
        cron_extractor
    ],
    edit_renderers=[cron_edit_renderer],
    display_renderers=[cron_display_renderer]
)

factory.doc['blueprint']['cron'] = "Add-on blueprint `yafowil.widget.cron <http://github.com/bluedynamics/yafowil.widget.cron/>`_ ."  # noqa
