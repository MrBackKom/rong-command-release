var url = require("url");
var path = require("path");
var weinreApp;

const WEINRE_NAME = "weinre-debug";
const WEINRE_ID = "#fis-rong";

var weinreTargetUrl = {
	protocol: "http:",
	pathname: "/target/target-script-min.js",
	hash: WEINRE_ID
};

var weinreClientUrl = {
	protocol: "http:",
	pathname: "/client/",
	hash: WEINRE_ID
};


exports.get = function (key) {

	var config = getConfig();
	weinreTargetUrl.hostname = config.hostname;
	weinreClientUrl.hostname = config.hostname;
	weinreClientUrl.port = config.port;
	weinreTargetUrl.port = config.port;

	var options = {
		name: WEINRE_NAME,
		active: false,
		url: false,
		targetUrl: url.format(weinreTargetUrl),
		clientUrl: url.format(weinreClientUrl),
		port: config.port
	};
    switch(key.toLowerCase()){
        case 'targeturl':
            return url.format(weinreTargetUrl);
        break;
        case 'clienturl':
            return url.format(weinreClientUrl);
        break;
    }
	// cb(url.format(weinreClientUrl), url.format(weinreTargetUrl));
}

var defaultConfig = {
	hostname: getIp() || 'localhost',
	port: 8123
} 
function getConfig() {
    var userConfig = fis.config.get('weinre') || {};
    var conf = {};
    for(var i in defaultConfig){
    	conf[i] = userConfig[i] === undefined ? defaultConfig[i] : userConfig[i];
    }
    return conf;
}



function setWeinreUrl(weinreClientUrl, weinreTargetUrl) {
	console.log(weinreClientUrl, weinreTargetUrl);
}



function enableWeinre(ui, bs) {

	if (weinreApp) {
		weinreApp.close();
		weinreApp = false;
	}
	var config = getConfig();
	var weinre = require("weinre");
	weinreApp = weinre.run({
		httpPort: config.port,
		boundHost: config.hostname,
		verbose: false,
		debug: false,
		readTimeout: 5,
		deathTimeout: 15
	});

}


function disableWeinre(ui) {
	if (weinreApp) {
		weinreApp.close();
		weinreApp = false;
	}
}

function getIp(){
	'use strict';
	var os = require('os');
	var ifaces = os.networkInterfaces();
	var localIp;
	Object.keys(ifaces).forEach(function (ifname) {
	  ifaces[ifname].forEach(function (iface) {
	    if ('IPv4' !== iface.family || iface.internal !== false) {
	      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
	      return;
	    }
	    if(localIp === undefined || ifname.indexOf('eth') === 0){
		  	localIp = iface.address;
	    }
	  });
	});
	return localIp;
}
exports.start = enableWeinre;
exports.stop = disableWeinre;
