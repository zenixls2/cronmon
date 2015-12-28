Installation
------------
- prepare
```
    sudo apt-get install nodejs redis
    npm install -g nodemon
    npm install
```
- to run:
```
    sudo service redis start
    nodemon app.js
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
