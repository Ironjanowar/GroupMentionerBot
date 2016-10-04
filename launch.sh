#!/bin/bash

while true; do
    git pull
    node bot.py
    sleep 5
done


