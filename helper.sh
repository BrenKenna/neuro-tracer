#!/bin/bash


# Configure project
npm create vite@latest \
    neuro-tracer -- \
    --template react-ts

npm install


# Fetch dependencies
npm install \
    react-router-dom \
    zod dexie \
    moveable selecto \
    vitest \
    pino \
    tailwindcss @tailwindcss/vite


