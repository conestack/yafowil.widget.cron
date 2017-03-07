# -*- coding: utf-8 -*-
from node.utils import UNSET
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
            data.tag(
                'span', u'',
                class_='icon-plus-sign'
            ) +
            _(
                'label_edit',
                u'Edit'
            ),
            class_='btn btn-sm edit'
        ) +\
        data.tag('div', u'', class_='editarea')


factory.register(
    'action_edit',
    edit_renderers=[action_edit_renderer]
)
# don't document internal widget
factory.doc['blueprint']['action_edit'] = UNSET


def cron_extractor(widget, data):

    def _extract_part(widget, name):
        try:
            return data.request.get(widget.dottedpath + '.' + name, UNSET) or UNSET  # noqa
        except KeyError:
            return UNSET

    return {
        'minute': _extract_part(widget, 'minute'),
        'hour': _extract_part(widget, 'hour'),
        'dow': _extract_part(widget, 'dow'),
        'dom': _extract_part(widget, 'dom'),
        'month': _extract_part(widget, 'month')
    }


def make_cron_summary(value):
    return 'summary: blabla'


def cron_edit_renderer(widget, data):

    def _get_value(name):
        value = data.value.get(
            widget.dottedpath + '.' +
            name,
            UNSET
        ) if data.value else UNSET
        if isinstance(value, list):
            value = ','.join(str(it) for it in value)
        return value

    compound = factory(
        'compound',
        name=widget.dottedpath
    )
    compound['minute'] = factory(
        'label:text:action_edit',
        props={
            'label': _('label_minute', u'Minute'),
            'label.class': 'minute',
            'position': 'inner-before'
        },
        value=_get_value('minute')
    )
    compound['hour'] = factory(
        'label:text:action_edit',
        props={
            'label': _('label_hour', u'Hour'),
            'label.class': 'hour',
            'position': 'inner-before'
        },
        value=_get_value('hour')
    )
    compound['dow'] = factory(
        'label:text:action_edit',
        props={
            'label': _('label_dow', u'Day of Week'),
            'label.class': 'dow',
            'position': 'inner-before'
        },
        value=_get_value('dow')
    )
    compound['dom'] = factory(
        'label:text:action_edit',
        props={
            'label': _('label_dom', u'Day of Month'),
            'label.class': 'dom',
            'position': 'inner-before'
        },
        value=_get_value('dom')
    )
    compound['month'] = factory(
        'label:text:action_edit',
        props={
            'label': _('label_month', u'Month'),
            'label.class': 'month',
            'position': 'inner-before'
        },
        value=_get_value('month')
    )
    compound['year'] = factory(
        'label:text:action_edit',
        props={
            'label': _('label_year', u'Year'),
            'label.class': 'year',
            'position': 'inner-before'
        },
        value=_get_value('year')
    )

    # summary = make_cron_summary(value)

    return\
        data.tag(
            'div',
            compound(),
            # data.tag('p', summary, class_='summary'),
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
    extractors=[cron_extractor],
    edit_renderers=[cron_edit_renderer],
    display_renderers=[
        cron_display_renderer,
        compound_renderer
    ]
)

factory.doc['blueprint']['cron'] = "Add-on blueprint `yafowil.widget.cron <http://github.com/bluedynamics/yafowil.widget.cron/>`_ ."  # noqa
