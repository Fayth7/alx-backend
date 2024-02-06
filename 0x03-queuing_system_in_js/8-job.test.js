import Kue from 'kue';
import { createPushNotificationsJobs } from './8-job.js';

const queue = new Kue();
queue.testMode(true);

describe('createPushNotificationsJobs', () => {
    it('display a error message if jobs is not an array', () => {
        const jobData = 'not an array';
        expect(() => {
            createPushNotificationsJobs(jobData, queue);
        }).toThrow(/Jobs is not an array/);
    });

    it('create two new jobs to the queue', () => {
        const jobs = [
            {
                phoneNumber: '4153518780',
                message: 'This is the code 1234 to verify your account'
},
            {
                phoneNumber: '4153518781',
                message: 'This is the code 4567 to verify your account'
}
        ];

        createPushNotificationsJobs(jobs, queue);

        expect(queue.length()).toEqual(2);
    });

    // Add more test cases as needed
afterEach(() => {
        queue.clear();
        queue.testMode(false);
    });
});
