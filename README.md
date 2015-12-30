Installation
------------
- prepare
```
    sudo apt-add-repository ppa:chris-lea/node.js
    sudo apt-get update
    sudo apt-get install nodejs redis-server nginx
    sudo npm install -g pm2
    sudo cp redis.conf /etc/init/
    npm install
    # set up reverse proxy for nginx
```
- to run:
```
    sudo service redis start
    pm2 startup ubuntu
    pm2 start app.js
```
- endpoints:
```
    /{appname}/run: initialize monitoring
    /{appname}/check?code=xxx: report the result. if successs, expire the record in 1day.
    /stat: show all the status in json format
```
- to use in crontab:
```
    0 1 * * * curl http://{domain}/run | ./job | curl http://{domain}/check?code=$?
```
