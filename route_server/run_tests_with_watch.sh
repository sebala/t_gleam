#!/bin/bash
clear
cmd="nosetests --with-watch"
$cmd
watchmedo shell-command -R -p "*.py" -c "clear && $cmd" .
