var debug = true;

var STORAGE_KEYS = {
    CONTEXT_ON: 'contextWhitelistIsActive',
    CONTEXT_NAMES: 'contextWhitelistNames',
    CONTEXT_ALLOWED_HOSTS: 'contextWhitelistHostsByContext',
    CURRENT_CONTEXT_ID: 'contextWhitelistId'
};

var STORAGE_KEYS_VALUES = Object.keys(STORAGE_KEYS).map(function (key) {return STORAGE_KEYS[key];});

var globalWhitelist = [
    'google.',
    'localhost'
];

var contextWhitelist = {
    blockPage: function () {
        var scope = this;

        chrome.storage.sync.get(STORAGE_KEYS_VALUES, function (values) {
            var isWhitelistModeOn = values[STORAGE_KEYS.CONTEXT_ON];
            var currentContextName = scope.getContextName(values[STORAGE_KEYS.CURRENT_CONTEXT_ID], values[STORAGE_KEYS.CONTEXT_NAMES]);
            var allowedHosts = scope.getAllowedHosts(values[STORAGE_KEYS.CURRENT_CONTEXT_ID], values[STORAGE_KEYS.CONTEXT_ALLOWED_HOSTS]);

            if (debug) {
                console.log('isWhitelistModeOn', isWhitelistModeOn);
            }

            if (isWhitelistModeOn) {
                var host = Utils.getHostName(location.host);

                if (debug) {
                    console.log('checking host:', host);
                }

                if (scope.isHostBlocked(host, allowedHosts)) {
                    document.body.innerHTML = "" +
                        "this page is not in the current context's whitelist: " +
                        "" + host +
                        "<br/> Current context is: " +
                        "" + currentContextName +
                        "<br/> The allowed hosts in this context are: " +
                        "" + JSON.stringify(allowedHosts);
                    console.log('the host is blocked');
                } else {
                    console.log('the host is not blocked');
                }
            }
        });
    },
    getAllowedHosts: function (contextId, allowedHosts) {
        allowedHosts = allowedHosts || [];

        return allowedHosts[contextId] || [];
    },
    getContextName: function (contextId, contextNames) {
        return contextNames[contextId] || '#' + contextId;
    },
    isHostBlocked: function (host/*, allowedHosts */) {
        var r = false, isInGlobalWhitelist = false;

        globalWhitelist.forEach(function (item) {
            if (host.indexOf(item) === 0) {
                r = false;
                isInGlobalWhitelist = true;
            }
        });

        if (isInGlobalWhitelist) {
            return r;
        }

        r = true;

        return r;
    }
};

contextWhitelist.blockPage();