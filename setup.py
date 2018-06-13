# -*- coding: utf-8 -*-
"""Installer for the yafowil.widget.cron package."""
from setuptools import find_packages
from setuptools import setup


version = '1.1.dev0'
shortdesc = 'Cron widget for YAFOWIL'
longdesc = '\n\n'.join([
    open('README.rst').read(),
    open('CHANGES.rst').read(),
    open('LICENSE.rst').read(),
])
tests_require = ['yafowil[test]']


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
    author='BlueDynamics Alliance',
    author_email='dev@bluedynamics.com',
    url=u'http://pypi.python.org/pypi/yafowil.widget.cron',
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
    tests_require=tests_require,
    extras_require=dict(
        test=tests_require,
    ),
    test_suite="yafowil.widget.cron.tests",
    entry_points="""
    [yafowil.plugin]
    register = yafowil.widget.cron:register
    example = yafowil.widget.cron.example:get_example
    """
)
