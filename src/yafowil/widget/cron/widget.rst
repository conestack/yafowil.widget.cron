Cron widget
===========

Load requirements::

    >>> import yafowil.loader
    >>> import yafowil.widget.cron
    >>> from yafowil.base import factory


Render widget::

    >>> widget = factory('cron', 'cronwidget')
    >>> widget()
    u'<div class=" crontab widget" id="input-cronwidget">...<input class="text" id="input-cronwidget-minute"...<input class="text" id="input-cronwidget-hour"...<input class="text" id="input-cronwidget-dow"...<input class="text" id="input-cronwidget-dom"...<input class="text" id="input-cronwidget-month"...<input class="text" id="input-cronwidget-year"...


Base extraction::

    >>> data = widget.extract({})
    >>> data.printtree()
    <RuntimeData cronwidget, value=<UNSET>, extracted={'month': <UNSET>, 'dom': <UNSET>, 'hour': <UNSET>, 'minute': <UNSET>, 'dow': <UNSET>} at 0x7fea2aa8b65>


Valid widget extraction. Returns a datastructure, whic can be used with python-crontab::

    >>> request = {'cronwidget': {'month': u'3,6,9,12', 'dom': u'1,15,30', 'hour': u'0,6,12,18', 'minute': u'0,10,20,30,40,50', 'dow': u'1,3,5'}}
    >>> data = widget.extract(request)
    >>> interact(locals())

    >>> data.errors
    [ExtractionError('Not a valid date input.',)]

    >>> data.extracted
    'xyz'

    >>> widget(data)
    u'<input class="datetime required" id="input-dt" name="dt" size="10"
    type="text"
    value="xyz" />'

