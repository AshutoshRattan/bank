const queue = require('../configs/kue')
const {transactionEmail} = require('../utils/index') 

queue.process('transactionEmail', (job, done) => {
    // job.data
    console.log(job.data)
    transactionEmail(job.data.transaction, job.data.users)
    done()
})