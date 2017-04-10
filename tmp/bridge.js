(function(){

	var maxConsoleLogRecursionDepth = 10;
	var maxConsoleLogPropertiesPerObject = 20;

	if(window.console && window.console.log){
		var origConsoleLog = window.console.log;
		
		window.console.log = function(){
			var args = [].slice.call(arguments),
				message = '';
			
			for(var i=0; i<args.length; i++){
				message += consoleLog(args[i]) + ', ';
			}
			
			sendMessage('log', message.replace(/,\s$/, ''));
			
			origConsoleLog.apply(window.console, arguments);
		};
	}

	function consoleLog(val) {
		var str = consoleLogRecur(val, maxConsoleLogRecursionDepth);
		return str.replace(/,\s$/, '');
	}
	
	function consoleLogRecur(val, depth){
		if(isObject(val)){
			var str = '{';
			
			var numProps = 0;
			for(var attr in val){
				numProps += 1;
				if (numProps > maxConsoleLogPropertiesPerObject) {
					str += "...";
					break;
				}
			
				var prop = '';
			
				if(isObject(val[attr])){
					if (depth-1 === 0) {
						prop = "{...}, "
					} else {
						prop = consoleLogRecur(val[attr], depth-1);
					}
				}
				else{
					prop = getConsoleVal(val[attr]) + ', ';
				}
			
				str += attr + ':' + prop;
			}
			
			str = str.replace(/,\s$/, '');
			str += '}, ';

			return str;
		}
		else{
			return getConsoleVal(val);
		}
	}
	
	function getConsoleVal(val){
		switch(typeof val){
			case 'string':
				return '"' + val + '"';
			default:
				if (val && val.toString) {
					return val.toString();
				} else {
					return '';
				}
		}
	}
	
	function isObject(val){
		return typeof val === 'object' && !Array.isArray(val) && val !== null;
	}

    function sendMessage() {
        var args = [].slice.call(arguments);
        if(window.callPhantom){
            //send messages to parent phantom.js process
            alert(JSON.stringify(args));
        }
    }

    //send error messages to phantom.js process
    window.onerror = function(message, url, linenumber){
        sendMessage('error', 'JavaScript error: ' + message + ' on line ' + linenumber + ' for ' + url);
    }

    //create a listener who'll bubble events from Phantomjs to Grunt
    function createGruntListener(ev, runner){
        runner.on(ev, function(test, err){
            var data = {
                err: err
            };

            if(test){
                data.title = test.title;
                data.fullTitle = test.fullTitle();
            }

            sendMessage('mocha.' + ev, data);
        });
    }

    var GruntReporter = function(runner){
        if (!Mocha) {
            throw new Error('Mocha was not found, make sure you include Mocha in your HTML spec file.');
        }

        //setup HTML reporter to output data on the screen
        Mocha.reporters.HTML.call(this, runner);

        //create a Grunt listener for each Mocha events
        var events = [
            'start',
            'test',
            'test end',
            'suite',
            'suite end',
            'fail',
            'pass',
            'pending',
            'end'
        ];

        for(var i=0; i<events.length; i++){
            createGruntListener(events[i], runner);
        }
    }

    mocha.setup({
        reporter: GruntReporter
    });

})();
