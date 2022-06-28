FROM node:16-alpine as builder
WORKDIR /service

ARG LOCAL

COPY . /service

ENV NX_DEAMON=false

RUN npm i
RUN npm run build:referral-system-api --skip-nx-cache
RUN if [ "$LOCAL" != "" ] ; then cp apps/referral-system-api/.env dist/apps/referral-system-api ; fi
RUN npm prune --production

FROM node:16-alpine

ARG LOCAL

WORKDIR /service

COPY --from=builder /service/package*.json /service/
COPY --from=builder /service/node_modules/ /service/node_modules/
COPY --from=builder /service/dist/apps/referral-system-api /service/dist/

RUN if [ "$LOCAL" != "" ] ; then cp ./dist/.env ./ ; fi

USER node

CMD ["node", "dist/main.js"]