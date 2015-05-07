//var debug = true;

var STORAGE_KEYS = {
    CONTEXT_ON           : 'contextWhitelistIsActive',
    CONTEXT_NAMES        : 'contextWhitelistNames',
    CONTEXT_ALLOWED_HOSTS: 'contextWhitelistHostsByContext',
    CURRENT_CONTEXT_ID   : 'contextWhitelistId'
};

// initial setup:
var values = {};

values[STORAGE_KEYS.CONTEXT_NAMES] = {
    'context_1': 'Working',
    'context_2': 'Reading news',
    'context_3': 'Leisure',
    'context_4': 'Personal finance'
};

values[STORAGE_KEYS.CURRENT_CONTEXT_ID] = 'context_1';

chrome.storage.sync.set(values);

document.addEventListener('DOMContentLoaded', function () {

    var debug = document.getElementById("debug");
    var onOffCheckbox = document.querySelector("input[name=contextWhitelistIsActive]");
    var contextRadios = document.querySelectorAll("input[name=contextWhitelistActiveContext]");
    var allowButton = document.getElementById("addCurrentHostToAllowed");

    if (debug) {
        window.addEventListener('error', function (e) {
            debug.innerHTML = e.message;
        });
    }

    // initialize values:
    chrome.storage.sync.get(STORAGE_KEYS.CONTEXT_ON, function (values) {
        onOffCheckbox.checked = values[STORAGE_KEYS.CONTEXT_ON];
    });

    // listen for changes:
    onOffCheckbox.addEventListener("click", function () {
        if (debug) {
            debug.innerHTML = 'checkbox checked: ' + onOffCheckbox.checked;
        }

        var values = {};
        values[STORAGE_KEYS.CONTEXT_ON] = onOffCheckbox.checked;

        chrome.storage.sync.set(values, function () {
            // Notify that we saved.
            if (debug) {
                debug.innerHTML = 'synced the value: ' + chrome.storage.sync.get(STORAGE_KEYS.CONTEXT_ON);
            }
        });
    });

    Array.prototype.forEach.call(contextRadios, function (contextRadio) {

    });

    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        var hostname = Utils.getHostName(new URL(tabs[0].url).hostname);
        allowButton.innerText = 'Add ' + hostname + ' to allowed hosts of current context';
    });

});