Datetime widget
===============

Features
--------

- Use ``bda.intellidatetime`` for extraction

- Render with or without time input

Load requirements::

    >>> import yafowil.loader
    >>> import yafowil.widget.datetime
    >>> from yafowil.base import factory

Datetime
--------

Render very basic widget::

    >>> widget = factory('datetime', 'dt')
    >>> widget()
    u'<input class="datetime" id="input-dt" name="dt" size="10" type="text" 
    value="" />'

Base extraction::

    >>> data = widget.extract({})
    >>> data.printtree()
    <RuntimeData dt, value=<UNSET>, extracted='' at ...>

Render datepicker class. Use this to bind a datepicker JS of your choice::
  
    >>> widget = factory(
    ...     'datetime',
    ...     'dt',
    ...     props = {
    ...         'datepicker': True,
    ...     })
    >>> widget()
    u'<input class="datepicker datetime" id="input-dt" name="dt" size="10" 
    type="text" value="" />'

Widget without time input::

    >>> widget = factory(
    ...     'datetime',
    ...     'dt',
    ...     props = {
    ...         'required': 'No date given',
    ...     })
    >>> widget()
    u'<input class="datetime required" id="input-dt" name="dt" size="10" 
    type="text" value="" />'

Widget extraction::

    >>> request = {'dt': ''}
    >>> data = widget.extract(request)
    >>> data.errors
    [ExtractionError('No date given',)]

    >>> data.extracted
    ''

Widget renders empty value::

    >>> widget(data)
    u'<input class="datetime required" id="input-dt" name="dt" size="10" 
    type="text" value="" />'

Widget extraction with non-date input::

    >>> request = {'dt': 'xyz'}
    >>> data = widget.extract(request)
    >>> data.errors
    [ExtractionError('Not a valid date input.',)]

    >>> data.extracted
    'xyz'

    >>> widget(data)
    u'<input class="datetime required" id="input-dt" name="dt" size="10" 
    type="text" 
    value="xyz" />'

Valid widget extraction. Returns datetime instance::

    >>> request = {'dt': '2010.1.1'}
    >>> data = widget.extract(request)
    >>> data.errors
    []

    >>> data.extracted
    datetime.datetime(2010, 1, 1, 0, 0)

    >>> widget(data)
    u'<input class="datetime required" id="input-dt" name="dt" size="10" 
    type="text" value="2010-1-1" />'

Widget with more advanced configuration. Widget now renders time input and
input converting is locale aware. You can pass ``tzinfo`` property as well if
you want the conversion to consider timezones::

    >>> widget = factory(
    ...     'datetime',
    ...     'dt',
    ...     props = {
    ...         'datepicker': True,
    ...         'required': 'No date given',
    ...         'delimiter': '.',
    ...         'locale': 'de',
    ...         'time': True,
    ...         'timepicker': True,
    ...         'tzinfo': None,
    ...     })
    >>> widget()
    u'<input class="datepicker datetime required" id="input-dt" name="dt" 
    size="10" 
    type="text" value="" /><input class="timepicker" id="input-dt-time" 
    name="dt.time" size="5" type="text" value="" />'

Widget extraction::

    >>> request = {'dt': '', 'dt.time': ''}
    >>> data = widget.extract(request)

No input was given::

    >>> data.errors
    [ExtractionError('No date given',)]

Empty string in extracted data::

    >>> data.extracted
    ''

Widget renders empty value::

    >>> widget(data)
    u'<input class="datepicker datetime required" id="input-dt" name="dt" 
    size="10" 
    type="text" value="" /><input class="timepicker" id="input-dt-time" 
    name="dt.time" size="5" 
    type="text" value="" />'

Widget extraction with non-datetime input::

    >>> request = {'dt': 'xyz', 'dt.time': 'x'}
    >>> data = widget.extract(request)
    >>> data.errors
    [ExtractionError('Not a valid date input.',)]

    >>> data.extracted
    'xyz'

    >>> widget(data)
    u'<input class="datepicker datetime required" id="input-dt" name="dt" 
    size="10" 
    type="text" value="xyz" /><input class="timepicker" id="input-dt-time" 
    name="dt.time" 
    size="5" type="text" value="x" />'

Valid widget extraction. Returns datetime instance::

    >>> request = {'dt': '1.1.2010', 'dt.time': '10:15'}
    >>> data = widget.extract(request)
    >>> data.errors
    []

    >>> data.extracted
    datetime.datetime(2010, 1, 1, 10, 15)

    >>> widget(data)
    u'<input class="datepicker datetime required" id="input-dt" name="dt" 
    size="10" 
    type="text" value="1.1.2010" /><input class="timepicker" 
    id="input-dt-time" name="dt.time" 
    size="5" type="text" value="10:15" />'

Locale might be a callable::

    >>> def callable_locale(widget, data):
    ...     print "locale called"
    ...     return 'de'
    >>> widget = factory('datetime', 'dt',
    ...     props = { 'locale': callable_locale })
    >>> widget()
    locale called
    u'<input class="datetime" id="input-dt" name="dt" size="10" type="text" 
    value="" />'

Test widget with given datetime value::

    >>> import datetime
    >>> widget = factory(
    ...     'datetime',
    ...     'dt',
    ...     value=datetime.datetime(2011, 5, 1),
    ...     props = {
    ...         'time': True,
    ...     })
    >>> widget()
    u'<input class="datetime" id="input-dt" name="dt" size="10" type="text" 
    value="2011-5-1" 
    /><input id="input-dt-time" name="dt.time" size="5" type="text" 
    value="00:00" />'

Test widget in display mode::

    >>> widget = factory(
    ...     'datetime',
    ...     'dt',
    ...     value=datetime.datetime(2011, 5, 1),
    ...     mode='display')
    >>> widget()
    u'<div class="display-datetime" id="display-dt">2011-05-01 00:00</div>'

    >>> widget = factory(
    ...     'datetime',
    ...     'dt',
    ...     value=datetime.datetime(2011, 5, 1),
    ...     props = {
    ...         'format': '%Y.%m.%d',
    ...     },
    ...     mode='display')
    >>> widget()
    u'<div class="display-datetime" id="display-dt">2011.05.01</div>'

    >>> widget = factory(
    ...     'datetime',
    ...     'dt',
    ...     mode='display')
    >>> widget()
    u''

    >>> def custom_formatter(widget, data):
    ...      return data.value.strftime('at year %Y at month %m at day %d')

    >>> widget = factory(
    ...     'datetime',
    ...     'dt',
    ...     value=datetime.datetime(2011, 5, 1),
    ...     props = {
    ...         'format': custom_formatter,
    ...     },
    ...     mode='display')
    >>> widget()
    u'<div class="display-datetime" id="display-dt">at year 2011 at month 05 
    at day 01</div>'

Time
----

Render base widget::

    >>> widget = factory('time', 't')
    >>> widget()
    u'<input class="time" id="input-t" name="t" size="5" type="text" 
    value="" />'

Extract empty::

    >>> data = widget.extract({})
    >>> data.printtree()
    <RuntimeData t, value=<UNSET>, extracted=<UNSET> at ...>

Invalid time input::

    >>> data = widget.extract({'t': 'abcdef'})
    >>> data.errors
    [ExtractionError('Not a valid time input.',)]

Parsinf Failure::

    >>> data = widget.extract({'t': 'abc'})
    >>> data.errors
    [ExtractionError('Failed to parse time input.',)]

Hours not a number::

    >>> data = widget.extract({'t': 'aa00'})
    >>> data.errors
    [ExtractionError('Hours not a number.',)]

Minutes not a number::

    >>> data = widget.extract({'t': '00:aa'})
    >>> data.errors
    [ExtractionError('Minutes not a number.',)]

Extract hours and minute without delimiter. Only wotks for 4-character values.
Widget format is ``string`` by default::

    >>> data = widget.extract({'t': '0101'})
    >>> data.printtree()
    <RuntimeData t, value=<UNSET>, extracted='01:01' at ...>

Extract with delimiter::

    >>> data = widget.extract({'t': '1:1'})
    >>> data.printtree()
    <RuntimeData t, value=<UNSET>, extracted='01:01' at ...>

Validate day time. triggers if ``daytime`` or ``timepicker`` set to ``True``::

    >>> widget = factory('time', 't', value='02:02', props={
    ...     'daytime': True})
    >>> data = widget.extract({'t': '25:1'})
    >>> data.errors
    [ExtractionError('Hours must be in range 0..23.',)]

    >>> data = widget.extract({'t': '1:61'})
    >>> data.errors
    [ExtractionError('Minutes must be in range 0..59.',)]

    >>> widget = factory('time', 't', value='02:02', props={
    ...     'timepicker': True})
    >>> data = widget.extract({'t': '25:1'})
    >>> data.errors
    [ExtractionError('Hours must be in range 0..23.',)]

    >>> data = widget.extract({'t': '1:61'})
    >>> data.errors
    [ExtractionError('Minutes must be in range 0..59.',)]

Additional CSS class is rendered for timepicker if ``timepicker`` set::

    >>> widget()
    u'<input class="time timepicker" id="input-t" name="t" size="5" 
    type="text" value="02:02" />'

Value rendering if preset and extracted::

    >>> widget = factory('time', 't', value='02:02')
    >>> widget()
    u'<input class="time" id="input-t" name="t" size="5" 
    type="text" value="02:02" />'

    >>> data = widget.extract({'t': '1:12'})
    >>> data.extracted
    '01:12'

    >>> widget(data)
    u'<input class="time" id="input-t" name="t" size="5" 
    type="text" value="01:12" />'

Render display mode without value::

    >>> widget = factory('time', 't', mode='display')
    >>> widget()
    u''

Render display mode with value::

    >>> widget = factory('time', 't', value='02:02', mode='display')
    >>> widget()
    u'<div class="display-time" id="display-t">02:02</div>'

Invalid ``format``::

    >>> widget = factory('time', 't', props={'format': 'inexistent'})
    >>> data = widget.extract({'t': '1:12'})
    Traceback (most recent call last):
      ...
    ValueError: Unknown format 'inexistent'

Number ``format``. Default unit is ``hours``::

    >>> widget = factory('time', 't', props={'format': 'number'})
    >>> data = widget.extract({'t': '1:12'})
    >>> data.printtree()
    <RuntimeData t, value=<UNSET>, extracted=1.2 at ...>

Number format without preset value::

    >>> widget = factory('time', 't', props={'format': 'number'})
    >>> widget()
    u'<input class="time" id="input-t" name="t" size="5" type="text" 
    value="" />'

Number format with preset value::

    >>> widget = factory('time', 't', value=1.2, props={'format': 'number'})
    >>> widget()
    u'<input class="time" id="input-t" name="t" size="5" 
    type="text" value="01:12" />'

    >>> data = widget.extract({'t': '0:12'})
    >>> '%0.1f' % data.extracted
    '0.2'

    >>> widget(data)
    u'<input class="time" id="input-t" name="t" size="5" 
    type="text" value="00:12" />'

    >>> widget = factory('time', 't', value=0, props={'format': 'number'})
    >>> widget()
    u'<input class="time" id="input-t" name="t" 
    size="5" type="text" value="00:00" />'

    >>> data = widget.extract({'t': ''})
    >>> data.extracted
    <UNSET>

    >>> data = widget.extract({'t': '0:0'})
    >>> data.extracted
    0.0

    >>> widget(data)
    u'<input class="time" id="input-t" name="t" size="5" 
    type="text" value="00:00" />'

    >>> widget = factory('time', 't', value=1.2, mode='display', props={
    ...     'format': 'number'})
    >>> widget()
    u'<div class="display-time" id="display-t">01:12</div>'

Invalid ``unit``::

    >>> widget = factory('time', 't', props={
    ...     'format': 'number',
    ...     'unit': 'inexistent'})
    >>> data = widget.extract({'t': '1:12'})
    Traceback (most recent call last):
      ...
    ValueError: Unknown unit 'inexistent'

Minutes ``unit``::

    >>> widget = factory('time', 't', props={
    ...     'format': 'number',
    ...     'unit': 'minutes'})
    >>> data = widget.extract({'t': '1:12'})
    >>> data.printtree()
    <RuntimeData t, value=<UNSET>, extracted=72 at ...>

Minutes unit with preset value::

    >>> widget = factory('time', 't', value=12, props={
    ...     'format': 'number',
    ...     'unit': 'minutes'})
    >>> widget()
    u'<input class="time" id="input-t" name="t" size="5" 
    type="text" value="00:12" />'

    >>> data = widget.extract({'t': '2:30'})
    >>> data.extracted
    150

    >>> widget(data)
    u'<input class="time" id="input-t" name="t" size="5" 
    type="text" value="02:30" />'

    >>> widget = factory('time', 't', value=12, mode='display', props={
    ...     'format': 'number',
    ...     'unit': 'minutes'})
    >>> widget()
    u'<div class="display-time" id="display-t">00:12</div>'

Format tuple. Preset and extraction value is (hh, mm)::

    >>> widget = factory('time', 't', props={'format': 'tuple'})
    >>> widget()
    u'<input class="time" id="input-t" name="t" size="5" type="text" 
    value="" />'

    >>> data = widget.extract({'t': '2:30'})
    >>> data.extracted
    (2, 30)

    >>> widget = factory('time', 't', value=(5, 30), props={'format': 'tuple'})
    >>> widget()
    u'<input class="time" id="input-t" name="t" size="5" type="text" 
    value="05:30" />'

    >>> data = widget.extract({'t': '2:30'})
    >>> widget(data=data)
    u'<input class="time" id="input-t" name="t" size="5" type="text" 
    value="02:30" />'

    >>> widget = factory('time', 't', value=(0, 0), props={'format': 'tuple'})
    >>> widget()
    u'<input class="time" id="input-t" name="t" size="5" 
    type="text" value="00:00" />'

    >>> data = widget.extract({'t': ''})
    >>> data.extracted
    <UNSET>

    >>> data = widget.extract({'t': '0:0'})
    >>> data.extracted
    (0, 0)
