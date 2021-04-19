
var isInRoot = false;
var fileName = "";
let icon_folder = "icons" + "/";
let section_folder = "sections" + "/";
let appendix_folder = "addenda" + "/";

// DATA START

let home = ["index.html", "", "#beginning", "home.png", "home-active.png", 100, 86, "Ytre Eikjo"];

let sections = [
	["index.html", "", "#beginning", 1, "Introduction"],
	["laberg.html", section_folder, "", 2, "Laberg"]
	
]

let appendix_part1 = [
	["map.html", appendix_folder, "", "map.png", "map-active.png", 125, 97, "Maps"]
];

let appendix_part2 = [
	["writing-log.html", appendix_folder, "", "log.png", "log-active.png", 74, 94, "Writing log"],
	["sources.html", appendix_folder, "", "sources.png", "sources-active.png", 85, 85, "Sources"],
	["about.html",  appendix_folder, "", "about.png", "about-active.png", 133, 133, "About"],
	["contact-and-feedback.html", appendix_folder, "", "contact.png", "contact-active.png", 89, 89, "Contact and Feedback"]
];

// DATA END

document.addEventListener('readystatechange', function() {
	if (document.readyState === "complete") { addMenu(); } });


function addMenu() {

	var pathname = window.location.pathname;
	var pathnameStripet = pathname.replace(/^(\/)/,"");
	
	var pathnameParts = pathnameStripet.split('/');
	
	
	if (pathnameParts.length == 1) { 
		isInRoot = true;
		fileName = pathnameParts[0];
	} else if (pathnameParts.length == 2) {
		fileName = pathnameParts[1];
	} else {
		return;
	}
	
	// ADD MENU ROOT
	
	var menuNav = document.getElementById("menu");

	var menuRoot = appendOn(menuNav, "ul");
	
	// ADD FIRST APPENDIX PART WITH HOME LINK.
	
	var menu1 = appendOn(appendOn(menuRoot, "li"), "ul");
	menu1.classList.add("menu-vertical");
	
	appendCreatedElementOn(menu1, createNonSectionObject(home));
	for (let objData in appendix_part1) {
		appendCreatedElementOn(menu1, createNonSectionObject(appendix_part1[objData]));
	}
	
	
	// ADD SECTIONS MENU.
	
	var menu2_sections = appendOn(appendOn(menuRoot, "li"), "ul");
	menu2_sections.classList.add("menu-content");
	var menu2_header = appendOn(appendOn(menu2_sections, "li"), "span");
	menu2_header.classList.add("menu-icon");
	appendIconOn(menu2_header, checkFilePath(icon_folder + "content.png"), 86, 85);
	appendTextOn(menu2_header, "Story sections");
	
	var menu2_list = appendOn(appendOn(menu2_sections, "li"), "ul");
	for (let objData in sections) {
		appendCreatedElementOn(menu2_list, createSectionObject(sections[objData]));
	}
	

	// ADD SECOUND APPENDIX PART.
	
	var menu3 = appendOn(appendOn(menuRoot, "li"), "ul");
	menu3.classList.add("menu-vertical");
	
	for (let objData in appendix_part2) {
		appendCreatedElementOn(menu3, createNonSectionObject(appendix_part2[objData]));
	}
	
	
	// ADD TOP LINK.
	
	
	
}

function appendOn(element, type) {
	var newElm = document.createElement(type);
	element.appendChild(newElm);
	return newElm;
}

function appendCreatedElementOn(element, newElement) {
	element.appendChild(newElement)
	return newElement
}

function appendTextOn(element, text) {
	var newText = document.createTextNode(text);
	element.appendChild(newText);
	return newText;
}

function appendIconOn(element, src, width, height) {
	var newIcon = document.createElement("img");
	newIcon.src = src;
	newIcon.width = 20;
	newIcon.height = height/width * 20;
	newIcon.alt = "";
	newIcon.setAttribute("aria-hidden", "true");
	element.appendChild(newIcon);
	return newIcon;
}

function checkFilePath(filepath) {
	return isInRoot ? filepath : "../" + filepath;
}

function createSectionObject (objectData) {
	var newLi = document.createElement("li");
	
	var newElm = createInnerObject(objectData);
	
	newLi.appendChild(newElm);
	var numberingElm = appendOn(newElm, "span");
	numberingElm.classList.add("seksjon-number");
	appendTextOn(numberingElm, objectData[3]);
	appendTextOn(newElm, objectData[4]);
	
	return newLi;
}

function createNonSectionObject (objectData) {
	var newLi = document.createElement("li");
	var newElm = createInnerObject(objectData);
	newLi.appendChild(newElm);
	appendIconOn(newElm, checkFilePath(icon_folder + objectData[3]), objectData[5], objectData[6]);
	appendTextOn(newElm, objectData[7]);
	return newLi;
}

function createInnerObject (objectData) {
	var newElm;
	
	if (objectData[0] == fileName) {
		newElm = document.createElement("span");
	} else {
		newElm = document.createElement("a");
		newElm.href = checkFilePath(objectData[1] + objectData[0] + objectData[2]);
		newElm.type = "text/html"
	}
	return newElm;
}





