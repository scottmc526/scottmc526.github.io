$(document).ready(function (){

    $('.click').click(function (){
      var getter = $.ajax ({
        url: "https://randomuser.me/api/",
        method: 'GET',
        dataType: 'json'
      })
      getter.done(function (returned){
        var result = returned['results'][0]['user']['picture']['thumbnail'];
        var firstNamey = returned['results'][0]['user']['name']['first'];
        var lastNamey = returned['results'][0]['user']['name']['last'];


        $('.pic').empty().append('<img src="'+result+'"/>')
        $('.name').empty().append('<p class="person">'+firstNamey+' '+lastNamey+'</p>')
      })
    })

    $('.click2').click(function (){
      var getter = $.ajax ({
        url: "https://randomuser.me/api/",
        method: 'GET',
        dataType: 'json'
      })
      getter.done(function (returned){
        var result = returned['results'][0]['user']['picture']['thumbnail'];
        var firstNamey = returned['results'][0]['user']['name']['first'];
        var lastNamey = returned['results'][0]['user']['name']['last'];


        $('.pic2').empty().append('<img src="'+result+'"/>')
        $('.name2').empty().append('<p class="person">'+firstNamey+' '+lastNamey+'</p>')
      })
    })
})
