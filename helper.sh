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


# Configure site
cd src
mkdir -p app \
    components \
    pages \
    content \
    data-model \
    assets


# Visually test the site
npm run dev -- --host


# Build and preview
npm run build

npm run preview -- --host