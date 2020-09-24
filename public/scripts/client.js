$(document).ready(function () {

  $("#password-copy-button").click(function(){
    $('#new-site-password-input').val($('#new-password-output').text())
  })
  // submit the foam for the password generate function
  $("#generate-password").on('submit', function (e) {
    e.preventDefault();
    let numCheck = $(".number").is(":checked") ? true : false;
    let lowercaseCheck = $(".lowercase").is(":checked") ? true : false;
    let uppercaseCheck = $(".uppercase").is(":checked") ? true : false;
    let specialCheck = $(".special-characters").is(":checked") ? true : false;
    const totalLength = $(this).find('.length').val();
    console.log('check generetor', numCheck, lowercaseCheck, uppercaseCheck, specialCheck)
    const result = generatedPassword(totalLength, numCheck, lowercaseCheck, uppercaseCheck, specialCheck);
    console.log(result);
    $(".password").text(result);
    $(".length").val('');
    $(".number").prop("checked", false);
    $(".lowercase").prop("checked", false);
    $(".uppercase").prop("checked", false);
    $(".special-characters").prop("checked", false);
  });

  // ////////////// DISPLAY WEBSITES \\\\\\\\\\\\\\\ \\
  $.ajax({
    url: '/websites/',
    method: 'GET',
    dataType: 'json',
    success: (websites) => {
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
  };

  // Create Website Element
  const createWebsiteElement = function (websiteData) {
    const website =`
      <div class="row row-cols-6">
        <div class="col credentials website-url"><a href="http://${websiteData.url}">${websiteData.url}</a></div>
        <div class="col credentials">${websiteData.loginname} <button type="button" id="copied" data-clipboard-target="#output" ><img src="./assets/copyClipboard@33.33x.png" class="copiedToClipboard"></button></div>
        <div class="col credentials">${websiteData.password} <button type="button" id="copied" data-clipboard-target="#output" ><img src="./assets/copyClipboard@33.33x.png" class="copiedToClipboard"></button></div>
        <div class="col credentials">${websiteData.category}</div>
        <div class="col credentials"><input type="hidden" id="websiteId" name="websiteId" value="${websiteData.id}" />
        <button type="button" class="btn btn-info" onClick="createEdit(${websiteData.id})" ><img src="./assets/edit-icon.png"></button></div>
        <div class="col credentials"><button type="button" class="btn btn-danger" onClick="deleteWebsite(${websiteData.id})" id="website-${websiteData.id}" ><img src="./assets/delete-icon.png"></button></div>
      </div>`
    console.log(websiteData);

    return website
  };

  // Edit feature for website
  createEdit = function(id) {
    if ($('.edit-container').find('#edit-website-button')) {
      $('#edit-form').empty();
    }
    console.log('website id is',id)
    const editScript = `
    <form id="edit-website-button" class="mx-auto">
        <h4>Edit Website Form</h4>
        <p class= >Fill-in the fields and click update to save your new credentials for a new site. You can use the pasword generator, and the copy to clipboard button</p>
        <div class="form-group">
          <input type="hidden" id="websiteId" name="websiteId" value="${id}" />
          <label>Change site URL</label>
          <input type="text" class="form-control" name="url">
        </div>
        <div class="form-group">
          <label>User Login Details</label>
          <input type="text" class="form-control" name="loginname">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="text" class="form-control" name="password">
        </div>
        <div class="form-group">
          <label>Website Category</label>
          <input type="text" class="form-control" name="category">
        </div>
        <button type="submit" class="btn btn-danger" id="edit-submit-button"> Update </button>
      </form>`;

      $('#edit-form').append(editScript);

      $("#edit-website-button").submit(function (e) {
        e.preventDefault();
        const formData = $('#edit-website-button').serialize();
        console.log('what is form Data', formData);
        $.ajax({
          url: '/websites/' + id,
          type: 'PATCH',
          cache: false,
          data: formData,
          success: function (data) {
            console.log('success',data);
            $('#edit-form').empty();
            window.location='/new'
          }
          , error: function (textStatus, err) {
            alert('text status ' + textStatus + ', err ' + err)
          }
        })
      })
  };

  // Delete Website
  deleteWebsite = function(url_id) {
    $.ajax({
      type: "DELETE",
      url: '/websites/' + url_id,
      data: { _method: 'delete' },
      success: function (data) {
        console.log(data);
        window.location='/new';
      },
      error: function (data) {
        console.log('Error:', data);
      }
    });
  };

  // Add new website for user
  $('#new-website').submit(function (ev) {
    ev.preventDefault();
    const formData = $('#new-website').serialize();
    $.ajax({
      url: '/websites',
      type: 'POST',
      cache: false,
      data: formData,
      success: function (data) {
        window.location='/new'
      }
      , error: function (textStatus, err) {
        alert(textStatus.responseJSON.error)
      }
    })
  })

  $('#register-form').submit(function (ev) {
    ev.preventDefault();
    const formData = $('#register-form').serialize();
    $.ajax({
      url: '/user',
      type: 'POST',
      cache: false,
      data: formData,
      success: function (data) {
        window.location='/new'
        alert('Success!')
      }
      , error: function (textStatus, err) {
        alert('text status ' + textStatus + ', err ' + err)
      }
    })
  });

  $('#login-form').submit(function (ev) {
    ev.preventDefault();
    const formData = $('#login-form').serialize();
    $.ajax({
      url: '/user/login',
      type: 'POST',
      cache: false,
      data: formData,
      success: function (data) {
        window.location='/new'
      }
      , error: function (textStatus, err) {
        alert('text status ' + textStatus + ', err ' + err)
      }
    })
  });

  $('#logout-btn').click(function () {
    $.ajax({
      url: '/user/logout',
      type: 'POST',
      cache: false,
      success: function (data) {
        window.location='/'
      }
      , error: function (textStatus, err) {
        alert('text status ' + textStatus + ', err ' + err)
      }
    })  })

    $('#login-btn-dynamic').click(function(){
      window.location='/';
   })

});

