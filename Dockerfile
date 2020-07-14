# base image
FROM node:8.12.0

# install chrome for protractor tests
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -yq google-chrome-stable

# set working directory
WORKDIR /app

# install and cache app dependencies
COPY package*.json /app/

RUN npm install -g @angular/cli@1.7.4
RUN npm ci

# add app
COPY . /app

RUN chmod +x ./wait-for-it.sh

#RUN npm run build

# start app
CMD ng serve --host 0.0.0.0
