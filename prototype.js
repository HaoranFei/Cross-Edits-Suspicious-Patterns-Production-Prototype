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
const fetch = require('node-fetch');

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var url = "https://en.wikipedia.org/w/api.php?origin=*";
var window_size = 10;
var baseline = 0.3;
var percentage = 0.5;
var margin = baseline * percentage;
var warning_timeframe = 0; //Timeframe to get previous warnings to determine blocks
var warning_threshold = 3;
/*
var sample_edit_params = {
    title: "Donald Trump",
    author: "Chaheel Riens",
    wikiRevId: 967788714,
    timestamp: "2020-07-15T09:22:15Z",
};
*/
var sample_revID = 967788714;
function setUpDecisionLog() {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            db = undefined;
            return [2 /*return*/, db];
        });
    });
}
/*
  Queries the MediaWiki API to get the article title and author ID from revision ID.
*/
function getUserAndTitle(revID) {
    return __awaiter(this, void 0, void 0, function () {
        var this_url, params, response, response_json, pages_object, v, page_object, title, author, timestamp, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this_url = url;
                    params = {
                        action: "query",
                        format: "json",
                        prop: "info|revisions",
                        revids: revID
                    };
                    Object.keys(params).forEach(function (key) { this_url += "&" + key + "=" + params[key]; });
                    return [4 /*yield*/, fetch(this_url)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    response_json = _a.sent();
                    pages_object = response_json.query.pages;
                    for (v in pages_object) {
                        page_object = pages_object[v];
                    }
                    title = page_object.title;
                    author = page_object.revisions[0].user;
                    timestamp = page_object.revisions[0].timestamp;
                    results = {
                        title: title,
                        author: author,
                        timestamp: timestamp
                    };
                    return [2 /*return*/, results];
            }
        });
    });
}
function findEditHistoryAuthor(edit_params_promise) {
    return __awaiter(this, void 0, void 0, function () {
        var edit_params, title, author, timestamp, this_url, params, response, response_json, edits_by_article, edits_list, page, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, edit_params_promise];
                case 1:
                    edit_params = _a.sent();
                    title = edit_params.title;
                    author = edit_params.author;
                    timestamp = edit_params.timestamp;
                    this_url = url;
                    params = {
                        action: "query",
                        format: "json",
                        list: "allrevisions",
                        arvuser: author,
                        arvstart: timestamp,
                        arvlimit: window_size,
                        arvprop: "oresscores|timestamp"
                    };
                    Object.keys(params).forEach(function (key) { this_url += "&" + key + "=" + params[key]; });
                    return [4 /*yield*/, fetch(this_url)];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    response_json = _a.sent();
                    edits_by_article = response_json.query.allrevisions;
                    edits_list = [];
                    for (page in edits_by_article) {
                        edits_list.push(edits_by_article[page].revisions[0]);
                    }
                    results = {
                        title: title,
                        author: author,
                        edits_list: edits_list
                    };
                    return [2 /*return*/, results];
            }
        });
    });
}
function displayWarningChoice() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            //Returns whether the reviewer agrees on issuing a warning
            return [2 /*return*/, true];
        });
    });
}
function displayBlockChoice() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            //Returns whether the reviewer agrees on issuing a block
            return [2 /*return*/, true];
        });
    });
}
function sendWarningMessage(recipient) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
}
function sendBlockMessage(recipient) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
}
function getRecipientForBlock() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ""];
        });
    });
}
function getPreviousWarnings(user_id, end_timestamp) {
    //Not yet implemented
    return [];
}
function writeNewDecision(user_id, title, type, timestamp, recipient_id, start_window, avg_score) {
    return;
}
function getScoreAndProcess(props_and_edits_list_promise) {
    return __awaiter(this, void 0, void 0, function () {
        var props_and_edits_list, title, author, edits_list, scores, i, window_start, window_end, avg, diff, warnings, decision, type, recipient, result_string;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, props_and_edits_list_promise];
                case 1:
                    props_and_edits_list = _a.sent();
                    title = props_and_edits_list.title;
                    author = props_and_edits_list.author;
                    edits_list = props_and_edits_list.edits_list;
                    scores = new Array(Math.max(window_size, edits_list.length));
                    for (i = 0; i < scores.length; i++) {
                        //Only take ORES_DAMAGING score 
                        scores[i] = edits_list[i].oresscores.damaging["true"];
                    }
                    window_start = edits_list[window_size - 1].timestamp;
                    window_end = edits_list[0].timestamp;
                    avg = scores.reduce(function (acc, e) { return acc + e; }, 0) / scores.length;
                    diff = avg - baseline;
                    if (!(diff > margin)) return [3 /*break*/, 6];
                    warnings = getPreviousWarnings(author, window_end);
                    if (!(warnings.length > warning_threshold)) return [3 /*break*/, 4];
                    type = "block";
                    decision = displayBlockChoice();
                    if (!decision) return [3 /*break*/, 3];
                    return [4 /*yield*/, getRecipientForBlock()];
                case 2:
                    recipient = _a.sent();
                    sendBlockMessage(recipient);
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    type = "warning";
                    decision = displayWarningChoice();
                    if (decision) {
                        recipient = author;
                        sendWarningMessage(recipient);
                    }
                    _a.label = 5;
                case 5:
                    writeNewDecision(author, title, type, window_end, recipient, window_start, avg);
                    return [3 /*break*/, 7];
                case 6:
                    console.log("Author " + author + "is not engaged in suspicious behavior.");
                    _a.label = 7;
                case 7:
                    result_string = "";
                    result_string += "Title: " + title + " Author: " + author + "\n";
                    result_string += "Avg Score is: " + avg + " Difference from baseline is: " + diff + "\n";
                    result_string += "Starting time of window is: " + window_start + "\n";
                    result_string += "Ending time of window is: " + window_end + "\n";
                    console.log(result_string);
                    return [2 /*return*/];
            }
        });
    });
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
