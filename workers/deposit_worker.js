const queue = require('../configs/kue')
const {depositEmail} = require('../utils/index') 

queue.process('depositEmail', (job, done) => {
    console.log(job.data)
    depositEmail(job.data.transaction, job.data.user)
    done()
})