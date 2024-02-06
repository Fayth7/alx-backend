import kue from 'kue';

const Kue = require('kue');

const blacklist = [
    '4153518780',
    '4153518781'
];

const jobQueue = new Kue();

function sendNotification(phoneNumber, message, job, done) {
    job.progress(0);
    if (blacklist.includes(phoneNumber)) {
        job.fail(new Error(`Phone number ${phoneNumber} is blacklisted`));
    } else {
        job.progress(50);
        console.log('Sending notification to', phoneNumber, ', with message:', message);
        // Add your notification sending logic here
done();
    }
}

jobQueue.process('push_notification_code_2', 2, (job, done) => {
    sendNotification(job.data.phoneNumber, job.data.message, job, done);
});

jobQueue.on('job', (job) => {
    console.log('Notification job #', job.id, ' ', job.progress(), '% complete');
});

jobQueue.on('failed', (job, error) => {
    console.error('Notification job #', job.id, ' failed:', error);
});

jobQueue.on('complete', (job) => {
    console.log('Notification job #', job.id, ' completed');
});
