"use strict";
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
exports.__esModule = true;
var CESP_Test_1 = require("./CESP_Test");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var test_case_one_info, test_case_one, test_case_two_info, test_case_two, this_url, params, response, response_json, pages, large_revID_list, page, this_revision_list, i, test_case_large_info, test_case_large, normal_revID_list, test_case_normal_info, test_case_normal, offending_revID_list, test_case_offending_info, test_case_offending;
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
                    test_case_one = new CESP_Test_1.CESP_Test(test_case_one_info);
                    test_case_two_info = {
                        url: "https://en.wikipedia.org/w/api.php?origin=*",
                        window_size: 10,
                        baseline: 0.0,
                        percentage: 0.0,
                        margin: 0.0,
                        warning_timeframe: 3,
                        warning_threshold: 3,
                        revID_list: [967788714, 967788714, 967788714, 967788714, 967788714]
                    };
                    test_case_two = new CESP_Test_1.CESP_Test(test_case_two_info);
                    this_url = "https://en.wikipedia.org/w/api.php?origin=*";
                    params = {
                        action: "query",
                        format: "json",
                        list: "allrevisions",
                        arvstart: "2020-07-15T09:22:15Z",
                        arvlimit: 100,
                        arvprop: "ids|timestamp"
                    };
                    Object.keys(params).forEach(function (key) { this_url += "&" + key + "=" + params[key]; });
                    return [4 /*yield*/, fetch(this_url, { headers: { "User-Agent": "WikiLoop DoubleCheck Team" } })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    response_json = _a.sent();
                    pages = response_json.query.allrevisions;
                    large_revID_list = [];
                    for (page in pages) {
                        this_revision_list = pages[page].revisions;
                        for (i = 0; i < this_revision_list.length; i++) {
                            large_revID_list.push(this_revision_list[i].revid);
                        }
                    }
                    test_case_large_info = {
                        url: "https://en.wikipedia.org/w/api.php?origin=*",
                        window_size: 10,
                        baseline: 0.0,
                        percentage: 0.0,
                        margin: 0.1,
                        warning_timeframe: 3,
                        warning_threshold: 3,
                        revID_list: large_revID_list
                    };
                    test_case_large = new CESP_Test_1.CESP_Test(test_case_large_info);
                    normal_revID_list = [967788714, 967788713, 967788712, 967788660, 967788711, 967788655,
                        967788710, 967788709, 967788708, 967788707, 967788705, 967788706];
                    test_case_normal_info = {
                        url: "https://en.wikipedia.org/w/api.php?origin=*",
                        window_size: 10,
                        baseline: 0.0,
                        percentage: 0.0,
                        margin: 0.1,
                        warning_timeframe: 3,
                        warning_threshold: 3,
                        revID_list: normal_revID_list
                    };
                    test_case_normal = new CESP_Test_1.CESP_Test(test_case_normal_info);
                    return [4 /*yield*/, test_case_normal.run_all()];
                case 3:
                    _a.sent();
                    offending_revID_list = [968719871, 927235330, 968712369, 968714347, 968713855, 968699772,
                        968713899, 968713561, 968714228, 968714110, 968705063, 968705137,
                        968705232, 968705288, 968705348, 968705424];
                    test_case_offending_info = {
                        url: "https://en.wikipedia.org/w/api.php?origin=*",
                        window_size: 10,
                        baseline: 0.0,
                        percentage: 0.0,
                        margin: 0.1,
                        warning_timeframe: 3,
                        warning_threshold: 3,
                        revID_list: offending_revID_list
                    };
                    test_case_offending = new CESP_Test_1.CESP_Test(test_case_offending_info);
                    return [4 /*yield*/, test_case_offending.run_all()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main();
