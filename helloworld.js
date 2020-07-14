function greeter(person) {
    return "Hello, " + person;
}
var user = "Jane User";
var url = "https://en.wikipedia.org/w/api.php";
var params = {
    action: "query",
    format: "json",
    list: "logevents",
    lelimit: "3",
    letitle: "Ocala, Florida"
};
url = url + "?origin=*";
Object.keys(params).forEach(function (key) { url += "&" + key + "=" + params[key]; });
var PromiseA = fetch(url).then(function (response) { return response.json(); }).then(function (response) {
    return response.query.logevents;
}).then(function (response) {
    var events = response;
    var first_event_type;
    var first_event_title;
    var c = 0;
    for (var l in events) {
        c = c + 1;
        first_event_type = events[l].type;
        first_event_title = events[l].title;
    }
    //document.body.textContent = greeter(user);
    document.body.textContent = " Type: " + first_event_type + " Title: " + first_event_title + " Number of Events: " + c;
})["catch"](function (error) { console.log(error); });
