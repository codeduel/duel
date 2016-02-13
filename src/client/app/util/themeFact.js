angular.module('duel.themeFact', ['angular.css.injector'])

.factory('ThemeFact', ['$window', 'cssInjector', function($window, cssInjector) {
  var themeFact = {};
  themeFact.data = {};
  themeFact.data.theme = undefined;

  var themeObjects = {
    default: {aceThemeName: 'cobalt', cssThemeName: 'duel.css'},
    light: {aceThemeName: 'xcode', cssThemeName: 'light.css'},
    dark: {aceThemeName: 'monokai', cssThemeName: 'dark.css'}
  };

  //set the theme
  themeFact.setTheme = function(themeName){
    //save the last theme to remove later
    var lastTheme = themeFact.data.theme;
    //don't change theme if it's the same
    if(themeName === lastTheme){
      return;
    }
    //make sure the new themeName exists and then set it
    if(themeName in themeObjects){
      themeFact.data.theme = themeName;
      $window.localStorage.setItem('duel.theme', themeName);
      //add the theme's css file if it isn't default
      if(themeName !== 'default'){
        cssInjector.add('assets/css/' + themeObjects[themeFact.data.theme].cssThemeName);
      }
      //remove the previous theme's css file if it isn't default
      if(lastTheme && lastTheme !== 'default' && lastTheme in themeObjects){
        cssInjector.remove('assets/css/' + themeObjects[lastTheme].cssThemeName);
      }
    }
  };

  //send back theme object that corresponds to themeFact.data.theme
  themeFact.getTheme = function(){
    if(themeFact.data.theme !== undefined && themeFact.data.theme in themeObjects){
      return themeObjects[themeFact.data.theme];
    } else {
      //if the theme isn't set try and get it from local storage
      themeFact.data.theme = $window.localStorage.getItem('duel.theme');
      //if it's still not set, set it to default
      if(!themeFact.data.theme){
        themeFact.setTheme('default');
      }
      return themeObjects[themeFact.data.theme];
    }
  };

  themeFact.init = function(){
    if(themeFact.data.theme){
      return;
    }
    theme = $window.localStorage.getItem('duel.theme') || 'default';
    themeFact.setTheme(theme);
  };

  return themeFact;
}]);
