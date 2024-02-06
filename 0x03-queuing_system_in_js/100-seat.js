const redis = require('redis');
const { promisify } = require('util');
const express = require('express');
const Kue = require('kue');
const app = express();
const queue = new Kue();

// Create a Redis client and connect to the server
const client = redis.createClient();

// Set the number of available seats when the server starts
client.set('available_seats', '50');

// Promisify the Redis client commands
const getCurrentAvailableSeats = promisify(client.get).bind(client, 'available_seats');
const reserveSeat = (number) => {
    const currentSeats = parseInt(getCurrentAvailableSeats());
    client.set('available_seats', String(currentSeats - number));
    return currentSeats - number;
};

// Queue reservation job
queue.process('reserve_seat', async (job, done) => {
    try {
        const reservedSeats = reserveSeat(job.data);
        console.log('Seat reservation job', job.id, 'completed');
        done();
    } catch (error) {
        console.log('Seat reservation job', job.id, 'failed:', error.message);
        done(error);
    }
});

// Routes
app.get('/available_seats', (req, res) => {
    const availableSeats = getCurrentAvailableSeats().then((value) => {
        res.json({ numberOfAvailableSeats: value });
    });
});

app.get('/reserve_seat', (req, res) => {
    const isEnabled = getCurrentAvailableSeats().then((value) => {
        if (value < 0) {
            res.json({ status: 'Reservation are blocked' });
        } else {
            const job = queue.create('reserve_seat', 1);
            res.json({ status: 'Reservation in process' });
        }
    });
});

app.get('/process', (req, res) => {
    getCurrentAvailableSeats().then((value) => {
        const reservedSeats = reserveSeat(1);
        if (reservedSeats === 0) {
            res.json({ status: 'Queue processing' });
        } else {
            queue.process('reserve_seat', (job, done) => {
                done(new Error('Not enough seats available'));
            });
        }
    });
});

const PORT = 1245;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
