FROM node:18-alpine
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /frontend-next

COPY . /frontend-next

RUN npm install

EXPOSE 3000

CMD npm run dev
