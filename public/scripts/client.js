$(document).ready(function() {
  console.log('test')

  const workCheck = () => {
    $.ajax({
      url: '/new',
      method: 'GET',
      dataType: 'json',
      success: (posts) => {
        console.log(posts);
      },
      error: (error) => {
        console.error(error);
      }
    });
  };

  workCheck();

  // submit the foam for the password generate function
  $("#generate-password").on('submit',function(e) {
    e.preventDefault();
    let numCheck = $(".number").is(":checked") ? "true" : "false";
    let lowercaseCheck = $(".lowercase").is(":checked") ? "true" : "false";
    let uppercaseCheck = $(".uppercase").is(":checked") ? "true" : "false";
    let specialCheck = $(".special-characters").is(":checked") ? "true" : "false";
    const totalLength = $(this).find('.length').val();
    const result = generatedPassword(totalLength, numCheck, lowercaseCheck, uppercaseCheck, specialCheck);
    console.log(result);
    $(".password").text(result);
    $(".length").val('');
    $(".number").prop("checked", false);
    $(".lowercase").prop("checked", false);
    $(".uppercase").prop("checked", false);
    $(".special-characters").prop("checked", false);
  } )

  const webCheck = () => {
    $.ajax({
      url: '/websites',
      method: 'GET',
      dataType: 'json',
      success: (posts) => {
        console.log(posts);
      },
      error: (error) => {
        console.error(error);
      }
    });
  };

  webCheck();







  // ////////////// DISPLAY WEBSITES \\\\\\\\\\\\\\\ \\
const data = [
  {'url': 'www.dffg.com',
'loginName': 'asdf',
'password': 'mnbv',
'category': 'fun'}
]

  $.ajax({
    url: '/websites/',
    method: 'GET',
    dataType: 'json',
    success: (websites) => {
      console.log('Checking websites',websites);
      displayWebsites(websites.websites);
    },
    error: (error) => {
      console.error(error);
    }
  });


  // Display Webiste Function

  const displayWebsites = function (websites) {
    for (const website of websites) {
      const item_created = createWebsiteElement(website);
      $('.websites-display').append(item_created);
    }
  }



  // Create Website Element
  const createWebsiteElement = function (websiteData) {
    const website =`
      <div class="row row-cols-4">
        <div class="col credentials">${websiteData.url}</div>
        <div class="col credentials">${websiteData.loginName}</div>
        <div class="col credentials">${websiteData.password}</div>
        <div class="col credentials">${websiteData.category}</div>
      </div>`
      // console.log(websiteData);
    return website
  }

  displayWebsites(data)

  // POST the form for the new webistes
//  $("#new-website").on('submit', function (event) {
//   event.preventDefault();
//   console.log(event)
//   const serializedWebsiteForm= $(this).serialize();
//   $.post('/websites/', serializedWebsiteForm)
//     .then ((response) => {
//     console.log(response)
//       loadWebsites()
//     })
//   });

  // GET request for websites
  const loadWebsites = () => {
    $.get('/websites', (websites) => {
      displayWebsites(websites);
    });
  };
  loadWebsites()




});

