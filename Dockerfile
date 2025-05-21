FROM python:3.10-slim

ENV MPLCONFIGDIR=/tmp/matplotlib

# Install Node.js
RUN apt-get update && apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app
COPY . .

# Install Python deps
RUN pip install -r requirements.txt

# Install Node.js deps
RUN npm install

ENV PORT=7860
EXPOSE 7860

CMD ["npm", "start"]
