FROM node:18-alpine
LABEL org.opencontainers.image.source=https://github.com/BalonmanoVetusta/handball-liveshow-spain

ARG NODECG_BUNDLE_NAME=handball-liveshow-spain
ARG NODECG_PORT=9090
ARG NODECG_HOST=0.0.0.0
WORKDIR /opt/nodecg/
USER nodecg

RUN apt-get update \
  && apt-get install -y git \
  && rm -rf /var/lib/apt/lists/*

# Sets up the runtime user, makes nodecg-cli available to images which extend this image, and creates the directory structure with the appropriate permissions.
RUN addgroup --system nodecg \
  && adduser --system nodecg --ingroup nodecg \
  && npm i -g nodecg-cli \
  && mkdir cfg bundles logs db assets 

RUN nodecg setup \
  && chown -R nodecg:nodecg /opt/nodecg

COPY --chown=nodecg:nodecg cfg/nodecg* cfg/
COPY --chown=nodecg:nodecg package.json bundles/${NODECG_BUNDLE_NAME}/package.json
COPY --chown=nodecg:nodecg cfg bundles/${NODECG_BUNDLE_NAME}/cfg
COPY --chown=nodecg:nodecg images bundles/${NODECG_BUNDLE_NAME}/images
COPY --chown=nodecg:nodecg schemas bundles/${NODECG_BUNDLE_NAME}/schemas
COPY --chown=nodecg:nodecg dashboard bundles/${NODECG_BUNDLE_NAME}/dashboard
COPY --chown=nodecg:nodecg graphics bundles/${NODECG_BUNDLE_NAME}/graphics
COPY --chown=nodecg:nodecg extension bundles/${NODECG_BUNDLE_NAME}/extension

WORKDIR /opt/nodecg/
VOLUME /opt/nodecg/cfg /opt/nodecg/bundles /opt/nodecg/logs /opt/nodecg/db /opt/nodecg/assets
EXPOSE ${NODECG_PORT:-9090}/tcp

CMD ["node", "/opt/nodecg/index.js"]
