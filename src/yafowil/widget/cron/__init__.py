from yafowil.base import factory
from yafowil.utils import entry_point
import os
import webresource as wr


resources_dir = os.path.join(os.path.dirname(__file__), 'resources')


##############################################################################
# Default
##############################################################################

# webresource ################################################################

resources = wr.ResourceGroup(
    name='yafowil.widget.cron',
    directory=resources_dir,
    path='yafowil-cron'
)
resources.add(wr.ScriptResource(
    name='yafowil-cron-js',
    directory=os.path.join(resources_dir, 'default'),
    path='yafowil-cron/default',
    depends='jquery-js',
    resource='widget.js',
    compressed='widget.min.js'
))
resources.add(wr.StyleResource(
    name='yafowil-cron-css',
    directory=os.path.join(resources_dir, 'default'),
    path='yafowil-cron/default',
    resource='widget.min.css'
))

# B/C resources ##############################################################

js = [{
    'group': 'yafowil.widget.cron.common',
    'resource': 'default/widget.js',
    'order': 21,
}]
css = [{
    'group': 'yafowil.widget.cron.common',
    'resource': 'default/widget.min.css',
    'order': 21,
}]


##############################################################################
# Bootstrap 5
##############################################################################

# webresource ################################################################

bootstrap5_resources = wr.ResourceGroup(
    name='yafowil.widget.cron',
    directory=resources_dir,
    path='yafowil-cron'
)
bootstrap5_resources.add(wr.ScriptResource(
    name='yafowil-cron-js',
    directory=os.path.join(resources_dir, 'bootstrap5'),
    path='yafowil-cron/bootstrap5',
    depends='jquery-js',
    resource='widget.js',
    compressed='widget.min.js'
))
bootstrap5_resources.add(wr.StyleResource(
    name='yafowil-cron-css',
    directory=os.path.join(resources_dir, 'default'),
    path='yafowil-cron/default',
    resource='widget.min.css'
))

# B/C resources ##############################################################

bootstrap5_js = [{
    'group': 'yafowil.widget.cron.common',
    'resource': 'bootstrap5/widget.js',
    'order': 21,
}]


##############################################################################
# Registration
##############################################################################

@entry_point(order=10)
def register():
    from yafowil.widget.cron import widget  # noqa

    widget_name = 'yafowil.widget.cron'

    # Default
    factory.register_theme(
        'default',
        widget_name,
        resources_dir,
        js=js,
        css=css
    )
    factory.register_resources('default', widget_name, resources)

    # Bootstrap 5
    factory.register_theme(
        ['bootstrap5'],
        widget_name,
        resources_dir,
        js=bootstrap5_js,
        css=css
    )

    factory.register_resources(
        ['bootstrap5'],
        widget_name,
        bootstrap5_resources
    )
