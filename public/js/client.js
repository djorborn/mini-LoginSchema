var register_form = document.getElementById('register_form');

function checkUsernameAvailability(username){
  $.ajax('/check_username_availability', {
    type: 'POST',
    data: {'username': username},
    success: function(reply){
      if(reply.availability === "available"){
        availability_span.innerHTML = '<label class="tooltip"><i class="material-icons w3-theme-d1">check</i><div class="tooltiptext">Username Available</div></label>';
      } else {
        availability_span.innerHTML = '<label class="tooltip"><i class="material-icons" style="color: red;">error</i><div class="tooltiptext">Username Unavailable</div></label>';
      }
    }
  })
}

function deleteAccount(){
  $.ajax('/delete_account', {
    type: 'POST',
    success: function(reply){
      if(reply){
        window.location = "/";
      }
    }
  })
}
