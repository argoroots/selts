$(function() {
    $(window).on('resize', function () {
        var height = window.innerHeight

        if (window.innerWidth < 767 || window.location.pathname !== '/') {
            $('#header').css('margin-top', '50px')
        } else {
            $('#header').css('margin-top', height / 3 + 'px')
        }

        if (window.innerWidth < 767) {
            $('#frontpage-navigation, #navigation').removeClass('list-inline')
        } else {
            $('#frontpage-navigation, #navigation').addClass('list-inline')
        }

        $('#content').css('margin-bottom', height + 'px')
        $('.news-img').css('height', height + 'px')
    }).resize()

    if ($('.news-img').length > 0) {
        $(window).on('scroll', function () {
            if ($(window).scrollTop() < $('#content').position().top + $('#content').height()) {
                $('#news-images').css('top', $(window).scrollTop() + 'px')
                console.log($(window).scrollTop())
            }
        }).scroll()
    }

    $('#footer').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 200)
    })
})
