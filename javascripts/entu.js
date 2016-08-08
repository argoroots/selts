$(document).ready(function() {
    if(window.location.pathname == '/liikmed.html') {
        $.get('https://kunda.entu.ee/api2/entity-613/childs', function(data) {
            var asutajad = $.map(data.result.person.entities, function(n) {
                return n.name
            })
            $('#asutajad').html(asutajad.join(', '))
        }, 'JSON')
        $.get('https://kunda.entu.ee/api2/entity-624/childs', function(data) {
            var juhatus = $.map(data.result.person.entities, function(n) {
                return n.name
            })
            $('#juhatus').html(juhatus.join(', '))
        }, 'JSON')
        $.get('https://kunda.entu.ee/api2/entity-628/childs', function(data) {
            var liikmed = $.map(data.result.person.entities, function(n) {
                return n.name
            })
            $('#liikmed').html(liikmed.join(', '))
        }, 'JSON')
    }
})
