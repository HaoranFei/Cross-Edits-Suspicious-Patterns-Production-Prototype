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
const warning_timeframe = 3; //Timeframe to get previous warnings to determine blocks, in days
const warning_threshold = 3;

/*
var sample_edit_params = {
    title: "Donald Trump",
    author: "Chaheel Riens",
    wikiRevId: 967788714,
    timestamp: "2020-07-15T09:22:15Z",
};
*/

var sample_revID = 967788714;
var db;

async function setUpDecisionLog() {
    //Simulating a real database in demo 
    db = {};
}


/*
  Queries the MediaWiki API to get the article title and author ID from revision ID.
*/

async function getUserAndTitle(revID){
    var this_url = url;
    var params = {
        action: "query",
        format: "json",
        prop: "info|revisions",
 		revids: revID,
    }
    Object.keys(params).forEach(function(key){this_url += "&" + key + "=" + params[key];});
    var response = await fetch(this_url);
    var response_json = await response.json();
    
    var pages_object = response_json.query.pages;
    for (var v in pages_object) {
    	var page_object = pages_object[v];
    }

    var title = page_object.title;
    var author = page_object.revisions[0].user;
    var timestamp = page_object.revisions[0].timestamp;
    var results = {
    	title: title,
    	author: author,
    	timestamp: timestamp,
    }
    return results;
}


async function findEditHistoryAuthor(edit_params_promise){
	var edit_params = await edit_params_promise;
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
    
    if(!(user_id in db)) {
    	return [];
    }else{
    	var edits_by_user = db[user_id];
    	var edits_before_end = edits_by_user.filter(function(edit){
    		var warning_period_start = new Date(end_timestamp);
    		warning_period_start.setDate(warning_period_start.getDate() - warning_timeframe);
    		var warning_period_end = new Date(end_timestamp);
    		var this_edit_time = new Date(edit.timestamp);
    		return (this_edit_time > warning_period_start && this_edit_time < warning_period_end); 
    	});
    	return edits_before_end;
    }
}

function writeNewDecision(user_id, title, type, timestamp, recipient_id, start_window, avg_score) {
	var decision_object = {
		user_id: user_id,
		title: title,
		timestamp: timestamp,
		recipient_id: recipient_id,
		start_window: start_window,
		avg_score: avg_score,
	}
    if(!(user_id in db)) {
    	db[user_id] = [decision_object];
    }else {
    	db[user_id].push(decision_object);
    }
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
    var sample_edit_params = getUserAndTitle(sample_revID);
    var params_and_history = findEditHistoryAuthor(sample_edit_params);
    //console.log("Second Step Finished");
    getScoreAndProcess(params_and_history);
}

main();

