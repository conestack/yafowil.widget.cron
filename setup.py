from setuptools import find_packages
from setuptools import setup
import os


def read_file(name):
    with open(os.path.join(os.path.dirname(__file__), name)) as f:
        return f.read()


version = '2.0.dev0'
shortdesc = 'Cron widget for YAFOWIL'
longdesc = '\n\n'.join([read_file(name) for name in [
    'README.rst',
    'CHANGES.rst',
    'LICENSE.rst'
]])


setup(
    name='yafowil.widget.cron',
    version=version,
    description=shortdesc,
    long_description=longdesc,
    classifiers=[
        'License :: OSI Approved :: BSD License',
        'Environment :: Web Environment',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
    ],
    keywords='',
    author='Yafowil Contributors',
    author_email='dev@conestack.org',
    url=u'http://github.com/conestack/yafowil.widget.cron',
    license='Simplified BSD',
    packages=find_packages('src'),
    package_dir={'': 'src'},
    namespace_packages=['yafowil', 'yafowil.widget'],
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'setuptools',
        'crontab',
        'yafowil>2.2',
    ],
    tests_require=[
        'lxml',
        'zope.testrunner'
    ],
    extras_require=dict(test=[
        'lxml',
        'zope.testrunner'
    ]),
    test_suite="yafowil.widget.cron.tests",
    entry_points="""
    [yafowil.plugin]
    register = yafowil.widget.cron:register
    example = yafowil.widget.cron.example:get_example
    """
)
