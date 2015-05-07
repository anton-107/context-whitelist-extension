var Utils = {
    getHostName: function (fullStringHostName) {
        fullStringHostName = String(fullStringHostName).replace(/\//g, '');
        var parts = fullStringHostName.split('.').reverse();
        if (parts.length > 1) {
            return [parts[1], parts[0]].join('.');
        } else if (parts.length === 1) {
            return parts[0];
        } else {
            return '';
        }
    }
};