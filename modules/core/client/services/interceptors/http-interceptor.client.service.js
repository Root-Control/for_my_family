(function () {
  'use strict';

  angular
    .module('core')
    .factory('httpRequestInterceptor', httpRequestInterceptor);

  httpRequestInterceptor.$inject = [];

  function httpRequestInterceptor() {
    return {
      request: function (config) {
        config.headers.Authorization = localStorage.accessToken;
        return config;
      }
    };
  }
}());
