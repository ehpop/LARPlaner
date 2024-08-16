FROM node:18-alpine
RUN apk add --no-cache g++ make py3-pip libc6-compat
COPY . .
EXPOSE 3000
RUN npm install
CMD npm run dev
