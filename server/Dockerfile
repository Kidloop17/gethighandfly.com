FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY . .
RUN mkdir -p /data
ENV NODE_ENV=production
ENV DATABASE_PATH=/data/registrations.db
EXPOSE 3001
CMD ["node", "index.js"]
