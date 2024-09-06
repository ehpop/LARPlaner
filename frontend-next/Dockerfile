FROM node:18-alpine
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /frontend-next

COPY . /frontend-next

RUN npm install -g npm@10.8.2
RUN npm install --force

EXPOSE 9000

CMD npm run dev

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD curl -f http://localhost:9000/api/health || exit 1
