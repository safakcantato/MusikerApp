// wenn Seite geladen wurde, dann schicke $ajax und lade Daten
$.ajax({
    url: '/getuser',
    method: 'post',
    success: (userdaten) => {
        alert('daten wurden geladen'); // schöner, besser
        console.log( userdaten );
       // einfügen in Formular
       $('#email').val( userdaten.email );
       //...
    }
});


let vorname = $('#benutzerVorname')
let nachname = $('#benutzerNachname')
let email = $('#email')
let password = $('#password')
let confirmPassword = $('#confirm-password')
let date = $('#date')
let role = $('#role')
let instrument = $('#instrument')

$('#edit').on('click', (e) => {
e.preventDefault();
$.ajax({
    url: '/edituser',
    data: {
        vorname: vorname.val(),
        nachname: nachname.val(),
        email: email.val(),
        password: password.val(),
        confirmPassword: confirmPassword.val(),
        date: date.val(),
        role: role.val(),
        instrument: instrument.val()
    }, // was user eingebene hat
    method: 'patch',
    success: () => {
        alert('data edited succesfully'); // schöner, besser
        window.location = "./member/index.html"
    }
})
})

