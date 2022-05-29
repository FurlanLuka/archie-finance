FROM node:16-alpine as builder
WORKDIR /service

ARG application

COPY . /service

RUN npm i
RUN npm run build:collateral-api
RUN npm prune --production
RUN ls

FROM node:16-alpine

USER node
WORKDIR /service

COPY --from=builder /service/package*.json /service/
COPY --from=builder /service/node_modules/ /service/node_modules/
COPY --from=builder /service/dist/apps/collateral-api /service/dist/

CMD ["node", "dist/main.js"]