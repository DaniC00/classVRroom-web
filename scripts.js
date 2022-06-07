
//BASE_URL = 'http://localhost:5000';
BASE_URL = 'https://api-dcalper.herokuapp.com'

LOGIN_URL = '/api/login';
LOGOUT_URL = '/api/logout'
GETCOURSES_URL = '/api/get_courses';
GETCOURSEDETAILS_URL ='/api/get_course_details';
EXPORTDATABASE_URL = '/api/export_data_base';
PINREQUEST_URL = '/api/pin_request';
STARTVREXERCISE_URL = '/api/start_vr_exercise';
FINISHVREXERCISE_URL = '/api/finish_vr_exercise';


function loginButtonAction(){
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    
    //BASE_URL+LOGIN_URL+'?username='+username+'&password='+password

    console.log("Iniciando sesion con el usuario "+username);

    $.ajax({
        url: BASE_URL+LOGIN_URL+'?username='+username+'&password='+password,
        contentType: "application/json",
        dataType: 'json',
        success: function(result){
            if(result.status === 'OK'){

                localStorage.setItem('token', result.token);

               window.location.href = "mainmenu.html"
            } else if (result.status ==='NOK'){
                alert('Login Incorrecto!')
            }
        }
    })
}

function logoutButtonAction(){
    var usertoken = localStorage.getItem('token');
    $.ajax({
        url: BASE_URL+LOGOUT_URL+'?token='+usertoken,
        contentType: "application/json",
        dataType: 'json',
        success: function(result){
            alert(result.message);
            localStorage.removeItem('token');
            window.location.href = "index.html";
        }
    })
}

function getCoursesAction(){
    var usertoken = localStorage.getItem('token');
    $.ajax({
        url: BASE_URL+GETCOURSES_URL+'?session_token='+usertoken,
        contentType: "application/json",
        dataType: 'json',
        success: function(result){

            if(result.status == "NOK_EXPIRED"){
                alert("TOKEN EXPIRADO - INICIA SESION DE NUEVO");
                localStorage.removeItem('token');
                window.location.href = "index.html";
            } else if(result.status != "NOK"){
                console.log(result)

                for(i=0; i<result.length; i++){
                    //crear el input para mostrar el curso
                    var coursesContainer = document.getElementById("course-list-container");

                    //vacia la lista y crea la nueva
                    coursesContainer.innerHTML = "";
                    coursesContainer.innerHTML += '<input style="pointer-events: none; width: 65%; justify-content: center; margin-top: 16px; height: 20px" type="text" value="'+result[i].title+' - '+result[i].description+'"/> <button class="regular-button" type="button" style="width: 15%;" onclick="getCourseDetails('+result[i].courseId+')">Details</button>';
                }

            } else {
                console.log(result)
            }
        }
    })
}

function getCourseDetails(courseId){

    var usertoken = localStorage.getItem('token');
    $.ajax({
        url: BASE_URL+GETCOURSEDETAILS_URL+'?session_token='+usertoken+'&courseId='+courseId,
        contentType: "application/json",
        dataType: 'json',
        success: function(result){
            if(result.status == "NOK_EXPIRED"){
                alert("TOKEN EXPIRADO - INICIA SESION DE NUEVO");
                localStorage.removeItem('token');
                window.location.href = "index.html";
            } else if(result.status != "NOK"){
                console.log(result)

                document.getElementById('details-textarea').innerHTML = JSON.stringify(result, null, 4);

                /*
                document.getElementById('details-textarea').innerHTML = 'title: '+result.title+'\ndescription: '+result.description+'\nstudents: '+JSON.stringify(result.subscribers.students)+
                '\nteachers: '+JSON.stringify(result.subscribers.teachers)+'\n\ntasks: '+JSON.stringify(result.tasks)+'\n\nvr_tasks: '+JSON.stringify(result.vr_tasks); */

            } else {
                console.log(result)
            }
        }
    })

}


function downloadExportDB(){

    const username = document.getElementById('exportDBusername').value
    const password = document.getElementById('exportDBpassword').value

    $.ajax({
        url: BASE_URL+EXPORTDATABASE_URL+'?username='+username+'&password='+password,
        contentType: "application/json",
        dataType: 'json',
        success: function(result){
            if(result.status == "NOK_EXPIRED"){
                alert("TOKEN EXPIRADO - INICIA SESION DE NUEVO");
                localStorage.removeItem('token');
                window.location.href = "index.html";
            } else if(result.status != "NOK"){
                saveJSON(result, "coursesDB.json");
            } else {
                alert(result.message)
            }
        }
    })
}

function pinRequest(){
    const vrTaskId = document.getElementById('vrTaskIdInput').value
    var session_token = localStorage.getItem('token');

    $.ajax({
        url: BASE_URL+PINREQUEST_URL+'?session_token='+session_token+'&vrTaskId='+vrTaskId,
        contentType: "application/json",
        dataType: 'json',
        success: function(result){
            if(result.status == "NOK_EXPIRED"){
                alert("TOKEN EXPIRADO - INICIA SESION DE NUEVO");
                localStorage.removeItem('token');
                window.location.href = "index.html";
            }else if(result.status != "NOK"){
                document.getElementById("generatedPinInput").value = result.pin;
            } else {
                alert(result.message)
            }
        }
    })

}

function startVrExercise(){

    const pinNumber = document.getElementById('startExercisePinInput').value

    $.ajax({
        url: BASE_URL+STARTVREXERCISE_URL+'?pin='+pinNumber,
        contentType: "application/json",
        dataType: 'json',
        success: function(result){
            if(result.status == "NOK_EXPIRED"){
                alert("TOKEN EXPIRADO - INICIA SESION DE NUEVO");
                localStorage.removeItem('token');
                window.location.href = "index.html";
            } else if(result.status != "NOK"){
                console.log(result);
                document.getElementById("startExerciseResult").value = 'usuario: '+result.username+' - task ID asociada a este pin: '+result.VRexerciceID;
            } else {
                alert(result.message)
            }
        }
    })

}

function finishVRExercise(){

    //finnishPinInput finnishUserInput finnishFailedInput finnishPassedInput finnishGradeInput FinnishFeedbackInput

    let finnishPinInput = document.getElementById('finnishPinInput').value;
    let finnishFailedInput = document.getElementById('finnishFailedInput').value;
    let finnishPassedInput = document.getElementById('finnishPassedInput').value;
    let finnishGradeInput = document.getElementById('finnishGradeInput').value;
    let FinnishFeedbackInput = document.getElementById('FinnishFeedbackInput').value;

    //pin, studentID, failed_items, grade, feedback, passed_items

    let dataToSend = { "pin": finnishPinInput, "failed_items" : finnishFailedInput , 
    "passed_items" : finnishPassedInput ,"grade" : finnishGradeInput ,"feedback" : FinnishFeedbackInput};

    console.log(dataToSend)

    $.ajax({
        type: "POST",
        url: BASE_URL+FINISHVREXERCISE_URL,
        data: dataToSend,  
        success: function(result){
            if(result.status != "NOK" && result.status != "NOK_MISSING_DATA"){
                alert(result.message)
            } else {
                alert(result.message)
            }
        }
    })

}

function saveJSON(data, filename){

    if(!data) {
        console.error('No data')
        return;
    }

    if(!filename) filename = 'console.json'

    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
}