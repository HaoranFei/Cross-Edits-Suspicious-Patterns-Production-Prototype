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
var CESP_Test = /** @class */ (function () {
    function CESP_Test(info) {
        this.url = info.url;
        this.window_size = info.window_size;
        this.baseline = info.baseline;
        this.percentage = info.percentage;
        this.margin = info.margin;
        this.warning_timeframe = info.warning_timeframe; //Timeframe to get previous warnings to determine blocks, in days
        this.warning_threshold = info.warning_threshold;
        this.revID_list = info.revID_list;
        this.db = {};
    }
    CESP_Test.prototype.sleep = function (milliseconds) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, milliseconds); })];
            });
        });
    };
    CESP_Test.prototype.resetDecisionLog = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                //Simulating a real database in demo 
                this.db = {};
                return [2 /*return*/];
            });
        });
    };
    /*
      Queries the MediaWiki API to get the article title and author ID from revision ID.
    */
    CESP_Test.prototype.getUserAndTitle = function (revID) {
        return __awaiter(this, void 0, void 0, function () {
            var this_url, params, response, response_json, pages_object, v, page_object, title, author, timestamp, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this_url = this.url;
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
                        console.log("Loaded metadata for revision ID: " + revID);
                        return [2 /*return*/, results];
                }
            });
        });
    };
    CESP_Test.prototype.findEditHistoryAuthor = function (edit_params_promise) {
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
                        this_url = this.url;
                        params = {
                            action: "query",
                            format: "json",
                            list: "allrevisions",
                            arvuser: author,
                            arvstart: timestamp,
                            arvlimit: this.window_size,
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
                        console.log("Retrieved past " + edits_list.length + " edits for author " + author);
                        return [2 /*return*/, results];
                }
            });
        });
    };
    CESP_Test.prototype.displayWarningChoice = function (userID) {
        //Returns whether the reviewer agrees on issuing a warning
        console.log("Choice displayed to reviewer on whether to warn " + userID);
        return true;
    };
    CESP_Test.prototype.displayBlockChoice = function (userID) {
        //Returns whether the reviewer agrees on issuing a block
        console.log("Choice displayed to reviewer on whether to block " + userID);
        return true;
    };
    CESP_Test.prototype.sendWarningMessage = function (recipient) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("Warning message sent to " + recipient + "\n");
                return [2 /*return*/];
            });
        });
    };
    CESP_Test.prototype.sendBlockMessage = function (recipient) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("Block message sent to " + recipient + "\n");
                return [2 /*return*/];
            });
        });
    };
    CESP_Test.prototype.getRecipientForBlock = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, "Block_Recipient_Placeholder"];
            });
        });
    };
    CESP_Test.prototype.getPreviousWarnings = function (user_id, end_timestamp) {
        if (!(user_id in this.db)) {
            return [];
        }
        else {
            var events_by_user = this.db[user_id];
            var events_before_end = events_by_user.filter(function (edit) {
                var warning_period_start = new Date(end_timestamp);
                warning_period_start.setDate(warning_period_start.getDate() - this.warning_timeframe);
                var warning_period_end = new Date(end_timestamp);
                var this_edit_time = new Date(edit.timestamp);
                return (this_edit_time > warning_period_start && this_edit_time < warning_period_end);
            });
            console.log("Get " + events_before_end.length + " past events for " + user_id + "\n");
            return events_before_end;
        }
    };
    CESP_Test.prototype.writeNewDecision = function (user_id, title, type, timestamp, recipient_id, start_window, avg_score) {
        var decision_object = {
            user_id: user_id,
            title: title,
            timestamp: timestamp,
            recipient_id: recipient_id,
            start_window: start_window,
            avg_score: avg_score
        };
        if (!(user_id in this.db)) {
            this.db[user_id] = [decision_object];
        }
        else {
            this.db[user_id].push(decision_object);
        }
        console.log("Suspicious event of type " + type + " logged for " + user_id + " at " + timestamp + "\n");
    };
    CESP_Test.prototype.getScoreAndProcess = function (props_and_edits_list_promise) {
        return __awaiter(this, void 0, void 0, function () {
            var props_and_edits_list, title, author, edits_list, scores, i, missing_score_string, window_start, window_end, avg, diff, warnings, decision, type, recipient, result_string;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, props_and_edits_list_promise];
                    case 1:
                        props_and_edits_list = _a.sent();
                        title = props_and_edits_list.title;
                        author = props_and_edits_list.author;
                        edits_list = props_and_edits_list.edits_list;
                        scores = new Array(Math.max(this.window_size, edits_list.length));
                        for (i = 0; i < scores.length; i++) {
                            //Only take ORES_DAMAGING score 
                            //If ORES Scores are missing, skip this edit entirely. 
                            if (edits_list[i].oresscores.damaging == undefined) {
                                missing_score_string = "";
                                missing_score_string += "Title: " + title + " Author: " + author + "\n";
                                missing_score_string += "ORES Scores are missing. Hence no detection is performed. \n";
                                missing_score_string += "Timestamp: " + edits_list[0].timestamp + "\n";
                                console.log(missing_score_string);
                                return [2 /*return*/];
                            }
                            scores[i] = edits_list[i].oresscores.damaging["true"];
                        }
                        window_start = edits_list[this.window_size - 1].timestamp;
                        window_end = edits_list[0].timestamp;
                        avg = scores.reduce(function (acc, e) { return acc + e; }, 0) / scores.length;
                        diff = avg - this.baseline;
                        if (!(diff > this.margin)) return [3 /*break*/, 6];
                        warnings = this.getPreviousWarnings(author, window_end);
                        if (!(warnings.length > this.warning_threshold)) return [3 /*break*/, 4];
                        type = "block";
                        decision = this.displayBlockChoice(author);
                        if (!decision) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getRecipientForBlock()];
                    case 2:
                        recipient = _a.sent();
                        this.sendBlockMessage(recipient);
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        type = "warning";
                        decision = this.displayWarningChoice(author);
                        if (decision) {
                            recipient = author;
                            this.sendWarningMessage(recipient);
                        }
                        _a.label = 5;
                    case 5:
                        this.writeNewDecision(author, title, type, window_end, recipient, window_start, avg);
                        return [3 /*break*/, 7];
                    case 6:
                        console.log("Author " + author + "is not engaged in suspicious behavior.");
                        _a.label = 7;
                    case 7:
                        result_string = "";
                        result_string += "Title: " + title + " Author: " + author + "\n";
                        result_string += "Avg ORES Damaging score is: " + avg.toFixed(2) + "\n";
                        result_string += "Difference from baseline score is: " + diff.toFixed(2) + "\n";
                        result_string += "Starting time of window is: " + window_start + "\n";
                        result_string += "Ending time of window is: " + window_end + "\n";
                        console.log(result_string);
                        return [2 /*return*/];
                }
            });
        });
    };
    CESP_Test.prototype.run_test = function (revID) {
        var sample_edit_params = this.getUserAndTitle(revID);
        var params_and_history = this.findEditHistoryAuthor(sample_edit_params);
        this.getScoreAndProcess(params_and_history);
        console.log("Executed test for revision ID: " + revID);
    };
    CESP_Test.prototype.run_all = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.resetDecisionLog();
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.revID_list.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.run_test(this.revID_list[i])];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.sleep(3000)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return CESP_Test;
}());
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var test_case_one_info, test_case_one;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    test_case_one_info = {
                        url: "https://en.wikipedia.org/w/api.php?origin=*",
                        window_size: 10,
                        baseline: 0.3,
                        percentage: 0.5,
                        margin: 0.15,
                        warning_timeframe: 3,
                        warning_threshold: 3,
                        revID_list: [967788714, 845591562, 820220399, 797070597, 784455460, 761250919, 760592760, 760592487, 738223561, 694525673]
                    };
                    test_case_one = new CESP_Test(test_case_one_info);
                    return [4 /*yield*/, test_case_one.run_all()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main();
