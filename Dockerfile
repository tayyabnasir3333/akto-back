FROM node:18.13.0

RUN apt-get update && \
    apt-get install -y redis-server

WORKDIR /app

COPY package*.json .

RUN npm install

RUN npm install -g typescript
COPY . .

ENV MONGOURI=mongodb+srv://aktoo:aktoo@aktoo.e6s8rad.mongodb.net/?retryWrites=true&w=majority
ENV jwtSecret=sdkfgjdsfijfbdsjb
ENV saltRounds=10
ENV Stripe_Secret_Key=sk_test_51OHS5VBH6eDoohcXclz4KbQDKs2qgvsUwGudAHNi3bpGc9I3YulKxGrnDVS0uzvZE2KfFty7oXF0WxhSggyFvt9K00s2H8QOng
ENV Aws_Secret_Key=PL5luBjrJBxW2WowSsOSaZSaO2xnaBupPkrVdD2o
ENV AWS_Access_Key=AKIA26XAUOBEWQEVPCVN
ENV Aws_Bucket_Name=aktoo
ENV Folder_Name=thumbnails
ENV FRONT_SERVER_URL=http://57.180.206.67:7003
# ENV REDIS_HOST=127.0.0.1
# ENV REDIS_PORT=6379
ENV PORT=5001
EXPOSE 5001

CMD ["npm", "run","dev"]