export default class ClientUser {
  constructor(User) {
    this.first_name = User.first_name;
    this.last_name = User.last_name;
    this.full_name = `${User.first_name} ${User.last_name}`;
    this.email = User.email;
    this.age = User.age;
  }
}