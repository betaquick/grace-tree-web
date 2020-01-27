// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 60000,
  specs: [
    './src/app.e2e-spec.ts',
    './src/register/register.e2e-spec.ts',
    './src/login/login.e2e-spec.ts',
    './src/**/*.e2e-spec.ts'
  ],
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: [
        '--disable-gpu',
        '--window-size=1200,600',
        '--no-sandbox',
        '--headless',
        '--test-type=browser'
      ],
      prefs: {
        'download': {
          'prompt_for_download': false,
          'default_directory': process.cwd()
        }
      }
    }
  },
  directConnect: true,
  baseUrl: 'http://localhost:4206/',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {
    }
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};
