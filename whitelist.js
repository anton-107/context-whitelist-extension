var debug = true;

var STORAGE_KEYS = {
    CONTEXT_ON: 'contextWhitelistIsActive',
    CONTEXT_NAMES: 'contextWhitelistNames',
    CURRENT_CONTEXT_ID: 'contextWhitelistId'
};

var globalWhitelist = [
    'google.',
    'localhost'
];

var contextWhitelist = {
    getHostName: function (fullStringHostName) {
        var parts = fullStringHostName.split('.').reverse();
        if (parts.length > 1) {
            return [parts[1], parts[0]].join('.');
        } else if (parts.length === 1) {
            return parts[0];
        } else {
            return '';
        }
    },
    blockPage: function () {
        var scope = this;

        chrome.storage.sync.get(Object.values(STORAGE_KEYS), function (values) {
            var isWhitelistModeOn = values[STORAGE_KEYS.CONTEXT_ON];
            var currentContextName = values[STORAGE_KEYS.CURRENT_CONTEXT_ID];

            if (debug) {
                console.log('isWhitelistModeOn', isWhitelistModeOn);
            }

            if (isWhitelistModeOn) {
                var host = scope.getHostName(location.host);

                if (debug) {
                    console.log('checking host:', host);
                }

                if (scope.isHostBlocked(host)) {
                    document.body.innerHTML = "" +
                        "this page is not in the current context's whitelist: " +
                        "" + host +
                        "<br/> Current context is: " +
                        "" + currentContextName;
                    console.log('the host is blocked');
                } else {
                    console.log('the host is not blocked');
                }
            }
        });
    },
    isHostBlocked: function (host) {
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