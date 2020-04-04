const axios = require('axios');

const filterMonitoredTime = (records, monitoredTime) =>{
    return records.filter(record => {
        const time = record.dt_txt.split(" ")[1];
        return time >= monitoredTime.start && time <= monitoredTime.end;
    });
}
const verifyIfWillRainByDay = (records => {
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
});
const treatCharacterForDisplay = daysOfWeek => {
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

const challenge = async(
    monitoredTime,
    apiUrl = 'http://api.openweathermap.org/data/2.5/forecast?q=Macei%C3%B3,Alagoas,BR&appid=8f69775c6b4ec8d992652bfebcedaef8'
) => {
    const response = await axios.get(apiUrl);
    
    const filteredRecords = filterMonitoredTime(response.data.list, {...monitoredTime});
    const daysOfWeek = verifyIfWillRainByDay(filteredRecords);
    console.log(`Não vai dar praia nos seguintes dias: ${treatCharacterForDisplay(daysOfWeek)}`);
};

challenge({
    start: '08:00:00',
    end: '18:00:00'
});