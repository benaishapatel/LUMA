
/* ANTIQUATED
 * Method Name: authenticated
 * Injected Parameters::
 *  $q -- TODO
 *  $cookieStore -- controls cookie storage
 * Parameters:
 *   none
 * Description: This checks if the user is new and does not have a cookie
 * Author: John Clara
 * Date: 5/31/15
 *
  var authenticated = ['$q','$cookieStore', function ($q,$cookieStore) {
      var deferred = $q.defer();
      if ($cookieStore.get("user") == "visited") {
        deferred.resolve();
      } else {
        deferred.reject('New User');
      }
      return deferred.promise;
  }];
*/

/* ANTIQUATED
 * State Name: 'tutorial'
 * URL: /tutorial
 * url_parameters:
 *  None
 * template: /tutorial.html
 * Controller: TutorialCtrl
 * Factories Used:
 *  None
 * Directives Used:
 *  None
  $stateProvider
    .state('tutorial', {
      url        : '/tutorial',
      templateUrl: '/tutorial.html',
      controller : 'TutorialCtrl',
  });
*/

/* ANTIQUATED
app.run(function ($rootScope, $state, $log) {
  $rootScope.$on('$stateChangeError', function () {
    // Redirect user to our login page
    $state.go('tutorial');
  });
});
*/

/* ANTIQUATED
app.directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
          $(element).tooltip({
            trigger: 'manual',
            container: 'body'
          });
          $(element).tooltip('show');
        }
    };
});

app.directive('removeTooltips', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
          $('*').tooltip('hide');
        }
    };
});
*/

/* ANTIQUATED
app.controller('TutorialCtrl', [
'$scope',
'$cookieStore',
function($scope, $cookieStore) {
    $cookieStore.put('user','visited');
    $scope.fakeBubbles = [
      {"labName":"EBU3B B230",
       "commonLabName":"B230",
       "freeSpace":10,
       "totalSpace":30,
      },
      {"labName":"EBU3B B230",
       "commonLabName":"B230",
       "freeSpace":20,
       "totalSpace":42,
      },
      {"labName":"EBU3B B240",
       "commonLabName":"B240",
       "freeSpace":34,
       "totalSpace":42,
      }
    ]
}]);
*/
