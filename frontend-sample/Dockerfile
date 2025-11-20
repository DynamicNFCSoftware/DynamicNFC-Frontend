
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# Step 1: Build React app
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
# Use --legacy-peer-deps to avoid peer dependency resolution failures during build
RUN npm install --legacy-peer-deps
COPY . .
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# Step 2: Serve with nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
# Copy our nginx config (ensure SPA routes fall back to index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
