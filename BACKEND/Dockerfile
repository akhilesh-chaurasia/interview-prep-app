# Use official Node.js image as base
FROM node:20-alpine

# Install Chromium + libs required for Puppeteer's resume-PDF generation
# (Puppeteer's own bundled Chromium download doesn't run reliably on Alpine)
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Skip Puppeteer's own Chromium download, use the system one instead
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy remaining files
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]