const axios = require('axios');

const { 
    filterMonitoredTime, 
    verifyIfWillRainByDay, 
    treatCharacterForDisplay
} = require('./src/helpers');

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
    start: process.argv[2] ?  process.argv[2] : '08:00:00',
    end: process.argv[3] ?  process.argv[3] : '18:00:00'
});