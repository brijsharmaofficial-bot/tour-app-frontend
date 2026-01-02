class RegistrationModel {
    public email: string;
    public name: string;
    public phone: string;
    public password: string;

    constructor(email: string, name: string, phone: string, password: string) {
        this.email = email;
        this.name = name;
        this.phone = phone;
        this.password = password;
    }

    // Example method for validating email format
    public validateEmail(): boolean {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(this.email);
    }

    // Example method for checking password strength
    public isPasswordStrong(): boolean {
        return this.password.length >= 8; // Simple check for minimum length
    }
}