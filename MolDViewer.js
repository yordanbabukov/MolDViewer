/*
	Copyright (C) <2015>  <Yordan Kamenov Babukov>
	This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, 
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


//var zxcasd = "3 0 A1*(1-l1*Math.exp(-k1*t)/(l1-k1)-k1*Math.exp(-l1*t)/(k1-l1)) ff0000 A1=106362;k1=0.0332603;l1=0.0020304 53BP1 A2*(1-l2*Math.exp(-k2*t)/(l2-k2)-k2*Math.exp(-l2*t)/(k2-l2)) 00ff00 A2=109633;k2=0.0023531;l2=0.00492201 53BP1_I  A3*(k3/(l3-k3))*(Math.exp(-k3*t)-Math.exp(-l3*t))+B3*(1-Math.exp(-m3*t)) 0000ff A3=26526;k3=0.0037122;l3=0.00002346;m3=0.0356783;B3=13383 BARD1"
var zxcasd = "3 0 A1*(1-l1*Math.exp(-k1*t)/(l1-k1)-k1*Math.exp(-l1*t)/(k1-l1)) ff0000 A1=106362;k1=0.0332603;l1=0.0020304 53BP1 A3*(k3/(l3-k3))*(Math.exp(-k3*t)-Math.exp(-l3*t))+B3*(1-Math.exp(-m3*t)) 0000ff A3=26526;k3=0.0037122;l3=0.00002346;m3=0.0356783;B3=13383 BARD1 A2*(1-l2*Math.exp(-k2*t)/(l2-k2)-k2*Math.exp(-l2*t)/(k2-l2)) 00ff00 A2=109633;k2=0.0023531;l2=0.00492201 53BP1_I A106*(1-Math.exp(-k106*t))+B106*(1-Math.exp(-m106*t)) ffff4d A106=6728.0200928756;k106=0.0214709666885089;l106=0.00042628711478909;m106=1.08951197907581;d106=0;B106=6520.91455300658 HLTF_I if:t>=d106 A106*((k106/(k106-l106))*Math.exp(l106*(d106-t))-(l106/(k106-l106))*Math.exp(k106*(d106-t))-Math.exp(-k106*t))+B106*(1-Math.exp(-m106*t)) A107*(1-Math.exp(-k107*t))+B107*(1-Math.exp(-m107*t)) ffcc00 A107=57080.5036779827;k107=0.167539724451001;l107=0.0178099104361899;m107=0.145774756231156;d107=15.3137186175472;B107=6221.78181169722 XRCC1 if:t>=d107 A107*((k107/(k107-l107))*Math.exp(l107*(d107-t))-(l107/(k107-l107))*Math.exp(k107*(d107-t))-Math.exp(-k107*t))+B107*(1-Math.exp(-m107*t))"

//------todo------
//много бави при t-scaling след достигане на първа фаза.
//при 3 уравнения в зависимост от реда на уравненията при t-scaling не мащабира правилно.

//за махане на пунктира
var noGridLines = 1;

//no quantity нормалзииране за raw data
var arrayWithFitDataNames = [];
var maxInEquationLocal = 0;
var array_with_maximums_13000 = []; // масив с максимумите до 13 000 момент.
var noQuantityByUser = 10000; // когато е без фактора количества, по подразбиране намира максимума до 10000, но след това потребител може да го залага ръчно.
var flagAfterFirstStart = 0; // флаг само 1 път да се намират максимумите до 10 000 * 1.3
var rawDataNoQuantity = [];
var flagNoQuantityRawData = 0;

//променлива спрямо която бутона No quantity функционира
var noQuantitySwitchName = 0;

//за да не пази след паралел animation 
var helpArrayParal = [];

var array_with_equation_names_anim2 = [];

var help_help = 0;
var array_with_names_of_proteins = [];

//масив, в който пазя първоначалните (ненормализирани) raw data стойности.
var data3 = [];

//за махане на максимум от масива с максимуми при скрита графика
var array_with_maximums_2 = [];

//бързо намиране на макс и промяна в оригиналния масива.
var data_max_optimization = [];
var help_array_max = [];
var array_with_maximums = [];

//нещо омазах флаговете за ъплоаднати файлове и добавям нов, най-вероятно мога да преизползвам и текущо съществуващ.
var flagUpWhenUploadedFileWithConfigurationBonus = 0;

//show/hide променлива която се инкрементира и спрямо това цъканията скриват/показват всички графики.
var showHideVar = 0;

//за оптимизиране на кликането на show/hide fit data имена-бутоните.
var flag_show_fit_data = 0;
var current_clicked_fit_data; // ?
var data_temp_holder = []; //съдържа данните по Y на текущо премахнатите графики
var skip_graphs2 = []; // за real-time с бързото цъкане
var currently_clicked_fits = []; // съдържа номерата на графиките, които са текущо премахнати
var coef_optimiz; // за коефициентите да се менят бързо.
var flag_coef_optimiz = 0;

//променлива, че е натиснат бутона animation 2, а не animation.
var flagParallelAnimation = 0;
var currentStep = 0; // used for HTML div element and to count steps to finish iterating.

//need global for optimization try 1 (animation)
var tempCoef;

//array for if formulees and help params.
var startingEquationWithIf = 0; // ползвам за промяна рамката на четене.
var totalNumberOfIfEqs = 0; // това ползвам колко от последните са модифицирани
var numberOfIfEqs = 0; // това ползвам за извличане на уравнения и гранични стойности при чертане
var dataWithIf = []; // съдържа новите формули (след достигане на условието) и колко е граничната стойности.

//флаг който не разрешава цъкането на бутони правещи анимация докато тече анимация.
var flagPreventFromDoubleClicking = 0;

//променлива с която отчитам кой масив с генерирани данни да взема при t-scaling after from
var counterToOptize = 0;

//променлива с която ще чета множество файлове с по 1 измерване, но с различна дължина
var currentFileColumnLength = [];
var helpCounter = 1;
var firstInitialization = 0;

//взимам цветовете и имената на raw-datata от всеки първи ред на всеки файл.
var helpColorRawData = [];

//2015-09-30
// променлива която отчита дали има фитове които не са видими или обратното. Ползвам я за да не оправям разместването на графиките при скрий/покажи всички
//var roundingProblem = 0;
//var roundingProblemBack = 0;


//променлива в която пазя на коя позиция е била raw-dataта във файла за да я пропусна при визуализиране.
var rawDataSkipGraphic = [];

//помощна променлива, която отмервам броя слайдъри и тези които искат да се въведат от fill sliders файла.
var countingSliders = 0;

//за сменяне на режим в print mode
var switchColorR = 0;
var switchColorG = 0;
var switchColorB = 0;
var switchColorRs = 1;
var switchColorGs = 1;
var switchColorBs = 1;

//За анимацията 
var FLOATS = Float32Array.BYTES_PER_ELEMENT;

//оптимизация
used_data = [];
temp_data = [];

//променлива при натиснат бутон t-scaling
var t_scaling_flag = 0;

//променлива текущ брой уравнения - с нея махам уравнения по желание на потр.
var number_of_graphs_to_hide = 0;
var skip_graphs = []; //(тук пазя индексите, за да ги пропускам при изчислеянията.)
var help_to_skip_graphs = 0;
var new_help_to_skip_graphs = 0;

//променлива пазеща броя уравнения подадени във файла
var first_line_of_file = 0;

//тук указвам бройката редове за уравнение във файл, за да не си играя да меня на 100 места при модификация.
var lines_per_equation_in_file = 4;

//used to set number of sliders by user file input
var flagUpWhenUploadedFileWithConfiguration = 0;
var removeSymbols2=[];

var maxInEquation = 0.00000000001;
var max = 0.00000000001;

var bla2=[];

//used to iterate over file with random number of columns. if its 6, this must be 6/3 (0-5  -> (5+1)/2 )
var fileRowLength=1;

//used for automatic animation multiple values
var l = 1;

//used for raw data animation (it's not the same speed as function graphics) 
var helpCount = 0;

//used to check if file is uploaded, and if is -> visualize raw data from it
var flagUpWhenUploadedFile = 0;

//user manual speed for t-scale animation
var tScaleSpeed = 100.0;

//testing
var tempRes;

//this variable can be used later to set presicion of y values, if you use it in formulee that requires presicions.
var fixPres = 0; // unused - will be used for setting manualy presicion of Oy values (if special needs occure)
var fixPresX = 0; // unused - will be used for setting manualy presicion of Ox values (if special needs occure)

//each time next is pressed, formulee will be saved in new variable equation_formulee indexed like array with z index (later they will be accessed by index z)
var z = -1;
//array that stores all used variables in all equations!
var check_for_duplicates_dropmenu = [];
//used to indicates if value exists in the array or not.
var checker_helper = 0;

//variables to add content
var number_of_sliders = 0;
var number_of_constants = 0;

//variables to remove content
var number_of_sliders_old;
var number_of_constants_old;

var color_of_equation;
//array that keeps converted values of colors and parse them to webgl
var color_eqs = [];
var permanentColorEqs = [];

//not used yet (its always 1)
var start_number_of_constants=1;
//variable to remove content 
var j = 0;
var naming_values;

//variable to keep the equation entered by user
var equation_by_user = [];

//variable to finish custom configuration
var show_custom_config = 0;

var gl;		// глобален WebGL контекст
var glprog;	// глобална GLSL програма
var buf; 	
var data;	
var t = 0;		

// number of bytes per each WebGL FLOAT (should be 4 bytes)
var FLOATS = Float32Array.BYTES_PER_ELEMENT;

//sample constants
//change n
var n = 700;	//hardcored value for default visualisation -> number of pictures

//change n
var t1 = 2100;	//hardcored value for default visualisation -> period of picture taking (every 3 seconds)
//recreation n
var n1 = n; 	//variable used for recreation effect

var flag = 0; //varible for stopping animation. - unused

var speed_gen = 5;	//used to change the speed of recreation - minimum is 1 //unused

//function to create new variables in real-time. Used to declare all extracted variables from the equation
function createVariable(varName,varContent)
{
    var scriptStr = "var "+varName+"= \""+varContent+"\"";
	
    var node_scriptCode = document.createTextNode( scriptStr );
    var node_script = document.createElement("script");
    node_script.type = "text/javascript";
    node_script.appendChild(node_scriptCode);

    var node_head = document.getElementById("head");
    node_head.appendChild(node_script);
}

//executed once
//preparations with checkbox colors and default values after page reload
function preparation(){
	document.getElementById('number_of_sliders').value = 0;
	document.getElementById('number_of_constants').value = 0;
	document.getElementById("color_selection").value = "none";
	color_of_equation = "none";
	document.getElementById("name_of_complex").value = "";
	done();
}

//executed once
//when "done" button is pressed clears the options for user choice
function clearing_custom_stuff() 
{
	if (show_custom_config)	{
		document.getElementById("number_of_sliders").style.display='none';
		document.getElementById("number_of_constants").style.display='none';
		document.getElementById("color_selection").style.display='none';
		document.getElementById("name_of_complex").style.display='none';
		document.getElementById("equation_formulee").style.display='none';
		document.getElementById("paragraph_for_union_information").style.visibility='hidden';
		document.getElementById("paragraph_for_name_constants").style.display='none';
		document.getElementById("br_span_sliders").style.display='none';
	}

	//this sets the canvas
	before_start();
}

//executed once
//sets canvas and dotted Ox patterns. 
function before_start() {
	var canv = document.createElement('canvas');
	canv.id = 'picasso';
	canv.width = 1000;
	canv.height = 400;
	document.body.appendChild(canv); // adds the canvas to the body element
	
	var zxc = document.getElementById("picasso");
	var rect = zxc.getBoundingClientRect();
	//creating 10 dotted Ox patterns
	for (var i = 0; i < 10; i+=1) {
	var myDiv = document.createElement('div');
		myDiv.id = 'time_time_' + i;
		//adding values of dotted Ox patterns
		//change n
		myDiv.innerHTML = eval( (1*t1) * (i+1)/10);//.toFixed(fixPresX); - not working, maybe parentheses needed
		myDiv.style.color = 'white';
		myDiv.style.position = 'absolute';
		
		var tempCoordsBottom = rect.bottom - 25.0;
		//First shift right. Second: i take the rest and divide it by nearly 10, so it looks good.
		var tempCoordsLeft = (rect.right - rect.left)*15/100 + ((i)*( (rect.right - rect.left)-(rect.right - rect.left)*15/100) ) /9.45;
		myDiv.style.top = tempCoordsBottom + 'px';
		myDiv.style.left = tempCoordsLeft + 'px';
		document.body.appendChild(myDiv);
	}
	
	
	//creating 3 dotted Oy patterns
	for (var i = 0; i < 1; i+=1) {
		var myDiv = document.createElement('div');
		myDiv.id = 'time_time_y' + i;
		//adding values of dotted Oy patterns
		myDiv.style.color = 'white';
		myDiv.style.position = 'absolute';
		var tempCoordsCoords = (rect.bottom - rect.top)/(3-0.2) ;
		var tempCoordsBottom = rect.bottom - tempCoordsCoords*(i+1);
		myDiv.style.top = tempCoordsBottom + 'px';
		myDiv.style.left = 20 + 'px';
		document.body.appendChild(myDiv);
	}
	for (var i = 1; i < 3; i+=1) {
		var myDiv = document.createElement('div');
		myDiv.id = 'time_time_y' + i;
		//adding values of dotted Oy patterns
		myDiv.style.color = 'white';
		myDiv.style.position = 'absolute';
		var tempCoordsCoords = (rect.bottom - rect.top)/(3+i/5.0) ;
		var tempCoordsBottom = rect.bottom - tempCoordsCoords*(i+1);

		myDiv.style.top = tempCoordsBottom + 'px';
		myDiv.style.left = 20 + 'px';
		document.body.appendChild(myDiv);
	}
	
	//буква "I" за интензитета
	var myDiv = document.createElement('div');
	myDiv.id = 'i_intensity';
	myDiv.innerHTML = "I";
	myDiv.style.color = 'white';
	myDiv.style.position = 'absolute';
	var tempCoordsBottom = rect.bottom - 30;
	myDiv.style.top = tempCoordsBottom + 'px';
	myDiv.style.left = 32 + 'px';
	document.body.appendChild(myDiv);
	
	//буква "s" за времето
	var myDiv = document.createElement('div');
	myDiv.id = 's_time';
	myDiv.innerHTML = "T[s]";
	myDiv.style.color = 'white';
	myDiv.style.position = 'absolute';
	var tempCoordsBottom = rect.bottom - 27;
	myDiv.style.top = tempCoordsBottom + 'px';
	myDiv.style.left = 47 + 'px';
	document.body.appendChild(myDiv);
	
	//текуща стойност на менящ се параметър от animation. Формата ще е: Параметър=стойност
	var myDiv = document.createElement('div');
	myDiv.id = 'param_value';
	myDiv.style.color = 'white';
	myDiv.style.position = 'absolute';
	var tempCoordsCoords = rect.bottom - rect.top;
	var tempCoordsBottom = rect.bottom - tempCoordsCoords + 10;
	myDiv.style.top = tempCoordsBottom + 'px';
	myDiv.style.left = eval(rect.right - 195) + 'px';
	document.body.appendChild(myDiv);
				 
	gl = getContext("picasso");
	glprog = getProgram("vshader","fshader");

	aXYZ = gl.getAttribLocation(glprog,"aXYZ");
	aRGB = gl.getAttribLocation(glprog,"aRGB");
	
	readRawDataFromFile();
	readConfigDataFromFile();
	readSliderDataFromFile();
	//2016-16-02
	document.getElementById("changeGridColor").click();
	
	//visualise graphics on canvas
	start_optimization_t_scaling();
	//start();
}


//executed once
//when we are ready - we press it to finalize the custom configuration
function done()
{
	show_custom_config = 1;
	
	
	//25.12.2015
	//добавяне на бутонче за скриване на слайдърите. Целта е да не пречат след първоначално въвеждане
	var slid = document.createElement("input");
	slid.type = "button";
	slid.value = "Show Sliders";
	slid.id = "showHideSliders";
	slid.style.position = "absolute";
	slid.style.left = "8px"
	slid.style.visibility = "visible";
	slid.className = "AnimationPush";
	slid.onclick = function(){ 
		//проверка, дали е въведен fit data файл преди fill sliders.
		if( flagUpWhenUploadedFileWithConfiguration != 1 ) {
			alert("Enter fit data first!");
			return;
		}
	
		if(this.value == "Hide Sliders"){
			var showHide = document.getElementById(this.id);
			showHide.value = "Show Sliders";
			
			var ttt = document.getElementById("specialBrAfterFirstLineButtons");
			ttt.parentNode.removeChild(ttt);
			var ttt = document.getElementById("specialBrAfterFirstLineButtons1");
			ttt.parentNode.removeChild(ttt);

			for (var i=1; i<=number_of_sliders; i++) {
				document.getElementById("dropMenu"+i).style.display="none";
				document.getElementById("MinButton"+i).style.display="none";
				document.getElementById("MinButtonPush"+i).style.display="none";
				document.getElementById("MaxButton"+i).style.display="none";
				document.getElementById("MaxButtonPush"+i).style.display="none";
				document.getElementById("StepButton"+i).style.display="none";
				document.getElementById("StepButtonPush"+i).style.display="none";
				document.getElementById("NameConsts"+i).style.display="none";
				document.getElementById("br"+i).style.display="none";
	
			}
			document.getElementById("setValues").style.display="none";
			
		} else {
			if(this.value == "Show Sliders"){
				var showHide = document.getElementById(this.id);
				showHide.value = "Hide Sliders";

				var ttt = document.getElementById("sliders");
				var slid = document.createElement("br");
				slid.id = "specialBrAfterFirstLineButtons";
				ttt.parentNode.insertBefore( slid, ttt);
				var slid = document.createElement("br");
				slid.id = "specialBrAfterFirstLineButtons1";
				ttt.parentNode.insertBefore( slid, ttt);
				
				for (var i=1; i<=number_of_sliders; i++) {
					document.getElementById("dropMenu"+i).style.display="inline";
					document.getElementById("MinButton"+i).style.display="inline";
					document.getElementById("MinButtonPush"+i).style.display="inline";
					document.getElementById("MaxButton"+i).style.display="inline";
					document.getElementById("MaxButtonPush"+i).style.display="inline";
					document.getElementById("StepButton"+i).style.display="inline";
					document.getElementById("StepButtonPush"+i).style.display="inline";
					document.getElementById("NameConsts"+i).style.display="inline";
					document.getElementById("br"+i).style.display="inline";
					
				}
				document.getElementById("setValues").style.display="inline";
			}
		}

		//обновяване на позициите на разграфяването след скриване/показване на бутоните с константи	
		var zxc = document.getElementById("picasso");
		var rect = zxc.getBoundingClientRect();
		for (var i = 0; i < 10; i+=1) {
			var myDiv = document.getElementById('time_time_' + i);			
			//adding values of dotted Ox patterns
			//change n
			//if i will use on tablets, maybe -25.0 should be replaced with something non static
			var tempCoordsBottom = rect.bottom - 25.0;
			//First shift right. Second: i take the rest and divide it by nearly 10, so it looks good.
			var tempCoordsLeft = (rect.right - rect.left)*15/100 + ((i)*( (rect.right - rect.left)-(rect.right - rect.left)*15/100) ) /9.45;
			myDiv.style.top = tempCoordsBottom + 'px';
			myDiv.style.left = tempCoordsLeft + 'px';
		}
		for (var i = 0; i < 1; i+=1) {
			var myDiv = document.getElementById('time_time_y' + i);
			//adding values of dotted Oy patterns
			var tempCoordsCoords = (rect.bottom - rect.top)/(3-0.2) ;
			var tempCoordsBottom = rect.bottom - tempCoordsCoords*(i+1);//(rect.bottom - rect.top)/(3-(i));
			myDiv.style.top = tempCoordsBottom + 'px';
			myDiv.style.left = 20 + 'px';
		}

		for (var i = 1; i < 3; i+=1) {;
			var myDiv = document.getElementById('time_time_y' + i);
			//adding values of dotted Oy patterns
			var tempCoordsCoords = (rect.bottom - rect.top)/(3+i/5.0) ;
			var tempCoordsBottom = rect.bottom - tempCoordsCoords*(i+1);//(rect.bottom - rect.top)/(3-(i));
			myDiv.style.top = tempCoordsBottom + 'px';
			myDiv.style.left = 20 + 'px';
		}
		
		//обновяване на I div
		var myDiv = document.getElementById('i_intensity');
		var tempCoordsBottom = rect.bottom - 30;
		myDiv.style.top = tempCoordsBottom + 'px';
		myDiv.style.left = 32 + 'px';
		
		//обновяване на S div
		var myDiv = document.getElementById('s_time');
		var tempCoordsBottom = rect.bottom - 27;
		myDiv.style.top = tempCoordsBottom + 'px';
		myDiv.style.left = 47 + 'px';		
		
		//обновяване на параметър=стойност div
		//z-index за момента не е нужен, но може после да потрябва.
		var myDiv = document.getElementById('param_value');
		var tempCoordsCoords = rect.bottom - rect.top;
		var tempCoordsBottom = rect.bottom - tempCoordsCoords + 10;
		myDiv.style.top = tempCoordsBottom + 'px';
		myDiv.style.left = eval(rect.right - 195) + 'px';
	};
	
	document.getElementById("paragraph_for_union_information").appendChild(slid);

	//добавяне на бутонче за скриване на бутоните с константите. Целта е да не пречат след първоначално въвеждане
	var slid = document.createElement("input");
	slid.type = "button";
	slid.value = "Hide Consts";
	slid.id = "showHideButtons";
	slid.style.position = "absolute";
	slid.style.left = "95px"
	slid.style.visibility = "visible";
	slid.className = "AnimationPush";
	slid.onclick = function(){ 
		//проверка, дали е въведен fit data файл преди fill sliders.
		if( flagUpWhenUploadedFileWithConfiguration != 1 ) {
			alert("Enter fit data first!");
			return;
		}
		if(this.value == "Hide Consts"){
			var showHide = document.getElementById(this.id);
			showHide.value = "Show Consts";
			var showHideButtonsVar = document.getElementsByClassName("buttonsCustomConfig");
			for (var i = 0; i < showHideButtonsVar.length; i++ ) document.getElementById(showHideButtonsVar[i].id).style.display="none";
			var showHideTxtFieldVar = document.getElementsByClassName("txtFieldCustomConfig");
			for (var i = 0; i < showHideTxtFieldVar.length; i++ ) document.getElementById(showHideTxtFieldVar[i].id).style.display="none";
			var showHideBrsVar = document.getElementsByClassName("newLinesButtons");
			for (var i = 0; i < showHideBrsVar.length; i++ ) document.getElementById(showHideBrsVar[i].id).style.display="none";	
			var showHideSelectColor = document.getElementsByClassName("colorSelectAfterUpload");
			for (var i = 0; i < showHideSelectColor.length; i++ ) document.getElementById(showHideSelectColor[i].id).style.display="none";	
			var showHideColor = document.getElementsByClassName("colClass");
			for (var i = 0; i < showHideColor.length; i++ ) document.getElementById(showHideColor[i].id).style.display="none";	

		} else {
			if(this.value == "Show Consts"){
				var showHide = document.getElementById(this.id);
				showHide.value = "Hide Consts";
				var showHideButtonsVar = document.getElementsByClassName("buttonsCustomConfig");
				for (var i = 0; i < showHideButtonsVar.length; i++ ) document.getElementById(showHideButtonsVar[i].id).style.display="inline";
				var showHideTxtFieldVar = document.getElementsByClassName("txtFieldCustomConfig");
				for (var i = 0; i < showHideTxtFieldVar.length; i++ ) document.getElementById(showHideTxtFieldVar[i].id).style.display="inline";
				var showHideBrsVar = document.getElementsByClassName("newLinesButtons");
				for (var i = 0; i < showHideBrsVar.length; i++ ) document.getElementById(showHideBrsVar[i].id).style.display="inline";
				var showHideSelectColor = document.getElementsByClassName("colorSelectAfterUpload");
				for (var i = 0; i < showHideSelectColor.length; i++ ) document.getElementById(showHideSelectColor[i].id).style.display="inline";	
				var showHideColor = document.getElementsByClassName("colClass");
				for (var i = 0; i < showHideColor.length; i++ ) document.getElementById(showHideColor[i].id).style.display="inline";	
			}
		}
	
		//обновяване на позициите на разграфяването след скриване/показване на бутоните с константи	
		var zxc = document.getElementById("picasso");
		var rect = zxc.getBoundingClientRect();
		for (var i = 0; i < 10; i+=1) {
			var myDiv = document.getElementById('time_time_' + i);			
			//adding values of dotted Ox patterns
			//change n
			//if i will use on tablets, maybe -25.0 should be replaced with something non static
			var tempCoordsBottom = rect.bottom - 25.0;
			//First shift right. Second: i take the rest and divide it by nearly 10, so it looks good.
			var tempCoordsLeft = (rect.right - rect.left)*15/100 + ((i)*( (rect.right - rect.left)-(rect.right - rect.left)*15/100) ) /9.45;
			myDiv.style.top = tempCoordsBottom + 'px';
			myDiv.style.left = tempCoordsLeft + 'px';
		}
		for (var i = 0; i < 1; i+=1) {
			var myDiv = document.getElementById('time_time_y' + i);
			//adding values of dotted Oy patterns
			var tempCoordsCoords = (rect.bottom - rect.top)/(3-0.2) ;
			var tempCoordsBottom = rect.bottom - tempCoordsCoords*(i+1);
			myDiv.style.top = tempCoordsBottom + 'px';
			myDiv.style.left = 20 + 'px';
		}

		for (var i = 1; i < 3; i+=1) {
			var myDiv = document.getElementById('time_time_y' + i);
			//adding values of dotted Oy patterns
			var tempCoordsCoords = (rect.bottom - rect.top)/(3+i/5.0) ;
			var tempCoordsBottom = rect.bottom - tempCoordsCoords*(i+1);
			myDiv.style.top = tempCoordsBottom + 'px';
			myDiv.style.left = 20 + 'px';
		}
		
		//обновяване на I div
		var myDiv = document.getElementById('i_intensity');
		var tempCoordsBottom = rect.bottom - 30;
		myDiv.style.top = tempCoordsBottom + 'px';
		myDiv.style.left = 32 + 'px';
		
		//обновяване на S div
		var myDiv = document.getElementById('s_time');
		var tempCoordsBottom = rect.bottom - 27;
		myDiv.style.top = tempCoordsBottom + 'px';
		myDiv.style.left = 47 + 'px';		
		
		//обновяване на параметър=стойност div
		//z-index за момента не е нужен, но може после да потрябва.
		var myDiv = document.getElementById('param_value');
		var tempCoordsCoords = rect.bottom - rect.top;
		var tempCoordsBottom = rect.bottom - tempCoordsCoords + 10;
		myDiv.style.top = tempCoordsBottom + 'px';
		myDiv.style.left = eval(rect.right - 195) + 'px';

	};

	document.getElementById("paragraph_for_union_information").appendChild(slid);

	//добавяне на бутонче за скриване на бутоните на графиките. Целта е да може да се покаже 1во колко е комплексна цялата работа, после да може да се покажат само някои от тях
	var slid = document.createElement("input");
	slid.type = "button";
	slid.value = "Hide Raw";
	slid.style.position = "absolute";
	slid.style.left = "182px";
	slid.style.display = 'none';
	slid.style.visibility = "visible";
	slid.id = "showHideGraphics";
	slid.className = "AnimationPush";
	slid.onclick = function(){ 
		if(this.value == "Hide Raw" && flagUpWhenUploadedFile === 1){
			var showHide = document.getElementById(this.id);
			showHide.value = "Show Raw";
			flagUpWhenUploadedFile = 0;
			start_optimization_t_scaling();
		} else {
			if(this.value == "Show Raw"){
				var showHide = document.getElementById(this.id);
				showHide.value = "Hide Raw";
				flagUpWhenUploadedFile = 1;
				start_optimization_t_scaling();
			}
		}
	};

	document.getElementById("paragraph_for_union_information").appendChild(slid);

	//input from file (custom configuration by user)
	var slid = document.createElement("input");
	slid.type = "file";
	slid.style.position = "absolute";
	slid.style.left = "356px"
	slid.style.visibility = "visible";
	slid.id = "configurationByUser";
	slid.style.display = "none";
	document.getElementById("paragraph_for_union_information").appendChild(slid);
	
	//input from file (visualizating raw data)
	var slid = document.createElement("input");					
	slid.type = "file";
	slid.id = "files";
	slid.style.display = "none";
	slid.multiple = "multiple";
	document.getElementById("paragraph_for_union_information").appendChild(slid);
	
	//output from file (testing)
	var slid = document.createElement("output");					
	slid.id = "result";
	document.getElementById("paragraph_for_union_information").appendChild(slid);
	
	//input from file (custom configuration by user)
	var slid = document.createElement("input");
	slid.type = "button";
	slid.value = "Raw data";
	slid.style.position = "absolute";
	//slid.style.left = "269px"
	slid.style.left = "183px";
	slid.style.visibility = "visible";
	slid.id = "fictiveFiles";
	slid.className = "AnimationPush";
	slid.onclick = function HandleBrowseClick() {
		//проверка дали вече не са били upload-нати файлове с raw data
		if(flagUpWhenUploadedFile == 1){
			alert("File already loaded. Reload page to upload new file.");
			return;
		}
		var fileinput = document.getElementById("files");
		fileinput.click();
	}
	document.getElementById("paragraph_for_union_information").appendChild(slid);
	
	//input from file (custom configuration by user)
	var slid = document.createElement("input");
	slid.type = "button";
	slid.value = "Fit data";
	slid.style.position = "absolute";
	//slid.style.left = "356px"
	slid.style.left = "270px";
	slid.style.visibility = "visible";
	slid.id = "fictiveConfigurationByUser";
	slid.className = "AnimationPush";
	slid.onclick = function HandleBrowseClick() {
		if(flagUpWhenUploadedFileWithConfiguration == 1){
			alert("File already loaded. Reload page to upload new file.");
			return;
		}
		var fileinput = document.getElementById("configurationByUser");
		fileinput.click();
	}
	document.getElementById("paragraph_for_union_information").appendChild(slid);

	//input from file (sliders information) fill sliders
	var slid = document.createElement("input");
	slid.type = "file";
	slid.style.position = "absolute";
	slid.style.left = "356px"
	slid.style.visibility = "visible";
	slid.id = "fillSlidersByUser";
	slid.style.display = "none";
	document.getElementById("paragraph_for_union_information").appendChild(slid);

	//input from file (sliders information) fill sliders
	var slid = document.createElement("input");
	slid.type = "button";
	slid.value = "Fill sliders";
	slid.style.position = "absolute";
	//slid.style.left = "443px"
	slid.style.left = "358px";
	slid.style.visibility = "visible";
	slid.id = "fictiveSliderInfoByUser";
	slid.className = "AnimationPush";
	slid.onclick = function HandleBrowseClick() {
		//проверка, дали е въведен fit data файл преди fill sliders.
		if( flagUpWhenUploadedFileWithConfiguration != 1 ) {
			alert("Enter fit data first!");
			return;
		}
		var fileinput = document.getElementById("fillSlidersByUser");
		fileinput.click();
	}
	document.getElementById("paragraph_for_union_information").appendChild(slid);
	
	//output from file (testing)
	var slid = document.createElement("output");					
	slid.id = "result-config";
	document.getElementById("paragraph_for_union_information").appendChild(slid);
	
	//input from file (custom configuration by user)
	var slid = document.createElement("input");
	slid.type = "button";
	slid.value = "Print mode";
	slid.style.position = "absolute";
	//slid.style.left = "530px"
	slid.style.left = "446px";
	slid.style.visibility = "visible";
	slid.id = "changeModeToPrint";
	slid.className = "AnimationPush";
	slid.onclick = changeMode;
	document.getElementById("paragraph_for_union_information").appendChild(slid);
	
	//25.12.2015
	//change grid color
	var slid = document.createElement("input");
	slid.type = "button";
	slid.value = "Grid on";
	slid.style.position = "absolute";
	//slid.style.left = "530px"
	slid.style.left = "535px";
	slid.style.visibility = "visible";
	slid.id = "changeGridColor";
	slid.className = "AnimationPush";
	slid.onclick = changeGridColor;
	document.getElementById("paragraph_for_union_information").appendChild(slid);
	
	var slid = document.createElement("input");					
	slid.type = "button";
	slid.value = "Show/Hide all";
	slid.id = "showHideAllGraphics";
	slid.addEventListener("mousedown", mouseDownAll);
	slid.addEventListener('contextmenu',function(e){e.preventDefault();},false);
	slid.style.marginLeft = '8px';
	slid.style.position = "absolute";
	//slid.style.left = "530px"
	slid.style.left = "616px";
	slid.style.visibility = "visible";
	slid.className = "AnimationPush";
	document.getElementById("paragraph_for_union_information").appendChild(slid);
	
	var slid = document.createElement("input");					
	slid.type = "button";
	slid.value = "No quantity";
	slid.id = "noQuantityButton";
	slid.onclick = function() {
		noQuantitySwitchName++;
//2016-02-16
		if(noQuantitySwitchName % 2 === 1 && document.getElementById("oyScaleMaxValue").value != "" ) {
			alert("Delete I-max value");
			return;
		}
		if(noQuantitySwitchName % 2 === 1) {
//2016-02-17
var addingBordersForRawData = document.getElementsByClassName("buttonNames2");
//if (event.which == 1  && showHideVar % 2 == 1) {
//				showHideVar = showHideVar + 1;
				
				for (var j = 0; j < addingBordersForRawData.length; j++ ) {

					//връщам оригиналния цвят на бутона
					//ако е променян цвета на графика
					var temp_color = document.getElementById("txt_field"+'0'+'00000'+j+"push").style.backgroundColor;	
					function rgb2hex(rgb) {
						rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
						function hex(x) {
							return ("0" + parseInt(x).toString(16)).slice(-2);
						}
						
						return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
					}
					
					document.getElementById("txt_name"+j).style.backgroundColor = rgb2hex(temp_color);
					current_clicked_fit_data = j;
					
					var index = skip_graphs2.indexOf(current_clicked_fit_data);
					skip_graphs2.splice(index, 1);
					flag_show_fit_data = 1;
					click_remove_fit();
				}
//			}



			document.getElementById("noQuantityButton").value = "With quantity"
			iMaxOptimizationNoQuantity();	
		} else {
//2016-02-17
var addingBordersForRawData = document.getElementsByClassName("buttonNames2");
//if (event.which == 1  && showHideVar % 2 == 1) {
//				showHideVar = showHideVar + 1;
				
				for (var j = 0; j < addingBordersForRawData.length; j++ ) {

					//връщам оригиналния цвят на бутона
					//ако е променян цвета на графика
					var temp_color = document.getElementById("txt_field"+'0'+'00000'+j+"push").style.backgroundColor;	
					function rgb2hex(rgb) {
						rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
						function hex(x) {
							return ("0" + parseInt(x).toString(16)).slice(-2);
						}
						
						return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
					}
					
					document.getElementById("txt_name"+j).style.backgroundColor = rgb2hex(temp_color);
					current_clicked_fit_data = j;
					
					var index = skip_graphs2.indexOf(current_clicked_fit_data);
					skip_graphs2.splice(index, 1);
					flag_show_fit_data = 1;
					click_remove_fit();
				}
//			}


		//да добавя може би нова функция, която връща стария вид на графиките?
			document.getElementById("noQuantityButton").value = "No quantity"
			start();
			//2016-02-16
			document.getElementById("changeGridColor").click();
			document.getElementById("changeGridColor").click();
		}
	};
	slid.style.marginRight = '6px';
	slid.style.position = "absolute";
	//slid.style.left = "530px"
	slid.style.left = "712px";
	slid.style.visibility = "visible";
	slid.className = "AnimationPush";
	document.getElementById("paragraph_for_union_information").appendChild(slid);
	
	var slid = document.createElement("input");
	slid.id = "noQuantityScaleText";
	slid.type = "text";
	slid.value = noQuantityByUser;
	slid.style.marginTop = '3px';
	slid.style.position = "absolute";
	//slid.style.display = "none";
	//slid.style.left = "530px"
	slid.style.left = "800px";
	slid.style.visibility = "visible";
	slid.size = 7;
	slid.onkeydown = function onKeyPressedOyScale(ev) {
		var e = ev || event;
		if(e.keyCode == 13) {
			//11-19-2015
			if( flagAfterFirstStart === 1) {
				array_with_maximums_13000 = [];
				numberOfIfEqs = 0;
				for (var m = 0; m <= z; m+=1){
				var t = 0.0;
					maxInEquation = 0;
					//alert(parseInt(document.getElementById("noQuantityScaleText").value));
					for (var i=0; i<parseInt(document.getElementById("noQuantityScaleText").value); i++){
//23.01-2						
						//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1] ) ) {
						if(t >= eval(dataWithIf[2*numberOfIfEqs+1] ) ) {
							var candidate = eval(dataWithIf[2*numberOfIfEqs]);
						} else { 
							var candidate = eval(equation_by_user[m]);
						}
						//ако има зададена стойност за нормализиране от потребител не обхожда за да търси максимума.
						if (document.getElementById("oyScaleMaxValue").value != "" && document.getElementById("oyScaleMaxValue").value > 0 ){
							maxInEquation = parseFloat(document.getElementById("oyScaleMaxValue").value);
						}else{
							findMaxValueInEquation(candidate);
						}
						if (max < -1.7+candidate/(maxInEquation/3.2) ) max = -1.7+candidate/(maxInEquation/3.2);
						//change n
						//28.12.2015
						//t+=1.3;
						t+=1.0;
					}
//23.01-2
					//if( m > z-totalNumberOfIfEqs) numberOfIfEqs++;
numberOfIfEqs++;
					array_with_maximums_13000.push(maxInEquation);
				}
			}
			iMaxOptimizationNoQuantity();	
		}
	};
	document.getElementById("paragraph_for_union_information").appendChild(slid);
	
	var slid = document.createElement("input");					
	slid.type = "button";
	slid.value = "Quantity max";
	slid.id = "noQuantityScaleButton";
	slid.style.position = "absolute";
	//slid.style.left = "530px"
	//slid.style.display = "none";
	slid.style.left = "882px";
	slid.style.visibility = "visible";
	slid.onclick = function() {
		if( flagAfterFirstStart === 1) {
			array_with_maximums_13000 = [];
			numberOfIfEqs = 0;
			for (var m = 0; m <= z; m+=1){
			var t = 0.0;
				maxInEquation = 0;
				//alert(parseInt(document.getElementById("noQuantityScaleText").value));
				for (var i=0; i<parseInt(document.getElementById("noQuantityScaleText").value); i++){
//23.01-2
					//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1] ) ) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1] ) ) {
						var candidate = eval(dataWithIf[2*numberOfIfEqs]);
					} else { 
						var candidate = eval(equation_by_user[m]);
					}
					//ако има зададена стойност за нормализиране от потребител не обхожда за да търси максимума.
					if (document.getElementById("oyScaleMaxValue").value != "" && document.getElementById("oyScaleMaxValue").value > 0 ){
						maxInEquation = parseFloat(document.getElementById("oyScaleMaxValue").value);
					}else{
						findMaxValueInEquation(candidate);
					}
					if (max < -1.7+candidate/(maxInEquation/3.2) ) max = -1.7+candidate/(maxInEquation/3.2);
					//change n
					t+=1.3;
				}
//23.01-2
				//if( m > z-totalNumberOfIfEqs) numberOfIfEqs++;
numberOfIfEqs++;
				array_with_maximums_13000.push(maxInEquation);
			}
		}
		iMaxOptimizationNoQuantity();	

	};
	slid.style.marginRight = '6px';
	slid.className = "AnimationPush";
	document.getElementById("paragraph_for_union_information").appendChild(slid);

	// setting value for dropdown menu 
	var addingValuesOfButtons = document.getElementsByClassName("buttonsCustomConfig");
	for (var i = 0; i < addingValuesOfButtons.length; i++) { 
		if( check_for_duplicates_dropmenu.indexOf(addingValuesOfButtons[i].value) > -1 ){
			continue;
		}
			
		//if element is currently not in the array - it's added
		// adding the button value to the dropmenu options 
		for (var j = 1; j <= document.getElementById("number_of_sliders").value; j++) {
			var slid = document.createElement("option");					
			//adding value and showvalue to dropmenu, so i can access from it later
			slid.value = addingValuesOfButtons[i].value;
			slid.text = addingValuesOfButtons[i].value;
			document.getElementById("dropMenu"+j).appendChild(slid);
		}
		check_for_duplicates_dropmenu.push(addingValuesOfButtons[i].value);
	}
	
	//adding button recreation
	var slid = document.createElement("br");
	slid.id = "specialBrAfterButtons";
	slid.style.display = 'none';
	document.getElementById("buttons").appendChild(slid);
	
	//button mode 2 - from
	var slid = document.createElement("input");
	slid.id = "rangeFromValue";
	slid.type = "text";
	slid.size = 7;
	slid.value = 1000;
	document.getElementById("buttons").appendChild(slid);
	
	var slid = document.createElement("input");					
	slid.type = "button";
	slid.value = "from";
	slid.style.marginRight = '6px';
	document.getElementById("buttons").appendChild(slid);
	
	//button t1 (time interval value)
	var slid = document.createElement("input");
	slid.id = "tValue";
	slid.type = "text";
	slid.size = 7;
	slid.value = t1;
	slid.onkeydown = function onKeyPressedT1(ev) {
		var e = ev || event;
		if(e.keyCode == 13) {
			t1 = parseFloat(document.getElementById(this.id).value);
			for (var i = 0; i < 10; i+=1) {
				//refreshing values of dotted Ox patterns
				//change n 
				document.getElementById('time_time_' + i).innerHTML = eval( (1*t1) * (i+1)/10);
			}
			start_optimization_t_scaling();
			//start();
		}
	};
	document.getElementById("buttons").appendChild(slid);
	
	var slid = document.createElement("input");					
	slid.type = "button";
	slid.value = "T";
	slid.onclick = function(){ 
		t1 = parseFloat(document.getElementById("tValue").value);
		for (var i = 0; i < 10; i+=1) {
			//refreshing values of dotted Ox patterns
			//change n 
			document.getElementById('time_time_' + i).innerHTML = eval( (1*t1) * (i+1)/10);
		}
			//2015-09-10
			//start_optimization_t_scaling();
			start();
			//2015-09-10
			//click_remove_fit();
	};
	slid.style.marginRight = '6px';
	slid.style.width = '52px';
	document.getElementById("buttons").appendChild(slid);
	
	var slid = document.createElement("select");
	slid.id = "tScaleSpeedValue";
	document.getElementById("buttons").appendChild(slid);
	
	for (var i = 1; i < 101; i++){
		var slid = document.createElement("option");					
		//adding value and showvalue to dropmenu, so i can access from it later
		slid.value = i;
		slid.text = i;
		document.getElementById("tScaleSpeedValue").appendChild(slid);
	}

	var slid = document.createElement("input");					
	slid.type = "button";
	slid.value = "T-scaling";
	slid.id = "recreationButton2";
	slid.style.marginRight = '6px';
	slid.className = "AnimationPush";
	slid.onclick = function(){ 
		
		//check if From value is lower than T value
		if( eval(document.getElementById("tValue").value) < eval(document.getElementById("rangeFromValue").value) ) {
			alert("'from' value must be lower than 'T' value");
			return;
		}
		
		//check if some the fit data is currently hidden.
		if( number_of_graphs_to_hide == first_line_of_file ) {
			alert("No current fit data available..");
			return;
		}
		
		//anti-stoyno button (cannot press animation button before animation is done).
		if( flagPreventFromDoubleClicking == 1 ) {
			alert("Animation is currently running, please wait..");
			return;
		}
		flagPreventFromDoubleClicking = 1;
		
		recreation_2(); 
	};
	document.getElementById("buttons").appendChild(slid);
	
	var slid = document.createElement("select");
	slid.id = "real-time-speed";
	slid.style.width = "42px";
	slid.onchange = function onKeyPressedSpeedGen(ev) {
		var e = ev || event;
		if(e.keyCode == 13) {
			if ( this.value < 1){
				speed_gen = 1;
			}else{
				speed_gen = parseInt(this.value);
			}
		}
	};
	document.getElementById("buttons").appendChild(slid);
	var slid = document.createElement("option");					
	//adding value and showvalue to dropmenu, so i can access from it later
	slid.value = 1;
	slid.text = 1;
	document.getElementById("real-time-speed").appendChild(slid);
	var slid = document.createElement("option");					
	//adding value and showvalue to dropmenu, so i can access from it later
	slid.value = 2;
	slid.text = 2;
	document.getElementById("real-time-speed").appendChild(slid);
	var slid = document.createElement("option");					
	//adding value and showvalue to dropmenu, so i can access from it later
	slid.value = 4;
	slid.text = 4;
	document.getElementById("real-time-speed").appendChild(slid);
	var slid = document.createElement("option");					
	//adding value and showvalue to dropmenu, so i can access from it later
	slid.value = 5;
	slid.text = 5;
	document.getElementById("real-time-speed").appendChild(slid);
	var slid = document.createElement("option");					
	//adding value and showvalue to dropmenu, so i can access from it later
	slid.value = 7;
	slid.text = 7;
	document.getElementById("real-time-speed").appendChild(slid);
	var slid = document.createElement("option");					
	//adding value and showvalue to dropmenu, so i can access from it later
	slid.value = 10;
	slid.text = 10;
	document.getElementById("real-time-speed").appendChild(slid);
	
	var slid = document.createElement("input");					
	slid.type = "button";
	slid.value = "Real-time";
	slid.id = "recreationButton";
	slid.style.marginRight = '6px';
	slid.className = "AnimationPush";
	slid.onclick = function(){
		if( flagUpWhenUploadedFileWithConfiguration != 1 ) {
			alert("Enter fit data first!");
			return;
		}
				
		//проверка дали не са скрити всички фитове.
		if( number_of_graphs_to_hide == first_line_of_file ) {
			alert("No current fit data available..");
			return;
		}
		
		//против натискане на бутона преди да е завършила анимацията.
		if( flagPreventFromDoubleClicking == 1 ) {
			alert("Animation is currently running, please wait..");
			return;
		}
		flagPreventFromDoubleClicking = 1;
		
		recreation(); 
	};

	document.getElementById("buttons").appendChild(slid);
	
	//добавяне на бутонче Animation. Един за всички неща.
	var slid = document.createElement("input");
	slid.type = "button";
	slid.value = "Animation";
	slid.style.position = "relative";
	//slid.style.left = "269px"
	slid.style.marginRight = '6px';
	slid.style.visibility = "visible";
	slid.id = "AnimationUnited";
	slid.className = "AnimationPush";
	slid.onclick = function(){
		
		if( flagUpWhenUploadedFileWithConfiguration != 1 ) {
			alert("Enter fit data first!");
			return;
		}
				
		//check if there is at least one visualized fit graphic.
		if( number_of_graphs_to_hide == first_line_of_file ) {
			alert("No current fit data available..");
			return;
		}
	
		if( flagPreventFromDoubleClicking == 1 ) {
			alert("Animation is currently running, please wait..");
			return;
		}
		flagPreventFromDoubleClicking = 1;
		//animation_function_test(); 
		before_animation_function_test();
	}
	document.getElementById("buttons").appendChild(slid);
	
	//добавяне на бутонче Animation 2. Един за всички неща, но паралелно вървящи.
	var slid = document.createElement("input");
	slid.type = "button";
	slid.value = "P animation";
	slid.style.position = "relative";
	//slid.style.left = "269px"
	slid.style.marginRight = '6px';
	slid.style.visibility = "visible";
	slid.id = "AnimationUnitedParallel";
	//slid.style.width = "100px";
	slid.className = "AnimationPush";
	slid.onclick = function(){
		
		if( flagUpWhenUploadedFileWithConfiguration != 1 ) {
			alert("Enter fit data first!");
			return;
		}
		
		//check if there is at least one visualized fit graphic.
		if( number_of_graphs_to_hide == first_line_of_file ) {
			alert("No current fit data available..");
			return;
		}
	
		if( flagPreventFromDoubleClicking == 1 ) {
			alert("Animation is currently running, please wait..");
			return;
		}
		flagPreventFromDoubleClicking = 1;
		//animation_function_test(); 
		flagParallelAnimation = 1;
		before_animation_function_test();
	}
	document.getElementById("buttons").appendChild(slid);
	
	
	//normalization value by user - in cases where one of the curves has huge intensity
	var slid = document.createElement("input");
	slid.id = "oyScaleMaxValue";
	slid.type = "text";
	slid.size = 7;
	slid.onkeydown = function onKeyPressedOyScale(ev) {
		var e = ev || event;
		if(e.keyCode == 13) {
			if (noQuantitySwitchName % 2 === 1 ) {
				alert("No need to normalize in mode 'No quantity'");
				return;
			}
		
			//проверка ако е празния низ да си прави каквото трябва.
			if(document.getElementById("oyScaleMaxValue").value.length == 0 ) {
				start_new_generation();
				return;
			}
			
			//проверка дали е положително числото, ако е отрицателно или 0 аламрира
			if(this.value <= 0) {
				alert("I-max value must be greater than 0!");
				return;
			}
			start_new_generation();
		}
	};
	document.getElementById("buttons").appendChild(slid);
	
	var slid = document.createElement("input");					
	slid.type = "button";
	slid.value = "I-max";
	slid.id = "oyScaleMax";
	slid.onclick = function() {
		if (noQuantitySwitchName % 2 === 1 ) {
			alert("No need to normalize in mode 'No quantity'");
			return;
		}
	
		//проверка ако е празния низ да си прави каквото трябва.
		if(document.getElementById("oyScaleMaxValue").value.length == 0 ) {
			tempCoef = "";
			start_new_generation();
			return;
		}
	
		if(document.getElementById("oyScaleMaxValue").value <= 0 ) {
			alert("I-max value must be greater than 0!");
			return;
		}
		start_new_generation();
		
	};
	slid.style.marginRight = '6px';
	slid.className = "AnimationPush";
	document.getElementById("buttons").appendChild(slid);
	
	function mouseDownAll(event){
	
		var addingBordersForRawData = document.getElementsByClassName("buttonNames2");
		
		//махане на всички фит графики:
		if(event.which == 1  && showHideVar % 2 == 0){
			showHideVar = showHideVar + 1;
			
			//задава неутрални цветове на бутоните
			for (var j = 0; j < addingBordersForRawData.length; j++ ) {
				document.getElementById("txt_name"+j).style.backgroundColor = "#ffffff";
				
				//проверка дали не е премахнат даден фит.
				if( skip_graphs2.indexOf(j) > -1 ) { continue; } else { skip_graphs2.push( j ); }
				//добавям в масива позицията на премахнатото уравнение. (нужно ми е - спрямо него не push-вам елементите на определни графики.)
				current_clicked_fit_data = parseInt( j );
				flag_show_fit_data = 0;
				click_remove_fit();
			}
			
			

		} else { 
			if (event.which == 1  && showHideVar % 2 == 1) {
				showHideVar = showHideVar + 1;
				
				for (var j = 0; j < addingBordersForRawData.length; j++ ) {

					//връщам оригиналния цвят на бутона
					//ако е променян цвета на графика
					var temp_color = document.getElementById("txt_field"+'0'+'00000'+j+"push").style.backgroundColor;	
					function rgb2hex(rgb) {
						rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
						function hex(x) {
							return ("0" + parseInt(x).toString(16)).slice(-2);
						}
						
						return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
					}
					
					document.getElementById("txt_name"+j).style.backgroundColor = rgb2hex(temp_color);
					current_clicked_fit_data = j;
					
					var index = skip_graphs2.indexOf(current_clicked_fit_data);
					skip_graphs2.splice(index, 1);
					flag_show_fit_data = 1;
					click_remove_fit();
				}
			}
		}

		//показване/скриване на всички raw? графики.
		if(event.which == 3 && rawDataSkipGraphic.length  != 0 ){
			rawDataSkipGraphic = [];
			for (var j = 0; j < addingBordersForRawData.length; j++ ) {
							
				if( helpColorRawData[i] != document.getElementById("txt_name"+j).value ) {
					document.getElementById("txt_name"+j).style.borderColor = "#ffffff";
				}
			}
			n=n1;
			start_recreation();
		}else {
			if(event.which == 3 && rawDataSkipGraphic.length  == 0 ){
				//тук трябва да прочета 1-вия ред само, да го премахна и останалото си е аналогично
				//работи както трябва и без да го махам - защо?
				var addingBordersForRawData = document.getElementsByClassName("buttonNames2");	
				
				for (var i = 0; i < helpColorRawData.length; i++){
					//извличам имената
					if( i % 2 == 0) {
						rawDataSkipGraphic.push(helpColorRawData[i]);
						//ако името съответства на бутон, значи ще сложим border с цвета указан във файла.
						for (var j = 0; j < addingBordersForRawData.length; j++ ) {
								
							if( helpColorRawData[i] == document.getElementById("txt_name"+j).value ) {
								document.getElementById("txt_name"+j).style.borderColor = "#"+helpColorRawData[i+1];
							}
						}
					}
				}
				n=n1;
				start_recreation();
			}
		}
		
	}
	
	clearing_custom_stuff();
	
}

//executed once
//creating buttons for constants used in equations (each button is paired with text field)
function create_config_constant_buttons()
{
	number_of_constants_old = number_of_constants;
	number_of_constants = document.getElementById("number_of_constants").value;
	//removing old elements
	for (var i=start_number_of_constants; i<=number_of_constants_old; i++)
	{
		var parent = document.getElementById("buttons");
		var child = document.getElementById("txt_field"+i+'00000'+j+"push");
		parent.removeChild(child);
		child = document.getElementById("txt_field"+i+'00000'+j);
		parent.removeChild(child);
	}
	
	//adding new elements
	for (var i=start_number_of_constants; i<=number_of_constants; i++)
	{
		//check if button with this ID exists (this is how i remove it with button "previous")
		if ( document.getElementById("txt_field"+i+'00000'+j+"push") ) break;
		if ( document.getElementById("txt_field"+i+'00000'+j) ) break;
		
		//creating text field in front of button
		var slid = document.createElement("input");
		slid.id = "txt_field"+i+'00000'+j;
		slid.type = "text";
		slid.size = 7;
		slid.className = "txtFieldCustomConfig";
		slid.value = "Enter";
		slid.onkeydown = function onKeyPressedNameButton(ev) {
			var e = ev || event;
			//it's 1 when done() is pressed, and then text fields have different functionality
			//sets names to buttons
			if(show_custom_config === 0) { 
				if(e.keyCode == 13) {
					//Enter was pressed
					// changing button value 
					document.getElementById(this.id+"push").value = document.getElementById(this.id).value;
				}
			}else{ 
				// here is the functionality after custom config 
				//sets values to buttons
				if(show_custom_config === 1){
					if(e.keyCode == 13) {
						createVariable( document.getElementById(this.id+"push").value, document.getElementById(this.id).value );
						start_optimization_t_scaling();
						return false; //prevents form from being submitted.
					}
				}
			}
		};
		document.getElementById("buttons").appendChild(slid);
		
		// creating button
		// with the strange convention of ID's i will manipulate easy the input in text field to become value of button
		var but = document.createElement("input");
		but.type = "button";
		but.value = "Button "+i+j;
		but.id = "txt_field"+i+'00000'+j+"push";
		but.className = "buttonsCustomConfig";
		but.style.backgroundColor = color_of_equation;
		// appending to father with id=buttons
		document.getElementById("buttons").appendChild(but);
		but.onclick = function() {alert(document.getElementById("txt_field"+i+'00000'+j+"push").type);};
	}
}

//executed once
//dynamic creation of sliders (each slider is paired with min/max/step/animation buttons)
function create_config_sliders()
{
	number_of_sliders_old = number_of_sliders;
    number_of_sliders = document.getElementById("number_of_sliders").value;
	
	//if file is uploaded it takes it's value of nregulators.
	if (flagUpWhenUploadedFileWithConfiguration === 1) 
	{
		number_of_sliders = removeSymbols2[1];
	}

	//removing old sliders
	for (var i=1; i<=number_of_sliders_old; i++)
	{
		//слайдър
		var parent = document.getElementById("sliders");;
		var child = document.getElementById("dropMenu"+i);
		parent.removeChild(child);
		child = document.getElementById("MinButton"+i);
		parent.removeChild(child);
		child = document.getElementById("MaxButton"+i);
		parent.removeChild(child);
		child = document.getElementById("MinButtonPush"+i);
		parent.removeChild(child);
		child = document.getElementById("MaxButtonPush"+i);
		parent.removeChild(child);
		child = document.getElementById("StepButton"+i);
		parent.removeChild(child);
		child = document.getElementById("StepButtonPush"+i);
		parent.removeChild(child);
		child = document.getElementById("AnimationPush"+i);
		parent.removeChild(child);		
		child = document.getElementById("br"+i);
		parent.removeChild(child);
	}

	//adding new sliders
	for (var i=1; i<=number_of_sliders; i++)
	{
		slid = document.createElement("input");
		slid.type = "button";
		slid.value = "None";
		slid.style.display = "none";
		//slid.size = 200;
		//slid.id = "MinButtonPush"+i;
		slid.id = "NameConsts"+i;
		slid.className = "buttonNames3";
		document.getElementById("sliders").appendChild(slid);
		//до тук
	
		var slid = document.createElement("select");
		slid.name = "Select parameter";
		slid.id = "dropMenu"+i;
		slid.onchange = function () {
			var options = this.options;
			var value   = options[options.selectedIndex].value;
			var findNumberOfEq = document.getElementsByClassName("buttonsCustomConfig");
			var helpArray = [];
			//извличам номера на уравнението, по-долу премахвам водещите нули.
			for (var ij = 0; ij < findNumberOfEq.length; ij++) {
					
				if ( findNumberOfEq[ij].value == value) {
					helpArray.push(findNumberOfEq[ij].id.substring(findNumberOfEq[ij].id.length-4-first_line_of_file.toString().length, findNumberOfEq[ij].id.length-4));
				}
			}
			//removing leading zeros
			//премахвам водещи нули (това е за да работи с 999 999 уравнения)
			for (var iz = 0; iz < helpArray.length; iz++) {
				if( parseInt(helpArray[iz]) == 0) {
					helpArray[iz] = 0; continue; 
				}
				helpArray[iz] = helpArray[iz].replace(/^0+/, '');
			}
			var rrr = parseInt( this.id.slice(8) );
			if (array_with_names_of_proteins[helpArray[0]] == undefined) {
				document.getElementById("NameConsts"+rrr ).value = "None";
				return
			}
			document.getElementById("NameConsts"+rrr ).value = array_with_names_of_proteins[helpArray[0]];
			
		}
		slid.style.display = "none";
		slid.style.width = "62px";
		document.getElementById("sliders").appendChild(slid);
		
		slid = document.createElement("input");
		slid.id = "MinButton"+i;
		slid.style.display = "none";
		slid.type = "text";
		slid.size = 7;
		slid.onkeypress = function (ev) {
			var e = ev || event;
			//after done is pressed values are accepted
			if(show_custom_config === 1){	
				if(e.keyCode == 13) {
					//gets the last char of id and by it i will change the correct slider
					//слайдър
					var tempMin = parseFloat(document.getElementById("MinButton"+this.id.substring(9)).value );
					tempCoef = document.getElementById("dropMenu" + this.id.substring(9)).value;
					//alert(document.getElementById("dropMenu" + this.id.substring(9)).value + " " +parseFloat(document.getElementById("MinButton"+this.id.substring(9)).value) );
					createVariable( tempCoef, tempMin );

					start_new_generation();
					
					
					return false; //prevents form from being submitted.
				}
			}
		};
		document.getElementById("sliders").appendChild(slid);
		
		slid = document.createElement("input");
		slid.type = "button";
		slid.value = "From";
		slid.style.display = "none";
		slid.id = "MinButtonPush"+i;
		slid.onclick = function(){ 
			//get the chosen min
			var tempMin = parseFloat(document.getElementById("MinButton"+this.id.substring(13)).value );
			tempCoef = document.getElementById("dropMenu" + this.id.substring(13)).value;
			createVariable( tempCoef, tempMin );

			start_new_generation();
		};
		document.getElementById("sliders").appendChild(slid);
		
		slid = document.createElement("input");
		slid.id = "MaxButton"+i;
		slid.style.display = "none";
		slid.type = "text";
		slid.size = 7;
		slid.onkeypress = function (ev) {
			var e = ev || event;
			//after done is pressed values are accepted
			if(show_custom_config === 1){	
				if(e.keyCode == 13) {					
					start_optimization_t_scaling();
					return false; //prevents form from being submitted.
				}
			}
		};
		document.getElementById("sliders").appendChild(slid);
		
		slid = document.createElement("input");
		slid.type = "button";
		slid.style.display = "none";
		slid.value = "To";
		slid.id = "MaxButtonPush"+i;
		document.getElementById("sliders").appendChild(slid);
		
		slid = document.createElement("input");
		slid.id = "StepButton"+i;
		slid.type = "text";
		slid.style.display = "none";
		slid.size = 7;
		slid.onkeypress = function (ev) {
			var e = ev || event;
			//after done is pressed values are accepted
			if(show_custom_config === 1){	
				if(e.keyCode == 13) {
					return false; //prevents form from being submitted.
				}
			}
		};
		document.getElementById("sliders").appendChild(slid);
		
		slid = document.createElement("input");
		slid.type = "button";
		slid.value = "Step";
		slid.id = "StepButtonPush"+i;
		slid.style.display = "none";
		document.getElementById("sliders").appendChild(slid);
		
		slid = document.createElement("input");
		slid.type = "button";
		slid.value = "Animation";
		slid.id = "AnimationPush"+i;
		slid.className = "AnimationPush";
		slid.style.display = "none";
		slid.onclick = animation_function_test;
		document.getElementById("sliders").appendChild(slid);
		
		if (i === 1){
			slid = document.createElement("input");
			slid.type = "button";
			slid.value = "Set values";
			slid.id = "setValues";
			slid.className = "AnimationPush";
			slid.style.display = "none";
			slid.onclick = function HandleBrowseClick() {

			};
			document.getElementById("sliders").appendChild(slid);
		}
		slid = document.createElement("br");
		slid.id = "br"+i;
		slid.style.display = "none";
		document.getElementById("sliders").appendChild(slid);
	}
}

//23.01
//прави анимация по всички зададени параметри
function animation_function_test(){
	//i have to get the values here, because "this" is returning window in incremCoef function.
	//gets A0, B0...
	tempCoef = document.getElementById("dropMenu" + l).value;
	
	document.getElementById("dropMenu" + l).style.background="#ff0";
				
	//gets the chosen step
	var tempStep2 = parseFloat(document.getElementById("StepButton" + l).value);
	
	//get the chosen max
	var tempMax = parseFloat(document.getElementById("MaxButton" + l).value);
				
	//get the chosen min
	var tempMin = parseFloat(document.getElementById("MinButton" + l).value);
	
	var myVar = setInterval( function(){ incremCoef(); }, 20 );
				
	//setting precision of html div element value params
	if (decimalPlaces(parseFloat( tempMin )) > decimalPlaces(parseFloat( tempMax ))) {
		presicionValue = decimalPlaces(parseFloat( tempMin )) + 2;
		if(presicionValue >= 20) {presicionValue=20; }
	}else {
		presicionValue = decimalPlaces(parseFloat( tempMax )) + 2;
		if(presicionValue >= 20) {presicionValue=20; }
	}
				
	function incremCoef()
	{
		//division by 0
		if( eval(tempCoef) < tempMax && (tempMax - tempMin) > 0) {
			tempStep = (tempMax - tempMin)/tempStep2;
			createVariable( tempCoef, ( parseFloat( eval(tempCoef) ) + parseFloat( tempStep ) ).toFixed(presicionValue) );
			if (eval(tempCoef) > tempMax)
			{
				presicionValue = decimalPlaces(parseFloat( tempMax ));
				if (presicionValue >= 20 )presicionValue = 20;
				createVariable( tempCoef, tempMax );

			}
						
			document.getElementById("param_value").innerHTML = tempCoef +"="+ parseFloat(eval(tempCoef)).toFixed(presicionValue);
			//start_optimization_t_scaling();
//24.01-3 когато е скрита тук се случва нещо. 
//Влиза първият път, вижда че 1вата е скрита и скипва и край. С другите не го прави
			start_new_generation();
		} else {
			if( eval(tempCoef) > tempMax && (tempMax - tempMin) < 0 ){
				tempStep = (tempMax - tempMin)/tempStep2;
				
				createVariable( tempCoef, parseFloat( eval(tempCoef) ) + parseFloat( tempStep ) );
				if (eval(tempCoef) < tempMax)
				{
					presicionValue = decimalPlaces(parseFloat( tempMax ));
					//2015-10-03-5
					if (presicionValue >= 20 )presicionValue = 20;
					createVariable( tempCoef, tempMax );
				}
				document.getElementById("param_value").innerHTML = tempCoef +"="+ parseFloat(eval(tempCoef)).toFixed(presicionValue);
				//start_optimization_t_scaling();
				start_new_generation();
			} else { 
				clearInterval(myVar);
				flagPreventFromDoubleClicking = 0;

				//обхожда параметрите
				if (l < number_of_sliders){
					//if (document.getElementById("dropMenu" + l).value == undefined) {return;}
					document.getElementById("dropMenu" + l).style.background="none";
					l++;
					animation_function_test();
				} else {
					document.getElementById("dropMenu" + l).style.background="none";
					l=1;
				}
			}
		}
	}
	
}

//прави анимация по всички зададени параметри
function animation_function_test_proba_byrza(){
	//i have to get the values here, because "this" is returning window in incremCoef function.
	//gets A0, B0...
	tempCoef = document.getElementById("dropMenu" + l).value;
	
	document.getElementById("dropMenu" + l).style.background="#ff0";
	
	//get the chosen min
	var tempMin = parseFloat(document.getElementById("MinButton" + l).value);

	createVariable( tempCoef, tempMin );

	start_new_generation();
	
	//обхожда параметрите
	if (l < number_of_sliders){
		document.getElementById("dropMenu" + l).style.background="none";
		l++;
		animation_function_test_proba_byrza();
	} else {
		document.getElementById("dropMenu" + l).style.background="none";
		l=1;
	}
}

//прави паралелна анимация по всички указани параметри.
function animation_function_test_2(){
	currentStep = 0;
	//till function incremCoef() is just for non-error with variable presicionValue;

	array_with_equation_names_anim2 = [];
	var tempStep2 = parseInt(document.getElementById("StepButton" + 1).value);
	
		for (var l = 1; l <= number_of_sliders; l++ ) {
			if (array_with_equation_names_anim2.indexOf(document.getElementById("NameConsts" + l).value) > -1 || document.getElementById("NameConsts" + l).value == "None" ) { 
				continue; 
			} else {
				array_with_equation_names_anim2.push(document.getElementById("NameConsts" + l).value);
			}
			
		}
	var myVar = setInterval( function(){ incremCoef(); }, 20 );
				
	function incremCoef()
	{		
		
		//показване на стъпката
		if (tempStep2 > currentStep) {
			currentStep = currentStep + 1;
			document.getElementById("param_value").innerHTML = "Step: "+ currentStep;
		}
				
		//тук трябва да се изнесе start_new_generation извън цикъла, а в цикъла да се намират параметри към уравнение и да се присвояват (само за 1 уравнение, ако модифицирам start_new_gen може и да стане с колкото искаме)
		
		//ще трупам в различни масиви номера на уравнението към което е параметъра при генерирането на имената на графиките пред падащите менюта
		//после 
		
		//сега логиката е: обхождам веднъж всички слайдъри и тези с еднакво име (имам имената в масива по-долу) им правя createConst и после заедно eval. Така правя за всички от масива. т.е. итерирам спрямо стойностите в масива ми по всичките sliders 
		
		for (var za = 1; za <= array_with_equation_names_anim2.length; za++) {
			for (var l = 1; l <= number_of_sliders; l++ ) {
				if(document.getElementById("NameConsts" + l).value == array_with_equation_names_anim2[za-1] ) {
					
					tempCoef = document.getElementById("dropMenu" + l).value
					var tempMax = parseFloat(document.getElementById("MaxButton" + l).value);
					var tempMin = parseFloat(document.getElementById("MinButton" + l).value);
					if( eval(tempCoef) < tempMax && (tempMax - tempMin) > 0 ) {
						tempStep = (tempMax - tempMin)/tempStep2;
						createVariable( tempCoef, ( parseFloat( eval(tempCoef) ) + parseFloat( tempStep ) ) );
						//това прави визуализирането както искам! обаче ще трябва потребителя да цъкне "ок" - да опитам да го автоматизирам това.
						if (eval(tempCoef) > tempMax) {
							//presicionValue = decimalPlaces(parseFloat( tempMax ));
							createVariable( tempCoef, tempMax );
						}

					} else {
						if( eval(tempCoef) > tempMax && (tempMax - tempMin) < 0 ){
							tempStep = (tempMax - tempMin)/tempStep2;
							createVariable( tempCoef, parseFloat( eval(tempCoef) ) + parseFloat( tempStep ) );
							//това прави визуализирането както искам! обаче ще трябва потребителя да цъкне "ок" - да опитам да го автоматизирам това.
							if (eval(tempCoef) < tempMax)
							{
								createVariable( tempCoef, tempMax );
							}
						} else { 
							clearInterval(myVar);
							flagPreventFromDoubleClicking = 0;
							flagParallelAnimation = 0;
						}
					}
				}
			}
			start_new_generation();
		}
	}	
}

function decimalPlaces(num) {
	var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
	if (!match) { return 0; }
	return Math.max(
       0,
       // Number of digits right of decimal point.
       (match[1] ? match[1].length : 0)
       // Adjust for scientific notation.
       - (match[2] ? +match[2] : 0));
}

//executed once
//converts hex to RGB(0-255) to rgb(0-1) with one floating decimal 
function convertHexToRGB(hexColor) {
	rgbColor = parseInt(hexColor, 16)/255.0;
	return rgbColor.toFixed(1);
}

//raw data reading
function readRawDataFromFile() {
    //Check File API support
    if (window.File && window.FileList && window.FileReader) {
        var filesInput = document.getElementById("files");
        filesInput.addEventListener("change", function(event) {
            var files = event.target.files; //FileList object
			//тук залагам първоначални стойности, за да може да качваме произволен брой пъти raw-data без refresh на страницата
			helpCounter = 1;
			currentFileColumnLength = [];
			
            for (var i = 0; i < files.length; i++) {
//26.01
//plamen qnkov koherent
//0888 693 704
                var file = files[i];

                //Only plain text
                if (!file.type.match('plain')) continue;

                var picReader = new FileReader();

                picReader.addEventListener("load", function(event) {

					var textFile = event.target;
					//used to iterate over file with random number of columns. if its 6, this must be 6/3 (0-5  -> (5+1)/2 )
					var lengthHelper = textFile.result.split('\n');
					var lengthHelper2 = lengthHelper[0].replace(/(\r|\n|\t)/gm," ").split(" ");
					var lengthHelper3 = lengthHelper2.filter(function(v){return v!==''});
					helpColorRawData.extend(lengthHelper3);
					var addingBordersForRawData = document.getElementsByClassName("buttonNames2");	

					for (var i = 0; i < lengthHelper3.length; i++){
						//извличам имената
						if( i % 2 == 0) {
							rawDataSkipGraphic.push(lengthHelper3[i]);
							//ако името съответства на бутон, значи ще сложим border с цвета указан във файла.
							for (var j = 0; j < addingBordersForRawData.length; j++ ) {
								if( lengthHelper3[i] == document.getElementById("txt_name"+j).value ) {
									document.getElementById("txt_name"+j).style.border = "thick solid"
									document.getElementById("txt_name"+j).style.borderWidth = "5px 3px 5px 3px"
									document.getElementById("txt_name"+j).style.borderColor = "#"+lengthHelper3[i+1];
								}
							}
						}
					}
					
					fileRowLength = lengthHelper3.length/2;

					//замества нов ред и табулация с празен символ - така стават на масив, логически групиран по двойки (време->стойност)
					bla = textFile.result.replace(/(\r|\n|\t)/gm," ");
					bla3 = bla.split(" ");
					bla4 = bla3.filter(function(v){return v!==''});
					bla2.extend(bla4);
					//тук bla2 накрая е n пъти едно и също, трябва някак да запазвам предишните.

					currentFileColumnLength.push( (bla4.length) / 2*fileRowLength );

					helpCounter++;
					if( helpCounter < files.length){
						return;
					}

					flagUpWhenUploadedFile = 1;
					start();
					
                });

				//Read the text file
                picReader.readAsText(file);
            }
        });
    }
    else {
        console.log("Your browser does not support File API");
    }
}



//сливане на масиви
Array.prototype.extend = function (other_array) {
    /* you should include a test to check whether other_array really is an array */
    other_array.forEach(function(v) {this.push(v)}, this);    
}

//25.12.2015 
//задаване на конфигурация от потребител - прочетена от файл. by user
function readConfigDataFromFile() {

    //Check File API support
    if (window.File && window.FileList && window.FileReader) {
        var filesInput = document.getElementById("configurationByUser");
		
		
        filesInput.addEventListener("change", function(event) {
            var files = event.target.files; //FileList object

			flagAfterFirstStart = 1; //да се намери макс до 13 000
			
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
				//var file = "C:/Users/dancho/Desktop/BAN/diploma/software - after diplom24122015/Fit data/Formuli_3.txt";
				//alert(file);
                //Only plain text
                if (!file.type.match('plain')) continue;

                var picReader = new FileReader();

                picReader.addEventListener("load", function(event) {

                var textFile = event.target;

				// ------------  УКАЗВАНЕ НА БРОЙ СЛАЙДЪРИ ОТ ФАЙЛ -----------------------
				//премахвам нови редове и табулации, замествам ги със знак за нов ред.
				
				//25.12.2015
				removeSymbols = textFile.result.replace(/(\r|\n|\t)/gm," ");
				//removeSymbols = zxcasd.replace(/(\r|\n|\t)/gm," ");
				
				//преобразувам до масив
				removeSymbols3 = removeSymbols.split(" ");
				removeSymbols2 = removeSymbols3.filter(function(v){return v!==''});
				//достъп до 1-вия елемент на файла, който указва брой брегулатори (случва се във функция create_config_sliders)

				//прочитане на първото поле от файла и създаване на N броя регулатори.
				first_line_of_file = removeSymbols2[0];
				if(parseInt(first_line_of_file) > 999999) { 
					alert("Maximum equations is limited to 999999!");
					return;
				}
				flagUpWhenUploadedFileWithConfiguration = 1;
				
				create_config_sliders();

				//--------------------------  УКАЗВАНЕ НА УРАВНЕНИЕ ОТ ФАЙЛ ОТ ПОТРЕБИТЕЛ ------------------------
				
				for (var numb_eqs_from_file = 0; numb_eqs_from_file < first_line_of_file; numb_eqs_from_file++ )
				{
					//рамката на четене през 2 реда повече, ако има if-ове.
					if( totalNumberOfIfEqs == 1 ) {
						lines_per_equation_in_file = 6;
						startingEquationWithIf = 2*(numb_eqs_from_file-1);
					}
					var splited = removeSymbols2[lines_per_equation_in_file * numb_eqs_from_file+2-startingEquationWithIf].split(/[*%+/)(-][*%+/)(-]*/);
					for (var i = 0; i < splited.length; i+=1) {
						var temp = splited[i];
						//check if there is js Math function and skip it.
						if ( temp.substr(0,5) === "Math.") continue;
						if ( temp === "t") continue;
						if ( temp === "") continue;
						if ( isNumber(temp) ) continue;
						createVariable( temp, i);
					}
					equation_by_user[numb_eqs_from_file] = removeSymbols2[lines_per_equation_in_file*numb_eqs_from_file+2-startingEquationWithIf];

					if(removeSymbols2[lines_per_equation_in_file*numb_eqs_from_file+6-startingEquationWithIf] == undefined) continue;
					if(removeSymbols2[lines_per_equation_in_file*numb_eqs_from_file+6-startingEquationWithIf].substring(0,6) == 'if:t>=' ) {
						dataWithIf.push( removeSymbols2[lines_per_equation_in_file*numb_eqs_from_file+7-startingEquationWithIf] );
						dataWithIf.push( removeSymbols2[lines_per_equation_in_file*numb_eqs_from_file+6-startingEquationWithIf].substring(6) );
						totalNumberOfIfEqs++;
					}
				}
				lines_per_equation_in_file = 4;
				startingEquationWithIf = 0;
				color_eqs = [];
				
				//-----------------------УКАЗВАНЕ НА ЦВЯТ НА УРАВНЕНИЕ ОТ ФАЙЛ ОТ ПОТРЕБИТЕЛ -----------------
				for (var numb_eqs_from_file = 0; numb_eqs_from_file < first_line_of_file; numb_eqs_from_file++ )
				{
					if( numb_eqs_from_file == first_line_of_file-totalNumberOfIfEqs) {
						lines_per_equation_in_file = 6;
						startingEquationWithIf = 2*(numb_eqs_from_file);
					}
					newRcolor = convertHexToRGB(removeSymbols2[lines_per_equation_in_file * numb_eqs_from_file+3-startingEquationWithIf].substring(0,2));
					newGcolor = convertHexToRGB(removeSymbols2[lines_per_equation_in_file * numb_eqs_from_file+3-startingEquationWithIf].substring(2,4));
					newBcolor = convertHexToRGB(removeSymbols2[lines_per_equation_in_file * numb_eqs_from_file+3-startingEquationWithIf].substring(4,6));
					color_eqs.push([newRcolor, newGcolor, newBcolor]);
				}
				//това го ползвам за лесно премахване и показване на всички фитове от бутона Show/Hide all.
				permanentColorEqs = color_eqs;
				lines_per_equation_in_file = 4;
				startingEquationWithIf = 0;

				//---------------------УКАЗВАНЕ НА СТОЙНОСТИ НА ПАРАМЕТРИТЕ ОТ ФАЙЛ --------------------------
				for (var numb_eqs_from_file = 0; numb_eqs_from_file < first_line_of_file; numb_eqs_from_file++ )
				{
					if( numb_eqs_from_file == first_line_of_file-totalNumberOfIfEqs) {
						lines_per_equation_in_file = 6;
						startingEquationWithIf = 2*(numb_eqs_from_file);
					}
					var splited2 = removeSymbols2[lines_per_equation_in_file*numb_eqs_from_file+4-startingEquationWithIf].split(/=|;/);
					for (var i = 0; i < splited2.length/2; i++)
					{
						createVariable(splited2[2*i], splited2[2*i+1] );
					}
				}
				lines_per_equation_in_file = 4;
				startingEquationWithIf = 0;
				
				//масив с всички без последните 2 "Web safe colors" (белият цвят го ползвам за неутрален)
				var arrSafeColors = ["000000", "000033", "000066", "000099", "0000cc", "0000ff", "003300", "003333", "003366", "003399", "0033cc", "0033ff", "006600", "006633", "006666", "006699", "0066cc", "0066ff", "009900", "009933", "009966", "009999", "0099cc", "0099ff", "00cc00", "00cc33", "00cc66", "00cc99", "00cccc", "00ccff", "00ff00", "00ff33", "00ff66", "00ff99", "00ffcc", "00ffff", "330000", "330033", "330066", "330099", "3300cc", "3300ff", "333300", "333333", "333366", "333399", "3333cc", "3333ff", "336600", "336633", "336666", "336699", "3366cc", "3366ff", "339900", "339933", "339966", "339999", "3399cc", "3399ff", "33cc00", "33cc33", "33cc66", "33cc99", "33cccc", "33ccff", "33ff00", "33ff33", "33ff66", "33ff99", "33ffcc", "33ffff", "660000", "660033", "660066", "660099", "6600cc", "6600ff", "663300", "663333", "663366", "663399", "6633cc", "6633ff", "666600", "666633", "666666", "666699", "6666cc", "6666ff", "669900", "669933", "669966", "669999", "6699cc", "6699ff", "66cc00", "66cc33", "66cc66", "66cc99", "66cccc", "66ccff", "66ff00", "66ff33", "66ff66", "66ff99", "66ffcc", "66ffff", "990000", "990033", "990066", "990099", "9900cc", "9900ff", "993300", "993333", "993366", "993399", "9933cc", "9933ff", "996600", "996633", "996666", "996699", "9966cc", "9966ff", "999900", "999933", "999966", "999999", "9999cc", "9999ff", "99cc00", "99cc33", "99cc66", "99cc99", "99cccc", "99ccff", "99ff00", "99ff33", "99ff66", "99ff99", "99ffcc", "99ffff", "cc0000", "cc0033", "cc0066", "cc0099", "cc00cc", "cc00ff", "cc3300", "cc3333", "cc3366", "cc3399", "cc33cc", "cc33ff", "cc6600", "cc6633", "cc6666", "cc6699", "cc66cc", "cc66ff", "cc9900", "cc9933", "cc9966", "cc9999", "cc99cc", "cc99ff", "cccc00", "cccc33", "cccc66", "cccc99", "cccccc", "ccccff", "ccff00", "ccff33", "ccff66", "ccff99", "ccffcc", "ccffff", "ff0000", "ff0033", "ff0066", "ff0099", "ff00cc", "ff00ff", "ff3300", "ff3333", "ff3366", "ff3399", "ff33cc", "ff33ff", "ff6600", "ff6633", "ff6666", "ff6699", "ff66cc", "ff66ff", "ff9900", "ff9933", "ff9966", "ff9999", "ff99cc", "ff99ff", "ffcc00", "ffcc33", "ffcc66", "ffcc99", "ffcccc", "ffccff", "ffff00", "ffff33", "ffff66", "ffff99"];
				//---------------------АВТОМАТИЧНО ГЕНЕРИРАНЕ НА БУТОНИ СЪС СЪОТВЕТНИТЕ ИМ ИМЕНА ОТ ФАЙЛ ----------------

//23.01 -> тук да направя вместо '00000' да е 'zzzzz', така при махането после няма да е проблем.
				for (var numb_eqs_from_file = 0; numb_eqs_from_file < first_line_of_file; numb_eqs_from_file++ )
				{
					//тук да добавям br елемент!
					var slid = document.createElement("br");
					slid.id = "brauto"+numb_eqs_from_file;
					slid.className = "newLinesButtons";
					document.getElementById("buttons").appendChild(slid);
					
					if( numb_eqs_from_file == first_line_of_file-totalNumberOfIfEqs) {
						lines_per_equation_in_file = 6;
						startingEquationWithIf = 2*(numb_eqs_from_file);
					}
					
					var splited2 = removeSymbols2[lines_per_equation_in_file*numb_eqs_from_file+4-startingEquationWithIf].split(/=|;/);
					for (var i = 0; i < splited2.length/2; i++)
					{
						//creating text field in front of button
						var slid = document.createElement("input");
						slid.id = "txt_field"+i+'00000'+numb_eqs_from_file;
						slid.type = "text";
						slid.size = 7;
						slid.className = "txtFieldCustomConfig";
						slid.value = splited2[2*i+1];
						slid.onkeydown = function onKeyPressedNameButton(ev) {
							var e = ev || event;
							if(e.keyCode == 13) {
								createVariable( document.getElementById(this.id+"push").value, document.getElementById(this.id).value );
								//2015-09-15--
								tempCoef = document.getElementById(this.id+"push").value;
								createVariable( tempCoef, parseFloat( eval(tempCoef) ) );
								start_new_generation();

								return false; //prevents form from being submitted.
							}
						};
						document.getElementById("buttons").appendChild(slid);
								
						// creating button
						// with the strange convention of ID's i will manipulate easy the input in text field to become value of button
						var but = document.createElement("input");
						but.type = "button";
						but.value = splited2[2*i];
						but.id = "txt_field"+i+'00000'+numb_eqs_from_file+"push";
						but.onclick = function(){
							
							var temp_str = this.id;
							var temp_str2 = temp_str.substring(0, temp_str.length - 4);
							createVariable( document.getElementById(this.id).value, document.getElementById(temp_str2).value );
							tempCoef = document.getElementById(this.id).value;
							createVariable( tempCoef, parseFloat( eval(tempCoef) ) );
							start_new_generation();
							
							
							
							return false;
						};
						but.className = "buttonsCustomConfig";
						var temp_color = removeSymbols2[lines_per_equation_in_file*numb_eqs_from_file+3-startingEquationWithIf];
						but.style.backgroundColor = "#" + temp_color;
						// appending to father with id=buttons
						document.getElementById("buttons").appendChild(but);
					}
					
					//25.12.2015
					//за цвят от потребител след въведена конфигурация.
//26.01
					var slid = document.createElement("input");
					slid.type = "button";
					slid.id = "colorSelectionAfterConfigUploaded"+numb_eqs_from_file;
					slid.style.width = "105px";
					slid.value = removeSymbols2[lines_per_equation_in_file*numb_eqs_from_file+5-startingEquationWithIf];	
					slid.className = "colorSelectAfterUpload";
					/*slid.onchange = function () {
						//промяна на цвета на бутоните
						//тези нови променливи се налагат, тъй като това се активира след обхождането файла и нямам текущи стойности - трябва да си ги извлека наново.
						var extractNumberForLine = this.id.slice(33);

//23.01-3
						//if (extractNumberForLine > first_line_of_file - totalNumberOfIfEqs) {
if (extractNumberForLine >= first_line_of_file - totalNumberOfIfEqs) {
							var splited2 = removeSymbols2[lines_per_equation_in_file*extractNumberForLine+2*(extractNumberForLine-(first_line_of_file - totalNumberOfIfEqs))+4-startingEquationWithIf].split(/=|;/);
						} else {
							var splited2 = removeSymbols2[lines_per_equation_in_file*extractNumberForLine+4-startingEquationWithIf].split(/=|;/);
						}

						
						for (var i = 0; i < splited2.length/2; i++) { 
							document.getElementById("txt_field"+i+'00000'+extractNumberForLine+"push").style.backgroundColor = "#" + document.getElementById(this.id).value;
						}
							
						//промяна на цвета на имената-бутони
						document.getElementById("txt_name"+extractNumberForLine).style.backgroundColor = "#" + document.getElementById(this.id).value;
							
						//промяна на цвета на самата графика
						customRcolor = convertHexToRGB(document.getElementById(this.id).value.substring(0,2));
						customGcolor = convertHexToRGB(document.getElementById(this.id).value.substring(2,4));
						customBcolor = convertHexToRGB(document.getElementById(this.id).value.substring(4,6));
						//тук да намеря къде е в масива по номера на уравнението и да заместя директно стойностите.
						var help_to_change_color = 0;
						var opit = parseInt(extractNumberForLine); //- help_to_change_color;
						var help_array_colors = [customRcolor, customGcolor, customBcolor];

						if ( opit === 0 ) {
							color_eqs.shift();
							color_eqs.unshift(help_array_colors);
						
						} else {
							color_eqs.splice(opit, 1, help_array_colors );
						}
						start_new_generation();
					};
*/
				document.getElementById("buttons").appendChild(slid); 
				
					
				//25.12.2015
//26.01
/*
				for (var i = 1; i <= 214; i++){
					var slid = document.createElement("option");					
					//adding value and showvalue to dropmenu, so i can access from it later
					slid.value = arrSafeColors[i-1];
					slid.text = removeSymbols2[lines_per_equation_in_file*numb_eqs_from_file+5-startingEquationWithIf];
					slid.style.backgroundColor = "#"+arrSafeColors[i-1];
					document.getElementById("colorSelectionAfterConfigUploaded"+numb_eqs_from_file).appendChild(slid);					
					}
*/
//				var slid = document.createElement("input");
//				slid.type = "button";	
//				slid.value = removeSymbols2[lines_per_equation_in_file*numb_eqs_from_file+5-startingEquationWithIf];		
//				document.getElementById("colorSelectionAfterConfigUploaded"+numb_eqs_from_file).appendChild(slid);
					
				var slid = document.createElement("input");
				slid.id = "col"+numb_eqs_from_file;
				slid.className = "colClass";
				slid.setAttribute("type", "color"); 
				slid.value = "#" + removeSymbols2[lines_per_equation_in_file*numb_eqs_from_file+3-startingEquationWithIf];
				slid.onchange = function () {
						//промяна на цвета на бутоните
						//тези нови променливи се налагат, тъй като това се активира след обхождането файла и нямам текущи стойности - трябва да си ги извлека наново.
						var extractNumberForLine = this.id.slice(3);

//23.01-3
						//if (extractNumberForLine > first_line_of_file - totalNumberOfIfEqs) {
if (extractNumberForLine >= first_line_of_file - totalNumberOfIfEqs) {
							var splited2 = removeSymbols2[lines_per_equation_in_file*extractNumberForLine+2*(extractNumberForLine-(first_line_of_file - totalNumberOfIfEqs))+4-startingEquationWithIf].split(/=|;/);
						} else {
							var splited2 = removeSymbols2[lines_per_equation_in_file*extractNumberForLine+4-startingEquationWithIf].split(/=|;/);
						}
						
						for (var i = 0; i < splited2.length/2; i++) { 
							document.getElementById("txt_field"+i+'00000'+extractNumberForLine+"push").style.backgroundColor = document.getElementById(this.id).value;
						}
							
						//промяна на цвета на имената-бутони
						document.getElementById("txt_name"+extractNumberForLine).style.backgroundColor = document.getElementById(this.id).value;
							
						//промяна на цвета на самата графика
						customRcolor = convertHexToRGB(document.getElementById(this.id).value.substring(1,3));
						customGcolor = convertHexToRGB(document.getElementById(this.id).value.substring(3,5));
						customBcolor = convertHexToRGB(document.getElementById(this.id).value.substring(5,7));
						//alert(document.getElementById(this.id).value);
						//тук да намеря къде е в масива по номера на уравнението и да заместя директно стойностите.
						var help_to_change_color = 0;
						var opit = parseInt(extractNumberForLine); //- help_to_change_color;
						var help_array_colors = [customRcolor, customGcolor, customBcolor];

						if ( opit === 0 ) {
							color_eqs.shift();
							color_eqs.unshift(help_array_colors);
						
						} else {
							color_eqs.splice(opit, 1, help_array_colors );
						}
						start_new_generation();
					};
				document.getElementById("buttons").appendChild(slid); 
				
				array_with_names_of_proteins.push(removeSymbols2[lines_per_equation_in_file*numb_eqs_from_file+5-startingEquationWithIf]);
				}
				lines_per_equation_in_file = 4;
				startingEquationWithIf = 0;
				arrSafeColors = [];

				//------------------------ДОБАВЯНЕ НА ИМЕНАТА НА КОНСТАНТИТЕ КЪМ ПАДАЩОТО МЕНЮ ---------------
				//добавяне на стойности в dropdown менюто, отговарящи на имената на бутоните
				var addingValuesOfButtons = document.getElementsByClassName("buttonsCustomConfig");
				for (var j = 1; j <= number_of_sliders; j++) {
					var slid = document.createElement("option");			
					//adding value and showvalue to dropmenu, so i can access from it later
					slid.value = "";
					slid.text = "";
					document.getElementById("dropMenu"+j).appendChild(slid);
				}
				
				for (var i = 0; i < addingValuesOfButtons.length; i++) { 
					//ако присъства в масива, пропускам			
					if( check_for_duplicates_dropmenu.indexOf(addingValuesOfButtons[i].value) > -1 ){
						
						continue;
					}
					//if element is currently not in the array - it's added
					// adding the button value to the dropmenu options 
					for (var j = 1; j <= number_of_sliders; j++) {
						var slid = document.createElement("option");			
						//adding value and showvalue to dropmenu, so i can access from it later
						slid.value = addingValuesOfButtons[i].value;
						slid.text = addingValuesOfButtons[i].value; //+ "......." + nameHelp;
						document.getElementById("dropMenu"+j).appendChild(slid);
					}
					check_for_duplicates_dropmenu.push(addingValuesOfButtons[i].value);
				}
				
				//------------------------------АВТОМАТИЧНО ГЕНЕРИРАНЕ НА ИМЕНА-БУТОНИ ОТ ФАЙЛ ----------------
				var slid = document.createElement("br");
				slid.id = "firstBrNames";
				document.getElementById("buttons").appendChild(slid);
				arrayWithFitDataNames = [];
				//ще имам стъпки, колкото броя уравнения е указано във файла
				for (var numb_eqs_from_file = 0; numb_eqs_from_file < first_line_of_file; numb_eqs_from_file++ )
				{	
						if( numb_eqs_from_file == first_line_of_file-totalNumberOfIfEqs) {
							lines_per_equation_in_file = 6;
							startingEquationWithIf = 2*(numb_eqs_from_file);
						}
						// creating button
						// with the strange convention of ID's i will manipulate easy the input in text field to become value of button
						var but = document.createElement("input");
						but.type = "button";
						but.value = removeSymbols2[lines_per_equation_in_file*numb_eqs_from_file+5-startingEquationWithIf];
						arrayWithFitDataNames.push(removeSymbols2[lines_per_equation_in_file*numb_eqs_from_file+5-startingEquationWithIf]);
						but.id = "txt_name"+numb_eqs_from_file;
						but.addEventListener('contextmenu',function(e){e.preventDefault();},false);
						but.addEventListener("mousedown", mouseDown);
						but.className = "buttonNames2";
						var temp_color = removeSymbols2[lines_per_equation_in_file*numb_eqs_from_file+3-startingEquationWithIf];
						but.style.backgroundColor = "#" + temp_color;
						// appending to father with id=buttons
						document.getElementById("buttons").appendChild(but);
				}
				lines_per_equation_in_file = 4;
				startingEquationWithIf = 0;
				
				function mouseDown(event)
				{
					//при натиснат десен миши бутон да маха raw data графика.
					if(event.which == 3){
						//ако името на бутона е в текущо рисуваните - я махаме
						var index = rawDataSkipGraphic.indexOf(this.value);
						
						if (index > -1) {
							rawDataSkipGraphic.splice(index, 1);
						}else{
						//ако не е в текущо рисуваните - я слагаме
							rawDataSkipGraphic.push(this.value);
						}
						if (this.style.borderColor ==  "rgb(255, 255, 255)"){
							for (var i = 0; i < helpColorRawData.length; i++){
								if(helpColorRawData[i] == this.value){
									this.style.borderColor = '#' + helpColorRawData[i+1];
								}
							}
						} else {
							this.style.borderColor = '#ffffff';
						}
						n=n1;
						start_recreation();
					}
					
//23.01-3
					//няма да махам цели части от масива, а само ще "нулирам" даден участък. Рамта не би трябвало да проблем, а изчисленията.
					if(event.which == 1 ) {
						if(this.style.backgroundColor !== "rgb(255, 255, 255)") {
							this.style.backgroundColor = "#ffffff";

							//добавям в масива позицията на премахнатото уравнение. (нужно ми е - спрямо него не push-вам елементите на определни графики.)
							skip_graphs.push( parseInt( this.id.slice(8) ) );
							skip_graphs2.push( parseInt( this.id.slice(8) ) );
							current_clicked_fit_data = parseInt( this.id.slice(8) );
						}else{
							//тук се показва поне 1 графика, затова премахвам флага.
							flagPreventFromDoubleClicking = 0;
							flag_show_fit_data = 1;
							current_clicked_fit_data = parseInt( this.id.slice(8) );
							var index = skip_graphs2.indexOf(current_clicked_fit_data);
							skip_graphs2.splice(index, 1);
							
							//тук да променя!
							//връщам оригиналния цвят на бутона
							//25.12.2015
							if(document.getElementById("col"+this.id.slice(8)).value == "#000000") {
								//ако не е променян цвета на графика
//23.01-3
								//if( this.id.slice(8) > first_line_of_file - totalNumberOfIfEqs ) {
if( this.id.slice(8) >= first_line_of_file - totalNumberOfIfEqs ) {
									lines_per_equation_in_file = 6;
									startingEquationWithIf = 2*(this.id.slice(8) - (first_line_of_file - totalNumberOfIfEqs) );
								}
								var temp_color = removeSymbols2[4*(first_line_of_file - totalNumberOfIfEqs)+ 3 + lines_per_equation_in_file*parseInt(this.id.slice(8) - (first_line_of_file - totalNumberOfIfEqs))];
								lines_per_equation_in_file = 4;
								startingEquationWithIf = 0;
							}else{
								//ако е променян цвета на графика
								var temp_color = document.getElementById("col"+this.id.slice(8)).value;
							}
									
							this.style.backgroundColor = temp_color;
						}
						click_remove_fit();
						return false;
					}
				};

				//???
				start_optimization_t_scaling();
				//start_new_generation();
				
				var fileinput = document.getElementById("showHideButtons");
				fileinput.click();
				
				//25.12.2015 наместване на лекото разместване когато максималната графиката е последна.
				//var gridcolor = document.getElementById("changeGridColor");
				//gridcolor.click();
				
                });

                //Read the text file
                picReader.readAsText(file);
            }

        });
    }
    else {
        console.log("Your browser does not support File API");
   }
}

//тази функция е за бързо реагиране на show/hide fit имена-бутони.
function click_remove_fit() {
//bug??? (to recreate problem: remove var t = 1.0; and type: console.log(t); logs undefined (but t is declared global))
	//помощен масив, спрямо който махам максимумите на текущи скритите графики.
//23.01-4
//alert( currently_clicked_fits);
	var t = 1.0;
	if ( currently_clicked_fits.indexOf(current_clicked_fit_data) > -1 ){
		for (var i = 0; i < 3*701; i++){
		}
	} else {
		currently_clicked_fits.push(current_clicked_fit_data);
		for (var i = 0; i < 3*701; i++){
			//3*3*701 е 3 координати, чертани по 3 графики, всяка от 701 точки. - добавям всички y координати. После ще ги връщам
			//умножавам по текущия максимум, така данната е първоначалната, след което при добавяне ще деля новия максимум (ако има такъв), така добавената графика ще бъде правилно нормализирана.
			data_temp_holder.push ( (data[27351+flagUpWhenUploadedFile*( 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) )+3*3*701*(current_clicked_fit_data)+3*i+1] + 1.7) * maxInEquation );
		}
	}
	//ако цвета на графиката е неутрален, вдигаме флага и ще трябва да я генерираме наново.
	//Проблем с if графиките.
	numberOfIfEqs = 0;
//23.01-2
	//if( current_clicked_fit_data > z-totalNumberOfIfEqs ) {
if( current_clicked_fit_data >= z-totalNumberOfIfEqs ) {
		numberOfIfEqs = (current_clicked_fit_data - (z-totalNumberOfIfEqs) - 1 );
	}

	if (flag_show_fit_data === 1) {
		if (noQuantitySwitchName % 2 === 1) {
			var t = 0;
			for (var i = 0; i < 701; i++){
					//взимам индекса на цъкнатата графика от масива с цъкнати графики.
//23.01-2
					//if( current_clicked_fit_data > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
if( t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
						tempRes = eval(dataWithIf[2*numberOfIfEqs]);
					} else { 
						tempRes = eval(equation_by_user[current_clicked_fit_data ]);
					}
					data[27351+flagUpWhenUploadedFile*( 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) )+3*3*701*(current_clicked_fit_data)+3*i+1] = -1.7+tempRes/(array_with_maximums[current_clicked_fit_data]/3.2);
					t+=creationStep;//creationStep;	
				}
			var t = 0;
			for (var i = 701; i < 2*701; i++){
					//взимам индекса на цъкнатата графика от масива с цъкнати графики.
//23.01-2
					//if( current_clicked_fit_data > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
						tempRes = eval(dataWithIf[2*numberOfIfEqs]);
					} else { 
						tempRes = eval(equation_by_user[current_clicked_fit_data ]);
					}
					data[27351+flagUpWhenUploadedFile*( 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) )+3*3*701*(current_clicked_fit_data)+3*i+1] = -1.707+tempRes/(array_with_maximums[current_clicked_fit_data]/3.2);
					t+=creationStep;//creationStep;
				}
			var t = 0;
			for (var i = 2*701; i < 3*701; i++){
					//взимам индекса на цъкнатата графика от масива с цъкнати графики.
//23.01-2
					//if( current_clicked_fit_data > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
if( t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
						tempRes = eval(dataWithIf[2*numberOfIfEqs]);
					} else { 
						tempRes = eval(equation_by_user[current_clicked_fit_data ]);
					}
					data[27351+flagUpWhenUploadedFile*( 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) )+3*3*701*(current_clicked_fit_data)+3*i+1] = -1.714+tempRes/(array_with_maximums[current_clicked_fit_data]/3.2);
					t+=creationStep;//creationStep;
				}
			flag_show_fit_data = 0;
		} else {
			var t = 0;
			for (var i = 0; i < 701; i++){
					//взимам индекса на цъкнатата графика от масива с цъкнати графики.
//23.01-2
					//if( current_clicked_fit_data > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
						tempRes = eval(dataWithIf[2*numberOfIfEqs]);
					} else { 
						tempRes = eval(equation_by_user[current_clicked_fit_data ]);
					}
					data[27351+flagUpWhenUploadedFile*( 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) )+3*3*701*(current_clicked_fit_data)+3*i+1] = -1.7+tempRes/(maxInEquation/3.2);
					t+=creationStep;//creationStep;
				}
			var t = 0;
			for (var i = 701; i < 2*701; i++){
					//взимам индекса на цъкнатата графика от масива с цъкнати графики.
//23.01-2
					//if( current_clicked_fit_data > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
						tempRes = eval(dataWithIf[2*numberOfIfEqs]);
					} else { 
						tempRes = eval(equation_by_user[current_clicked_fit_data ]);
					}
					data[27351+flagUpWhenUploadedFile*( 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) )+3*3*701*(current_clicked_fit_data)+3*i+1] = -1.707+tempRes/(maxInEquation/3.2);
					t+=creationStep;//creationStep;
				}
			var t = 0;
			for (var i = 2*701; i < 3*701; i++){
					//взимам индекса на цъкнатата графика от масива с цъкнати графики.
//23.01-2
					//if( current_clicked_fit_data > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
						tempRes = eval(dataWithIf[2*numberOfIfEqs]);
					} else { 
						tempRes = eval(equation_by_user[current_clicked_fit_data ]);
					}
					data[27351+flagUpWhenUploadedFile*( 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) )+3*3*701*(current_clicked_fit_data)+3*i+1] = -1.714+tempRes/(maxInEquation/3.2);
					t+=creationStep;//creationStep;

				}
			flag_show_fit_data = 0;
		}
	} else {
		
		//ползва се за оптимизация на кликането на имената-бутониmaxInEquation
		//скривам ги като изпращам Y Координатата на -5
		for (var i = 0; i < 3*701; i++){
			//3*3*701 е 3 координати, чертани по 3 графики, всяка от 701 точки.
			data[27351+flagUpWhenUploadedFile*( 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) )+3*3*701*(current_clicked_fit_data)+3*i+1] = -5;
		}
	}
			
	gl.clearColor(switchColorR,switchColorG,switchColorB,1);
	gl.clear(gl.COLOR_BUFFER_BIT);
				
	//iterating over text .txt file with hardcoded name.
	var t = 0.0;	
			
	//code for creating vertex buffer
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

	gl.enableVertexAttribArray(aXYZ);
	gl.vertexAttribPointer(aXYZ,3,gl.FLOAT,false,0,0);
			
	//coord sys 
	gl.vertexAttrib3f(aRGB,switchColorRs,switchColorGs,switchColorBs);
	gl.drawArrays(gl.LINES,0,4);
			
	//Draws dotted line top.
	if(noGridLines === 1) {
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		gl.drawArrays(gl.LINES,4,700+1);
		
		//Draws dotted line middle.
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		gl.drawArrays(gl.LINES,4+701,700+1);
		
		//Draws dotted line bottom.
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		gl.drawArrays(gl.LINES,4+701*2,700+1);
				
		//Draws 10 dotted lines X-axis (time).
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		for(var j=0; j<10; j++){
			gl.drawArrays(gl.LINES,4+3*701+701*(j),700+1);
		}
	}
			
	if(flagUpWhenUploadedFile === 1) { 
	//Draws raw data
				
		for (var p = 1; p < helpCounter; p++) {
			//ако съм премахнал графика не се рисува (да го направя при връщане на графика да се рисува. т.е. някак да добавям индекса където трябва)
			if ( rawDataSkipGraphic.indexOf(helpColorRawData[2*p-2]) == -1 ){
				continue;
			}
			//взима цветовете от raw data файла.
			var color_of_raw_data = helpColorRawData[2*p-1];
			var newRcolor = convertHexToRGB(color_of_raw_data.substring(0,2));
			var newGcolor = convertHexToRGB(color_of_raw_data.substring(2,4));
			var newBcolor = convertHexToRGB(color_of_raw_data.substring(4,6));
			gl.vertexAttrib3f(aRGB,newRcolor,newGcolor,newBcolor);
			gl.drawArrays(gl.LINE_STRIP,4+3*701+10*701+( findMaxToNthElement(currentFileColumnLength, p-1) ) , currentFileColumnLength[p-1]);
		}
	}
	//Draws formulees and sets colors
	for (var m = 0; m <= z-number_of_graphs_to_hide; m+=1) {
		gl.vertexAttrib3f(aRGB,color_eqs[m][0],color_eqs[m][1],color_eqs[m][2]);
		gl.drawArrays(gl.LINE_STRIP,(3*m+0)*(700+1)+4+3*701+10*701+flagUpWhenUploadedFile*( findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) ),700+1);
		gl.drawArrays(gl.LINE_STRIP,(3*m+1)*(700+1)+4+3*701+10*701+flagUpWhenUploadedFile*( findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) ),700+1);
		gl.drawArrays(gl.LINE_STRIP,(3*m+2)*(700+1)+4+3*701+10*701+flagUpWhenUploadedFile*( findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) ),700+1);		
	}
}

//fill sliders reading
function readSliderDataFromFile() {

    //Check File API support
    if (window.File && window.FileList && window.FileReader) {
        var filesInput = document.getElementById("fillSlidersByUser");
		
        filesInput.addEventListener("change", function(event) {
            var files = event.target.files; //FileList object

            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                //Only plain text
                if (!file.type.match('plain')) continue;

                var picReader = new FileReader();

                picReader.addEventListener("load", function(event) {

					var textFile = event.target;

					var lengthHelper = textFile.result;//.split('\n');
					lengthHelper = String(lengthHelper);

					var lengthHelper2 = lengthHelper.replace(/(\r|\n|\t)/gm," ").split(" ");

					//премахване ако е имало много последвателни празни символи
					var lengthHelper3 = lengthHelper2.filter(function(v){return v!==''});
					
					//изчистване на стойности, ако преди е имало такива.
					countingSliders = 0;
					for (var llll = 0; llll < number_of_sliders; llll++){
						//добавя стойност на падащото меню
							countingSliders++;
							document.getElementById("dropMenu"+countingSliders ).value = "";
						//добавя стойност на From
							document.getElementById("MinButton"+countingSliders ).value = "";
						//добавя стойност на To
							document.getElementById("MaxButton"+countingSliders ).value = "";
						//добавя стойност на Step
							document.getElementById("StepButton"+countingSliders ).value = "";
						//добавя стойност на NameConsts (името пред падащото меню)
							document.getElementById("NameConsts"+countingSliders ).value = "None";
					}
					
					//добавяне на стойности на слайдърите
					countingSliders = 0;
					for (var llll = 0; llll < lengthHelper3.length; llll++){
						//добавя стойност на падащото меню
						if(llll % 4 === 0){
							countingSliders++;
							if(countingSliders > number_of_sliders) break;
							document.getElementById("dropMenu"+countingSliders ).value = lengthHelper3[llll];
						}
						//добавя стойност на From
						if(llll % 4 === 1){
							document.getElementById("MinButton"+countingSliders ).value = lengthHelper3[llll];
						}
						//добавя стойност на To
						if(llll % 4 === 2){
							document.getElementById("MaxButton"+countingSliders ).value = lengthHelper3[llll];
						}

						//добавя стойност на Step
						if(llll % 4 === 3){
							document.getElementById("StepButton"+countingSliders ).value = lengthHelper3[llll];
						}
							var findNumberOfEq = document.getElementsByClassName("buttonsCustomConfig");
							var helpArray = [];
							
							//извличам номера на уравнението, по-долу премахвам водещите нули.
							for (var i = 0; i < findNumberOfEq.length; i++) {
								if ( findNumberOfEq[i].value == document.getElementById("dropMenu"+countingSliders ).value) {
									helpArray.push(findNumberOfEq[i].id.substring(findNumberOfEq[i].id.length-4-first_line_of_file.toString().length, findNumberOfEq[i].id.length-4));
								}
							}
							
							//removing leading zeros
							//премахвам водещи нули (това е за да работи с 999 999 уравнения)
							for (var i = 0; i < helpArray.length; i++) {
								if( parseInt(helpArray[i]) == 0) {
									helpArray[i] = 0; continue; 
								}
//23.01 тук махам водещи нули - да го опразя на z.
								helpArray[i] = helpArray[i].replace(/^0+/, '');
							}
							document.getElementById("NameConsts"+countingSliders ).value = array_with_names_of_proteins[helpArray[0]];
					}
					flagUpWhenUploadedFileWithConfigurationBonus = 1;
                });
                //Read the text file
                picReader.readAsText(file);
            }
        });
    }
    else {
        console.log("Your browser does not support File API");
    }
}

//check if variable is number.
function isNumber (o) {
  return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
}

//executed once
// returns WebGL context, linked with HTML element with id
function getContext(id)
{
	var canvas = document.getElementById(id);
	if (!canvas)
	{
		alert("Искаме canvas с id="+id+", а няма!");
		return null;
	}
	
	var context = canvas.getContext("webgl");
	if (!context)
	{
		context = canvas.getContext("experimental-webgl");
	}
	
	if (!context)
	{
		alert("Искаме WebGL контекст, а няма!");
	}
	
	return context;
}

//executed once
//returns compiled shader
function getShader(id,type)
{
	var source = document.getElementById(id).text;
	var shader = gl.createShader(type);

	gl.shaderSource(shader,source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS))
	{
		alert(gl.getShaderInfoLog(shader));
		return null;
	}
	
	return shader;
}

//executed once
//returns complete/linked program
function getProgram(idv,idf)
{
	var vShader = getShader(idv,gl.VERTEX_SHADER);
	var fShader = getShader(idf,gl.FRAGMENT_SHADER);
			
	if (!vShader || !fShader) {return null;}
	
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram,vShader);
	gl.attachShader(shaderProgram,fShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS))
	{
		alert(gl.getProgramInfoLog(shaderProgram));
		return null;
	}

	gl.useProgram(shaderProgram);
	return shaderProgram;
}

function findMaxValueInEquation(candidate) {
	if (maxInEquation < candidate ){
		maxInEquation = candidate;
	}
	return maxInEquation;
}

//Function that makes the calculations, not in the start().
function start_optimization_t_scaling() {
	//coordinate system
	data = [ -2.9, -1.7, 0, 2.9, -1.7, 0, -2.6, -1.9, 0, -2.6, 1.9, 0 ];
		
	//проверка дали е вкаран файл от потребител. и ако е генерираме спрямо неговите формули 			
	if(flagUpWhenUploadedFileWithConfiguration === 1) {
		z = first_line_of_file-1;
	}

	//dotted line top.
	for (var i=0; i<700+1; i++){
		data.push(-2.6+12*i/(700+1), -1.7+3.2,0);
	}
	
	//dotted line middle.
	for (var i=0; i<700+1; i++){
		data.push(-2.6+12*i/(700+1), -1.7+3.2*2/3,0);
	}
			
	//dotted line bottom.
	for (var i=0; i<700+1; i++){
		data.push(-2.6+12*i/(700+1), -1.7+3.2*(1/3),0);
	}

	//10 dotted lines X-axis (time)
	for (var j=1; j<=10; j++)
		for (var i=0; i<700+1; i++){
			data.push(-2.6+5.5*j/10, -1.7+3.6*5*i/(700+1),0);
		}
				
	//да го направя само един път (има го и в друга функция)
	buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,buf);
		
	if(t_scaling_flag === 1){
		var myVar = setInterval(function(){ mode_2() }, 20);
		function mode_2()
		{
			data = data.slice(0, 27351);
			t1+=incremSpeed;
			if (t1 < t_to) {
				start();
			}else{		
				clearInterval(myVar);
				t_scaling_flag = 0;
				flagPreventFromDoubleClicking = 0;
				t1=t_to;
				start();
			}
		}
	}
	
	start();
}

function start_optimiz_coefs() {
	
	var findNumberOfEq = document.getElementsByClassName("buttonsCustomConfig");
	var helpArray = [];
	
	//извличам номера на уравнението, по-долу премахвам водещите нули.
	for (var i = 0; i < findNumberOfEq.length; i++) {
		if ( findNumberOfEq[i].value == tempCoef) {
			helpArray.push(findNumberOfEq[i].id.substring(findNumberOfEq[i].id.length-4-first_line_of_file.toString().length, findNumberOfEq[i].id.length-4));
		}
	}

//23.01
//alert(helpArray);
	
	//removing leading zeros
	//премахвам водещи нули (това е за да работи с 999 999 уравнения)
	for (var i = 0; i < helpArray.length; i++) {
		if( parseInt(helpArray[i]) == 0) {
			helpArray[i] = 0; continue; 
		}
//23.01 тук махам водещи нули, да го оправя на z
		helpArray[i] = helpArray[i].replace(/^0+/, '');
		//alert(helpArray);
	}
}

//целта на тази функция е да намира параметър в кое уравнение е, така при промяна ще меня само тази част от масива.
function find_param_in_equation() {
	
}

//използва се от t-scaling after from.
//разликата с горната, е че тук ще пресмятам максимума спрямо следващите данни само (не всички) и ако има по-висок максимум, ще имам масив с данните от функциите и само ще трябва да се извърши операция деление.

//ползва се при натискане на бутона "t-scaling"
function t_scaling_preparation ()
{
	//coordinate system
	data2 = [ -2.9, -1.7, 0, 2.9, -1.7, 0, -2.6, -1.9, 0, -2.6, 1.9, 0 ];
			
	//проверка дали е вкаран файл от потребител. и ако е генерираме спрямо неговите формули 			
	if(flagUpWhenUploadedFileWithConfiguration === 1) {
		z = first_line_of_file-1;
	}

	//dotted line top.
	for (var i=0; i<700+1; i++){
		data2.push(-2.6+12*i/(700+1), -1.7+3.2,0);
	}
	
	//dotted line middle.
	for (var i=0; i<700+1; i++){
		data2.push(-2.6+12*i/(700+1), -1.7+3.2*2/3,0);
	}
		
	//dotted line bottom.
	for (var i=0; i<700+1; i++){
		data2.push(-2.6+12*i/(700+1), -1.7+3.2*(1/3),0);
	}

	//10 dotted lines X-axis (time)
	for (var j=1; j<=10; j++)
		for (var i=0; i<700+1; i++){
			data2.push(-2.6+5.5*j/10, -1.7+3.6*5*i/(700+1),0);
		}

	numberOfIfEqs = 0;
	for (var m = 0; m <= z; m+=1) {	
		var t = 0.0;
			//23.01	
		//if (skip_graphs2.indexOf(m) > -1 && m > z-totalNumberOfIfEqs) { numberOfIfEqs++;	/*continue;*/ }
	if (skip_graphs2.indexOf(m) > -1) { numberOfIfEqs++;	/*continue;*/ }
				
		for(var i=0; i<n+1; i++){
//23.01-2
			//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
if( t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
				tempRes = eval(dataWithIf[2*numberOfIfEqs]);
			} else { 
				tempRes = eval(equation_by_user[m]);
			}
					
			data2.push(-2.6+5.5*i/700.0,-1.7+tempRes/(3.2), 0 );
			t+=creationStep;
		}
		//rec n
		//2
		var t = 0.0;
		for(var i=0; i<n+1; i++){
//23.01-2
			//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
				tempRes = eval(dataWithIf[2*numberOfIfEqs]);
			} else { 
				tempRes = eval(equation_by_user[m]);
			}
			data2.push(-2.6+5.5*i/700.0,-1.707+tempRes/(3.2),0);
			t+=creationStep;
		}
		//rec n
		//3
		var t = 0.0;
		for(var i=0; i<n+1; i++){
//23.01-2
			//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
				tempRes = eval(dataWithIf[2*numberOfIfEqs]);
			} else { 
				tempRes = eval(equation_by_user[m]);
			}
			data2.push(-2.6+5.5*i/700.0,-1.714+tempRes/(3.2), 0 );
			t+=creationStep;
		}
//23.01-2
		//if( m > z-totalNumberOfIfEqs) numberOfIfEqs++;
numberOfIfEqs++;
	}
}

//executed once when parameter is valued or slider clicked
function start()
{	
	//bug??? (to recreate problem: remove var t = 1.0; and type: console.log(t); logs undefined (but t is declared global))
	var t = 1.0;
	new_help_to_skip_graphs=0;
	data_max_optimization = [];
	
	data = data.slice(0, 27351);
	data3 = [];

	array_with_maximums = [];
			
	//refreshing ox values for mode 2
	for (var i = 0; i < 10; i+=1) {
		document.getElementById('time_time_' + i).innerHTML = parseInt( eval( (1*t1) * (i+1)/10) );
	}
			
	gl.clearColor(switchColorR,switchColorG,switchColorB,1);
	gl.clear(gl.COLOR_BUFFER_BIT);
		
	max = 0.00000000001;
	maxInEquation = 0.00000000001;
			
	if (document.getElementById("oyScaleMaxValue").value != "" && document.getElementById("oyScaleMaxValue").value > 0 ){
		maxInEquation = parseFloat(document.getElementById("oyScaleMaxValue").value);
	}
			
	//стъпката е разделена на броя парчета на графиката. Така ще се побира във видимата част и ще я запълва
	creationStep = t1/700.0;

	//finding max of max			
	numberOfIfEqs = 0;
	for (var m = 0; m <= z; m+=1){
	var t = 0.0;
		maxInEquation = 0;

		for (var i=0; i<n+1; i++){
//23.01-2
			//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1] ) ) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1] ) ) {
				var candidate = eval(dataWithIf[2*numberOfIfEqs]);
			} else { 
				var candidate = eval(equation_by_user[m]);
			}
			//ако има зададена стойност за нормализиране от потребител не обхожда за да търси максимума.
			if (document.getElementById("oyScaleMaxValue").value != "" && document.getElementById("oyScaleMaxValue").value > 0 ){
				maxInEquation = parseFloat(document.getElementById("oyScaleMaxValue").value);
			}else{
				findMaxValueInEquation(candidate);
			}
			if (max < -1.7+candidate/(maxInEquation/3.2) ) max = -1.7+candidate/(maxInEquation/3.2);
			//change n
			t+=creationStep;
		}
//23.01-2
		//if( m > z-totalNumberOfIfEqs) numberOfIfEqs++;
numberOfIfEqs++;
		array_with_maximums.push(maxInEquation);
	}
	
	//намиране на максимуми до 10 000 момент.
	//finding max of max			
	if( flagAfterFirstStart === 1) {
		array_with_maximums_13000 = [];
		numberOfIfEqs = 0;
		for (var m = 0; m <= z; m+=1){
		var t = 0.0;
			maxInEquation = 0;

			for (var i=0; i<noQuantityByUser; i++){
//23.01-2
				//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1] ) ) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1] ) ) {
					var candidate = eval(dataWithIf[2*numberOfIfEqs]);
				} else { 
					var candidate = eval(equation_by_user[m]);
				}
				//ако има зададена стойност за нормализиране от потребител не обхожда за да търси максимума.
				if (document.getElementById("oyScaleMaxValue").value != "" && document.getElementById("oyScaleMaxValue").value > 0 ){
					maxInEquation = parseFloat(document.getElementById("oyScaleMaxValue").value);
				}else{
					findMaxValueInEquation(candidate);
				}
				if (max < -1.7+candidate/(maxInEquation/3.2) ) max = -1.7+candidate/(maxInEquation/3.2);
				//change n
				//t+=1.3;
				t+=1.0;
			}
//23.01-2
			//if( m > z-totalNumberOfIfEqs) numberOfIfEqs++;
numberOfIfEqs++;
			array_with_maximums_13000.push(maxInEquation);
		}
	}

	//Добавя скипва-не спрямо skip_graphs2
	for (var i = 0; i < array_with_maximums.length; i++) {
		//ако е скрита графика не ѝ взимам предвид максимума, но ще го ползвам после при показване на графиките и I-max
		if (skip_graphs2.indexOf(i) > -1) {
			continue;
		}
		if (array_with_maximums[i] > maxInEquation) {
			maxInEquation = array_with_maximums[i];
		}
	}

	if (noQuantitySwitchName % 2 === 1) {
		for (var i = 0; i < 3; i+=1) {
			document.getElementById('time_time_y' + i).innerHTML = ((i+1)/3).toFixed(2);
		}
	} else {	
		//setting Oy values
		for (var i = 0; i < 3; i+=1) {
			document.getElementById('time_time_y' + i).innerHTML = eval( maxInEquation * (i+1)/3).toFixed(fixPres);
		}
	}

	//режим noquantity
	if (noQuantitySwitchName % 2 === 1) {

	rawDataNoQuantity = [];
	for(var i = 0; i < helpCounter; i++)
	{
		rawDataNoQuantity.push(helpColorRawData[2*i]);
	}
			
		if (flagUpWhenUploadedFile === 1) 
		{
		
			//масива currentFileColumnLength съдържа дължините на файлове. helpCounter е броят файлове.
			
			for (var ii = 0; ii < helpCounter; ii++) {
				if ( arrayWithFitDataNames.indexOf( rawDataSkipGraphic[ii] )  > -1 ) {
				
					maxInEquationLocal = array_with_maximums_13000[arrayWithFitDataNames.indexOf( rawDataNoQuantity[ii] )];

				} else {
					maxInEquationLocal = array_with_maximums_13000[arrayWithFitDataNames.indexOf( rawDataNoQuantity[ii] )];
					
					for(var i=0; i<currentFileColumnLength[ii]; i++){
						if( currentFileColumnLength[ii-1] == undefined){
							data.push(-2.6+5.5*bla2[2*i]/t1,-1.7+bla2[2*i+1]/(maxInEquationLocal/3.2), 0 );
							data3.push(bla2[2*i+1]);
						}else{
							data.push(-2.6+5.5*bla2[ 2*findMaxToNthElement(currentFileColumnLength, ii) +2*i]/t1,-1.7+bla2[ 2*findMaxToNthElement(currentFileColumnLength, ii) +2*i+1]/(maxInEquationLocal/3.2), 0 );
							data3.push(bla2[ 2*findMaxToNthElement(currentFileColumnLength, ii) +2*i+1] );
						}	
					}
					continue;
				}
				
				for(var i=0; i<currentFileColumnLength[ii]; i++){
				
					if( currentFileColumnLength[ii-1] == undefined){
						data.push(-2.6+5.5*bla2[2*i]/t1,-1.7+bla2[2*i+1]/(maxInEquationLocal/3.2), 0 );
						data3.push(bla2[2*i+1]);
					}else{
						data.push(-2.6+5.5*bla2[ 2*findMaxToNthElement(currentFileColumnLength, ii) +2*i]/t1,-1.7+bla2[ 2*findMaxToNthElement(currentFileColumnLength, ii) +2*i+1]/(maxInEquationLocal/3.2), 0 );
						data3.push(bla2[ 2*findMaxToNthElement(currentFileColumnLength, ii) +2*i+1] );
						
					}	
				}
			}
		}
	} else {
		if (flagUpWhenUploadedFile === 1) {
			//масива currentFileColumnLength съдържа дължините на файлове. helpCounter е броят файлове.
			for (var ii = 0; ii < helpCounter-1; ii++) {
				for(var i=0; i<currentFileColumnLength[ii]; i++){
					if( currentFileColumnLength[ii-1] == undefined){

						data.push(-2.6+5.5*bla2[2*i]/t1,-1.7+bla2[2*i+1]/(maxInEquation/3.2), 0 );
						data3.push(bla2[2*i+1]);
					}else{
						data.push(-2.6+5.5*bla2[ 2*findMaxToNthElement(currentFileColumnLength, ii) +2*i]/t1,-1.7+bla2[ 2*findMaxToNthElement(currentFileColumnLength, ii) +2*i+1]/(maxInEquation/3.2), 0 );
						data3.push(bla2[ 2*findMaxToNthElement(currentFileColumnLength, ii) +2*i+1] );
					}
				}
			}
		}
	}

	//everything is duplicated 3 times for simulating line width
	//1
	numberOfIfEqs = 0;
	for (var m = 0; m <= z; m+=1) {
		var t = 0.0;
		//ако сме на уравнение, което потребителя в момента не иска да е видимо:
		//23.01
		//if (skip_graphs2.indexOf(m) > -1 && m > z-totalNumberOfIfEqs) { numberOfIfEqs++;	/*continue;*/ }
if (skip_graphs2.indexOf(m) > -1) { numberOfIfEqs++;	/*continue;*/ }
		
		//тук трябва вместо continue, да генерирам тези с Y=1.2
		if (skip_graphs2.indexOf(m) > -1) {
			for (var i=0; i<n+1; i++){
				//3*3*701 е 3 координати, чертани по 3 графики, всяка от 701 точки.
				data.push(-2.6+5.5*i/700.0, -5, 0 );
			}
			for (var i=0; i<n+1; i++){
				//3*3*701 е 3 координати, чертани по 3 графики, всяка от 701 точки.
				data.push(-2.6+5.5*i/700.0, -5, 0 );
			}
			for (var i=0; i<n+1; i++){
				//3*3*701 е 3 координати, чертани по 3 графики, всяка от 701 точки.
				data.push(-2.6+5.5*i/700.0, -5, 0 );
			}
			for(var i=0; i<n+1; i++){
//23.01-2
				//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
					tempRes = eval(dataWithIf[2*numberOfIfEqs]);
				} else { 
					tempRes = eval(equation_by_user[m]);
				}
				data_max_optimization.push(tempRes);
				//change n
				t+=creationStep;
			}
			continue; 
		}

		if (noQuantitySwitchName % 2 === 1) {
			for(var i=0; i<700+1; i++){
//23.01-2
				//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
					tempRes = eval(dataWithIf[2*numberOfIfEqs]);
				} else { 
					tempRes = eval(equation_by_user[m]);
				}
				data.push(-2.6+5.5*i/n,-1.7+tempRes/(array_with_maximums_13000[m]/3.2), 0 );
				
				data_max_optimization.push(tempRes);
				//change n
				t+=creationStep;
			}
					
			//2
			var t = 0.0;
			for(var i=0; i<700+1; i++){
//23.01-2
				//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
					tempRes = eval(dataWithIf[2*numberOfIfEqs]);
				} else { 
					tempRes = eval(equation_by_user[m]);
				}
				data.push(-2.6+5.5*i/n,-1.707+tempRes/(array_with_maximums_13000[m]/3.2),0);
				//change n
				t+=creationStep;
			}
			//3
			var t = 0.0;
			for(var i=0; i<700+1; i++){
//23.01-2
				//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
					tempRes = eval(dataWithIf[2*numberOfIfEqs]);
				} else { 
					tempRes = eval(equation_by_user[m]);
				}
				data.push(-2.6+5.5*i/n,-1.714+tempRes/(array_with_maximums_13000[m]/3.2), 0 );
				//change n
				t+=creationStep;
			}
//23.01-2
			//if( m > z-totalNumberOfIfEqs) numberOfIfEqs++;
numberOfIfEqs++;
		} else {
			//2015-10-17-1
			for(var i=0; i<700+1; i++){
//23.01-2
				//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
					tempRes = eval(dataWithIf[2*numberOfIfEqs]);
				} else { 
					tempRes = eval(equation_by_user[m]);
				}	
				data.push(-2.6+5.5*i/n,-1.7+tempRes/(maxInEquation/3.2), 0 );
				
				data_max_optimization.push(tempRes);
				//change n
				t+=creationStep;
			}
					
			//2
			var t = 0.0;
			for(var i=0; i<700+1; i++){
				//if( m > z-totalNumberOfIfEqs && t >= dataWithIf[2*numberOfIfEqs+1]) {
				
//23.01-2
				//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
					tempRes = eval(dataWithIf[2*numberOfIfEqs]);
				} else { 
					tempRes = eval(equation_by_user[m]);
				}

				data.push(-2.6+5.5*i/n,-1.707+tempRes/(maxInEquation/3.2),0);
				//change n
				t+=creationStep;
			}
			//3
			var t = 0.0;
			for(var i=0; i<700+1; i++){
				//if( m > z-totalNumberOfIfEqs && t >= dataWithIf[2*numberOfIfEqs+1]) {
				
//23.01-2
				//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
					tempRes = eval(dataWithIf[2*numberOfIfEqs]);
				} else { 
					tempRes = eval(equation_by_user[m]);
				}

				data.push(-2.6+5.5*i/n,-1.714+tempRes/(maxInEquation/3.2), 0 );
				//change n

				t+=creationStep;
			}
//23.01-2
			//if( m > z-totalNumberOfIfEqs) numberOfIfEqs++;
numberOfIfEqs++;
		}
	}
				
	//iterating over text .txt file with hardcoded name.
	var t = 0.0;	
			
	//code for creating vertex buffer
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

	gl.enableVertexAttribArray(aXYZ);
	gl.vertexAttribPointer(aXYZ,3,gl.FLOAT,false,0,0);
			
	//coord sys 
	gl.vertexAttrib3f(aRGB,switchColorRs,switchColorGs,switchColorBs);
	gl.drawArrays(gl.LINES,0,4);
			
	//Draws dotted line top.
	if(noGridLines === 1) {
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		gl.drawArrays(gl.LINES,4,700+1);
		
		//Draws dotted line middle.
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		gl.drawArrays(gl.LINES,4+701,700+1);
		
		//Draws dotted line bottom.
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		gl.drawArrays(gl.LINES,4+701*2,700+1);
				
		//Draws 10 dotted lines X-axis (time).
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		for(var j=0; j<10; j++){
			gl.drawArrays(gl.LINES,4+3*701+701*(j),700+1);
		}
	}
			
	if(flagUpWhenUploadedFile === 1) {
	//Draws raw data
		for (var p = 1; p < helpCounter; p++) {
			//ако съм премахнал графика не се рисува (да го направя при връщане на графика да се рисува. т.е. някак да добавям индекса където трябва)
			if ( rawDataSkipGraphic.indexOf(helpColorRawData[2*p-2]) == -1 ){
				continue;
			}
			//взима цветовете от raw data файла.
			var color_of_raw_data = helpColorRawData[2*p-1];
			var newRcolor = convertHexToRGB(color_of_raw_data.substring(0,2));
			var newGcolor = convertHexToRGB(color_of_raw_data.substring(2,4));
			var newBcolor = convertHexToRGB(color_of_raw_data.substring(4,6));
			gl.vertexAttrib3f(aRGB,newRcolor,newGcolor,newBcolor);
			gl.drawArrays(gl.LINE_STRIP,4+3*701+10*701+( findMaxToNthElement(currentFileColumnLength, p-1) ) , currentFileColumnLength[p-1]);
		}
	}
	//Draws formulees and sets colors
	for (var m = 0; m <= z; m+=1) {
		gl.vertexAttrib3f(aRGB,color_eqs[m][0],color_eqs[m][1],color_eqs[m][2]);
		gl.drawArrays(gl.LINE_STRIP,(3*m+0)*(700+1)+4+3*701+10*701+flagUpWhenUploadedFile*( findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) ),700+1);
		gl.drawArrays(gl.LINE_STRIP,(3*m+1)*(700+1)+4+3*701+10*701+flagUpWhenUploadedFile*( findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) ),700+1);
		gl.drawArrays(gl.LINE_STRIP,(3*m+2)*(700+1)+4+3*701+10*701+flagUpWhenUploadedFile*( findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) ),700+1);		
	}	
}

function findMaxToNthElement(arr, n)
{
	var ans = 0;
	for (var i=0; i < n; i++)
	{
		ans += arr[i];
	}
	return ans;
}
		
//function that calls start_recreation 
function recreation(){
	//help variable so raw data is visualized
	speed_gen = parseInt( document.getElementById("real-time-speed").value );
	helpCount = 0;

	//recreation - all, mode 2 from start to t1
	t1 = parseFloat(document.getElementById("tValue").value);
	creationStep = t1/700.0;
	n1 = 700;
	numberOfIfEqs = 0;
	
	//bug??? (to recreate problem: remove var t = 1.0; and type: console.log(t); logs undefined (but t is declared global))
	var t = 1.0;
	new_help_to_skip_graphs=0;
	
	//code for creating vertex buffer
	buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,buf);

	//rec n	
	n1 = n;
	//rec n
	n = 0;

	var myVar = setInterval(function(){ incremN() }, 20);
	function incremN()
	{
	//recreat n
		if (n < n1){
			n+=speed_gen;
			
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
			gl.vertexAttribPointer(aXYZ,3,gl.FLOAT,false,0,0);

			//recreat n;
			start_recreation();
		}else{
				clearInterval(myVar);
				flagPreventFromDoubleClicking = 0;
		}
	}
}

//executed many times when real-time button is clicked
function start_recreation()
{				
	gl.clearColor(switchColorR,switchColorG,switchColorB,1);
	gl.clear(gl.COLOR_BUFFER_BIT);

	//coord sys
	gl.vertexAttrib3f(aRGB,switchColorRs,switchColorGs,switchColorBs);
	gl.drawArrays(gl.LINES,0,4);
		
	//Draws dotted line top.
	if(noGridLines === 1) {
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		gl.drawArrays(gl.LINES,4,700+1);
			
		//Draws dotted line middle.
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		gl.drawArrays(gl.LINES,4+701,700+1);
				
		//Draws dotted line bottom.
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		gl.drawArrays(gl.LINES,4+701*2,700+1);
				
		//Draws 10 dotted lines X-axis (time).
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		for(var j=0; j<10; j++){
			gl.drawArrays(gl.LINES,4+3*701+701*(j),700+1);
		}
	}
	
	if(flagUpWhenUploadedFile === 1) { 
	//Draws raw data	
		for (var p = 1; p < helpCounter; p++) {
			//ако съм премахнал графика не се рисува (да го направя при връщане на графика да се рисува. т.е. някак да добавям индекса където трябва)
			if ( rawDataSkipGraphic.indexOf(helpColorRawData[2*p-2]) == -1 ){
				continue;
			}
			//взима цветовете от raw data файла.
			var color_of_raw_data = helpColorRawData[2*p-1];
			var newRcolor = convertHexToRGB(color_of_raw_data.substring(0,2));
			var newGcolor = convertHexToRGB(color_of_raw_data.substring(2,4));
			var newBcolor = convertHexToRGB(color_of_raw_data.substring(4,6));
			gl.vertexAttrib3f(aRGB,newRcolor,newGcolor,newBcolor);
			gl.drawArrays(gl.LINE_STRIP,4+3*701+10*701+( findMaxToNthElement(currentFileColumnLength, p-1) ) , currentFileColumnLength[p-1]);
		}
	}
	//Draws formulees and sets colors; m текущо уравнение, z брой уравнения.
	for (var m = 0; m <= z-number_of_graphs_to_hide; m+=1) {
		gl.vertexAttrib3f(aRGB,color_eqs[m][0],color_eqs[m][1],color_eqs[m][2]);
		gl.drawArrays(gl.LINE_STRIP,(3*m+0)*(700+1)+4+3*701+10*701+flagUpWhenUploadedFile*( findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) ),n+1);
		gl.drawArrays(gl.LINE_STRIP,(3*m+1)*(700+1)+4+3*701+10*701+flagUpWhenUploadedFile*( findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) ),n+1);
		gl.drawArrays(gl.LINE_STRIP,(3*m+2)*(700+1)+4+3*701+10*701+flagUpWhenUploadedFile*( findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) ),n+1);		
	
	}
}

//T-scaling behavior from 0 to From.
function recreation_2(){
	speed_gen = parseInt( document.getElementById("real-time-speed").value );
	
	//rec n	
	n1 = 700.0;
	t1 = parseFloat(document.getElementById("rangeFromValue").value);
	creationStep=parseFloat(t1/n1);

	//if file is uploaded - new number of graphics are generated
	if(flagUpWhenUploadedFileWithConfiguration === 1) {
		z = first_line_of_file-1;
	}
	
	maxInEquation = 0.00000000001;
	max = 0.00000000001;
	array_with_maximums = []
	//finding max of max			
	numberOfIfEqs = 0;
	for (var m = 0; m <= z; m+=1){
	var t = 0.0;
		
		maxInEquation = 0;
		
		for (var i=0; i<n+1; i++){
//23.01-2
			//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
				var candidate = eval(dataWithIf[2*numberOfIfEqs]);
			} else { 
				var candidate = eval(equation_by_user[m]);
			}
			//ако има зададена стойност за нормализиране от потребител не обхожда за да търси максимума.
			if (document.getElementById("oyScaleMaxValue").value != "" && document.getElementById("oyScaleMaxValue").value > 0 ){
				maxInEquation = parseFloat(document.getElementById("oyScaleMaxValue").value);
			}else{
				findMaxValueInEquation(candidate);
			}
			if (max < -1.7+candidate/(maxInEquation/3.2) ) max = -1.7+candidate/(maxInEquation/3.2);
			//change n
			t+=creationStep;
		}
//23.01-2
		//if( m > z-totalNumberOfIfEqs) numberOfIfEqs++;
numberOfIfEqs++;
		array_with_maximums.push(maxInEquation);
	}

	maxInEquation = 0.00000000001;
	//Добавя скипва-не спрямо skip_graphs2
	for (var i = 0; i < array_with_maximums.length; i++) {
		//ако е скрита графика не ѝ взимам предвид максимума, но ще го ползвам после при показване на графиките и I-max
		if (skip_graphs2.indexOf(i) > -1) {
			continue;
		}
		if (array_with_maximums[i] > maxInEquation) {
			maxInEquation = array_with_maximums[i];
		}
	}

	if (noQuantitySwitchName % 2 === 1) {
		for (var i = 0; i < 3; i+=1) {
			document.getElementById('time_time_y' + i).innerHTML = ((i+1)/3).toFixed(2);
		}
	} else {	
		//setting Oy values
		for (var i = 0; i < 3; i+=1) {
			document.getElementById('time_time_y' + i).innerHTML = eval( maxInEquation * (i+1)/3).toFixed(fixPres);
		}
	}	
	
	
	//refresh ox values on startup mode 2
	for (var i = 0; i < 10; i+=1) {
		document.getElementById('time_time_' + i).innerHTML = parseInt( eval( (1*t1) * (i+1)/10) );
	}	

	t_to = parseFloat(document.getElementById("tValue").value);
	
	//creationStep = t1/n1;

	//bug??? (to recreate problem: remove var t = 1.0; and type: console.log(t); logs undefined (but t is declared global))
	var t = 1.0;
	new_help_to_skip_graphs=0;
	
		data = data.slice(0, 27351);

	rawDataNoQuantity = [];
	for(var i = 0; i < helpCounter; i++)
	{
		rawDataNoQuantity.push(helpColorRawData[2*i]);
	}
	if (noQuantitySwitchName % 2 === 1) {
		if (flagUpWhenUploadedFile === 1) 
		{
		//2015-10-17-6
			//масива currentFileColumnLength съдържа дължините на файлове. helpCounter е броят файлове.
			for (var ii = 0; ii < helpCounter-1; ii++) {
				if ( arrayWithFitDataNames.indexOf( rawDataSkipGraphic[ii] )  > -1 ) {
					maxInEquationLocal = array_with_maximums_13000[arrayWithFitDataNames.indexOf( rawDataNoQuantity[ii] )];
				} else {
					maxInEquationLocal = array_with_maximums_13000[arrayWithFitDataNames.indexOf( rawDataNoQuantity[ii] )];
					for(var i=0; i<currentFileColumnLength[ii]; i++){
						if( currentFileColumnLength[ii-1] == undefined){
							data.push(-2.6+5.5*bla2[2*i]/t1,-1.7+bla2[2*i+1]/(maxInEquationLocal/3.2), 0 );
						}else{
							data.push(-2.6+5.5*bla2[ 2*findMaxToNthElement(currentFileColumnLength, ii) +2*i]/t1,-1.7+bla2[ 2*findMaxToNthElement(currentFileColumnLength, ii) +2*i+1]/(maxInEquationLocal/3.2), 0 );
						}	
					}
					continue;
				}
				
				for(var i=0; i<currentFileColumnLength[ii]; i++){
					if( currentFileColumnLength[ii-1] == undefined){
						data.push(-2.6+5.5*bla2[2*i]/t1,-1.7+bla2[2*i+1]/(maxInEquationLocal/3.2), 0 );
					}else{
						data.push(-2.6+5.5*bla2[ 2*findMaxToNthElement(currentFileColumnLength, ii) +2*i]/t1,-1.7+bla2[ 2*findMaxToNthElement(currentFileColumnLength, ii) +2*i+1]/(maxInEquationLocal/3.2), 0 );
					}	
				}
			}
		}
	} else {
		if (flagUpWhenUploadedFile === 1) 
		{
			//масива currentFileColumnLength съдържа дължините на файлове. helpCounter е броят файлове.
			for (var ii = 0; ii < helpCounter-1; ii++) {
				for(var i=0; i<currentFileColumnLength[ii]; i++){
					if( currentFileColumnLength[ii-1] == undefined){
						data.push(-2.6+5.5*bla2[2*i]/t1,-1.7+bla2[2*i+1]/(maxInEquation/3.2), 0 );
					}else{
						data.push(-2.6+5.5*bla2[ 2*findMaxToNthElement(currentFileColumnLength, ii) +2*i]/t1,-1.7+bla2[ 2*findMaxToNthElement(currentFileColumnLength, ii) +2*i+1]/(maxInEquation/3.2), 0 );
					}	
				}
			}
		}
	}

	n1 = 700;
	numberOfIfEqs = 0;
	for (var m = 0; m <= z; m+=1) {
		var t = 0.0;
//23.01
		//if (skip_graphs2.indexOf(m) > -1 && m > z-totalNumberOfIfEqs) { numberOfIfEqs++;	/*continue;*/ }
if (skip_graphs2.indexOf(m) > -1) { numberOfIfEqs++;	/*continue;*/ }
		
		//if (skip_graphs2.indexOf(m) > -1) { continue; }
		
		//тук трябва вместо continue, да генерирам тези с Y=1.2
		if (skip_graphs2.indexOf(m) > -1) {
			for (var i=0; i<n+1; i++){

				data.push(-2.6+5.5*i/700.0, -5, 0 );
			}
			for (var i=0; i<n+1; i++){

				data.push(-2.6+5.5*i/700.0, -5, 0 );
			}
			for (var i=0; i<n+1; i++){

				data.push(-2.6+5.5*i/700.0, -5, 0 );
			}
			continue; 
		 }

		if (noQuantitySwitchName % 2 === 1) {
			for(var i=0; i<700+1; i++){
				//if( m > z-totalNumberOfIfEqs && t >= dataWithIf[2*numberOfIfEqs+1]) {
				
//23.01-2
				//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
					tempRes = eval(dataWithIf[2*numberOfIfEqs]);
				} else { 
					tempRes = eval(equation_by_user[m]);
				}
				data.push(-2.6+5.5*i/n,-1.7+tempRes/(array_with_maximums_13000[m]/3.2), 0 );
				data_max_optimization.push(tempRes);
				//change n
				t+=creationStep;
			}
					
			//2
			var t = 0.0;
			for(var i=0; i<700+1; i++){
				//if( m > z-totalNumberOfIfEqs && t >= dataWithIf[2*numberOfIfEqs+1]) {
				
//23.01-2
				//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
					tempRes = eval(dataWithIf[2*numberOfIfEqs]);
				} else { 
					tempRes = eval(equation_by_user[m]);
				}
				data.push(-2.6+5.5*i/n,-1.707+tempRes/(array_with_maximums_13000[m]/3.2),0);
				//change n
				t+=creationStep;
			}
			//3
			var t = 0.0;
			for(var i=0; i<700+1; i++){
//23.01-2
				//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
if( t >= eval(dataWithIf[2*numberOfIfEqs+1]) ) {
					tempRes = eval(dataWithIf[2*numberOfIfEqs]);
				} else { 
					tempRes = eval(equation_by_user[m]);
				}
				//data.push(-2.6+5.5*i/n,-1.714+tempRes/(array_with_maximums[m]/3.2), 0 );
				data.push(-2.6+5.5*i/n,-1.714+tempRes/(array_with_maximums_13000[m]/3.2), 0 );
				//change n

				t+=creationStep;
			}
//23.01-2
			//if( m > z-totalNumberOfIfEqs) numberOfIfEqs++;
numberOfIfEqs++;
		} else {
			
			for(var i=0; i<n+1; i++){
//23.01-2
				//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
					tempRes = eval(dataWithIf[2*numberOfIfEqs]);
					
				} else { 
					tempRes = eval(equation_by_user[m]);
				}
				data.push(-2.6+5.5*i/700.0,-1.7+tempRes/(maxInEquation/3.2), 0 );
				t+=creationStep;
			}
			//rec n
			//2
			var t = 0.0;
			for(var i=0; i<n+1; i++){
//23.01-2
				//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
					tempRes = eval(dataWithIf[2*numberOfIfEqs]);
				} else { 
					tempRes = eval(equation_by_user[m]);
				}
				data.push(-2.6+5.5*i/700.0,-1.707+tempRes/(maxInEquation/3.2),0);
				t+=creationStep;
			}
			//rec n
			//3
			var t = 0.0;
			for(var i=0; i<n+1; i++){
//23.01-2
				//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
					tempRes = eval(dataWithIf[2*numberOfIfEqs]);
				} else { 
					tempRes = eval(equation_by_user[m]);
				}
				data.push(-2.6+5.5*i/700.0,-1.714+tempRes/(maxInEquation/3.2), 0 );
				t+=creationStep;
			}
//23.01-2
			//if( m > z-totalNumberOfIfEqs) numberOfIfEqs++;	
numberOfIfEqs++;	
		}
	}	
	
	//code for creating vertex buffer
	buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,buf);
	
	//raw data
	//recreat n
	n = 0;
	var myVar = setInterval(function(){ incremN() }, 20);
	function incremN()
	{
	//recreat n
		if (n < n1 ){
			n+=speed_gen;
			
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
			gl.vertexAttribPointer(aXYZ,3,gl.FLOAT,false,0,0);	
			
			//recreat n
			start_recreation_mode_2();
		}else{
			clearInterval(myVar);
			t_scaling_flag = 1;
			recreation_after_from();		
		}
	}
}

//това е функцията, която описва какво се случва след достигане на стойността from.
function recreation_after_from(){

	tScaleSpeed = parseFloat(document.getElementById("tScaleSpeedValue").value)*5.0;
	incremSpeed = parseFloat( (t_to - t1)/tScaleSpeed );
	start_optimization_t_scaling();
	
}

// ???
function start_recreation_mode_2(){

	//bug??? (to recreate problem: remove var t = 1.0; and type: console.log(t); logs undefined (but t is declared global))
	var t = 1.0;
	gl.clearColor(switchColorR,switchColorG,switchColorB,1);
	gl.clear(gl.COLOR_BUFFER_BIT);

	//coord sys
	gl.vertexAttrib3f(aRGB,switchColorRs,switchColorGs,switchColorBs);
	gl.drawArrays(gl.LINES,0,4);
			
	//Draws dotted line top.
	if(noGridLines === 1) {
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		gl.drawArrays(gl.LINES,4,700+1);
		
		//Draws dotted line middle.
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		gl.drawArrays(gl.LINES,4+701,700+1);
				
		//Draws dotted line bottom.
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		gl.drawArrays(gl.LINES,4+701*2,700+1);
				
		//Draws 10 dotted lines X-axis (time).
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		for(var j=0; j<10; j++){
			gl.drawArrays(gl.LINES,4+3*701+701*(j),700+1);
		}
	}
	
	if(flagUpWhenUploadedFile === 1) { 
	//Draws raw data
		for (var p = 1; p < helpCounter; p++) {
			//ако съм премахнал графика не се рисува (да го направя при връщане на графика да се рисува. т.е. някак да добавям индекса където трябва)
			if ( rawDataSkipGraphic.indexOf(helpColorRawData[2*p-2]) == -1 ){
				//alert("dsadaa");
				continue;
			}
			//взима цветовете от raw data файла.
			var color_of_raw_data = helpColorRawData[2*p-1];
			var newRcolor = convertHexToRGB(color_of_raw_data.substring(0,2));
			var newGcolor = convertHexToRGB(color_of_raw_data.substring(2,4));
			var newBcolor = convertHexToRGB(color_of_raw_data.substring(4,6));
			gl.vertexAttrib3f(aRGB,newRcolor,newGcolor,newBcolor);
			gl.drawArrays(gl.LINE_STRIP,4+3*701+10*701+( findMaxToNthElement(currentFileColumnLength, p-1) ) , currentFileColumnLength[p-1]);
		}
	}

	//Draws formulees and sets colors
	for (var m = 0; m <= z-number_of_graphs_to_hide; m+=1) {
		gl.vertexAttrib3f(aRGB,color_eqs[m][0],color_eqs[m][1],color_eqs[m][2]);

		gl.drawArrays(gl.LINE_STRIP,(3*m+0)*(700+1)+4+3*701+10*701+flagUpWhenUploadedFile*( findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) ),n+1);
		gl.drawArrays(gl.LINE_STRIP,(3*m+1)*(700+1)+4+3*701+10*701+flagUpWhenUploadedFile*( findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) ),n+1);
		gl.drawArrays(gl.LINE_STRIP,(3*m+2)*(700+1)+4+3*701+10*701+flagUpWhenUploadedFile*( findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) ),n+1);		
	
	}
}

//25.12.2015
function changeGridColor() {
	if( document.getElementById("changeGridColor").value == "Grid off" ) {
		noGridLines = 0;
		document.getElementById("changeGridColor").value = "Grid on"
		start_new_generation();
	}else {
		noGridLines = 1;
		document.getElementById("changeGridColor").value = "Grid off"
		start_new_generation();
	
	}
}

function changeMode() {

	if( this.value == "Print mode") {
		//сменя цветовете по абсцисата
		for (var i = 0; i < 10; i+=1) {
			document.getElementById('time_time_' + i).style.color = "black";
		}
		//сменя цветовете по ординатата
		for (var i = 0; i < 3; i+=1) {
			document.getElementById("time_time_y" + i).style.color = "black";
		}
		//сменя цветовете на I и T[s]
		document.getElementById("i_intensity").style.color = "black";
		document.getElementById("s_time").style.color = "black";
		
		//смяна на цвета на стойността от слайдърите в канвас елемента
		document.getElementById("param_value").style.color = "black";

		//сменя цвета на фона на рисувателното поле.
		switchColorR = 1;
		switchColorG = 1;
		switchColorB = 1;
		
		//сменя цвета на КС
		switchColorRs = 0;
		switchColorGs = 0;
		switchColorBs = 0;
		
		//start();
		//25.12.2015
		//noGridLines = 0;
		start_new_generation();
		
		this.value = "Normal mode"
	}else{
		//връща цветовете обратно.
		//сменя цветовете по абсцисата
		for (var i = 0; i < 10; i+=1) {
			document.getElementById('time_time_' + i).style.color = "white";
		}
		//сменя цветовете по ординатата
		for (var i = 0; i < 3; i+=1) {
			document.getElementById("time_time_y" + i).style.color = "white";
		}
		//сменя цветовете на I и T[s]
		document.getElementById("i_intensity").style.color = "white";
		document.getElementById("s_time").style.color = "white";
		
		//смяна на цвета на стойността от слайдърите в канвас елемента
		document.getElementById("param_value").style.color = "white";
		
		//сменя цвета на фона на рисувателното поле.
		switchColorR = 0;
		switchColorG = 0;
		switchColorB = 0;
		
		//сменя цвета на КС
		switchColorRs = 1;
		switchColorGs = 1;
		switchColorBs = 1;
		
		//start();
		//noGridLines = 1;
		start_new_generation();
		
		this.value = "Print mode"
	}
}

function start_generating_arrays(){
	//bug??? (to recreate problem: remove var t = 1.0; and type: console.log(t); logs undefined (but t is declared global))
	var t = 1.0;
	new_help_to_skip_graphs=0;
			
	gl.clearColor(switchColorR,switchColorG,switchColorB,1);
	gl.clear(gl.COLOR_BUFFER_BIT);
			
	max = 0.00000000001;
	maxInEquation = 0.00000000001;
			
	//стъпката е разделена на броя парчета на графиката. Така ще се побира във видимата част и ще я запълва
	creationStep = t1/700.0;

	//finding max of max			
	numberOfIfEqs = 0;
	for (var m = 0; m <= z; m+=1){
		var t = 0.0;
		//ако сме на уравнение, което потребителя в момента не иска да е видимо:
//23.01-2
		//if (skip_graphs.indexOf(m) > -1 && m > z-totalNumberOfIfEqs) { numberOfIfEqs++;	continue; }
if (skip_graphs.indexOf(m) > -1) { numberOfIfEqs++;	continue; }
		if (skip_graphs.indexOf(m) > -1) { continue; }
					
		for (var i=0; i<n+1; i++){
//23.01-2
			//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
				var candidate = eval(dataWithIf[2*numberOfIfEqs]);
			} else { 
				var candidate = eval(equation_by_user[m]);
			}
			//ако има зададена стойност за нормализиране от потребител не обхожда за да търси максимума.
			if (document.getElementById("oyScaleMaxValue").value != "" && document.getElementById("oyScaleMaxValue").value > 0 ){
				maxInEquation = parseFloat(document.getElementById("oyScaleMaxValue").value);
			}else{
				findMaxValueInEquation(candidate);
			}
			if (max < -1.7+candidate/(maxInEquation/3.2) ) max = -1.7+candidate/(maxInEquation/3.2);
			//change n
			t+=creationStep;
		}
//23.01-2
		//if( m > z-totalNumberOfIfEqs) numberOfIfEqs++;
numberOfIfEqs++;
	}

	if (flagUpWhenUploadedFile === 1) 
	{
		//масива currentFileColumnLength съдържа дължините на файлове. helpCounter е броят файлове.
		for (var ii = 0; ii < helpCounter-1; ii++) {
			for(var i=0; i<currentFileColumnLength[ii]; i++){
				if( currentFileColumnLength[ii-1] == undefined){
					data.push(-2.6+5.5*bla2[2*i]/t1,-1.7+bla2[2*i+1]/(maxInEquation/3.2), 0 );
				}else{
					data.push(-2.6+5.5*bla2[ 2*findMaxToNthElement(currentFileColumnLength, ii) +2*i]/t1,-1.7+bla2[ 2*findMaxToNthElement(currentFileColumnLength, ii) +2*i+1]/(maxInEquation/3.2), 0 );
				}
			}
		}
	}

	//everything is duplicated 3 times for simulating line width
	//1
	numberOfIfEqs = 0;
	for (var m = 0; m <= z; m+=1) {
		var t = 0.0;
		//ако сме на уравнение, което потребителя в момента не иска да е видимо:
//23.01-2
		//if (skip_graphs.indexOf(m) > -1 && m > z-totalNumberOfIfEqs) { numberOfIfEqs++;	continue; }
if (skip_graphs.indexOf(m) > -1) { numberOfIfEqs++;	continue; }
		if (skip_graphs.indexOf(m) > -1) { continue; }

		for(var i=0; i<700+1; i++){
//23.01-2
			//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
if( t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
				tempRes = eval(dataWithIf[2*numberOfIfEqs]);
			} else { 
				tempRes = eval(equation_by_user[m]);
			}

			data.push(-2.6+5.5*i/n,-1.7+tempRes/(maxInEquation/3.2), 0 );
			//change n
			t+=creationStep;
		}
				
		//2
		var t = 0.0;
		for(var i=0; i<700+1; i++){
//23.01-2
			//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
				tempRes = eval(dataWithIf[2*numberOfIfEqs]);
			} else { 
				tempRes = eval(equation_by_user[m]);
			}

			data.push(-2.6+5.5*i/n,-1.707+tempRes/(maxInEquation/3.2),0);
			//change n
			t+=creationStep;
		}
		//3
		var t = 0.0;
		for(var i=0; i<700+1; i++){
//23.01-2
			//if( m > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
				tempRes = eval(dataWithIf[2*numberOfIfEqs]);
			} else { 
				tempRes = eval(equation_by_user[m]);
			}

			data.push(-2.6+5.5*i/n,-1.714+tempRes/(maxInEquation/3.2), 0 );
			//change n

			t+=creationStep;
		}
//23.01-2
		//if( m > z-totalNumberOfIfEqs) numberOfIfEqs++;
numberOfIfEqs++;
	}
}

//за Animation: функция която се генерира coord sys + stipple + raw data + fit data (но не нормализирани)
function before_animation_function_test() {

	var t = 1.0;
	new_help_to_skip_graphs=0;
			
	gl.clearColor(switchColorR,switchColorG,switchColorB,1);
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	//задаване на стойности на параметрите, така бутона "Animation" може да бъде натискан произволен брой пъти
	for( var l = 1; l <= number_of_sliders; l++) {
		tempCoef = document.getElementById("dropMenu" + l).value;
		var tempMin = parseFloat(document.getElementById("MinButton" + l).value);
		createVariable( tempCoef, tempMin );
	}
	//start_optimization_t_scaling();
	animation_function_test_proba_byrza();
	
	if( flagParallelAnimation === 1) {
		animation_function_test_2();
	}else{
//24.01
//alert("dsada");
		animation_function_test();
	}
}

function iMaxOptimization()
{
//24.01
//alert(findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length))
	var maxInEquationHelper = maxInEquation;
	maxInEquation = 0;
	if (flagImaxSet == 1 ) {
		maxInEquation = parseFloat(document.getElementById("oyScaleMaxValue").value);
		if (flagUpWhenUploadedFile === 1) {
			//масива currentFileColumnLength съдържа дължините на файлове. helpCounter е броят файлове.
//24.01-2
			//for ( var i = 0; i < findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length); i++) {
for ( var i = 0; i <= findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length); i++) {
//24.01-2
//alert('sdasda')
				data[27351 + 1 + 3*i] = -1.7+data3[i+1]/(maxInEquation/3.2);
			}
		}

		for (var j = 0; j <= z; j+=1){
			//2015-09-30-2
			if (skip_graphs2.indexOf(j) > -1) { continue; }
//24.01-2
//alert(skip_graphs2.indexOf(j))
//alert(data_max_optimization[1*701+680])
			for(var i=0; i<700+1; i++){			
//24.01-2
//alert(data_max_optimization[j*701+i]/(maxInEquation/3.2))
				data[27351 + 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) + ((j*3+0)*3)*701+3*i+1] = -1.7+data_max_optimization[j*701+i]/(maxInEquation/3.2);
				data[27351 + 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) + ((j*3+1)*3)*701+3*i+1] = -1.707+data_max_optimization[j*701+i]/(maxInEquation/3.2);
				data[27351 + 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) + ((j*3+2)*3)*701+3*i+1] = -1.714+data_max_optimization[j*701+i]/(maxInEquation/3.2);
			}
		}
		return;
	}

	var t = 0;
	//намира максимум само на уравнението с което в момента работим.
	for (var i=0; i<700+1; i++){
//23.01-2
		//if( help_array_max[0] > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
if( t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
			var candidate = eval(dataWithIf[2*numberOfIfEqs]);
//24.01-1
//alert(candidate);
		} else { 
			var candidate = eval(equation_by_user[help_array_max[0]]);
		}
		if (maxInEquation < candidate ){
			maxInEquation = candidate;
		}
		t+=creationStep;
	}
	//обновявам стойностите на масива с максимуми.	
	array_with_maximums[help_array_max[0]] = maxInEquation;
	//намира максимума на всички показани графики (скритите ги скипва)
	var mmmax = 0;
	var a = array_with_maximums.length;
	firstloop:
	for (var counter=0;counter<a;counter++)
	{
		secondloop:
		for ( var counter2 = 0; counter2 < skip_graphs2.length; counter2++ )
		{
			if (skip_graphs2[counter2] == counter) 
			{ 
				continue firstloop; 
			}
		}
		if (array_with_maximums[counter] > mmmax)
		{
			mmmax = array_with_maximums[counter];
		}
	}

	//Проверявам да не би новия максимум да е по-малък от предишния.
	if ( maxInEquation < mmmax ) {
		maxInEquation = mmmax;
	} 
	//ако сме намерили нов максимум променям всички Y стойности в оригиналния масив.
	if ( maxInEquation != maxInEquationHelper) {
		if (flagUpWhenUploadedFile === 1) {
			//масива currentFileColumnLength съдържа дължините на файлове. helpCounter е броят файлове.
//24.01-6 
			//for ( var i = 0; i < findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length); i++) {
for ( var i = 0; i < findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length); i++) {
				data[27351 + 1 + 3*i] = -1.7+data3[i]/(maxInEquation/3.2);
				
			}
		}

		for (var j = 0; j <= z; j+=1){
			if (skip_graphs2.indexOf(j) > -1) { continue; }
			for(var i=0; i<700+1; i++){
				data[27351 + 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) + ((j*3+0)*3)*701+3*i+1] = -1.7+data_max_optimization[j*701+i]/(maxInEquation/3.2);
				data[27351 + 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) + ((j*3+1)*3)*701+3*i+1] = -1.707+data_max_optimization[j*701+i]/(maxInEquation/3.2);
				data[27351 + 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) + ((j*3+2)*3)*701+3*i+1] = -1.714+data_max_optimization[j*701+i]/(maxInEquation/3.2);
			}
		}
	}
}

//при натискане на бутона no quantity, нормализира графиките всяка спрямо нейният максимум (така са реални графики на белтъците, но без факторът количество на броя молекули)
function iMaxOptimizationNoQuantity()
{
	
	//да се промени да е спрямо No quantity scale
	if (noQuantitySwitchName % 2 === 0 ) {
		if (flagImaxSet == 1 ) {
			maxInEquation = parseFloat(document.getElementById("oyScaleMaxValue").value);
			//за момента без raw data-та.
			if (flagUpWhenUploadedFile === 1) {
				//масива currentFileColumnLength съдържа дължините на файлове. helpCounter е броят файлове.
//24.01-6
				//for ( var i = 0; i < findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length); i++) {
for ( var i = 0; i < findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length); i++) {
					data[27351 + 1 + 3*i] = -1.7+data3[i+1]/(maxInEquation/3.2);
				}
			}
			
			for (var j = 0; j <= z; j+=1){
				if (skip_graphs2.indexOf(j) > -1) { continue; }
				for(var i=0; i<700+1; i++){			
					data[27351 + 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) + ((j*3+0)*3)*701+3*i+1] = -1.7+data_max_optimization[j*701+i]/(maxInEquation/3.2);
					data[27351 + 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) + ((j*3+1)*3)*701+3*i+1] = -1.707+data_max_optimization[j*701+i]/(maxInEquation/3.2);
					data[27351 + 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) + ((j*3+2)*3)*701+3*i+1] = -1.714+data_max_optimization[j*701+i]/(maxInEquation/3.2);
				}
			}
			return;
		}
		
		//в тази функция на  този етап няма нужда от правене на нищо с масива от максимуми - само ще оправям стойностите.
		
		var t = 0;
		//намира максимум само на уравнението с което в момента работим.
			for (var i=0; i<700+1; i++){
//23.01-2
				//if( help_array_max[0] > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
					var candidate = eval(dataWithIf[2*numberOfIfEqs]);
				} else { 
					var candidate = eval(equation_by_user[help_array_max[0]]);
				}
				if (maxInEquation < candidate ){
					maxInEquation = candidate;
				}
				t+=creationStep;
			}
		//обновявам стойностите на масива с максимуми.	
		array_with_maximums[help_array_max[0]] = maxInEquation;
		
		//намира максимума на всички показани графики (скритите ги скипва)
		var mmmax = 0;
		var a = array_with_maximums.length;
		firstloop:
		for (var counter=0;counter<a;counter++)
		{
			secondloop:
			for ( var counter2 = 0; counter2 < skip_graphs2.length; counter2++ )
			{
				if (skip_graphs2[counter2] == counter) 
				{ 
					continue firstloop; 
				}
			}
			if (array_with_maximums[counter] > mmmax)
			{
				mmmax = array_with_maximums[counter];
			}
		}

		//Проверявам да не би новия максимум да е по-малък от предишния.
		if ( maxInEquation < mmmax ) {
			maxInEquation = mmmax;
		} 

		//ако сме намерили нов максимум променям всички Y стойности в оригиналния масив.
		if ( maxInEquation != maxInEquationHelper) {
			if (flagUpWhenUploadedFile === 1) {
				//масива currentFileColumnLength съдържа дължините на файлове. helpCounter е броят файлове.
//24.01-6
				//for ( var i = 0; i < findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length); i++) {
for ( var i = 0; i < findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length); i++) {
					data[27351 + 1 + 3*i] = -1.7+data3[i]/(maxInEquation/3.2);
				}
			}
		}
	} else {
		rawDataNoQuantity = [];
		for(var i = 0; i < helpCounter; i++)
		{
			rawDataNoQuantity.push(helpColorRawData[2*i]);
		}
		
		if (flagUpWhenUploadedFile === 1) {
		
			for (var p = 1; p < helpCounter; p++) {
				if ( arrayWithFitDataNames.indexOf( rawDataSkipGraphic[p-1] )  > -1 ) {
					maxInEquationLocal = array_with_maximums_13000[arrayWithFitDataNames.indexOf( rawDataNoQuantity[p-1] )];
				} else {
					maxInEquationLocal = array_with_maximums_13000[arrayWithFitDataNames.indexOf( rawDataNoQuantity[p-1] )];
					//continue;
				}

				if(p === 1) {

					for ( var i = 0; i < findMaxToNthElement(currentFileColumnLength, p); i++ ){
						data[27351 + 1 + 3*i] = -1.7+data3[i]/(maxInEquationLocal/3.2);
					}
					continue;
				}

				for ( var i = 0; i < findMaxToNthElement(currentFileColumnLength, p) - findMaxToNthElement(currentFileColumnLength, p-1) ; i++ ){
					data[27351 + 1 + 3*findMaxToNthElement(currentFileColumnLength, p-1) +3*i] = -1.7+data3[findMaxToNthElement(currentFileColumnLength, p-1)+i]/(maxInEquationLocal/3.2);
				}
			}
		}
	
		//задавам стойности спрямо собственият им макс.
		for (var j = 0; j <= z; j+=1){
			if (skip_graphs2.indexOf(j) > -1) { continue; }
			for(var i=0; i<700+1; i++){
				data[27351 + 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) + ((j*3+0)*3)*701+3*i+1] = -1.7+data_max_optimization[j*701+i]/(array_with_maximums_13000[j]/3.2);
				data[27351 + 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) + ((j*3+1)*3)*701+3*i+1] = -1.707+data_max_optimization[j*701+i]/(array_with_maximums_13000[j]/3.2);
				data[27351 + 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) + ((j*3+2)*3)*701+3*i+1] = -1.714+data_max_optimization[j*701+i]/(array_with_maximums_13000[j]/3.2);
			}
		}
	}
	
	//рисуване
	gl.clearColor(switchColorR,switchColorG,switchColorB,1);
	gl.clear(gl.COLOR_BUFFER_BIT);

	//setting Oy values
	for (var i = 0; i < 3; i+=1) {
		document.getElementById('time_time_y' + i).innerHTML = ((i+1)/3).toFixed(2);
	}
	
	var t = 0.0;	

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

	gl.enableVertexAttribArray(aXYZ);
	gl.vertexAttribPointer(aXYZ,3,gl.FLOAT,false,0,0);
			
	//coord sys 
	gl.vertexAttrib3f(aRGB,switchColorRs,switchColorGs,switchColorBs);
	gl.drawArrays(gl.LINES,0,4);
			
	//Draws dotted line top.
	if(noGridLines === 1) {
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		gl.drawArrays(gl.LINES,4,700+1);
		
		//Draws dotted line middle.
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		gl.drawArrays(gl.LINES,4+701,700+1);
		
		//Draws dotted line bottom.
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		gl.drawArrays(gl.LINES,4+701*2,700+1);
				
		//Draws 10 dotted lines X-axis (time).
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		for(var j=0; j<10; j++){
			gl.drawArrays(gl.LINES,4+3*701+701*(j),700+1);
		}
	}
	
	if(flagUpWhenUploadedFile === 1) { 
	//Draws raw data
				
		for (var p = 1; p < helpCounter; p++) {
			if ( rawDataSkipGraphic.indexOf(helpColorRawData[2*p-2]) == -1 ){
				continue;
			}
			//взима цветовете от raw data файла.
			var color_of_raw_data = helpColorRawData[2*p-1];
			var newRcolor = convertHexToRGB(color_of_raw_data.substring(0,2));
			var newGcolor = convertHexToRGB(color_of_raw_data.substring(2,4));
			var newBcolor = convertHexToRGB(color_of_raw_data.substring(4,6));
			gl.vertexAttrib3f(aRGB,newRcolor,newGcolor,newBcolor);
			gl.drawArrays(gl.LINE_STRIP,4+3*701+10*701+( findMaxToNthElement(currentFileColumnLength, p-1) ) , currentFileColumnLength[p-1]);
		}
	}
	//Draws formulees and sets colors
	for (var m = 0; m <= z/*-number_of_graphs_to_hide*/; m+=1) {
		gl.vertexAttrib3f(aRGB,color_eqs[m][0],color_eqs[m][1],color_eqs[m][2]);
		gl.drawArrays(gl.LINE_STRIP,(3*m+0)*(700+1)+4+3*701+10*701+flagUpWhenUploadedFile*( findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) ),700+1);
		gl.drawArrays(gl.LINE_STRIP,(3*m+1)*(700+1)+4+3*701+10*701+flagUpWhenUploadedFile*( findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) ),700+1);
		gl.drawArrays(gl.LINE_STRIP,(3*m+2)*(700+1)+4+3*701+10*701+flagUpWhenUploadedFile*( findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) ),700+1);		
	}

}


//function to optimize Animation: //normalization of data (finding max + division)// + draws everything.
function start_new_generation() {
	
	var findNumberOfEq = document.getElementsByClassName("buttonsCustomConfig");
	
	var helpArray = [];

	//извличам номера на уравнението, по-долу премахвам водещите нули.
	for (var i = 0; i < findNumberOfEq.length; i++) {
		if ( findNumberOfEq[i].value == tempCoef) {
			helpArray.push(findNumberOfEq[i].id.substring(findNumberOfEq[i].id.length-4-first_line_of_file.toString().length, findNumberOfEq[i].id.length-4));
		}
	}

	//removing leading zeros
	//премахвам водещи нули (това е за да работи с 999 999 уравнения)
//това е когато меним параметър на уравнение.
	for (var i = 0; i < helpArray.length; i++) {
		if( parseInt(helpArray[i]) == 0) {
			helpArray[i] = 0; continue;
		}
		helpArray[i] = helpArray[i].replace(/^0+/, '');
	}
	
//ако параметъра е на скрито уравнение - отивам на следващия параметър. 
	for (var i = 0; i < skip_graphs2.length; i++) {
		if (skip_graphs2[i] == helpArray[0]) { return; }
	}
	
	//присвоявам стойността на глобален масив, така мога да го ползвам в imaxoptimization()
	help_array_max=helpArray;
	
	if (noQuantitySwitchName % 2 === 1 ) { 
	
	} else {
		if (document.getElementById("oyScaleMaxValue").value != "" && document.getElementById("oyScaleMaxValue").value > 0 ){
			flagImaxSet = 1;
			iMaxOptimization();
			//flagImaxSet = 0;
		} else {
			flagImaxSet=0;
			iMaxOptimization();
		}
	}
//24.01 до тук всичко е ок, проверявам imaxoptimization
	
	var t = 0.0;
	//11
	numberOfIfEqs = 0;
//25.01
//alert(helpArray);
	for (var m = 0; m < helpArray.length; m+=1) {
//25.01
//alert(helpArray + " dfg");
//когато е скрита 1вата графика, отчита че иска да местим нея, а не така.
//alert(skip_graphs2);
//alert(skip_graphs2.indexOf(m));
//alert(skip_graphs2.indexOf(helpArray[m]));


//23.01-2
		//if( parseInt(helpArray[m]) > z-totalNumberOfIfEqs ) {
if( parseInt(helpArray[m]) >= z-totalNumberOfIfEqs ) {
			numberOfIfEqs = (parseInt(helpArray[m]) - (z-totalNumberOfIfEqs)  - 1 );
		}
		//ако сме на уравнение, което потребителя в момента не иска да е видимо:		
		//if (skip_graphs2.indexOf(m) > -1 && m > z-totalNumberOfIfEqs) { numberOfIfEqs++;	/*continue;*/ }
//25.01-1
//if (skip_graphs2.indexOf(m) > -1) { numberOfIfEqs++;	/*continue;*/ }
if (skip_graphs2.indexOf(helpArray[m]) > -1) { numberOfIfEqs++;	/*continue;*/ }
		//if (skip_graphs2.indexOf(m) > -1) { continue; }

		//тук трябва вместо continue, да генерирам тези с Y=1.2
//25.01-1
		//if (skip_graphs2.indexOf(m) > -1) {
if (skip_graphs2.indexOf(helpArray[m]) > -1) {
			for (var i=0; i<n+1; i++){
				data.push(-2.6+5.5*i/700.0, -5, 0 );
			}
			for (var i=0; i<n+1; i++){
				data.push(-2.6+5.5*i/700.0, -5, 0 );
			}
			for (var i=0; i<n+1; i++){
				data.push(-2.6+5.5*i/700.0, -5, 0 );
			}
//24.01-4 ето тук когато е скрита 1-вата излиза от цикъла и не прави нищо.
//като го сложа в коментар при по-голямо количество графики се разместват....
			continue; 
		}


		
		if (noQuantitySwitchName % 2 === 1 ) {
			//обновява макс на уравнението, което модифицираме:
			var t = 0.0;
			maxInEquation = 0;
			//намира максимум само на уравнението с което в момента работим.
				for (var i=0; i<700+1; i++){
//23.01-2
					//if( help_array_max[0] > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
if( t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
						var candidate = eval(dataWithIf[2*numberOfIfEqs]);
					} else { 
						var candidate = eval(equation_by_user[help_array_max[0]]);
					}
					if (maxInEquation < candidate ){
						maxInEquation = candidate;
					}
					t+=creationStep;
				}
			//обновявам стойностите на масива с максимуми.	
			array_with_maximums[help_array_max[0]] = maxInEquation;

			var t = 0.0;
			for(var i=0; i<700+1; i++){
//23.01-2
				//if( helpArray[m] > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
if( t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
					tempRes = eval(dataWithIf[2*numberOfIfEqs]);
				} else { 
					tempRes = eval(equation_by_user[helpArray[m] ]);
				}
				data[27351 + 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) + ((helpArray[m]*3+0)*3)*701+3*i+1] = -1.7+tempRes/(array_with_maximums[helpArray[m]]/3.2);
				data_max_optimization[helpArray[m]*701+i]=tempRes;
				//change n
				t+=creationStep;
			}
			//2
			var t = 0.0;
			for(var i=0; i<700+1; i++){
//23.01-2
				//if( helpArray[m] > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
					tempRes = eval(dataWithIf[2*numberOfIfEqs]);
					
				} else { 
					tempRes = eval(equation_by_user[helpArray[m] ]);
				}
				data[27351 + 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) + ((helpArray[m]*3+1)*3)*701+3*i+1] = -1.707+tempRes/(array_with_maximums[helpArray[m]]/3.2);
				//change n
				t+=creationStep;
			}
			//3
			var t = 0.0;
			for(var i=0; i<700+1; i++){
//23.01-2
				//if( helpArray[m] > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
					tempRes = eval(dataWithIf[2*numberOfIfEqs]);
				} else { 
					tempRes = eval(equation_by_user[helpArray[m] ]);
				}
				data[27351 + 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) + ((helpArray[m]*3+2)*3)*701+3*i+1] = -1.714+tempRes/(array_with_maximums[helpArray[m]]/3.2);
				//change n

				t+=creationStep;
			}
		} else {
			for(var i=0; i<700+1; i++){
//23.01-2
				//if( helpArray[m] > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
					tempRes = eval(dataWithIf[2*numberOfIfEqs]);
				} else { 
					tempRes = eval(equation_by_user[helpArray[m] ]);
				}	
				data[27351 + 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) + ((helpArray[m]*3+0)*3)*701+3*i+1] = -1.7+tempRes/(maxInEquation/3.2);
				data_max_optimization[helpArray[m]*701+i]=tempRes;
				//change n
				t+=creationStep;
			}
//24.01-2
//alert(tempRes);
			//2
			var t = 0.0;
			for(var i=0; i<700+1; i++){
//23.01-2
				//if( helpArray[m] > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
					tempRes = eval(dataWithIf[2*numberOfIfEqs]);
					
				} else { 
					tempRes = eval(equation_by_user[helpArray[m] ]);
				}
				data[27351 + 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) + ((helpArray[m]*3+1)*3)*701+3*i+1] = -1.707+tempRes/(maxInEquation/3.2);
				//change n
				t+=creationStep;
			}
			//3
			var t = 0.0;
			for(var i=0; i<700+1; i++){
//23.01-2
				//if( helpArray[m] > z-totalNumberOfIfEqs && t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
if(t >= eval(dataWithIf[2*numberOfIfEqs+1])) {
					tempRes = eval(dataWithIf[2*numberOfIfEqs]);
				} else { 
					tempRes = eval(equation_by_user[helpArray[m] ]);
				}
				data[27351 + 3*findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) + ((helpArray[m]*3+2)*3)*701+3*i+1] = -1.714+tempRes/(maxInEquation/3.2);
				//change n

				t+=creationStep;
			}
		}
	}

	gl.clearColor(switchColorR,switchColorG,switchColorB,1);
	gl.clear(gl.COLOR_BUFFER_BIT);

	//setting Oy values
	if (noQuantitySwitchName % 2 === 1) {
		for (var i = 0; i < 3; i+=1) {
			document.getElementById('time_time_y' + i).innerHTML = ((i+1)/3).toFixed(2);
		}
	} else {	
		//setting Oy values
		for (var i = 0; i < 3; i+=1) {
			document.getElementById('time_time_y' + i).innerHTML = eval( maxInEquation * (i+1)/3).toFixed(fixPres);
		}
	}
	
	var t = 0.0;	

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

	gl.enableVertexAttribArray(aXYZ);
	gl.vertexAttribPointer(aXYZ,3,gl.FLOAT,false,0,0);
			
	//coord sys 
	gl.vertexAttrib3f(aRGB,switchColorRs,switchColorGs,switchColorBs);
	gl.drawArrays(gl.LINES,0,4);
			
	//Draws dotted line top.
	if(noGridLines === 1) { 
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		gl.drawArrays(gl.LINES,4,700+1);
		
		//Draws dotted line middle.
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		gl.drawArrays(gl.LINES,4+701,700+1);
		
		//Draws dotted line bottom.
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		gl.drawArrays(gl.LINES,4+701*2,700+1);
				
		//Draws 10 dotted lines X-axis (time).
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		for(var j=0; j<10; j++){
			gl.drawArrays(gl.LINES,4+3*701+701*(j),700+1);
		}
	}
			
	if(flagUpWhenUploadedFile === 1) { 
	//Draws raw data
		for (var p = 1; p < helpCounter; p++) {
			if ( rawDataSkipGraphic.indexOf(helpColorRawData[2*p-2]) == -1 ){
				continue;
			}
			//взима цветовете от raw data файла.
			var color_of_raw_data = helpColorRawData[2*p-1];
			var newRcolor = convertHexToRGB(color_of_raw_data.substring(0,2));
			var newGcolor = convertHexToRGB(color_of_raw_data.substring(2,4));
			var newBcolor = convertHexToRGB(color_of_raw_data.substring(4,6));
			gl.vertexAttrib3f(aRGB,newRcolor,newGcolor,newBcolor);
			gl.drawArrays(gl.LINE_STRIP,4+3*701+10*701+( findMaxToNthElement(currentFileColumnLength, p-1) ) , currentFileColumnLength[p-1]);
		}
	}
	//Draws formulees and sets colors
	for (var m = 0; m <= z/*-number_of_graphs_to_hide*/; m+=1) {
		gl.vertexAttrib3f(aRGB,color_eqs[m][0],color_eqs[m][1],color_eqs[m][2]);
		gl.drawArrays(gl.LINE_STRIP,(3*m+0)*(700+1)+4+3*701+10*701+flagUpWhenUploadedFile*( findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) ),700+1);
		gl.drawArrays(gl.LINE_STRIP,(3*m+1)*(700+1)+4+3*701+10*701+flagUpWhenUploadedFile*( findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) ),700+1);
		gl.drawArrays(gl.LINE_STRIP,(3*m+2)*(700+1)+4+3*701+10*701+flagUpWhenUploadedFile*( findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) ),700+1);		
	}
}

function only_norlization(){

	if (document.getElementById("oyScaleMaxValue").value != "" && document.getElementById("oyScaleMaxValue").value > 0 ){
		flagImaxSet = 1;
		iMaxOptimization();
	} else {
		flagImaxSet=0;
		iMaxOptimization();
	}
	
	gl.clearColor(switchColorR,switchColorG,switchColorB,1);
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	//setting Oy values
	for (var i = 0; i < 3; i+=1) {
		document.getElementById('time_time_y' + i).innerHTML = eval( maxInEquation * (i+1)/3).toFixed(fixPres);
	}
	
	var t = 0.0;		
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	
	gl.enableVertexAttribArray(aXYZ);
	gl.vertexAttribPointer(aXYZ,3,gl.FLOAT,false,0,0);
			
	//coord sys 
	gl.vertexAttrib3f(aRGB,switchColorRs,switchColorGs,switchColorBs);
	gl.drawArrays(gl.LINES,0,4);
			
	//Draws dotted line top.
	if(noGridLines === 1) {
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		gl.drawArrays(gl.LINES,4,700+1);
		
		//Draws dotted line middle.
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		gl.drawArrays(gl.LINES,4+701,700+1);
		
		//Draws dotted line bottom.
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		gl.drawArrays(gl.LINES,4+701*2,700+1);
				
		//Draws 10 dotted lines X-axis (time).
		gl.vertexAttrib3f(aRGB,0.4,0.4,0.4);
		for(var j=0; j<10; j++){
			gl.drawArrays(gl.LINES,4+3*701+701*(j),700+1);
		}
	}
	
	if(flagUpWhenUploadedFile === 1) { 
	//Draws raw data
		for (var p = 1; p < helpCounter; p++) {
			if ( rawDataSkipGraphic.indexOf(helpColorRawData[2*p-2]) == -1 ){
				continue;
			}
			//взима цветовете от raw data файла.
			var color_of_raw_data = helpColorRawData[2*p-1];
			var newRcolor = convertHexToRGB(color_of_raw_data.substring(0,2));
			var newGcolor = convertHexToRGB(color_of_raw_data.substring(2,4));
			var newBcolor = convertHexToRGB(color_of_raw_data.substring(4,6));
			gl.vertexAttrib3f(aRGB,newRcolor,newGcolor,newBcolor);
			gl.drawArrays(gl.LINE_STRIP,4+3*701+10*701+( findMaxToNthElement(currentFileColumnLength, p-1) ) , currentFileColumnLength[p-1]);
		}
	}
	//Draws formulees and sets colors
	for (var m = 0; m <= z/*-number_of_graphs_to_hide*/; m+=1) {
		gl.vertexAttrib3f(aRGB,color_eqs[m][0],color_eqs[m][1],color_eqs[m][2]);
		gl.drawArrays(gl.LINE_STRIP,(3*m+0)*(700+1)+4+3*701+10*701+flagUpWhenUploadedFile*( findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) ),700+1);
		gl.drawArrays(gl.LINE_STRIP,(3*m+1)*(700+1)+4+3*701+10*701+flagUpWhenUploadedFile*( findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) ),700+1);
		gl.drawArrays(gl.LINE_STRIP,(3*m+2)*(700+1)+4+3*701+10*701+flagUpWhenUploadedFile*( findMaxToNthElement(currentFileColumnLength, currentFileColumnLength.length) ),700+1);		
	}
	//start_new_generation();
}
