var s4aExamples = {};
s4aExamples.init = function () {

    $.getJSON('test/examples.json', function (data) {
        if (data['length'] && data.length > 0) {

            var row = $('<div/>').attr('class', 'row');

            for (var i = 0; i < data.length; i++) {

                var example = data[i];

                var col = $('<div/>')
                        .attr('class', 'col-md-4')
                
                var panel = $('<div/>')
                        .attr('class', 'example-box panel panel-default')
                
                var panelBody = $('<div/>')
                        .attr('class', 'panel-body');

                var panelHeading = $('<div/>')
                        .attr('class', 'panel-heading')
                        .text(example.title);

                var desc = $('<div/>')
                        .attr('class', 'example-description')
                        .text(example.description);

                var link = $('<a/>').attr('class', 'btn btn-primary')
                        .attr('href', example.url)
                        .attr('role', 'button')
                        .html('View example &raquo;');

                panelBody
                        .append($('<p/>').append(desc))
                        .append($('<p/>').append(link));
                
                panel
                        .append(panelHeading)
                        .append(panelBody);

                col
                        .append(panel);
                
                row
                        .append(col);

                if ((i > 0 && ((i + 1) % 3 === 0)) || i === data.length - 1) {
                    console.log('appending row');
                    $('#examplesContainer').append(row);
                    row = $('<div/>').attr('class', 'row');
                }
            }
        }
    });

}
