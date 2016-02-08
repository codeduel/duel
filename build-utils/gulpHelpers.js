//utility functions
module.exports.printBuildComplete = function(){
  var greenText = '\[\033[32m\] %s \[\033[m\]';
  console.log(greenText, '************************************************************');
  console.log(greenText, '*****                BUILD COMPLETED!                  *****');
  console.log(greenText, '************************************************************');
};

module.exports.printBuildError = function(){
  var redText = '\[\033[31m\] %s \[\033[m\]';
  console.log(redText, '************************************************************');
  console.log(redText, '*****               BUILD BREAKING ERROR!              *****');
  console.log(redText, '************************************************************');
};

module.exports.printDevComplete = function(){
  var cyanText = '\[\033[36m\] %s \[\033[m\]';
  console.log(cyanText, '************************************************************');
  console.log(cyanText, '*****               DEV BUILD COMPLETED!               *****');
  console.log(cyanText, '************************************************************');
};

module.exports.printWatchError = function(){
  var redText = '\[\033[31m\] %s \[\033[m\]';
  console.log(redText, '************************************************************');
  console.log(redText, '*****     ERROR OCCURED - EXIT THEN RESTART WATCH!     *****');
  console.log(redText, '************************************************************');
};

//used for error handling in tasks that would otherwise cause watch to fail silently
module.exports.watchErrorContinue = function(err) {
  var redText = '\[\033[31m\] %s \[\033[m\]';
  var message = 'YOUR CODE WILL NOT PASS BUILD DUE TO:\n' + err.message;
  console.log(redText, message);
  //emit end allows the watch task to continue
  this.emit('end');
};
