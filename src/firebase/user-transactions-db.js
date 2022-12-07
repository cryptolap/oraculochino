import GenericDB from './generic-db'

export default class UserTransactionsDB extends GenericDB {
  constructor(userId) {
    super(`users/${userId}/transactions`)
  }

  // Here you can extend UserTransactionsDB with custom methods
}
