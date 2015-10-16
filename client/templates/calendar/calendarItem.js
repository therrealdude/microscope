Template.calendarItem.helpers({
	inPast: function(){
		var today = new Date();
		today.setHours(0);
		today.setMinutes(0);
		today.setSeconds(0);
		if(this.day < today){
			return "past";
		}else{
			return "";
		}
	},
	dayOfWeek: function(){
		return getWeekDay(this.day.getDay());
	},
	dayAndMonth: function(){
		return getDayAndMonth(this.day.getDate(), this.day.getMonth());
	}
});

var getWeekDay = function (dayofweek){
	if(dayofweek === 0){
		return "Sunday";
	}
	else if(dayofweek === 1){
		return "Monday";
	}
	else if(dayofweek === 2){
		return "Tuesday";
	}
	else if(dayofweek === 3){
		return "Wednesday";
	}
	else if(dayofweek === 4){
		return "Thursday";
	}
	else if(dayofweek === 5){
		return "Friday";
	}
	else if(dayofweek === 6){
		return "Saturday";
	}
}

var getDayAndMonth = function(day, month){
	if (day.toString().indexOf("1") === day.toString().length - 1 && day.toString() != "11"){
		return getMonth(month) + " " + day.toString() + "st";
	}
	else if(day.toString().indexOf("2") === day.toString().length - 1 && day.toString() != "12"){
		return getMonth(month) + " " + day.toString() + "nd";
	}
	else if(day.toString().indexOf("3") === day.toString().length - 1 && day.toString() != "13"){
		return getMonth(month) + " " + day.toString() + "rd";
	}
	else{
		return getMonth(month) + " " + day.toString() + "th";
	}
}

var getMonth = function(month){
	if(month === 0){
		return "January";
	}
	else if(month === 1){
		return "February";
	}
	else if(month === 2){
		return "March";
	}
	else if(month === 3){
		return "April";
	}
	else if(month === 4){
		return "May";
	}
	else if(month === 5){
		return "June";
	}
	else if(month === 6){
		return "July";
	}
	else if(month === 7){
		return "August";
	}
	else if(month === 8){
		return "September";
	}
	else if(month === 9){
		return "October";
	}
	else if(month === 10){
		return "November";
	}
	else if(month === 11){
		return "December";
	}
}