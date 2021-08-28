//=========================================================================
// Copyright 2012 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//=========================================================================

'use strict'; // to write cleaner code

// Settings
const {google} = require('googleapis');
const customsearch = google.customsearch('v1');
const fs = require('fs');

// Function to launch search
async function runSample(options, site) {
  const res = await customsearch.cse.list({
    cx: options.cx,
    q: options.q,
    auth: options.apiKey,
    /*
    fileType: options.fileType,
    gl: options.gl,
    cr: options.cr,
    lr: options.lr,
    */
  });
  return writeJSON(res.data.items, site);
}

// Function to store search results in .json files
function writeJSON(data, name) {
  try {
    // Ensure existence of jsons/ subfolder and define filename
    if (!fs.existsSync('jsons/')) {
      fs.mkdirSync('jsons/');
    }
    const filename = 'jsons/' + name + '.json';
    // Stringify data and save file
    const strdata = JSON.stringify(data, null, 2);
    fs.writeFileSync(filename, strdata);
    console.log('JSON data is saved.');
  } catch (err) {
    console.error(err);
  }
}

// Make sure we got a filename on the command line
if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' YOUR_FILENAME');
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}

// Read the input file store list of companies' websites
const filename = process.argv[2];
let websites;
try {
  websites = fs.readFileSync(filename, 'utf8').split('\r\n');
  console.log('Read websites: ', websites);
} catch (err) {
  console.error(err);
}

// Iterate over websites
for (let ws = 0; ws < websites.length; ws++) {
  const site = websites[ws];

  // Set search options
  if (module === require.main) {
    const options = {
      q: 'site:' + site + ' sustainability 2017',
      apiKey: 'AIzaSyAvFpf34goYcQW186rfnEwAdBrD0FvfGRo',
      cx: '8b4ac89e366051c73',
      fileType: 'pdf',
      gl: 'ch',
      cr: 'countryCH',
      lr: '(lang_en|lang_de|lang_fr|lang_it)',
    };
    runSample(options, site).catch(console.error);
  }
}

module.exports = {
  runSample,
};