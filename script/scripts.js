

document.addEventListener('readystatechange', function() {
 	if (document.readyState === "interactive") { 
 		setContentWidthAndFont();
 		setImageSize();
		makeWebsiteMenu();
	} 
		
	if (document.readyState === "complete") { 
		loadLateImages(); 
	}
});
		
window.addEventListener('resize', function() {
 	setContentWidthAndFont();
 	setImageSize();
	placeFullscreenView();
	window.setTimeout(function() {
		setContentWidthAndFont();
		setImageSize();
		placeFullscreenView();
	}, 500);
});


// ---------------------------------------------------------- //
// Getting background image when the page is loaded.

// BASED ON DEMO CODE FROM MOZILLA.ORG
// https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Loading
function loadLateImages() {
	let imageToLoad = document.getElementById("background-image");
	const loadImages = (image) => {
		image.setAttribute('src', image.getAttribute('data-src'));
	  	image.onload = () => {
			image.removeAttribute('data-src');
		};
	};
	loadImages(imageToLoad);
}


// --------------------------------------------------------- //
// Fullscreen view. 
// Click on the image and the image will scale up to take the hole screen
// click again and it scale down again.

var originalImage;
var scaledImage;
var innerImageFrame;
var fullscreenContainer;

var fullscreenIsActive = false;

function goIntoFullscreenImageView(image) {

	window.originalImage = image;
	
	window.fullscreenContainer = document.getElementById("fullscreen-image");
	window.fullscreenContainer.style.backgroundColor = "#fefef8611";
	window.fullscreenContainer.style.backdropFilter = "blur(1px)";
	window.fullscreenContainer.style.display = "inline";
	
	let outerImageFrame = appendOn(window.fullscreenContainer, "div");
	outerImageFrame.classList.add("image-view-outer-frame");
	
	window.innerImageFrame = appendOn(outerImageFrame, "div");
	window.innerImageFrame.classList.add("image-view-inner-frame");
	
	window.innerImageFrame.style.width = window.originalImage.clientWidth + "px";
	window.innerImageFrame.style.height = window.originalImage.clientHeight + "px";
	window.innerImageFrame.style.opacity = "0.3";
	
	window.scaledImage = appendOn(window.innerImageFrame, "img");
	window.scaledImage.src = window.originalImage.src;
	window.scaledImage.classList.add("main-image");

	window.fullscreenIsActive = true;
	window.originalImage.style.opacity = "0";
	window.originalImage.style.cursor = "default";
	window.innerImageFrame.style.cursor = "zoom-out";
		
	window.setTimeout(function() {
		
		window.fullscreenContainer.style.backgroundColor = "#fefef811";
		window.fullscreenContainer.style.backdropFilter = "blur(1px)";
		window.innerImageFrame.style.opacity = "0.3";
		console.log("will go into fullscreen mode. 2 ");
		
		 placeFullscreenView ();

	}, 10);
	
	window.fullscreenContainer.onclick = function() {
		
		window.fullscreenIsActive = false;
		//window.innerImageFrame.style.transition = "all 0.2s ease-out";
		window.innerImageFrame.style.width = window.originalImage.clientWidth + "px";
		window.innerImageFrame.style.height = window.originalImage.clientHeight + "px";
		window.innerImageFrame.style.opacity = "0.6";
		window.fullscreenContainer.style.backgroundColor = "#fefef811";
		
		window.innerImageFrame.addEventListener("transitionend", function() {
			window.fullscreenContainer.style.display = "none";
			window.fullscreenContainer.innerHTML = "";
			window.originalImage.style.opacity = "1";
			window.originalImage.style.cursor = "zoom-in";
		});
		
	};
}

function placeFullscreenView () {
	
	if (!fullscreenIsActive) {
		return;
	}
	
	let fullImageWidth = window.originalImage.getAttribute("width");
	let fullImageHeight = window.originalImage.getAttribute("height");
	let fullImageRatio = fullImageWidth / fullImageHeight;
	
	let maxScreenWidth = window.fullscreenContainer.clientWidth * 0.95;
	let maxScreenHeight = window.fullscreenContainer.clientHeight * 0.95;
	let maxScreenRatio = maxScreenWidth / maxScreenHeight;
	
	var scaledImageFullWidth;
	var scaledImageFullHeight;
	
	if (fullImageWidth < maxScreenWidth && fullImageHeight < maxScreenHeight ) {
		scaledImageFullWidth = fullImageWidth;
		scaledImageFullHeight = fullImageHeight;
	} else if (fullImageRatio < maxScreenRatio) {
		scaledImageFullWidth = maxScreenHeight * fullImageRatio;
		scaledImageFullHeight = maxScreenHeight;
	} else {
		scaledImageFullWidth = maxScreenWidth;
		scaledImageFullHeight = maxScreenWidth / fullImageRatio;
	}
	
	window.setTimeout(function(){
		let transitionTime = scaledImageFullWidth / window.originalImage.clientWidth * 0.2;
		
		window.innerImageFrame.style.transition = "all " + transitionTime + "s linear";

		window.innerImageFrame.style.width = scaledImageFullWidth + "px";
		window.innerImageFrame.style.height = scaledImageFullHeight + "px";
		window.innerImageFrame.style.opacity = "1";
		
		window.fullscreenContainer.style.transition = "all 0.4s ease-in";
		window.fullscreenContainer.style.backgroundColor = "#fefef899";
		window.fullscreenContainer.style.backdropFilter = "blur(6px)";
	}, 10);
}


// ------------------------------------------------------------------ //
// Setting content width and font size based on users resolution.
//

let FONT_SIZE_BIG_SCREEN = 1; // 20px
let FONT_SIZE_SMAL_SCREEN = 3.5; // 17px
let WIDTH_MAX = 2000;
let WIDTH_MIN = 370;
let CONTENT_WIDTH_MIN_PX = 500;
let CONTENT_WIDTH_SMAL_SCREEN = 100;	// prosent
let CONTENT_WIDTH_BIG_SCREEN = 45;		// prosent

let SISTE_LEDD = (CONTENT_WIDTH_BIG_SCREEN - CONTENT_WIDTH_SMAL_SCREEN)/(WIDTH_MAX - CONTENT_WIDTH_MIN_PX);

function setContentWidthAndFont() {
	
	let fontSizeElement = document.querySelector("html");
	let contentWidthElement = document.getElementById("page-content-layout");
	let	innerWindowWidth = window.innerWidth <= window.screen.width ? window.innerWidth : window.screen.width;
	//let screenDotPerPixel = window.devicePixelRatio;
	
	// ------- setting fornt size ---------- //
	
	if (innerWindowWidth <= WIDTH_MIN) {
		fontSizeElement.style.fontSize = FONT_SIZE_SMAL_SCREEN +"vw";
	} else if (innerWindowWidth >= WIDTH_MAX) {
		fontSizeElement.style.fontSize = FONT_SIZE_BIG_SCREEN + "vw";
	} else {
		let fontSizeDiff = FONT_SIZE_BIG_SCREEN - FONT_SIZE_SMAL_SCREEN;
		let screenWidthDiff = WIDTH_MAX - WIDTH_MIN;
		
		let interpolasionValue = ((innerWindowWidth - WIDTH_MIN) / screenWidthDiff);
		let partlyFontSize = interpolasionValue * fontSizeDiff;
		let newFontSize = partlyFontSize + FONT_SIZE_SMAL_SCREEN;
		
		let x = innerWindowWidth;
		let xx = x * x;
		//let y = 4.446 - 0.00291*x + 0.0000006038*xx;
		//let y = 14.69 + 0.007013*x - 0.000001608*xx;
		let y = 14.14 + 0.00635*x - 0.000001459*xx;
		
		console.log("font size y: " + y);
		
		//let diff = newFontSize - y;
		//let newSize = ((y * 1.4 ) - (diff * 2));
		
		let newPixelSize = y; //(newSize * (innerWindowWidth)) / 100;
		
		fontSizeElement.style.fontSize = newPixelSize + "px";
		
		//console.log("viewport width: " + innerWindowWidth + " font: " + y + " " + newPixelSize);
	
	}
	
	// ------- setting width size ---------- //
	
	if (innerWindowWidth <= CONTENT_WIDTH_MIN_PX) {
		contentWidthElement.style.width = CONTENT_WIDTH_SMAL_SCREEN + "vw";
	} else if (innerWindowWidth >= WIDTH_MAX) {
		contentWidthElement.style.width = CONTENT_WIDTH_BIG_SCREEN + "vw";
	} else {
		let contentWidthElementDiff = CONTENT_WIDTH_SMAL_SCREEN - CONTENT_WIDTH_BIG_SCREEN;
		let screenWidthDiff = WIDTH_MAX - CONTENT_WIDTH_MIN_PX;
		
		let interpolasionValue = ((innerWindowWidth - CONTENT_WIDTH_MIN_PX) / screenWidthDiff);
		let partlyContentWidth = interpolasionValue * contentWidthElementDiff;
		let newContentWidth = CONTENT_WIDTH_SMAL_SCREEN - partlyContentWidth;
		
		//contentWidthElement.style.width = newContentWidth + "vw";
		
		// https://www.omnicalculator.com/statistics/quadratic-regression
		
		let x = innerWindowWidth;
		let xx = x * x;
		//let y = 135 - 0.07833*x + 0.00001667*xx;
		let y = 338.9 + 0.3635 * x - 0.0000733 * xx;
		
		let diff = newContentWidth - y;
		let newSize = (y - (diff * 1.0));
	
		contentWidthElement.style.width = y + "px";
	
	}
}


// ------------------------------------------------------------------ //
// Setting the image size.
// 3:4 landscape = 100% width
// portrate < 100% width

function setImageSize() {

	var allImages = document.getElementsByClassName("story-image");
	
	console.log("number of images: " + allImages.length);
	console.log("2:3 " + (3/2));
	console.log("3:4 " + (4/3));
	
	var i;
	for(i = 0; i < allImages.length; i++) {
		console.log("ratio: " + (allImages[i].clientWidth / allImages[i].clientHeight));
		console.log("image width: " + allImages[i].clientWidth);
		
		let imageRatio = allImages[i].clientWidth / allImages[i].clientHeight;
		let hightWidthRatio = allImages[i].clientHeight / allImages[i].clientWidth;

		if(imageRatio < 0.75) {
			
			let smallImageHeight = allImages[i].clientWidth * 7/8;
			
			let imageWidth = imageRatio * smallImageHeight; //allImages[i].clientWidth;
			let imageWidthProsent = imageWidth / allImages[i].clientWidth * 100;
			
			console.log("new width %: " + imageWidthProsent);
			console.log("new height: " + allImages[i].clientHeight * imageWidthProsent );
		
			allImages[i].style.width = imageWidthProsent + "%";
			
			
		} else if(imageRatio < 1.3) {
			 			
			let newHeightDiff = allImages[i].clientHeight - allImages[i].clientWidth * 7/8;
			
			
		}
	}

}

 


// ------------------------------------------------------------------ //
// Makes the menu
//

var thisPageIsInRootFolder = false;
var thisPageFileName = "";
let icon_folder = "icons" + "/";
let section_folder = "sections" + "/";
let appendix_folder = "addenda" + "/";
let sectionsHeaderText = "Story sections";

// DATA start  ---- the pages that will be in the menu.

// data structure - sections:
// [ page filename, folder, section number, label text]
// home and appendix:
// [ page filename, folder, icon, icon active state, icon size, label text]

let sections = [
	["", "", 1, "Introduction"],
	["laberg.html", section_folder, 2, "Laberg"]
];

let home = ["", "", "home.png", "home-active.png", 100, 86, "Ytre Eikjo"];

let appendix_top = [
	["map.html", appendix_folder, "map.png", "map-active.png", 125, 97, "Maps"]
];

let appendix_bottom = [
	["writing-log.html", appendix_folder, "log.png", "log-active.png", 74, 94, "Writing log"],
	["sources.html", appendix_folder, "sources.png", "sources-active.png", 85, 85, "Sources"],
	["about.html",  appendix_folder, "about.png", "about-active.png", 133, 133, "About"],
	["contact-and-feedback.html", appendix_folder, "contact.png", "contact-active.png", 89, 89, "Contact and Feedback"]
];

let shortcut = ["#menu", "", "menu.png", "", 20, 5.2, ""];

// DATA END

function makeWebsiteMenu() {

	let thisPageFilenameAndPath = window.location.pathname;
	let thisPageFilenameAndPathCleaning = thisPageFilenameAndPath.split("#");
	let thisPageFilenameAndPathCleaned = thisPageFilenameAndPathCleaning[0].replace(/^(\/)/,"");
	let thisPageFilenameAndPathDivide = thisPageFilenameAndPathCleaned.split("/");
	
	if (thisPageFilenameAndPathDivide.length == 1) {
		thisPageIsInRootFolder = true;
		thisPageFileName = thisPageFilenameAndPathDivide[0];
	} else if (thisPageFilenameAndPathDivide.length == 2) {
		thisPageFileName = thisPageFilenameAndPathDivide[1];
	} else {
		console.log("more then to elements in the path.");
		console.log(thisPageFilenameAndPathDivide);
		return;
	}
	
	
	
	// Make MENU structure 
	
	let menuElement = document.getElementById("menu");
	menuElement.setAttribute("aria-labelledby", "primary-navigation");
	let menuRoot = appendOn(menuElement, "ul");
	let menuTop = appendOn(appendOn(menuRoot, "li"), "ul");
	let menuSections = appendOn(appendOn(menuRoot, "li"), "ul");
	let menuBottom = appendOn(appendOn(menuRoot, "li"), "ul");
	
	// TOP MENU 
	
	menuTop.classList.add("menu-horizontal-bar");
	appendButtonOn(menuTop, createNonSectionButtonWithData(home));
	for (let buttonIndex in appendix_top) {
		appendButtonOn(menuTop, createNonSectionButtonWithData(appendix_top[buttonIndex]));
	}
	
	// SECTIONS MENU
	
	menuSections.classList.add("menu-sections");
	let menuSectionsHeader = appendOn(appendOn(menuSections, "li"), "span");
	menuSectionsHeader.classList.add("menu-sections-header");
	appendIconOn(menuSectionsHeader, getFilePath(icon_folder + "content.png"), 86, 85);
	appendTextOn(menuSectionsHeader, sectionsHeaderText);
	
	let menuSectionsButtons = appendOn(appendOn(menuSections, "li"), "ul")
	menuSectionsButtons.classList.add("menu-sections-columns");
	for (let buttonIndex in sections) {
		appendButtonOn(menuSectionsButtons, createSectionsButtonWithData(sections[buttonIndex] ));
	}
	
	// BOTTOM MENU
	
	menuBottom.classList.add("menu-horizontal-bar");
	for (let buttonIndex in appendix_bottom) {
		appendButtonOn(menuBottom, createNonSectionButtonWithData(appendix_bottom[buttonIndex]));
	}	
	
	// SHORTCUT FROM HEADER
	menuShortcut = document.getElementById("shortcut-to-menu");
	menuShortcutLink = appendOn(menuShortcut, "a");
	menuShortcutLink.href = shortcut[0];
	menuShortcutLink.type = "text/html";
	appendIconOn(menuShortcutLink, getFilePath(icon_folder + shortcut[2]), shortcut[4], shortcut[5]);
	
}

function appendOn(element, type) {
	let newElement = document.createElement(type);
	element.appendChild(newElement);
	return newElement;
}

function appendIconOn(element, src, width, height) {
	let icon = document.createElement("img");
	element.appendChild(icon);
	icon.src = src;
	icon.width = "20px"; 
	icon.height = (height/width * 20) + "px";
	icon.alt = "";
	icon.setAttribute("aria-hidden", "true");
	return icon;
}

function appendTextOn(element, text) {
	let textElement = document.createTextNode(text);
	element.appendChild(textElement);
	return textElement;
}

function appendButtonOn(element, button) {
	element.appendChild(button);
	return button;
}

function createNonSectionButtonWithData(buttonData) {
	let button = document.createElement("li");
	let buttonContainer = appendOn(button, "div");
	let buttonElement = createBasicButtonWithIconWithData(buttonData);
	appendTextOn(buttonElement, buttonData[6]);
	buttonContainer.appendChild(buttonElement);
	buttonContainer.classList.add("menu-element-background");	
	return button;
}

function createBasicButtonWithIconWithData(buttonData) {
	let basicButton = createBasicLinkAndNonLinkButtonWithData(buttonData);
	if (buttonData[0] == thisPageFileName || (buttonData[0] == "#top" && thisPageFileName == "")) 
	{
	 	appendIconOn(basicButton, getFilePath(icon_folder + buttonData[3]), buttonData[4], buttonData[5]);
	 } else {
	 	appendIconOn(basicButton, getFilePath(icon_folder + buttonData[2]), buttonData[4], buttonData[5]);
	 }
	return basicButton;
}

function createSectionsButtonWithData(buttonData) {
	let button = document.createElement("li");
	button.classList.add("menu-selection-button");
	let buttonContainer =  createBasicLinkAndNonLinkButtonWithData(buttonData);
	button.appendChild(buttonContainer);
	let buttonNumbering = appendOn(buttonContainer, "span");
	buttonNumbering.classList.add("menu-section-number");
	appendTextOn(buttonNumbering, buttonData[2]);
	appendTextOn(buttonContainer, buttonData[3]);
	return button;
}

function createBasicLinkAndNonLinkButtonWithData(buttonData) {
	let basicButton;
	
	if (buttonData[0] == thisPageFileName || (buttonData[0] == "#top" && thisPageFileName == "")) {
		basicButton = document.createElement("span");
		basicButton.classList.add("menu-active-page");
	} else {
		basicButton = document.createElement("a");
		basicButton.href = getFilePath(buttonData[1] + buttonData[0]);
		basicButton.type = "text/html";
	}
	
	return basicButton;
}

function getFilePath(address) {
	return thisPageIsInRootFolder ? address : "../" + address;
}



