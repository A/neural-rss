module.exports = function(grunt) {
  grunt.initConfig({
    bgShell: {
      'get-articles': {
        cmd: 'cd '+__dirname+'&& node get-articles.js',
        bg: false
      },
     'start-mongo': {
        cmd: 'cd '+__dirname+'&& ./bin/mongod',
        bg: true
      },
      'start-app': {
        cmd: 'cd '+__dirname+'&& cd ./reeder/ && node app.js',
        bg: false
      }
    }
  });

  grunt.registerTask('default', 'bgShell:start-app');
  grunt.registerTask('build', ['bgShell:get-articles', 'bgShell:start-app']);
  grunt.registerTask('start-all', [
    'bgShell:start-mongo', 
    'bgShell:start-app', 
    'bgShell:get-articles'
  ]);
  grunt.loadNpmTasks('grunt-bg-shell');

};