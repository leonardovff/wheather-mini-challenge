module.exports.filterMonitoredTime = (records, monitoredTime) =>{
    return records.filter(record => {
        const time = record.dt_txt.split(" ")[1];
        return time >= monitoredTime.start && time <= monitoredTime.end;
    });
}

module.exports.verifyIfWillRainByDay = records => {
    return records.reduce((daysWithoutRain, record) => {
        const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const dayOfWeekRecord = weekDays[new Date(record.dt_txt).getDay()];
        
        if(!(dayOfWeekRecord in daysWithoutRain)){
            daysWithoutRain[dayOfWeekRecord] = true;
        }
        
        if(daysWithoutRain[dayOfWeekRecord] && record.main.humidity > 70){
            daysWithoutRain[dayOfWeekRecord] = false;
        }
        return daysWithoutRain;
    }, {});
};

module.exports.treatCharacterForDisplay = daysOfWeek => {
    const daysToDisplay = Object.keys(daysOfWeek)
        .filter(key => !daysOfWeek[key]);
    return daysToDisplay.reduce((string, day, i) => {
        if(string.length != 0){
            // handle to put "," or "e"
            string += i == daysToDisplay.length-1 ? " e " : ", ";
        }
        string += day;

        return string;
    }, '');
}