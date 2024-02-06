import redis from 'redis';

const redis = require('redis');

const client = redis.createClient();

client.on('connect', function(
) {
    console.log('Redis client connected to the server');
    publishMessage('Holberton Student #1 starts course', 100);
    publishMessage('Holberton Student #2 starts course', 200);
    publishMessage('KILL_SERVER', 300);
    publishMessage('Holberton Student #3 starts course', 400);
});

function publishMessage(message, time) {
    setTimeout(() => {
        console.log('About to send ' + message);
        client.publish('holberton school channel', message);
    }, time);
}

client.on('error', function (err) {
    console.error('Redis client not connected to the server: ' + err.message);
});
