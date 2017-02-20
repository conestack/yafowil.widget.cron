# -*- coding: utf-8 -*-
from node.utils import UNSET
from yafowil.base import ExtractionError
from yafowil.base import factory
from yafowil.base import fetch_value
from yafowil.common import generic_extractor
from yafowil.common import generic_required_extractor
from yafowil.tsf import TSF
from yafowil.utils import attr_value
from yafowil.utils import css_managed_props
from yafowil.utils import cssclasses
from yafowil.utils import cssid
from yafowil.utils import managedprops


_ = TSF('yafowil.widget.cron')


def render_cron_input(widget, data, value, postfix=None, css_class=False):

    import pdb
    pdb.set_trace()

    tag = data.tag
    widgetname = widget.dottedpath
    if postfix:
        widgetname = u'{0}.{1}'.format(widgetname, postfix)

    if value is True:
        value = ''
    if not value and data.request:
        value = data.request.get(widgetname)

    summary = make_cron_summary(value)

    return\
        tag('div',
            tag('label',
                _('label_minute', u'Minute'),
                tag('input', type='text', name=widgetname+'_minute'),
                tag('a', 'edit', class_=widgetname+' minute edit')
                ),
            tag('label',
                _('label_hour', u'Hour'),
                tag('input', type='text', name=widgetname+'_hour'),
                tag('a', 'edit', class_=widgetname+' hour edit')
                ),
            tag('label',
                _('label_dow', u'Day of Week'),
                tag('input', type='text', name=widgetname+'_dow'),
                tag('a', 'edit', class_=widgetname+' dow edit')
                ),
            tag('label',
                _('label_dom', u'Day of Month'),
                tag('input', type='text', name=widgetname+'_dom'),
                tag('a', 'edit', class_=widgetname+' dom edit')
                ),
            tag('label',
                _('label_month', u'Month'),
                tag('input', type='text', name=widgetname+'_month'),
                tag('a', 'edit', class_=widgetname+' month edit')
                ),
            tag('p', summary, class_=widgetname+' summary'),
            id=cssid(widget, 'input', postfix),
            class_=cssclasses(widget, data) or '' + ' crontab widget'
            )


def cron_extractor(widget, data):
    import pdb
    pdb.set_trace()

    extracted = data.extracted
    if extracted == UNSET or extracted == '':
        return UNSET
    return extracted


def make_cron_summary(value):
    return 'summary: blabla'


def cron_edit_renderer(widget, data):
    return render_cron_input(widget, data, None)


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
        cron_extractor
    ],
    edit_renderers=[cron_edit_renderer],
    display_renderers=[cron_display_renderer]
)

factory.doc['blueprint']['cron'] = "Add-on blueprint `yafowil.widget.cron <http://github.com/bluedynamics/yafowil.widget.cron/>`_ ."  # noqa
