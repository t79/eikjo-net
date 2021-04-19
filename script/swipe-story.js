// Code by Gabor Szabo
// https://code-maven.com/swipe-left-right-vanilla-javascript
// 
// The code is used with unclear permission. 
// The source page gives indirect permission for the usage in the text 
// "...  if you have some HTML pages you might want to allow your users to 
// move between pages, using JavaScript, but you don't want to rely any of 
// the JavaScript libraries."
//


var min_horizontal_move = 80;
var max_vertical_move = 60;
var within_ms = 1000;

var start_xPos;
var start_yPos;
var start_time;

document.addEventListener('readystatechange', function() {
	if (document.readyState === "complete") {
		var content = document.getElementById("story");
		content.addEventListener('touchstart', start_swipe_next_page);
		content.addEventListener('touchend', end_swipe_next_page);
	}
});

function start_swipe_next_page(event) {
	start_xPos = event.touches[0].pageX;
	start_yPos = event.touches[0].pageY;
	start_time = new Date();
}

function end_swipe_next_page(event) {
	var end_xPos = event.changedTouches[0].pageX;
	var end_yPos = event.changedTouches[0].pageY;
	var end_time = new Date();
	let move_x = end_xPos - start_xPos;
	let move_y = end_yPos - start_yPos;
	let elapsed_time = end_time - start_time;
	if (Math.abs(move_x) > min_horizontal_move && Math.abs(move_y) < max_vertical_move && elapsed_time < within_ms) {
		clickOnSwipe(move_x);
	}
}

function clickOnSwipe(value) {
	if (value < 0) {
		document.getElementById("continue-reading").click();
	} else {
		document.getElementById("reading-backward").click();
	}
}