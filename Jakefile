const {
  runDefault,
  runTests,
  runCoverageTests,
  runLinter,
  runNodemon,
  startBGServer,
  closeBGServer,
} = require('./tasks/jakeActions');

desc('list tasks');
task('default', runDefault);

desc('run tests with jest');
task('jest', ['startBGServer'], runTests);

desc('alias for "jest"');
task('test', ['startBGServer'], runTests);

desc('run coverage tests');
task('coverage', ['startBGServer'], runCoverageTests);

desc('run linter');
task('lint', runLinter);

desc('run application with nodemon');
task('dev', runNodemon);

task('startBGServer', startBGServer);
task('closeBGServer', closeBGServer);
