from node.utils import UNSET
from yafowil.base import ExtractionError
from yafowil.base import factory
from yafowil.compat import IS_PY2
from yafowil.tests import fxml
from yafowil.tests import YafowilTestCase
from yafowil.utils import EMPTY_VALUE
import os
import unittest


if not IS_PY2:
    from importlib import reload


def np(path):
    return path.replace('/', os.path.sep)


class TestCronWidget(YafowilTestCase):

    def setUp(self):
        super(TestCronWidget, self).setUp()
        from yafowil.widget import cron
        reload(cron.widget)
        cron.register()

    def test_edit_renderer(self):
        # Render widget
        widget = factory(
            'cron',
            name='cronwidget')
        self.checkOutput("""
        <div class="crontab widget" id="input-cronwidget">
          <div class="cron-value minute">
            <input class="hidden" id="input-cronwidget-minute"
                   name="cronwidget.minute" type="hidden" value=""/>
            <button class="btn btn-sm edit">Minute</button>
          </div>
          <div class="cron-value hour">
            <input class="hidden" id="input-cronwidget-hour"
                   name="cronwidget.hour" type="hidden" value=""/>
            <button class="btn btn-sm edit">Hour</button>
          </div>
          <div class="cron-value dom">
            <input class="hidden" id="input-cronwidget-dom"
                   name="cronwidget.dom" type="hidden" value=""/>
            <button class="btn btn-sm edit">Day of Month</button>
          </div>
          <div class="cron-value month">
            <input class="hidden" id="input-cronwidget-month"
                   name="cronwidget.month" type="hidden" value=""/>
            <button class="btn btn-sm edit">Month</button>
          </div>
          <div class="cron-value dow">
            <input class="hidden" id="input-cronwidget-dow"
                   name="cronwidget.dow" type="hidden" value=""/>
            <button class="btn btn-sm edit">Day of Week</button>
          </div>
          <div class="cron-value year">
            <input class="hidden" id="input-cronwidget-year"
                   name="cronwidget.year" type="hidden" value=""/>
            <button class="btn btn-sm edit">Year</button>
          </div>
          <div class="editarea"/>
        </div>
        """, fxml(widget()))

        # Render with JS config properties
        widget = factory(
            'cron',
            name='cronwidget',
            props={
                'lang': 'de',
                'start_year': 2010,
                'end_year': 2020
            })
        self.checkOutput("""
        <div class="crontab widget"
             data-end_year='2020'
             data-lang='de'
             data-start_year='2010'
             id="input-cronwidget">...</div>
        """, widget())

    def test_display_renderer(self):
        widget = factory(
            'cron',
            name='cronwidget',
            value='* * * * *',
            mode='display')
        self.checkOutput("""
        <div class="display-crontab widget" id="display-cronwidget">
          <code>* * * * *</code>
        </div>
        """, fxml(widget()))

    def test_extraction_empty_request(self):
        widget = factory(
            'cron',
            name='cronwidget')
        data = widget.extract({})
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['cronwidget', UNSET, UNSET, []]
        )
        minute = data['minute']
        self.assertEqual(
            [minute.name, minute.value, minute.extracted, minute.errors],
            ['minute', UNSET, UNSET, []]
        )
        hour = data['hour']
        self.assertEqual(
            [hour.name, hour.value, hour.extracted, hour.errors],
            ['hour', UNSET, UNSET, []]
        )
        dom = data['dom']
        self.assertEqual(
            [dom.name, dom.value, dom.extracted, dom.errors],
            ['dom', UNSET, UNSET, []]
        )
        month = data['month']
        self.assertEqual(
            [month.name, month.value, month.extracted, month.errors],
            ['month', UNSET, UNSET, []]
        )
        dow = data['dow']
        self.assertEqual(
            [dow.name, dow.value, dow.extracted, dow.errors],
            ['dow', UNSET, UNSET, []]
        )
        year = data['year']
        self.assertEqual(
            [year.name, year.value, year.extracted, year.errors],
            ['year', UNSET, UNSET, []]
        )

    def test_extraction_request_values(self):
        # Valid widget extraction. Returns a datastructure, whic can be used
        # with python-crontab
        widget = factory(
            'cron',
            name='cronwidget')
        request = {
            'cronwidget.month': u'3,6,9,12',
            'cronwidget.dom': u'1,15,30',
            'cronwidget.hour': u'0,6,12,18',
            'cronwidget.minute': u'0,10,20,30,40,50',
            'cronwidget.dow': u'1,3,5',
            'cronwidget.year': u'2017'
        }
        data = widget.extract(request)
        extracted = '0,10,20,30,40,50 0,6,12,18 1,15,30 3,6,9,12 1,3,5 2017'
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['cronwidget', UNSET, extracted, []]
        )
        minute = data['minute']
        self.assertEqual(
            [minute.name, minute.value, minute.extracted, minute.errors],
            ['minute', UNSET, '0,10,20,30,40,50', []]
        )
        hour = data['hour']
        self.assertEqual(
            [hour.name, hour.value, hour.extracted, hour.errors],
            ['hour', UNSET, '0,6,12,18', []]
        )
        dom = data['dom']
        self.assertEqual(
            [dom.name, dom.value, dom.extracted, dom.errors],
            ['dom', UNSET, '1,15,30', []]
        )
        month = data['month']
        self.assertEqual(
            [month.name, month.value, month.extracted, month.errors],
            ['month', UNSET, '3,6,9,12', []]
        )
        dow = data['dow']
        self.assertEqual(
            [dow.name, dow.value, dow.extracted, dow.errors],
            ['dow', UNSET, '1,3,5', []]
        )
        year = data['year']
        self.assertEqual(
            [year.name, year.value, year.extracted, year.errors],
            ['year', UNSET, '2017', []]
        )

    def test_extraction_empty_value(self):
        widget = factory(
            'cron',
            name='cronwidget')
        request = {
            'cronwidget.month': '',
            'cronwidget.dom': '',
            'cronwidget.hour': '',
            'cronwidget.minute': '',
            'cronwidget.dow': '',
            'cronwidget.year': ''
        }
        data = widget.extract(request)
        self.assertEqual(data.extracted, EMPTY_VALUE)

        widget = factory(
            'cron',
            name='cronwidget',
            props={
                'emptyvalue': None
            })
        data = widget.extract(request)
        self.assertEqual(data.extracted, None)

    def test_extraction_invalid_value(self):
        widget = factory(
            'cron',
            name='cronwidget')
        request = {
            'cronwidget.month': '*',
            'cronwidget.dom': '',
            'cronwidget.hour': '',
            'cronwidget.minute': '',
            'cronwidget.dow': '',
            'cronwidget.year': ''
        }
        data = widget.extract(request)
        msg = (
            'Invalid cron rule. You must at least '
            'select one item for each criteria'
        )
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['cronwidget', UNSET, UNSET, [ExtractionError(msg)]]
        )

    def test_extraction_required_value(self):
        widget = factory(
            'cron',
            name='cronwidget',
            props={
                'required': True
            })
        request = {
            'cronwidget.month': '',
            'cronwidget.dom': '',
            'cronwidget.hour': '',
            'cronwidget.minute': '',
            'cronwidget.dow': '',
            'cronwidget.year': ''
        }
        data = widget.extract(request)
        msg = 'Mandatory field was empty'
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['cronwidget', UNSET, EMPTY_VALUE, [ExtractionError(msg)]]
        )

    def test_preset_values(self):
        value = '0,10,20,30,40,50 0,6,12,18 1,15,30 3,6,9,12 1,3,5 2017'
        widget = factory(
            'cron',
            name='cronwidget',
            value=value)
        self.checkOutput("""
        ...name="cronwidget.minute" type="hidden" value="0,10,20,30,40,50"
        ...name="cronwidget.hour" type="hidden" value="0,6,12,18"
        ...name="cronwidget.dom" type="hidden" value="1,15,30"
        ...name="cronwidget.month" type="hidden" value="3,6,9,12"
        ...name="cronwidget.dow" type="hidden" value="1,3,5"
        ...name="cronwidget.year" type="hidden" value="2017"
        ...
        """, widget())

        data = widget.extract({})
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['cronwidget', value, UNSET, []]
        )
        minute = data['minute']
        self.assertEqual(
            [minute.name, minute.value, minute.extracted, minute.errors],
            ['minute', '0,10,20,30,40,50', UNSET, []]
        )
        hour = data['hour']
        self.assertEqual(
            [hour.name, hour.value, hour.extracted, hour.errors],
            ['hour', '0,6,12,18', UNSET, []]
        )
        dom = data['dom']
        self.assertEqual(
            [dom.name, dom.value, dom.extracted, dom.errors],
            ['dom', '1,15,30', UNSET, []]
        )
        month = data['month']
        self.assertEqual(
            [month.name, month.value, month.extracted, month.errors],
            ['month', '3,6,9,12', UNSET, []]
        )
        dow = data['dow']
        self.assertEqual(
            [dow.name, dow.value, dow.extracted, dow.errors],
            ['dow', '1,3,5', UNSET, []]
        )
        year = data['year']
        self.assertEqual(
            [year.name, year.value, year.extracted, year.errors],
            ['year', '2017', UNSET, []]
        )

        request = {
            'cronwidget.month': u'3,6',
            'cronwidget.dom': u'1,15',
            'cronwidget.hour': u'12,18',
            'cronwidget.minute': u'0,10,20',
            'cronwidget.dow': u'1',
            'cronwidget.year': u'*'
        }
        data = widget.extract(request)
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['cronwidget', value, '0,10,20 12,18 1,15 3,6 1 *', []]
        )
        minute = data['minute']
        self.assertEqual(
            [minute.name, minute.value, minute.extracted, minute.errors],
            ['minute', '0,10,20,30,40,50', '0,10,20', []]
        )
        hour = data['hour']
        self.assertEqual(
            [hour.name, hour.value, hour.extracted, hour.errors],
            ['hour', '0,6,12,18', '12,18', []]
        )
        dom = data['dom']
        self.assertEqual(
            [dom.name, dom.value, dom.extracted, dom.errors],
            ['dom', '1,15,30', '1,15', []]
        )
        month = data['month']
        self.assertEqual(
            [month.name, month.value, month.extracted, month.errors],
            ['month', '3,6,9,12', '3,6', []]
        )
        dow = data['dow']
        self.assertEqual(
            [dow.name, dow.value, dow.extracted, dow.errors],
            ['dow', '1,3,5', '1', []]
        )
        year = data['year']
        self.assertEqual(
            [year.name, year.value, year.extracted, year.errors],
            ['year', '2017', '*', []]
        )

        value = '1 2 3 4 5'
        widget = factory(
            'cron',
            name='cronwidget',
            value=value)
        self.checkOutput("""
        ...name="cronwidget.minute" type="hidden" value="1"
        ...name="cronwidget.hour" type="hidden" value="2"
        ...name="cronwidget.dom" type="hidden" value="3"
        ...name="cronwidget.month" type="hidden" value="4"
        ...name="cronwidget.dow" type="hidden" value="5"
        ...name="cronwidget.year" type="hidden" value="*"
        ...
        """, widget())

        value = '1 2 3 4'
        widget = factory(
            'cron',
            name='cronwidget',
            value=value)
        with self.assertRaises(ValueError):
            widget()

    def test_in_conjunction_with_hybrid_blueprint(self):
        value = '0,10,20,30,40,50 0,6,12,18 1,15,30 3,6,9,12 1,3,5 2017,2018,2019'
        widget = factory(
            'div:cron',
            name='cronwidget',
            value=value,
            props={
                'leaf': True,
                'div.class': 'wrapper-div'
            })
        self.checkOutput("""
        <div class="wrapper-div"><div class="crontab widget" ...>...</div></div>
        """, widget())

        request = {
            'cronwidget.month': u'1',
            'cronwidget.dom': u'2',
            'cronwidget.hour': u'3',
            'cronwidget.minute': u'4',
            'cronwidget.dow': u'5',
            'cronwidget.year': u'*'
        }

        data = widget.extract(request)
        self.assertEqual(
            [data.name, data.value, data.extracted, data.errors],
            ['cronwidget', value, '4 3 2 1 5 *', []]
        )
        minute = data['minute']
        self.assertEqual(
            [minute.name, minute.value, minute.extracted, minute.errors],
            ['minute', '0,10,20,30,40,50', '4', []]
        )
        hour = data['hour']
        self.assertEqual(
            [hour.name, hour.value, hour.extracted, hour.errors],
            ['hour', '0,6,12,18', '3', []]
        )
        dom = data['dom']
        self.assertEqual(
            [dom.name, dom.value, dom.extracted, dom.errors],
            ['dom', '1,15,30', '2', []]
        )
        month = data['month']
        self.assertEqual(
            [month.name, month.value, month.extracted, month.errors],
            ['month', '3,6,9,12', '1', []]
        )
        dow = data['dow']
        self.assertEqual(
            [dow.name, dow.value, dow.extracted, dow.errors],
            ['dow', '1,3,5', '5', []]
        )
        year = data['year']
        self.assertEqual(
            [year.name, year.value, year.extracted, year.errors],
            ['year', '2017,2018,2019', '*', []]
        )

    def test_resources(self):
        factory.theme = 'default'
        resources = factory.get_resources('yafowil.widget.cron')
        self.assertTrue(resources.directory.endswith(np('/cron/resources')))
        self.assertEqual(resources.path, 'yafowil-cron')

        scripts = resources.scripts
        self.assertEqual(len(scripts), 1)

        self.assertTrue(scripts[0].directory.endswith(np('/cron/resources')))
        self.assertEqual(scripts[0].path, 'yafowil-cron')
        self.assertEqual(scripts[0].file_name, 'widget.min.js')
        self.assertTrue(os.path.exists(scripts[0].file_path))

        styles = resources.styles
        self.assertEqual(len(styles), 1)

        self.assertTrue(styles[0].directory.endswith(np('/cron/resources')))
        self.assertEqual(styles[0].path, 'yafowil-cron')
        self.assertEqual(styles[0].file_name, 'widget.css')
        self.assertTrue(os.path.exists(styles[0].file_path))


if __name__ == '__main__':
    unittest.main()
