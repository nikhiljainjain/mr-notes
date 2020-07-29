/**
 * @description => calculate number of days between start & end date
 * 
 * @param {*} startDate 
 * @param {*} endDate 
 */
const calculateTimeDurationInDays = async (startDate=null, endDate=Date.now())=>{
	try{
		const startedDate = new Date(startDate);
		const endingDate = new Date(endDate);
		const diff_ms = endingDate.getTime() - startedDate.getTime();
		
		const days = Math.round(diff_ms/ONE_DAY_TIME_IN_MSEC); 
		return days;
	}catch(error){
		console.error("OOPS!!!", error);
	}
}

module.exports = { calculateTimeDurationInDays };