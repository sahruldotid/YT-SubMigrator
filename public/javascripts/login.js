// function onSuccess(googleUser) {
//   token = googleUser.getAuthResponse().access_token;
//   console.log(token);
//   if(token){
//     $.ajax({
//       type: 'POST',
//       url: 'http://localhost:3000/oauth2callback',
//       // url: 'https://local.free.beeceptor.com/',
//       headers: {
//         'X-Requested-With': 'XMLHttpRequest'
//       },
//       dataType: 'json',
//       contentType: 'application/json',
      
//       success: function (result) {
//         // window.location.href = "http://localhost:3000/dashboard";
//       },
//       data: JSON.stringify({access_token: token}),
//     });
//   } else {
//       // window.location.href = "http://localhost:3000/dashboard";
//   }
// }

// function onFailure(error) {
//   console.log(error);
// }

// function renderButton() {
//   gapi.signin2.render('my-signin2', {
//     'scope': 'https://www.googleapis.com/auth/youtube.readonly',
//     'width': 240,
//     'height': 50,
//     'longtitle': true,
//     'theme': 'dark',
//     'onsuccess': onSuccess,
//     'onfailure': onFailure
//   });
// }


// ===============================
// var googleUser = {};
// var startApp = function () {
//   gapi.load('auth2', function () {
//     // Retrieve the singleton for the GoogleAuth library and set up the client.
//     auth2 = gapi.auth2.init({
//       client_id: '875316385328-2as5p64ht38ssdcjmgui58bjnsl11go3.apps.googleusercontent.com',
//       cookiepolicy: 'none',
//       // Request scopes in addition to 'profile' and 'email'
//       scope: 'https://www.googleapis.com/auth/youtube.readonly'
//     });
//     attachSignin(document.getElementById('customBtn'));
//   });


//   googleUser = auth2.currentUser.get();
//   googleUser.grant(options).then(
//     function (success) {
//       console.log(JSON.stringify({
//         message: "success",
//         value: success
//       }));
//     },
//     function (fail) {
//       alert(JSON.stringify({
//         message: "fail",
//         value: fail
//       }));
//     });

// };



// function attachSignin(element) {
//   console.log(element.id);
//   auth2.attachClickHandler(element, {},
//     function (googleUser) {
//       document.getElementById('name').innerText = "Signed in: " +
//         googleUser.getBasicProfile().getName();
//     },
//     function (error) {
//       alert(JSON.stringify(error, undefined, 2));
//     });
// }


// =====================================




function start() {
  gapi.load('auth2', function () {
    auth2 = gapi.auth2.init({
      client_id: '875316385328-2as5p64ht38ssdcjmgui58bjnsl11go3.apps.googleusercontent.com', 
      scope: 'https://www.googleapis.com/auth/youtube.readonly',
      ux_mode: 'redirect',
      redirect_uri: 'http://localhost:3000/oauth2callback',
    });
    console.log(gapi.auth2);
  });
}

$('#signinButton').click(function () {
  // signInCallback defined in step 6.
  auth2.grantOfflineAccess().then(signInCallback);
});

function signInCallback(res){
  console.log(res);
  // if (res) {
  //       $.ajax({
  //         type: 'POST',
  //         url: 'http://localhost:3000/oauth2callback',
  //         // url: 'https://local.free.beeceptor.com/',
  //         headers: {
  //           'X-Requested-With': 'XMLHttpRequest'
  //         },
  //         dataType: 'json',
  //         contentType: 'application/json',
  //         success: function (result) {
  //           window.location.href = "http://localhost:3000/dashboard";
  //         },
  //         data: JSON.stringify(res),
  //       });
  //     } else {
  //         window.location.href = "http://localhost:3000/dashboard";
  //     }
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
    location.reload();
  });
}
