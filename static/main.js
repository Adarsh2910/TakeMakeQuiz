function validateEmail(){
		var emailID = document.getElementById("email").value;
		atpos = emailID.indexOf("@");
		dotpos = emailID.lastIndexOf("."); 
		if(atpos < 1 || (dotpos - atpos < 2)){
		document.getElementById("checkmail").innerHTML="Please enter a valid EMAIL ID";
	    document.getElementById("email").focus; 
	    return false;
	   }
        return;
         }


$('document').ready(function(){
	$('#takenquiz').css("display", "none");
	$('#takenewquiz').css("display", "none");
	$('#previousbutton').css("display", "none");
	$('#nextbutton').css("display", "none");
	$('#takequiz').css("display", "none");
	$('#nextquestbutton').css("display", "none");
	$('#resultsHeading').css("display", "none");
	$('.Quizestaken').css("display", "none");
	$('.newquizes').css("display", "none");
	$('#results').css("display", "none");
	$('#makebut').css("display", "none");
	

$('[data-toggle="tooltip"]').tooltip(); 

	var store = ( function() {
		var currentQuestion = 0,
			questionArray = [],
			offset = 0,
			score = 0,
			inc = 0,
			finishBool = false,
			quizName,
			quizID;

		return {
			getQuestionNo: function() {
				return currentQuestion;
			},
			nextQuestion: function() {
				currentQuestion++;
			},
			setQuestions: function(array) {
				questionArray = array;
			},
			getQuestionFromArray: function() {
				if(currentQuestion >= questionArray.length) {
					return false;
				}
				else {
					return questionArray[currentQuestion]
				}
			},
			getOffset: function() {
				return offset;
			},
			setOffset: function() {
				offset += 10;
			},
			getAnswer: function() {
				return questionArray[currentQuestion-1].ans;
			},
			updateScore: function(){
				score += 1; 
			},
			getScore: function() {
				return score;
			},

			updateInc: function(){
				inc ++;
			},

			getInc :function(){
				return inc;
			},
			markFinish: function() {
				finishBool = true;
			},
			isFinish: function() {
				return finishBool;
			},
			setQuizName: function(name) {
				quizName = name;
			},
			getQuizName: function() {
				return quizName;
			},
			setQuizID: function(id) {
				quizID = id;
			},
			getQuizID: function() {
				return quizID;
			}
		}
	})();

	// -------------- login & register page ( hide and show ) ---------
		
	$('#loginbut').click(function(e){
		e.preventDefault()
		$('.right').css("display","none");
		$('.left').css("float","right");
		$('.login').css("display","block");
	})
		$('#register').click(function(e){
		e.preventDefault()
		$('.right').css("display","block");
		$('.left').css("float","left");
		$('.login').css("display","none");
	});

		// --------------------- register model --------------------

	$('#regbut').click(function(e){
		e.preventDefault();
		var temp = document.getElementById("regpassword").value;
		if($('#username').val()==""||$('#email').val()==""||$('#regpassword').val()==""||$('#conpassword').val()==""){
			document.getElementById("username").placeholder="Please Enter Username";
			document.getElementById("email").placeholder="Please Enter a Valid Email";
			document.getElementById("regpassword").placeholder="Please Enter a Password";
			document.getElementById("conpassword").placeholder="Please Re-Enter password";
			return;
		}
		else if(temp.length <= 7 ){
			document.getElementById("checkpass").innerHTML="Please enter minimum 8 characters";
	    	document.getElementById("regpassword").focus; 
	    	return;
		}
		else if($('#conpassword').val()!= $('#regpassword').val()){
			document.getElementById("conpassword").value="";
			document.getElementById("conpassword").placeholder="Passwords do not match!";
			return;
		}

		var formData = {
		 username : $('#username').val(),
		 email : $('#email').val(),
		 password : $('#conpassword').val() 
		}
	 	$.ajax({	
		 	type: 'POST',
		 	url: 'http://35.200.242.164/user/register',
		 	data: formData,
		 	datatype: 'json',
		 	encode: 'true',
		 }).done(function(res){
		 	if(res.success === false) {
		 		alert("Email already Registered");
		 	}
		 	else {
		 		window.location = res.redirect;	
		 	}
		 	
		 })

	});



	//--------------------login model ---------------

	$('#logbut').click(function(e){
		e.preventDefault();

		if($('#logemail').val()=="" || $('#password').val()=="" ){
			$('.errordiv').css('display', 'none');
			$('.errordiv1').css('display', 'block');
			return;
		}
		else{
			$('.errordiv').css('display', 'none');
			$('.errordiv1').css('display', 'none');
		}

		var formData = {
			email : $('#logemail').val(),
			password : $('#password').val() 
		};

		$.ajax({	
			type: 'POST',
			url: 'http://35.200.242.164/user/login',
			data: formData,
			datatype: 'json',
			encode: 'true',
		}).done(function(res){
			$('.errordiv').css('display', 'none');
			window.location = res.redirect;
		}).fail(function(res){	
			$('.errordiv').css('display', 'block');
		})
	});


		// ------------------ logout ---------------------

	$('#logout').click(function(){
		$.removeCookie('token', { path: '/' });

		$.ajax({	
		 	type: 'POST',
		 	url: 'http://192.168.1.9:8095/get',
		})
	});

	//---------------------------------taken------------------------------------

	$('#takenquiz').css("display", "none");
	$('#successmessage').css("display", "none");

	$('#take').click(function(e){
	 	e.preventDefault();

		$('#intro').css("display","none");
		$('#takenewquiz').css("display", "block");
		$('.Quizestaken').css("display", "block");

		$.ajax({
			type: 'GET',
		 	url: 'http://35.200.242.164/user/quiz/taken/fetch',
		}).done(function(response){
		
			if(response.success == false){
				$('#takenquiz').css("display", "block");
				$('.Quizestaken').css("display", "none");
			} else {
				$('#takenquiz').css("display", "none");

			 	$.map(response.quizes, function(value , key ){
			 		var cardName = document.createElement("DIV");
			 		cardName.id = "cardname" + key;
			 		cardName.className = "cardname col-sm-3";

			 		h2Tag = document.createElement("H2");
			 		h2Text = document.createTextNode(value.quizName);
			 		h2Tag.appendChild(h2Text);

			 		h5Tag = document.createElement("H5");
			 		h5Text = document.createTextNode(value.score);
			 		h5Tag.appendChild(h5Text);

			 		cardName.appendChild(h2Tag);
			 		cardName.appendChild(h5Tag);

			 		var card = document.getElementsByClassName("card");
			 		card[0].appendChild(cardName);
			 	});
			}
		})
	})



	//--------------------------- show all new quizes ---------------------------------



	$('#takenewquiz').click(function(e) {
		$('#takenewquiz').css("display", "none");
		$('#nextbutton').css("display", "block");
		$('.newquizes').css("display", "block");
		$('.Quizestaken').css("display", "none");
		$('.takenquiz').css("display", "none");
		e.preventDefault();
		showQuizes(store.getOffset());

	});

	$('#nextbutton').click(function(e){
		store.setOffset();
		store.updateInc();
		showQuizes(store.getOffset());
		store.updateInc();
	});
	function showQuizes(offset) {
		$.ajax({
			type: 'GET',
		 	url: 'http://35.200.242.164/user/quiz/fetch/?offset='+offset,
		}).done(function(res) {
			
			$('.cardname').css("display", "none");
			var takecard = res.data;

			$.map(takecard, function(value , key ){

				store.getInc();
				var cardName = document.createElement("DIV");
		 		cardName.id = "cardtakename" + key + store.getInc();
		 		cardName.className = "cardtakenew  col-sm-3";
		 		h2Tag = document.createElement("H2");
		 		h2Text = document.createTextNode(value.quizname);
		 		h2Tag.appendChild(h2Text);


		 		cardName.appendChild(h2Tag);
		 		
		 		var card = document.getElementsByClassName("card");
		 		card[0].appendChild(cardName);

				    $("#cardtakename" + key + store.getInc() ).click(function(e){
					$('#takequiz').css("display", "block");
					$('#takenquiz').css("display", "none");
					$('#nextbutton').css("display", "none");
					$('#nextquestbutton').css("display", "block");
					$('.newquizes').css("display", "none");
					var quizid = value.quizId;
					store.setQuizID(value.quizId);
					store.setQuizName(value.quizname);
					
					$.ajax({
						type: 'POST',
					 	url: 'http://35.200.242.164/user/quiz/take',
					 	data: {quizID : quizid},
					 	datatype: 'json',
						encode: 'true',
					}).done(function(res){
						$('.displaycard').css("display","none");
						store.setQuestions(res.data[0].questions);
						showQuestion(store.getQuestionFromArray());
			// --------------------- timer -------------------------

				var totaltime = value.quizTime;

			  var minu = parseInt(Math.floor(totaltime / 60000));
			  var seco = parseInt(((totaltime % 60000) / 1000).toFixed(0));

			 document.getElementById('timer').innerHTML =
			     minu + ":" + seco;

			  startTimer();

			  function startTimer() {
			    var presentTime = document.getElementById('timer').innerHTML;
			    var timeArray = presentTime.split(/[:]+/);
			    var m = timeArray[0];
			    var s = checkSecond((timeArray[1] - 1));
			       if(s==59){m=m-1}
				    if(s<=0 && m<=0){
				   $('#takequiz').css("display", "none");
					$('#nextquestbutton').css("display", "none");
					$('#resultsHeading').css("display", "block");

					if(!store.isFinish()) {
						$.ajax({
							type: 'POST',
						 	url: 'http://35.200.242.164/user/quiz/finish',
						 	data: {
						 		score : store.getScore(),
						 		quizName: store.getQuizName(),
						 		quizID: store.getQuizID()
						 	},
						 	datatype: 'json',
							encode: 'true',
						}).done(function(res){
							
								$('#displayresults').append( store.getScore() );
								$('#results').css("display", "block");

						})
						
					}
				  }
			 
			    document.getElementById('timer').innerHTML =
			      m + ":" + s;
			    setTimeout(startTimer, 1000);
			  }

			  function checkSecond(sec) {
			    if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
			    if (sec < 0) {sec = "59"};
			    return sec;
			  }
 			


			})

			});
			
		})
		
	})
}


	// ---------------------- show selected quiz (questions and options) --------------------

	function showQuestion(question) {
		if(!question) {
			var checkedAns = $("input[type='radio'][name='answer']:checked").val();
			store.getAnswer();	
			if (checkedAns === store.getAnswer()) {
			 	store.updateScore();
				$("input:radio").prop("checked", false);
		 	}
			$('#takequiz').css("display", "none");
			$('#nextquestbutton').css("display", "none");
			$('#resultsHeading').css("display", "block");
			$.ajax({
				type: 'POST',
			 	url: 'http://35.200.242.164/user/quiz/finish',
			 	data: {
			 		score : store.getScore(),
			 		quizName: store.getQuizName(),
			 		quizID: store.getQuizID()
			 	},
			 	datatype: 'json',
				encode: 'true',
			}).done(function(res){
				if(!store.isFinish()) {
					store.markFinish();
					$('#displayresults').append( store.getScore() );
					$('#results').css("display", "block");	
				}
			})
		}
		else {
			$('#questionName').text( " "+ (store.getQuestionNo()+1) + ".  "  + question.questionName +" " );
			$('#opt1').text( question.optionA );
			$('#opt2').text( question.optionB );
			$('#opt3').text( question.optionC );
			$('#opt4').text( question.optionD );	

					}
					
				}

				$('#nextquestbutton').click(function(){
					store.nextQuestion();
					showQuestion(store.getQuestionFromArray());
					var checkedAns = $("input[type='radio'][name='answer']:checked").val();
					store.getAnswer();	
					if (checkedAns === store.getAnswer()) {
					 	store.updateScore();
						$("input:radio").prop("checked", false);
				 	}
				})

			

	//------------------------ make new  quiz-----------------------
	

	$(".makequiz").css("display","none");
	var quizArray = [];		
	$("#make").click(function(e){
	if($('#quizname').val()==""){
		document.getElementById("quizerror").innerHTML="Please Enter a Quiz Name";

			return false;
		}
		e.preventDefault();
		
		$('#intro').css("display","none");
		$(".makequiz").css("display","block");
		$('.cardnamee').css("display","none");
		$('#madequiznote').css("display","none");
		$('#finishmaking').css("display","none");
		$('#addQuestion').css("display","none");
		$('#makenew').css("display","none");
		$('#makebut').css("display","none");

		$("#nextQuestion").click(function(e){

			if($('#questionname').val()==""||$('#optionA').val()==""||$('#optionB').val()==""||$('#optionC').val()==""||$('#optionD').val()==""){
			document.getElementById("questionname").placeholder="Please Enter a question";	
			document.getElementById("optionA").placeholder="Please Enter an Option";
			document.getElementById("optionB").placeholder="Please Enter an Option";
			document.getElementById("optionC").placeholder="Please Enter an Option";
			document.getElementById("optionD").placeholder="Please Enter an Option";
			return;
			}

			e.preventDefault();		
			
			var questionObj = {
				questionName : $("#questionname").val(),
				optionA : $("#optionA").val(),
				optionB : $("#optionB").val(),
				optionC : $("#optionC").val(),
				optionD : $("#optionD").val(),
				ans : $('#sel1').find(":selected").text(),
			}

			$(".maketable input[type=text]").val("");
			console.log(questionObj);
			quizArray.push(questionObj);
			$('.formhide').css("display","none");
			$('#finishmaking').css("display","block");
			$('#addQuestion').css("display","block");
			$('#nextQuestion').css("display","none");

			$("#addQuestion").click(function(e){
			$('.formhide input').val(" ");
			$('#addQuestion').css("display","none");
			$('.formhide').css("display","block");
			$('#nextQuestion').css("display","block");
			$('#finishmaking').css("display","none");
			})	

		});

	});

	$("#finishQuiz").click(function(e){
		if($('#quizTime').val()==""){
		document.getElementById("timeerror").innerHTML="Please Enter Time";
			return false;
		}
		e.preventDefault();

		var quizName = $("#quizname").val();
		var quizTime = $("#quizTime").val();
		var divide = quizTime.split(":");	

		var mininMilli = divide[0] * 60000;
		var secinMilli = divide[1] * 1000;

		var finalMilli = mininMilli + secinMilli;

		var formData = {
			quizName :quizName,
			questions : quizArray,
			quizTime : finalMilli,
		}

		$.ajax({
			type: 'POST',
			url: 'http://35.200.242.164/user/quiz/add',
		 	data: formData,
		 	datatype: 'json',
		 	encode: 'true',
		}).done(function(res){
			if (res.success == true) {
				$('#makeform').css("display", "none");
				$('#successmessage').css("display", "block");
			}
		})
	});

	//-------------------------- made quiz -----------------
	$('#madequiznote').css("display", "none");
		$('#madequiz').click(function(e){
	 	e.preventDefault();

		$('#intro').css("display","none");
		$('#makequiz').css("display","none");
		$('#makebut').css("display","block");

		$.ajax({
			type: 'GET',
		 	url: 'http://35.200.242.164/user/quiz/created/fetch',
		}).done(function(response){
			
			if(response.success == false){
				$('#madequiznote').css("display", "block");
				$('.quizesmadenote').css("display", "none");
			} else {
				$('#madequiznote').css("display", "none");
				
			 	$.map(response.quizes, function(value , key ){
			 		var cardName = document.createElement("DIV");
			 		cardName.id = "cardnamee" + key;
			 		cardName.className = "cardnamee col-sm-3";

			 		h2Tag = document.createElement("H2");
			 		h2Text = document.createTextNode(value.quizName);
			 		h2Tag.appendChild(h2Text);

			 		cardName.appendChild(h2Tag);

			 		var card = document.getElementById("takencard");
			 		card.appendChild(cardName);
			 	});
			}
		})
	})


});
