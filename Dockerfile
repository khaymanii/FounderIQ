# -------- 1. Build stage --------
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build-time env vars
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# -------- 2. Runtime stage --------
FROM node:20-alpine

WORKDIR /app

# Only copy build output
COPY --from=builder /app/dist ./dist

# Install only vite (tiny)
RUN npm install -g vite

EXPOSE 4173

CMD ["vite", "preview", "--host", "--port", "4173"]
