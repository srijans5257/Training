class Day{
    constructor(year,month,day){
        this.year=year;
        this.month=month;
        this.day=day;
    }
}
function getDaysinMonth(year,month){
    let daysInMonth;
    if (month === 2) {  
        if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
            daysInMonth = 29;
        } else {
            daysInMonth = 28;
        }
    } else if (month === 4 || month === 6 || month === 9 || month === 11) {
        daysInMonth = 30; 
    } else {
        daysInMonth = 31;
    }

    const daysArray = [];
    for (let i = 1; i <= daysInMonth; i++) {
        daysArray.push(new Day(year, month, i));
    }

    return daysArray;
}
console.log(getDaysinMonth(2024,8));