FROM node:16-alpine as builder
WORKDIR /service

ARG LOCAL

COPY . /service

ENV NX_DAEMON=false

#RUN echo "@rizefinance:registry=https://npm.pkg.github.com/" >> ~.npmrc

RUN npm i
RUN npm run build:credit-api --skip-nx-cache
RUN if [ "$LOCAL" != "" ] ; then cp apps/credit-api/.env dist/apps/credit-api ; fi
RUN npm prune --production

FROM node:16-alpine

ARG LOCAL

WORKDIR /service

COPY --from=builder /service/package*.json /service/
COPY --from=builder /service/node_modules/ /service/node_modules/
COPY --from=builder /service/dist/apps/credit-api /service/dist/

RUN if [ "$LOCAL" != "" ] ; then cp ./dist/.env ./ ; fi

USER node

CMD ["node", "dist/main.js"]