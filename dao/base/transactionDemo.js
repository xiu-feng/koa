const Transaction = require('../transaction')
const Crud = require('../crud')

const transaction = Transaction()

const table_name = 't_base_car';

const crud = Crud(table_name)

module.exports = {transaction,crud}
