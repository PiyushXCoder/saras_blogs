FROM node:alpine3.19

RUN npm install -g pnpm 

COPY . /app
WORKDIR /app

RUN pnpm install && pnpm build

ENTRYPOINT ["/bin/sh", "-c" , "pnpm dlx prisma migrate deploy && pnpm start" ]
