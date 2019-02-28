var app = angular.module('luma', [
'ui.router'
]);

/********** STATES **********/

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider){

/* State Name: 'home'
 * URL: /home
 * url parameters:
 *  None
 * template: /home.html
 * Controller: MainCtrl
 * Factories Used:
 *  bubbles
 *  reservations
 * Directives Used:
 *  moveBar
*/
  $stateProvider
    .state('home', {
      url         : '/home',
      templateUrl : '/home.html',
      controller  : 'MainCtrl',
      resolve     : {
        percentPromise : ['bubbles', function(bubbles){
          return bubbles.getAll();
        }],
        reservationPromise : ['reservations', function(reservations){
          return reservations.getAll();
        }]
      }
  });

/* State Name: 'map'
 * URL: /map/{lab_name}
 * url_parameters:
 *  lab_name: name for the lab
 * template: /map.html
 * Controller: MapCtrl
 * Factories Used:
 *  layout
 *  computers
 * Directives Used:
 *  None
*/
  $stateProvider
    .state('map', {
      url        : '/map/{lab_name}',
      templateUrl: '/map.html',
      controller : 'MapCtrl',
      resolve    : {
        layoutPromise : ['$stateParams', 'layout', function($stateParams, layout){
          return layout.get($stateParams.lab_name);
        }],
        computersPromise : ['$stateParams', 'computers', function($stateParams, computers){
          return computers.get($stateParams.lab_name);
        }]
      }
  });

  /**** FOR TESTING ****/
/* State Name: 'fake_home'
 * URL: /fake/home
 * url_parameters:
 *  None
 * template: /home.html
 * Controller: MainCtrl
 * Factories Used:
 *  bubbles
 *  reservations
 * Directives Used:
 *  moveBar
*/
  $stateProvider
    .state('fake_home', {
      url         : '/fake/home',
      templateUrl : '/home.html',
      controller  : 'MainCtrl',
      resolve     : {
        percentPromise : ['bubbles', function(bubbles){
          return bubbles.getAll("empty");
        }],
        reservationPromise : ['reservations', function(reservations){
          return reservations.getAll(true);
        }]
      }
  });
/* State Name: 'fake_map'
 * URL: /fake/map/{lab_name}
 * url_parameters:
 *  lab_name: name for the lab
 * template: /map.html
 * Controller: MapCtrl
 * Factories Used:
 *  layout
 *  computers
 * Directives Used:
 *  None
*/
  $stateProvider
    .state('fake_map', {
      url        : '/fake/map/{lab_name}',
      templateUrl: '/map.html',
      controller : 'MapCtrl',
      resolve    : {
        layoutPromise : ['$stateParams', 'layout', function($stateParams, layout){
          return layout.get($stateParams.lab_name);
        }],
        computersPromise : ['$stateParams', 'computers', function($stateParams, computers){
          return computers.get($stateParams.lab_name,"false","false");
        }]
      }
  });
  /**** END FOR TESTING ****/


/* State Name: 'aboutus'
 * URL: /aboutus
 * url_parameters:
 *  None
 * template: /aboutus.html
 * Controller: AboutUsCtrl
 * Factories Used:
 *  None
 * Directives Used:
 *  None
*/
  $stateProvider
    .state('aboutus', {
      url        : '/aboutus',
      templateUrl: '/aboutus.html',
      controller : 'AboutUsCtrl',
  });

  $urlRouterProvider.otherwise('home');
}]);
/********** END STATES **********/

/********** FACTORIES **********/

/* Factory Name: 'bubbles'
 * Objects:
 *  percs: 
 *    example: { 'EBU3B B220' : {"commonLabName : B220",
                                 "free_space" : "10",
 *                               "total_space" : "42"},...
 *             }
 *  fake_percs: 
 *    example: { 'EBU3B B220' : {"commonLabName : B220",
                                 "free_space" : "10",
 *                               "total_space" : "42"},...
 *             }
 * Functions:
 *   percs getAll()
*/
app.factory('bubbles', ['$http', function($http){
  var o = {
    percs : {},
    fake_percs : {},
  };

/* Method Name: getAll
 * Parameters: 
 *  None
 * Get URL: /percents
 */
  o.getAll = function(style){
    var url;
    if (style){
      url = '/fake/percents/'+style;
    }
    else{
      url = '/percents';
    }
    return $http.get(url).success(function(data){
      var labNames = [
        'EBU3B B220',
        'EBU3B B230',
        'EBU3B B240',
        'EBU3B B250',
        'EBU3B B260',
        'EBU3B B270'];
      for (var i=0;i<labNames.length;++i){
        var labName = labNames[i];
        var tempObj = {};
        tempObj.commonLabName = labName.split(" ").pop();
        tempObj.freeSpace = ("0" + data[labName].free_space).slice(-2);
        tempObj.totalSpace = data[labName].total_space;
        if (style){
          o.fake_percs[labName] = (tempObj);
        }
        else{
          o.percs[labName] = (tempObj);
        }
      }
    });
  };

  return o;
}]);

/* Factory Name: 'layout'
 * Objects:
 *  layout: 
 *    example: { "lName" : "EBU3B B220",
 *               "commonLabName" : "B220",
 *               "length" : "8",
 *               "width" : "8",
 *               "offset" : 4,
 *               "table" : [["","23","24","25","26","27","",""],
 *                          ["","","","","","","","",""],
 *                          ["22","21","20","19","18","17","",""],
 *                          ...
 *                          ["1","2","3","4","5","","","30"],
 *                          ["","","","","","","","",""]]
 *               "computers" : {
 *                 "1" : {
 *                   "x" : "6",
 *                   "y" : "0"},
 *                 "2" : {
 *                   "x" : "6",
 *                   "y" : "1"},...
 *                 "30" : {
 *                   "x" : "6",
 *                   "y" : "7"}
 *                }
 *             }
 * Functions:
 *   layout get(lab_name)
*/
app.factory('layout', ['$http', function($http){
  var o = {
    layout : {}
  };
  
/* Method Name: get(lab_name)
 * Parameters: 
 *  String lab_name -- the lab we are getting the layout for
 *    ex: 'EBU3B B230"
 * Get URL: /computers/{lab_name}
 */
  o.get = function(lab_name){
    return $http.get('/layout/' + lab_name).success(function(data){
      o.layout.table = [];

      o.layout.lName = lab_name;
      o.layout.commonLabName = lab_name.split(" ").pop();

      var length = parseInt(data.length);
      var width = parseInt(data.width);
      o.layout.length = length;
      o.layout.width = width;
      o.layout.offset = "col-xs-offset-" + Math.floor((12-width)/2);
      
      for (var i=0;i<length;i++){
        o.layout.table[i] = {};
        for (var j=0;j<width;j++){
          o.layout.table[i][j] = "";
        }
      }

      var computers = data.computers;

      for (var comp_num in computers){
        var x = parseInt(computers[comp_num].x);
        var y = parseInt(computers[comp_num].y);
        o.layout.table[x][y] = comp_num;
      }
    });
  };

  return o;
}]);

/* Factory Name: 'computers'
 * Objects:
 *  comps: 
 *    example: { 1 : {"state" : "IN USE",
 *                                   "os" : "Linux"},
 *               2 : {"state" : "OPEN",
 *                                   "os" : "Windows"},
 *               3 : {"state" : "IN REPAIR",
 *                                   "os" : "Windows"},...
 *             }
 *  fake_comps: 
 *    example: { 1 : {"state" : "IN USE",
 *                                   "os" : "Linux"},
 *               2 : {"state" : "OPEN",
 *                                   "os" : "Windows"},
 *               3 : {"state" : "IN REPAIR",
 *                                   "os" : "Windows"},...
 *             }
 * Functions:
 *   comps get(lab_name)
*/
app.factory('computers', ['$http', function($http){
  var o = {
    comps :  {},
    fake_comps :  {}
  };

/* Method Name: get(lab_name)
 * Parameters: 
 *  String lab_name -- the lab we are getting computer statuses for
 *    ex: 'B230"
 * Get URL: /computers/{lab_name}
 */
  o.get = function(lab_name,taken,broken){
    var url;
    if (taken || broken){
      url = '/fake/computers/'+lab_name+"/"+taken+"/"+broken;
    }
    else{
      url = '/computers/'+lab_name;
    }
    return $http.get(url).success(function(data){
      var comps = {};
      for (var key in data){
        comps[parseInt(key.slice(-2))] = data[key];
      }
      if (taken || broken){
        angular.copy(comps,o.fake_comps);
      }
      else{
        angular.copy(comps,o.comps);
      }
    });
  };

  return o;
}]);

/* Factory Name: 'reservations'
 * Objects:
 *  reservs: 
 *    example: { 'EBU3B B230' : {"title" : "CSE 110",
 *                               "start" : TODO,
 *                               "end"   : TODO},
 *             }
 *  fake_reservs: 
 *    example: { 'EBU3B B230' : {"title" : "CSE 110",
 *                               "start" : TODO,
 *                               "end"   : TODO},
 *             }
 * Functions:
 *   reservs getAll()
*/
app.factory('reservations', ['$http', function($http){
  var o = {
    reservs : {},
    fake_reservs : {}
  };

/* Method Name: getAll()
 * Parameters: None
 * Get URL: /reservations
 */
  o.getAll = function(fake){
    var url;
    if (fake){
      url = '/fake/reservations';
    }
    else{
      url = '/reservations';
    }
    return $http.get(url).success(function(data){
      if (fake){
        o.fake_reservs = data;
      }
      else{
        o.reservs = data;
      }
    });
  };

  return o;
}]);
/********** END FACTORIES **********/

/********** DIRECTIVES **********/
app.directive("moveBar", [ function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
          scope.$watch('bubbles', function() {
            var freespace = parseInt(attrs.freespace);
            var totalspace = parseInt(attrs.totalspace);
                $(elem).animate(  
                  {top:(freespace/totalspace)*200},300);
          }, true);
        }
    }
}]);
/********** END DIRECTIVES **********/

/********** CONTROLLERS **********/

/* Controller Name: 'ParentCtrl'
 * Injected Paramters:
 *  $scope
 *  $location
 * Scope Objects:
 *  Object links
 *  bool isCollapsed
 *  bool isActive(viewLocation)
*/
app.controller('ParentCtrl',[
'$scope',
'$location',
function($scope,$location){
  $scope.links = {};
  $scope.isCollapsed = true;
  $scope.isActive = function (viewLocation) { 
    return viewLocation === "/#"+$location.path();
  };
}]);

var madeMainInterval = 0;
var madeMapInterval = 0;
/* Controller Name: 'MainCtrl'
 * Injected Paramters:
 *  $scope
 *  $state
 * Factories:
 *  bubbles
 *  reservations
 * Scope Objects:
 *  bubbles bubbles
 *  reserverations reservations
 *  String makeurl(labname)
 *  void intervalFunction()
*/
app.controller('MainCtrl', [
'$scope',
'$state',
'$interval',
'bubbles',
'reservations',
function($scope, $state,$interval, bubbles, reservations){
  var url;
  var madeInterval = 0;
  $scope.$parent.links = {"About Us":"/#/aboutus",
                          "Testing":"/#/fake/home"};
  if ($state.current.name === 'fake_home'){
    $scope.testing = 1;
    $scope.style = 'full';
    $scope.bubbles = bubbles.fake_percs;
    $scope.reservations = reservations.fake_reservs;
    url = '/#/fake/map/';

    $scope.reset = function(style){
      $scope.style=style;
      bubbles.getAll(style);
      $scope.bubbles = bubbles.fake_percs;
    };

    $scope.reset($scope.style);
  }
  else{
    $scope.bubbles = bubbles.percs;
    $scope.reservations = reservations.reservs;
    url = '/#/map/';
    $scope.intervalFunction = function(){
        if($state.current.controller=="MainCtrl"){
            bubbles.getAll();
            $scope.made = 1;
            $scope.bubbles = bubbles.percs;
        }
    };
    if (!madeMainInterval){
        madeMainInterval = 1;
        $interval($scope.intervalFunction,6000);
    }
  }
  $scope.makeurl = function(labname){
    return (url+labname);
  };
}]);

/* Controller Name: 'MapCtrl'
 * Injected Paramters:
 *  $scope
 *  $state
 * Factories:
 *  layout
 *  computers
 * Scope Objects:
 *  layout layout
 *  computers computers
 *  void intervalFunction()
*/
app.controller('MapCtrl', [
'$scope',
'$state',
'$interval',
'layout',
'computers',
function($scope, $state,$interval, layout, computers) {
  $scope.layout = layout.layout;
  if ($state.current.name === 'fake_map'){
    $scope.testing = 1;
    $scope.taken = "false";
    $scope.broken = "false";
    $scope.reset = function(labname){
      computers.get(labname,$scope.taken,$scope.broken);
      $scope.computers = computers.fake_comps;
    };
    $scope.computers = computers.fake_comps;
    $scope.$parent.links = {"B220":"/#/fake/map/EBU3B B220",
      "B230":"/#/fake/map/EBU3B B230",
      "B240":"/#/fake/map/EBU3B B240",
      "B250":"/#/fake/map/EBU3B B250",
      "B260":"/#/fake/map/EBU3B B260",
      "B270":"/#/fake/map/EBU3B B270"};
  }
  else{
    $scope.computers = computers.comps;
    $scope.$parent.links = {"B220":"/#/map/EBU3B B220",
      "B230":"/#/map/EBU3B B230",
      "B240":"/#/map/EBU3B B240",
      "B250":"/#/map/EBU3B B250",
      "B260":"/#/map/EBU3B B260",
      "B270":"/#/map/EBU3B B270"};
    $scope.intervalFunction = function(){
        if($state.current.controller=="MapCtrl"){
            computers.get($scope.layout.lName);
            $scope.computers = computers.comps;
        }
    };
    if (!madeMapInterval){
        madeMapInterval = 1;
        $interval($scope.intervalFunction,6000);
    }
  }
}]);

/* Controller Name: 'AboutUsCtrl'
 * Injected Parameters:
 *  $scope
 * Factories:
 *  None
 * Scope Objects:
 *  people
*/
app.controller('AboutUsCtrl',[
'$scope',
function($scope){
  $scope.$parent.links = {"About Us":"/#/aboutus"};
  $scope.people = { 
    "Amir Hajimirsadeghi" : { 
      "Description":"is a 2nd year Computer Science major who is very passionate about programming and learning new things.", 
      "Picture":"http://i.imgur.com/Ozi3f3e.jpg", 
      "Title":"Technical Lead"},
    "Andre Pan": {
      "Description":"is a 2nd year Computer Science major and also one of the QA Tech leads for LUMA. He enjoys reading and learning about new things, with a focus on computer science fields.", 
      "Picture":"http://i.imgur.com/YKRo58j.jpg", 
      "Title":"Quality Assurance Lead"},
    "Benaisha Patel": {
      "Description":"is a second year computer engineer on the LUMA UI team. She enjoys graphic design and plans to work in the gaming industry.", 
      "Picture":"http://i.imgur.com/gxj5fw5.jpg", 
      "Title":"UI Designer"},
    "Dylan Ha": {
      "Description":"is a 2nd year Computer Science major who enjoys long walks on the beach, exploring the world, and gorging himself with food. Dylan helps LUMA by making crucial decisions such as deciding which functionality to implement into our application. He has a passion to learn more about web and software development.", 
      "Picture":"http://i.imgur.com/yCc5qA8.jpg", 
      "Title":"Business Analyst"},
    "John Clara": {
      "Description":"is a 2nd year Computer Engineering major who loves coding and camping. John helps LUMA grow by encouraging the team wherever they need help. He is interested in Database Design and Cryptography.", 
      "Picture":"http://i.imgur.com/uhygw7x.jpg", 
      "Title":"Project Manager"},
    "Justine Lin": {
      "Description":"is a 2nd year Computer Science major who has interned at Boeing, Northrop Grumman, and Geospatial Technologies. She loves software architecture and enjoys spending time with her family and friends.", 
      "Picture":"http://i.imgur.com/B88Gwec.jpg", 
      "Title":"Software Architect"},
    "Lucas Marzocco": {
      "Description":"is a 3rd year Computer Science major who studies too hard, plays too much league, and doesn’t sleep enough. He is one of the QA Tech leads for LUMA and considers himself the “Best Debugger NA” and will be interning at Northrop Grumman for Summer 2015.", 
      "Picture":"http://i.imgur.com/j8oVyYc.jpg", 
      "Title":"Quality Assurance Lead"},
    "Paris Do": {
      "Description":"is a 2nd year Computer Science major at UCSD. Paris loves running, dogs, and hiking.", 
      "Picture":"http://i.imgur.com/x8P4piK.jpg", 
      "Title":"Software Architect"},
    "Rachel Shroyer": {
      "Description":"is a 2nd year Computer Science major and Business minor from the North Bay who is part of LUMA’s UI team. She loves basketball (go Warriors), working out, and trying new food. In her future career she would love to travel to different parts of the globe.",
      "Picture":"http://i.imgur.com/EHDUM62.jpg", 
      "Title":"UI Designer"},
    "Rehan Raiyyani": {
      "Description":"is a 3rd year computer science major who enjoys running, playing tennis, and telling corny jokes. Rehan helps choose the different technologies which LUMA utilizes. Rehan aspires to become an applied research scientist in the areas of CS Theory and AI.",
      "Picture":"http://i.imgur.com/vjFSDit.jpg", 
      "Title":"Technical Lead"},
    "Wesley Febrian": {
      "Description":"is an international student from Jakarta, Indonesia majoring in Computer Science. Wesley has a knack for knowing what the average UCSD CSE student wants in LUMA. He is interested in probability and statistics, UI/UX, and cryptography.", 
      "Picture":"http://i.imgur.com/FiBzlwU.jpg", 
      "Title":"Business Analyst"}
  };
}]);
/********** END CONTROLLERS **********/
