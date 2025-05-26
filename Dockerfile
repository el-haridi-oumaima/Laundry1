FROM node:18

# Install Expo CLI
RUN npm install -g expo-cli

WORKDIR /app
COPY . .

RUN npm install

EXPOSE 19000 19001 19002

CMD ["npx", "expo", "start", "--tunnel"]
