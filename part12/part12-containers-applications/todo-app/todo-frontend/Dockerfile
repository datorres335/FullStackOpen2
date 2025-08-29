FROM node:20  AS build-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

# Add test stage
FROM build-stage AS test-stage

# Run tests
RUN npm run test:run

FROM build-stage AS production-build

RUN npm run build

# This is a new stage, everything before this is gone, except for the files that we want to COPY
FROM nginx:1.25-alpine

# COPY the directory dist from the production-build stage to /usr/share/nginx/html
COPY --from=production-build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]