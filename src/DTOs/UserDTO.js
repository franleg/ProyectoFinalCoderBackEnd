export class UserPresenterDTO {
    constructor(user) {
        this.id = user._id;
        this.name = `${user.first_name} ${user.last_name}`
        this.email = user.email;
        this.phone = user.phone;
        this.adress = user.adress;
    }
}
