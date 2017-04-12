$(function() {
    if ($('body').css('background-image') === 'none') {
        $('body').css('background-image', "url('/assets/images/bg/" + Math.ceil(Math.random() * 8) + ".jpg')")
    }

    $('#fullpage').fullpage({
        scrollOverflow: true,
        navigation: true,
        navigationPosition: 'right',
    })
})
