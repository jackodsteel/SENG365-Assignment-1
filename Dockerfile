FROM node:8.9.4

# Create server directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install server dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle server source
COPY . /usr/src/app

EXPOSE 4941
CMD [ "npm", "start" ]
