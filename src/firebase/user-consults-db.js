import GenericDB from './generic-db'

export default class UserConsultsDB extends GenericDB {
  constructor(userId) {
    super(`users/${userId}/consults`)
  }

  // Here you can extend UserConsultsDB with custom methods
}
