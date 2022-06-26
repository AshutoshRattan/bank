const queue = require('../configs/kue')
const {withdrawEmail} = require('../utils/index') 

queue.process('withdrawEmail', (job, done) => {
    console.log(job.data)
    withdrawEmail(job.data.transaction, job.data.user)
    done()
})