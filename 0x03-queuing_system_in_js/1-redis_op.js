import redis from 'redis';

const redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379,
});

redisClient.on('connect', () => {
  console.log('Redis client connected to the server');
});

redisClient.on('error', (err) => {
  console.log('Redis client not connected to the server:', err);
});

redisClient.connect();

function setNewSchool(schoolName, value) {
  redisClient.set(schoolName, value, (err, res) => {
    if (err) {
      console.log('Error setting school value:', err);
      return;
    }

    console.log('School');
    redisClient.print(`Reply: ${value}`);
    console.log('Reply:', res);
  });
}

function displaySchoolValue(schoolName) {
  redisClient.get(schoolName, (err, value) => {
    if (err) {
      console.log('Error displaying school value:', err);
      return;
    }

    console.log('School value:', value);
  });
}

setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
