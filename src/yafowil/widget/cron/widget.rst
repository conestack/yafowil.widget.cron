Cron widget
===========

Load requirements::

    >>> import yafowil.loader
    >>> import yafowil.widget.cron
    >>> from yafowil.base import factory

Render widget::

    >>> widget = factory('cron', 'cronwidget')
    >>> widget()
    u'<div class="crontab widget" id="input-cronwidget">...</div>'

Base extraction::

    >>> data = widget.extract({})
    >>> data.printtree()
    <RuntimeData cronwidget, value=<UNSET>, extracted=odict([('minute', <UNSET>), ('hour', <UNSET>), ('dow', <UNSET>), ('dom', <UNSET>), ('month', <UNSET>)]) at ...>
      <RuntimeData cronwidget.minute, value=<UNSET>, extracted=<UNSET> at ...>
      <RuntimeData cronwidget.hour, value=<UNSET>, extracted=<UNSET> at ...>
      <RuntimeData cronwidget.dow, value=<UNSET>, extracted=<UNSET> at ...>
      <RuntimeData cronwidget.dom, value=<UNSET>, extracted=<UNSET> at ...>
      <RuntimeData cronwidget.month, value=<UNSET>, extracted=<UNSET> at ...>
      <RuntimeData cronwidget.year, value=<UNSET>, extracted=<UNSET> at ...>

    >>> data.extracted
    odict([('minute', <UNSET>), 
    ('hour', <UNSET>), 
    ('dow', <UNSET>), 
    ('dom', <UNSET>), 
    ('month', <UNSET>)])

Valid widget extraction. Returns a datastructure, whic can be used with python-crontab::

    >>> request = {
    ...     'cronwidget.month': u'3,6,9,12',
    ...     'cronwidget.dom': u'1,15,30',
    ...     'cronwidget.hour': u'0,6,12,18',
    ...     'cronwidget.minute': u'0,10,20,30,40,50',
    ...     'cronwidget.dow': u'1,3,5'
    ... }

    >>> data = widget.extract(request)
    >>> value = data.extracted
    >>> value
    odict([('minute', u'0,10,20,30,40,50'), 
    ('hour', u'0,6,12,18'), 
    ('dow', u'1,3,5'), 
    ('dom', u'1,15,30'), 
    ('month', u'3,6,9,12')])

Widget with value::

    >> widget = factory('cron', name='cronwidget', value=value)
    >> widget()
