FROM ubuntu:latest
MAINTAINER nevosial
RUN apt-get update
RUN apt-get install --yes nodejs nodejs-legacy npm
RUN apt-get clean

COPY ./package.json ./package-lock.json src/
RUN cd src && npm install
COPY . /src
WORKDIR src/
CMD ["npm" , "start"]
