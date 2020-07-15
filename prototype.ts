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

var wikiRevId = ;

async function setUpDecisionLog() {
    //Placeholder
    var db = undefined;
    return db;
}


/*
  Queries the MediaWiki API to get the article title and author ID from revision ID.
*/
async function getUserAndTitle(revID){
    var this_url = url;
    var params = {
        action: "query",
        format: "json",
        prop: "revisions",
        rvprop: "timestamp|user|comment|content",
        rvstartid: revID,
        rvendid: revID,
    }
    Object.keys(params).forEach(function(key){this_url += "&" + key + "=" + params[key];});
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

async function findEditHistoryAuthor(edit_params){
    var author = edit_params[1];
    var timestamp = edit_params[2];
    var this_url = url;
    var params = {
        action: "query",
        format: "json",
        list: "allrevisions",
        arvuser: author,
        arvstart: timestamp,
        arvlimit: window_size,
    }
    Object.keys(params).forEach(function(key){this_url += "&" + key + "=" + params[key];});
    var next_promise = fetch(this_url).then(function (response){return response.json();}).then(
        function(response) {
            var edits_by_article = response.query.allrevisions;
            var edits_list = [];
            for (var page in edits_by_article) {
                edits_list.concat(edits_by_article[page].revisions);
            }
            return edits_list;
        })
    var result_edit_list = await next_promise;
    return [author, result_edit_list];
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

async function getScoreAndProcess(author_and_edits_list){
    //Placeholder. Replace this with real code to retrieve ORES scores later.
    var scores = new Array(window_size);
    for (var i = 0; i < scores.length; i++) {
        scores[i] = 0.8;
    }

    var author = author_and_edits_list[0];
    var edits_list = author_and_edits_list[1];
    var window_start = edits_list[window_size-1].timestamp;
    var window_end = edits_list[0].timestamp;
    var avg = scores.reduce((acc, e) => acc + e, 0) / scores.length;
    var diff = avg - baseline;
    //Not yet handled
    var title = "";
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
    }
}

function main() {
    setUpDecisionLog();
    var author_and_title = getUserAndTitle(wikiRevId);
    var author_and_history = findEditHistoryAuthor(author_and_title);
    getScoreAndProcess(author_and_history);
}


