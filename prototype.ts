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

import {CESP_Test_Info} from "./interface";
import {CESP_Test} from "./CESP_Test";

async function main() {
	// Test Case One: 10 different edits, all by same author on same article
	// However, most of these edits suffer from lack of ORES-scores. 
	var test_case_one_info: CESP_Test_Info = {
		url: "https://en.wikipedia.org/w/api.php?origin=*",
		window_size: 10,
		baseline: 0.3,
		percentage: 0.5,
		margin: 0.15,
		warning_timeframe: 3,
		warning_threshold: 3,
		revID_list: [967788714, 845591562, 820220399, 797070597, 784455460, 761250919, 760592760, 760592487, 738223561, 694525673],
	}
	var test_case_one: CESP_Test = new CESP_Test(test_case_one_info);
	await test_case_one.run_all();

	// Test Case Two: repetition of same edit. Designed specifically to trigger first warning, then blocking decision. 
	var test_case_two_info: CESP_Test_Info = {
		url: "https://en.wikipedia.org/w/api.php?origin=*",
		window_size: 10,
		baseline: 0.0, //All revisions will be flagged!
		percentage: 0.0,
		margin: 0.0,
		warning_timeframe: 3,
		warning_threshold: 3,
		revID_list: [967788714, 967788714, 967788714, 967788714, 967788714], //Last reptition should trigger block
	}
	var test_case_two: CESP_Test = new CESP_Test(test_case_two_info);
	await test_case_two.run_all();

}

main();

