CLI-GUIDE.SERVER
----------------

> CLI-Guide Backend

For run in local

    $ npm install

DOCKER
------

### Building the image

    docker build -t willaguirre/cli-guide-server .

### Run the image

    docker run -p 49160:8080 -d willaguirre/cli-guide-server

### Open

for get the ip

    docker-machine ls

http://192.168.99.100:49160/

### Stop the image

    docker ps

copy the CONTAINER ID

    docker stop ef3c91cf5d80

### Delete the image

    docker images

delete by IMAGE ID

    docker rmi --force  8234f51489e8
