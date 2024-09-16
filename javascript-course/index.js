class School {
    constructor(name) {
        this.name = name;
    }

    getSchoolName() {
        return this.name;
    }
}

class Employee extends School {
    constructor(name, schoolName) {
        super(schoolName);
        this.employeeName = name;
    }

    getEmployeeName() {
        return this.employeeName;
    }
}

class Teacher extends Employee {
    constructor(name, schoolName, designation) {
        super(name, schoolName);
        this.designation = designation;
    }

    getInfo() {
        console.log(`${this.getEmployeeName()} -> ${this.getSchoolName()} -> ${this.designation}`);
    }
}
const myTeacher = new Teacher("Jane Smith", "Greenwood High", "Math Teacher");
myTeacher.getInfo();