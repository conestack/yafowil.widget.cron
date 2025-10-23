# -*- coding: utf-8 -*-
from node.utils import UNSET
from yafowil.base import ExtractionError
from yafowil.base import factory
from yafowil.base import fetch_value
from yafowil.common import generic_required_extractor
from yafowil.compound import compound_extractor
from yafowil.compound import compound_renderer
from yafowil.tsf import TSF
from yafowil.utils import attr_value
from yafowil.utils import cssclasses
from yafowil.utils import cssid
from yafowil.utils import EMPTY_VALUE
from yafowil.utils import managedprops


_ = TSF('yafowil.widget.cron')


@managedprops('edit_btn_class')
def cron_value_edit_action_renderer(widget, data):
    """Renders cron value edit button.
    """
    return data.rendered + data.tag(
        'button',
        attr_value('label', widget, data),
        class_=attr_value('btn.class', widget, data)
    )


factory.register(
    'cron_value_edit_action',
    edit_renderers=[cron_value_edit_action_renderer]
)
# don't document internal widget
factory.doc['blueprint']['cron_value_edit_action'] = UNSET


@managedprops('emptyvalue')
def cron_extractor(widget, data):
    # instanciate subwidgets
    widget()
    # extract subwidgets
    compound_extractor(widget, data)
    minute = data['minute']
    # if one subwidget is UNSET, whole widget not found on request
    if minute.extracted is UNSET:
        return UNSET
    minute = data['minute'].extracted
    hour = data['hour'].extracted
    dom = data['dom'].extracted
    month = data['month'].extracted
    dow = data['dow'].extracted
    year = data['year'].extracted
    # if all values missing, we have no cron rule
    if not minute and not hour and not dom \
            and not month and not dow and not year:
        return attr_value('emptyvalue', widget, data, EMPTY_VALUE)
    # if one value missing, we have an invalid cron rule
    if not (minute and hour and dom and month and dow and year):
        raise ExtractionError(_(
            'invalid_cron_rule',
            default=(
                'Invalid cron rule. You must at least '
                'select one item for each criteria'
            )
        ))
    return '{0} {1} {2} {3} {4} {5}'.format(minute, hour, dom, month, dow, year)


def cron_edit_renderer(widget, data):
    value = fetch_value(widget, data)
    if value is not UNSET and value is not attr_value('emptyvalue', widget, data, EMPTY_VALUE):
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
        name='cron',
        value=value,
        props={
            'structural': True,
            'id': cssid(widget, 'input'),
            'class': cssclasses(widget, data),
            'data': {
                'lang': attr_value('lang', widget, data),
                'start_year': attr_value('start_year', widget, data),
                'end_year': attr_value('end_year', widget, data)
            }
        })
    edit_container = container['edit-container'] = factory(
        'div',
        props={
            'structural': True,
            'class': attr_value('edit_container_class', widget, data)
        })
    options_container = edit_container['options'] = factory(
        'div',
        props={
            'structural': True,
            'class': attr_value('options_container_class', widget, data)
        })
    options_header = options_container['options_header'] = factory(
        'div',
        props={
            'structural': True,
            'class': attr_value('options_header_class', widget, data)
        })
    options_header['minute'] = factory(
        'div:cron_value_edit_action:hidden',
        props={
            'persist': False,
            'label': _('label_minute', default='Minute'),
            'div.class': 'cron-value minute',
            'btn.class': attr_value('edit_btn_class', widget, data)
        })
    options_header['hour'] = factory(
        'div:cron_value_edit_action:hidden',
        props={
            'persist': False,
            'label': _('label_hour', default='Hour'),
            'div.class': 'cron-value hour',
            'btn.class': attr_value('edit_btn_class', widget, data)
        })
    options_header['dom'] = factory(
        'div:cron_value_edit_action:hidden',
        props={
            'persist': False,
            'label': _('label_dom', default='Day of Month'),
            'div.class': 'cron-value dom',
            'btn.class': attr_value('edit_btn_class', widget, data)
        })
    options_header['month'] = factory(
        'div:cron_value_edit_action:hidden',
        props={
            'persist': False,
            'label': _('label_month', default='Month'),
            'div.class': 'cron-value month',
            'btn.class': attr_value('edit_btn_class', widget, data)
        })
    options_header['dow'] = factory(
        'div:cron_value_edit_action:hidden',
        props={
            'persist': False,
            'label': _('label_dow', default='Day of Week'),
            'div.class': 'cron-value dow',
            'btn.class': attr_value('edit_btn_class', widget, data)
        })
    options_header['year'] = factory(
        'div:cron_value_edit_action:hidden',
        props={
            'persist': False,
            'label': _('label_year', default='Year'),
            'div.class': 'cron-value year',
            'btn.class': attr_value('edit_btn_class', widget, data)
        })
    edit_container['editarea'] = factory(
        'div',
        props={
            'structural': True,
            'class': attr_value('editarea_class', widget, data),
        })


def cron_display_renderer(widget, data):
    value = fetch_value(widget, data)
    cssclasses = [
        attr_value("display_class", widget, data),
        f'display-{attr_value("class", widget, data) or "generic"}'
    ]
    attrs = {
        'id': cssid(widget, 'display'),
        'class_': ' '.join([_ for _ in cssclasses if _ is not None])
    }
    return data.tag('div', data.tag('code', value), **attrs)


factory.register(
    'cron',
    extractors=[
        cron_extractor,
        generic_required_extractor
    ],
    edit_renderers=[
        cron_edit_renderer,
        compound_renderer
    ],
    display_renderers=[
        cron_display_renderer
    ]
)

factory.doc['blueprint']['cron'] = """\
Add-on blueprint
`yafowil.widget.cron <http://github.com/conestack/yafowil.widget.cron/>`_ .
"""

factory.defaults['cron.class'] = 'crontab widget'
factory.doc['props']['cron.class'] = """\
CSS classes for cron widget wrapper DOM element.
"""

factory.defaults['cron.edit_container_class'] = 'edit-container'
factory.doc['props']['cron.edit_container_class'] = """\
CSS classes for cron widget editarea wrapper DOM element.
"""

factory.defaults['cron.options_container_class'] = ''
factory.doc['props']['cron.options_container_class'] = """\
CSS classes for cron widget edit options wrapper DOM element.
"""

factory.defaults['cron.options_header_class'] = ''
factory.doc['props']['cron.options_header_class'] = """\
CSS classes for cron widget edit options header DOM element.
"""

factory.defaults['cron.edit_btn_class'] = 'btn btn-sm edit'
factory.doc['props']['cron.edit_btn_class'] = """\
CSS classes for cron widget edit button DOM elements.
"""

factory.defaults['cron.editarea_class'] = 'editarea'
factory.doc['props']['cron.editarea_class'] = """\
CSS classes for cron widget editarea DOM element.
"""

factory.defaults['cron.lang'] = None
factory.doc['props']['cron.lang'] = """\
Language code.
"""

factory.defaults['cron.start_year'] = None
factory.doc['props']['cron.lang'] = """\
Start year. Defaults to current year.
"""

factory.defaults['cron.end_year'] = None
factory.doc['props']['cron.lang'] = """\
End year. Defaults to current year + 9
"""

factory.doc['props']['cron.emptyvalue'] = """\
If cron rule value empty, return as extracted
value.
"""
