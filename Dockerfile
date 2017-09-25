#Define the image we want to build from
FROM node:5.11.0

#Copy the current directory to a newly created working directory
COPY . /code

#Define the working directory - Change this to the directory your Node app is defined in
WORKDIR /code/server

#Install all the node dependencies
RUN npm install

#Define all environment variables. Here, we're defining the PORT environment variable
ENV PORT=3000

#This app binds to port 3000, so we use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

# Run application
CMD [ "node", "server.js"]
