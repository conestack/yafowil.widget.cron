from yafowil.base import factory
from yafowil.utils import entry_point
import os
import webresource as wr


resources_dir = os.path.join(os.path.dirname(__file__), 'resources')


##############################################################################
# Default
##############################################################################

# webresource ################################################################

scripts = wr.ResourceGroup(
    name='yafowil-cron-scripts',
    path='yafowil.widget.cron'
)
scripts.add(wr.ScriptResource(
    name='yafowil-cron-js',
    depends='jquery-js',
    directory=resources_dir,
    resource='widget.js',
    compressed='widget.min.js'
))

styles = wr.ResourceGroup(
    name='yafowil-cron-styles',
    path='yafowil.widget.cron'
)
styles.add(wr.StyleResource(
    name='yafowil-cron-css',
    directory=resources_dir,
    resource='widget.css'
))

# B/C resources ##############################################################

js = [{
    'group': 'yafowil.widget.cron.common',
    'resource': 'widget.js',
    'order': 21,
}]
css = [{
    'group': 'yafowil.widget.cron.common',
    'resource': 'widget.css',
    'order': 21,
}]


##############################################################################
# Registration
##############################################################################

@entry_point(order=10)
def register():
    from yafowil.widget.cron import widget  # noqa

    # Default
    factory.register_theme(
        'default', 'yafowil.widget.cron', resources_dir,
        js=js, css=css
    )
    factory.register_scripts('default', 'yafowil.widget.cron', scripts)
    factory.register_styles('default', 'yafowil.widget.cron', styles)
