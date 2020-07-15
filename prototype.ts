/**
  Copyright 2019 Google LLC

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
**/

const url = "https://en.wikipedia.org/w/api.php?origin=*";
const window_size:number = 10;
const baseline = 0.3;
const percentage = 0.5
const margin = baseline * percentage;
const warning_timeframe = 0; //Timeframe to get previous warnings to determine blocks
const warning_threshold = 3;


var sample_edit_params = {
    title: "Donald Trump",
    author: "Chaheel Riens",
    wikiRevId: 967788714,
    timestamp: "2020-07-15T09:22:15Z",
};

async function setUpDecisionLog() {
    //Placeholder
    var db = undefined;
    return db;
}


/*
  Queries the MediaWiki API to get the article title and author ID from revision ID.
*/
/*
async function getUserAndTitle(revID){
    var this_url = url;
    var params = {
        action: "query",
        format: "json",
        prop: "revisions",
        rvslots: "main",
        formatversion: "2",
        rvprop: "timestamp|user|comment|content",
        rvstartid: revID,
        rvendid: revID,
    }
    Object.keys(params).forEach(function(key){this_url += "&" + key + "=" + params[key];});
    console.log(this_url);
    var promise = fetch(this_url).then(function (response){return response.json();}).then(
        function(response) {
            var page = response.query.pages[0];
            var title = page.title;
            var author = page.revisions[0].user;
            var timestamp = page.revisions[0].timestamp;
            return [title, author, timestamp];
        })
    var result_list = await promise;
    return result_list;
}
*/

async function findEditHistoryAuthor(edit_params){
    var title = edit_params.title;
    var author = edit_params.author;
    var timestamp = edit_params.timestamp;
    //console.log("Title is: " + title);
    //console.log("Author is: " + author);
    //console.log("Timestamp is: " + timestamp);

    var this_url = url;
    var params = {
        action: "query",
        format: "json",
        list: "allrevisions",
        arvuser: author,
        arvstart: timestamp,
        arvlimit: window_size,
        arvprop: "oresscores|timestamp",
    }
    Object.keys(params).forEach(function(key){this_url += "&" + key + "=" + params[key];});
    //console.log(this_url);
    var response = await fetch(this_url);
    var response_json = await response.json();
    //console.log("Now Displaying the JSON response")
    //console.log(response_json);
    var edits_by_article = response_json.query.allrevisions;
    //console.log("Now displaying the edits")
    //console.log(edits_by_article);
    var edits_list = [];
    for (var page in edits_by_article) {
        edits_list.push(edits_by_article[page].revisions[0]);
    }
    //console.log("Now displaying the extracted edit list");
    //console.log(edits_list);
 
    var results = {
        title: title,
        author: author,
        edits_list: edits_list,
    }
    return results;
}

async function displayWarningChoice() {
    //Returns whether the reviewer agrees on issuing a warning
    return true;
}

async function displayBlockChoice() {
    //Returns whether the reviewer agrees on issuing a block
    return true;
}

async function sendWarningMessage(recipient){
    return;
}

async function sendBlockMessage(recipient){
    return;
}

async function getRecipientForBlock(){
    return ""
}

function getPreviousWarnings(user_id, end_timestamp) {
    //Not yet implemented
    return [];
}

function writeNewDecision(user_id, title, type, timestamp, recipient_id, start_window, avg_score) {
    return;
}

async function getScoreAndProcess(props_and_edits_list_promise){
    var props_and_edits_list = await props_and_edits_list_promise;
    var title = props_and_edits_list.title;
    var author = props_and_edits_list.author;
    var edits_list = props_and_edits_list.edits_list;
    //console.log("Retrieved Edits List is: ");
    //console.log(edits_list);

    var scores = new Array(Math.max(window_size, edits_list.length));
    for (var i = 0; i < scores.length; i++) {
        //Only take ORES_DAMAGING score 
        scores[i] = edits_list[i].oresscores.damaging.true;
    }

    var window_start = edits_list[window_size-1].timestamp;
    var window_end = edits_list[0].timestamp;
    var avg = scores.reduce((acc, e) => acc + e, 0) / scores.length;
    var diff = avg - baseline;
    
    if(diff > margin) {
        var warnings = getPreviousWarnings(author, window_end);
        var decision;
        var type;
        var recipient;
        if (warnings.length > warning_threshold) {
            type = "block";
            decision = displayBlockChoice();
            if (decision) {
                recipient = await getRecipientForBlock();
                sendBlockMessage(recipient);
            }
        }else{
            type = "warning";
            decision = displayWarningChoice();
            if (decision) {
                recipient = author;
                sendWarningMessage(recipient);
            }
        }
        writeNewDecision(author, title, type, window_end, recipient, window_start, avg);
    }else{
        console.log("Author " + author + "is not engaged in suspicious behavior.");
    }

    //Display on prototype.html
    var result_string = "";
    result_string += "Title: " + title + " Author: " + author + "\n";
    result_string += "Avg Score is: " + avg + " Difference from baseline is: " + diff + "\n";
    result_string += "Starting time of window is: " + window_start +"\n"; 
    result_string += "Ending time of window is: " + window_end + "\n";
    console.log(result_string);
    //document.body.textContent = result_string;
}

function main() {
    setUpDecisionLog();
    //console.log("First Step Finished");
    var params_and_history = findEditHistoryAuthor(sample_edit_params);
    //console.log("Second Step Finished");
    getScoreAndProcess(params_and_history);
}

main();

