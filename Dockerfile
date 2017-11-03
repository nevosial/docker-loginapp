FROM ubuntu:latest
MAINTAINER nevosial
RUN apt-get update
RUN apt-get install --yes nodejs nodejs-legacy npm
RUN apt-get clean

# Import MongoDB public GPG key AND create a MongoDB list file
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
RUN echo "deb http://repo.mongodb.org/apt/ubuntu $(cat /etc/lsb-release | grep DISTRIB_CODENAME | cut -d= -f2)/mongodb-org/3.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list

# Update apt-get sources AND install MongoDB
RUN apt-get update && apt-get install -y mongodb-org

# Create the MongoDB data directory
RUN mkdir -p /data/db

COPY ./package.json ./package-lock.json src/
RUN cd src && npm install
COPY . /src
WORKDIR src/
EXPOSE 3000
CMD ["npm" , "start"]
