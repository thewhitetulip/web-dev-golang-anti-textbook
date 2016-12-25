/*

This is a javascript file for omninotesweb
============

Author:  Suraj patil
Updated: January 2015
keyCode: n-110
*/

$(document).ready(function(){

  /*on() is used instead of click because click can be used only on static elements, and on() is to be used when you add
  elements dynamically*/
  $('[data-toggle="tooltip"]').tooltip();
//    
//    $('.items').openOnHover(function(){
//        alert();
//    });

  $('.floating-action-icon-add').click(function(){
    $('#addNoteModal').modal('show');
  });
  
  // $("#datepicker").datepicker();
  
  $('#editCatFrmBtn').click(function(){
     $('#EditForm').toggleClass('hidden') 
  });
  
  $('#searchFormBtn').click(function(){
     $('#SearchForm').toggleClass('hidden') 
  });
  
  $('#toggleAddFileGrp').click(function(){
     $('#file-group').toggleClass('hidden');
     $('#toggleAddFileGrp').addClass('hidden') ;
  });  
  
  $("#noti").click(
      function(){
          this.fadeOut();
      }  
  );
  if ($('#actlMsg').html()==''){
     $('.notification').addClass('hidden');
  } else {
    $('.notification').fadeOut(9000);
  }
  $('.btnMessage').click(function(){$('.notification').fadeOut()})

   /*$( document ).keypress(
     function(event){
       if ( event.which == 110 ) { //bind the 'n' key to add note
           $('#addNoteModal').modal('show');
        }

        if (event.which==109  ) { //binds the 'm' key to show the navigation drawer
          $('.sidebar-toggle').click();
        }
     }
   );*/
   
   $("#addNoteBtn").on("click", function() {
       this.preventDefaults();
        var task_id = $("#task-id").val();
        $.ajax({
            url: "/tasks/" + task_id,
            type: "POST",
	    data: {'title':'randome note', 'content':'this and that'}
        }).done(function(res, status) {
            console.log(status, res);
	    var response = res
	    $("#timeline").append(response)
        });
    });


$('.toggle').click(function(){
     $(this).next().toggle();
   });
});
