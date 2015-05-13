var sourceLang = "";
var destinationLang = "";
var sourceTopic = "";

var getData = function () {
    sourceLang = document.getElementById("sltSource").value;
    destinationLang = document.getElementById("sltDestination").value;
    sourceTopic = document.getElementById("txtSource").value;
}

var translate = function () {
    getData();
    document.getElementById("lblSuggestion").innerHTML = "";
    if (sourceTopic == "" || sourceLang == destinationLang) {
        document.getElementById("lblSuggestion").innerHTML = "Topic must not be empty, and source and destination languages must be different."
        return;
    }

    var requestURL = "https://" + sourceLang + ".wikipedia.org/w/api.php?action=query&prop=langlinks&lllimit=500&format=json&llprop=url&titles=" + sourceTopic;
//    console.log(requestURL);
    var request = new XMLHttpRequest();
    request.open("GET", requestURL, false);
    request.send();
    var result = request.responseText;
//    console.log(result);

    var resultJSON = JSON.parse(result);
    var currentPage = resultJSON.query.pages;
    for (var i in currentPage) {
        if (i == -1) {
//            no page with that name, do a search and then return suggestion
//            console.log("No page with that name");
            document.getElementById("lblSuggestion").innerHTML = "No topic with that name. These are some suggestions: <br>";
            var searchURL = "http://" + sourceLang + ".wikipedia.org/w/api.php?action=query&list=search&srlimit=10&format=json&srsearch=" + sourceTopic;
            var search = new XMLHttpRequest();
            search.open("GET", searchURL, false);
            search.send();
            var searchResult = search.responseText;
            var searchResultJSON = JSON.parse(searchResult);
            var suggestions = searchResultJSON.query.search;
            for (var j in suggestions) {
                document.getElementById("lblSuggestion").innerHTML += suggestions[j].title + "<br>";
            }
        }
        else {
//            there is a page with that name, find suitable langlink
            var langlinks = currentPage[i].langlinks;
            var languageFound = false;
            for (var j in langlinks) {
//                console.log(langlinks[j]);
                if (langlinks[j].lang == destinationLang) {
//                    suitable language available
//                    console.log("Language found");

                    var ll=langlinks[j];
                    var name = ll["*"];
//                    consider the probability of unescaping unicode characters
                    var url = ll.url;
                    document.getElementById("lblDestination").innerHTML = "<a href=" + "\"" + url + "\">" + name + "</a>";

                    languageFound = true;
                    break;
                }
            }
            if (languageFound == false) {
//                language not found
//                console.log("language not found");
                document.getElementById("lblDestination").innerHTML = "Topic was found in original language, but corresponding topic in destination language is unavailable.";
            }
        }
    }


}

document.getElementById("btnTranslate").addEventListener("click", translate);
