#!/bin/sh

set -e

./bin/coverage run \
    --source src/yafowil/widget/cron \
    --omit src/yafowil/widget/cron/example.py \
    -m yafowil.widget.cron.tests
./bin/coverage report
./bin/coverage html
