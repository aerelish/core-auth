# ---- stage 1: install dependencies ----

FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./

# ci : do clean install of dependencies
# --omit=dev : only install production dependencies
RUN npm ci --omit=dev

# ---- stage 2: build the application ----

FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- stage 3: production runner ----

FROM node:22-alpine AS runner
WORKDIR /app

# creating a non-root user and group for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# copying only what's needed
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# exposing the port the app runs on
EXPOSE 3000

# switch to non-root user for better security
USER appuser

# defining the command to run the application
ENTRYPOINT [ "node" ]
CMD ["dist/index.js" ]