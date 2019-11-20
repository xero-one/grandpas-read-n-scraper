/*Let us construct a variable that creates a date for data or articles fetched from the New York Times website*/
let createDate = () => {
    let time = new Date();
    let parsedDate = "";

    /*Set "pasedDate" empty string value to concatinate(+=) with one of the three attributes getMonth
    a built in Java month function instead of using moment npm"*/ 
    parsedDate += (time.getMonth() + 1) + "-";

    /*Set "pasedDate" empty string value to concatinate(+=) with one of the three attributes getDate
    a built in Java day function instead of using moment npm"*/ 
    parsedDate += time.getDate() + "-";

    /*Set "pasedDate" empty string value to concatinate(+=) with one of the three attributes getDate
    a built in Java year function instead of using moment npm"*/ 
    parsedDate += time.getFullYear();
 
    /*Then set the previous date constructor to return a fully concatinated string*/
    return parsedDate;
}

/*Export the important create date function so it can be referred to throughout the rest of the app*/
module.exports = createDate;