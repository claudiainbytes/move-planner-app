
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $("#street").val();
    var cityStr = $("#city").val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');

    // YOUR CODE GOES HERE!
    var streetviewURL = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '&key=AIzaSyDrU0pJnZxUiE65h29HHYD7yDsY721qXPI';
    $body.append('<img class="bgimg" src="' + streetviewURL + '" />');

    var articleNytUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + cityStr + "&sort=newest";
    articleNytUrl += '&' + $.param({
      'api-key': "9a666afbb9ad44389631e426a50ab906"
    });

    $.getJSON( articleNytUrl, function(data){
        var articles = data.response.docs;
        $nytHeaderElem.text('New York Times Articles about ' + cityStr );
        for (var i in articles) {
             $nytElem.append('<li><a href="'+ articles[i].web_url+'">' + articles[i].headline.main + '</a><p>' + articles[i].snippet + '<p></li>');
        }
    }).error(function(e){
        $nytHeaderElem.text('New York Times Articles about ' + cityStr + ' couldn\'t be changed' );
    });

    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';

    var wikiFail = setTimeout(function(){
        $wikiElem.text("Failed to get Wikipedia resources");
    }, 8000);

    // Using jQuery
    $.ajax( {
        url: wikiUrl,
        dataType: 'jsonp',
        success: function(data) {
            // do something with data
            var articles = data[1];
            $wikiElem.text('Wikipedia ' + cityStr + '\'s links');
            for (var i in articles) {
                 $wikiElem.append('<li><a href="https://en.wikipedia.org/wiki/'+ articles[i]+'">' + articles[i] + '</a></li>');
            }
            clearTimeout(wikiFail);
        }
    } );

    return false;
};

$(function() {
    loadData();
});

$('#form-container').submit(loadData);
