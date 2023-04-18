FROM reg.deeproute.ai/deeproute-all/mlp/ubuntu-bionic_nodejs16dot14dot2_empty:1.4.2 as build

WORKDIR /code

RUN npm i -g pnpm
COPY ./package.json ./package.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./.npmrc ./.npmrc
RUN npx pnpm install

COPY ./tsconfig.json ./tsconfig.json
COPY ./tsconfig.node.json ./tsconfig.node.json
COPY ./vite.config.ts ./vite.config.ts
COPY ./.eslintrc.js ./.eslintrc.js

COPY ./public ./public
COPY index.html index.html
COPY ./src ./src

ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

FROM nginx:1.22.0

# remove default server at port 80
RUN rm /etc/nginx/conf.d/default.conf

WORKDIR /code

COPY --from=build /code/dist ./build

# nginx image will inject env vars to tempaltes before nginx starts https://hub.docker.com/_/nginx
COPY ./config/nginx.conf.template /etc/nginx/templates/hurricane.conf.template

ARG BUILD_API_GATEWAY
ARG BUILD_NODE_ENV
ARG API_SWIM_HEADER

ENV API_GATEWAY=${BUILD_API_GATEWAY}
ENV NODE_ENV=${BUILD_NODE_ENV}
ENV API_SWIM_HEADER=${API_SWIM_HEADER}

ENV PORT=3000

EXPOSE $PORT

# https://stackoverflow.com/questions/18861300
CMD ["nginx", "-g", "daemon off;"]
