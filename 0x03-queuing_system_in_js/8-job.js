function createPushNotificationsJobs(jobs, queue) {
    if (!Array.isArray(jobs)) {
        throw new Error('Jobs is not an array');
    }

    jobs.forEach((job) => {
        queue.create('push_notification_code_3', job, (err, job) => {
            if (!err) {
                console.log('Notification job created:', job.id);
            } else {
                console.error('Failed to create notification job:', err);
            }
        });

        queue.on('job', (job) => {
            if (job.status === 'done') {
                console.log('Notification job', job.id, 'completed');
            }
        });

        queue.on('failed', (job, error) => {
            console.error('Notification job', job.id, 'failed:', error);
        });

        queue.on('progress', (job) => {
            console.log('Notification job', job.id, job.progress(), '% complete');
        });
    });
}
