describe('angularApp', function(){
  beforeEach(module('luma'));

/****** FACTORY TESTS *****/
  describe('factories', function(){

    describe('factory: bubbles', function(){

      beforeEach(inject(function(bubbles,_$httpBackend_){
        myFact = bubbles;
        $httpBackend = _$httpBackend_;
      }));

      it('can get an instance of bubbles', inject(function(){
        $httpBackend
          .whenGET('/percents')
          .respond({ 'EBU3B B220':{ 'free_space':'2', 
                                    'total_space':'4' },
                     'EBU3B B230':{ 'free_space':'2', 
                                    'total_space':'4' },
                     'EBU3B B240':{ 'free_space':'2', 
                                    'total_space':'4' },
                     'EBU3B B250':{ 'free_space':'2', 
                                    'total_space':'4' },
                     'EBU3B B260':{ 'free_space':'2', 
                                    'total_space':'4' },
                     'EBU3B B270':{ 'free_space':'2', 
                                    'total_space':'4' }
          });
        myFact.getAll();
        $httpBackend.flush();
        myFact.percs.should.not.equal(null);
      }));

      it('should parse the correct common name', inject(function(){
        $httpBackend
          .whenGET('/percents')
          .respond({ 'EBU3B B220':{ free_space:'2', 
                                    total_space:'4' },
                     'EBU3B B230':{ free_space:'2', 
                                    total_space:'4' },
                     'EBU3B B240':{ free_space:'2', 
                                    total_space:'4' },
                     'EBU3B B250':{ free_space:'2', 
                                    total_space:'4' },
                     'EBU3B B260':{ free_space:'2', 
                                    total_space:'4' },
                     'EBU3B B270':{ free_space:'2', 
                                    total_space:'4' }
          });
        myFact.getAll();
        $httpBackend.flush();
        myFact.percs['EBU3B B220'].commonLabName.should.equal('B220');
      }));

      it('should pad free_space with a zero', inject(function(){
        $httpBackend
          .whenGET('/percents')
          .respond({ 'EBU3B B220':{ free_space:'2', 
                                    total_space:'4' },
                     'EBU3B B230':{ free_space:'2', 
                                    total_space:'4' },
                     'EBU3B B240':{ free_space:'2', 
                                    total_space:'4' },
                     'EBU3B B250':{ free_space:'2', 
                                    total_space:'4' },
                     'EBU3B B260':{ free_space:'2', 
                                    total_space:'4' },
                     'EBU3B B270':{ free_space:'2', 
                                    total_space:'4' }
          });
        myFact.getAll();
        $httpBackend.flush();
        myFact.percs['EBU3B B220'].freeSpace.should.equal('02');
      }));

    });

    describe('factory: layout', function(){

      beforeEach(inject(function(layout,_$httpBackend_){
        myFact = layout;
        $httpBackend = _$httpBackend_;
      }));

      it('can get an instance of factory', inject(function(){
        $httpBackend
          .whenGET('/layout/EBU3B B220')
          .respond( {"length":"8",
                     "width":"8",
                     "computers":{"1":{"x":"6",
                                       "y":"0"},
                                  "2":{"x":"6",
                                       "y":"1"}
        }});
        myFact.get('EBU3B B220');
        $httpBackend.flush();
        myFact.layout.lName.should.not.equal(null);
      }));
      it('should parse the correct common name', inject(function(){
        $httpBackend
          .whenGET('/layout/EBU3B B220')
          .respond( {"length":"8",
                     "width":"8",
                     "computers":{"1":{"x":"6",
                                       "y":"0"},
                                  "2":{"x":"6",
                                       "y":"1"}
        }});
        myFact.get('EBU3B B220');
        $httpBackend.flush();
        myFact.layout.commonLabName.should.equal('B220');
      }));
      it('should parse the correct offset', inject(function(){
        $httpBackend
          .whenGET('/layout/EBU3B B220')
          .respond( {"length":"8",
                     "width":"8",
                     "computers":{"1":{"x":"6",
                                       "y":"0"},
                                  "2":{"x":"6",
                                       "y":"1"}
        }});
        myFact.get('EBU3B B220');
        $httpBackend.flush();
        myFact.layout.offset.should.equal('col-xs-offset-2');
      }));
      it('should put computer in the correct spot', inject(function(){
        $httpBackend
          .whenGET('/layout/EBU3B B220')
          .respond( {"length":"8",
                     "width":"8",
                     "computers":{"1":{"x":"6",
                                       "y":"0"},
                                  "2":{"x":"6",
                                       "y":"1"}
        }});
        myFact.get('EBU3B B220');
        $httpBackend.flush();
        myFact.layout.table[6][0].should.equal('1');
      }));
    });
  });

  describe('factory: computers', function(){

      beforeEach(inject(function(computers,_$httpBackend_){
        myFact = computers;
        $httpBackend = _$httpBackend_;
      }));

      it('can get an instance of computers', inject(function(){
        $httpBackend
          .whenGET('/computers/EBU3B B220')
          .respond({ 'ACS-CSEB240-01' : {"state" : "IN USE",
                                         "os" : "Linux"},
                     'ACS-CSEB240-02' : {"state" : "OPEN",
                                         "os" : "Windows"},
                     'ACS-CSEB240-03' : {"state" : "IN REPAIR",
                                         "os" : "Windows"}
          });
        myFact.get('EBU3B B220');
        $httpBackend.flush();
        myFact.comps.should.not.equal(null);
      }));

      it('should save data to parsed computer number', inject(function(){
        $httpBackend
          .whenGET('/computers/EBU3B B220')
          .respond({ 'ACS-CSEB240-01' : {"state" : "IN USE",
                                         "os" : "Linux"},
                     'ACS-CSEB240-02' : {"state" : "OPEN",
                                         "os" : "Windows"},
                     'ACS-CSEB240-03' : {"state" : "IN REPAIR",
                                         "os" : "Windows"}
          });
        myFact.get('EBU3B B220');
        $httpBackend.flush();
        myFact.comps[1].state.should.equal('IN USE');
      }));

  });

  describe('factory: reservations', function(){

      beforeEach(inject(function(reservations,_$httpBackend_){
        myFact = reservations;
        $httpBackend = _$httpBackend_;
      }));

      it('should get an instance of reservations', inject(function(){
        $httpBackend
          .whenGET('/reservations')
          .respond({ 'EBU3B B220':{ 'title':'CSE 110', 
                                    'start': 'a',
                                    'end'  : 'b'},
          });
        myFact.getAll();
        $httpBackend.flush();
        myFact.reservs.should.not.equal(null);
      }));
  });
/****** END FACTORY TESTS *****/

/****** CONTROLLER TESTS *****/

  describe('Controllers', function(){
    describe('Controller: ParentCtrl', function(){
      it('should be initially collapsed', inject(function($controller){
        var scope = {};
        var parentCtrl = $controller('ParentCtrl', {
          $scope: scope,
          $location: {}
        });
        scope.isCollapsed.should.equal(true);
      }));
      describe('isActive', function(){
        it('should know when home', inject(function($controller){
          var scope = {};
          var location = {
            path : function(){
              return "/home";
            }
          };
          var parentCtrl = $controller('ParentCtrl', {
            $scope: scope,
            $location: location
          });
          scope.isActive("/#/home").should.equal(true);
        }));
      });
    });

    describe('Controller: MainCtrl', function(){
      it('should make the correct url', inject(function($controller){
        var scope = {
          $parent : {
              $scope : {},
              $location : {}
            }
        };
        var mainCtrl = $controller('MainCtrl', {
          $scope:scope
        });
        scope.makeurl("B230").should.equal("/#/map/B230");
      }));

      it('should set bubbles', inject(function($controller){
        var scope = {
          $parent : {
              $scope : {},
              $location : {}
            }
        };
        var myBub = {
          percs : { 'EBU3B B220' : {
                commonLabName  : 'B220',
                freeSpace      : '08',
                totalSpace     : '42',
              }
          }
        };
        var mainCtrl = $controller('MainCtrl', {
          $scope:scope,
          bubbles : myBub
        });
        scope.bubbles['EBU3B B220'].freeSpace.should.equal('08');
      }));


      it('should update bubbles', inject(function($controller,$interval){
        var scope = {
          $parent : {
              $scope : {},
              $location : {}
            }
        };
        var myBub = {
          percs : { 'EBU3B B220' : {
                commonLabName  : 'B220',
                freeSpace      : '08',
                totalSpace     : '42',
              }
          },
          getAll : function(){
            myBub.percs = { 'EBU3B B220' : {
                commonLabName  : 'B220',
                freeSpace      : '10',
                totalSpace     : '42',
              }
            };
          }
        };
        var mainCtrl = $controller('MainCtrl', {
          $scope:scope,
          $state : {
            current : {
              controller : "MainCtrl"
            }
          },
          bubbles : myBub
        });
        scope.intervalFunction();
        scope.bubbles['EBU3B B220'].freeSpace.should.equal('10');
      }));
    });

    describe('Controller: MapCtrl', function(){

      it('should set computers', inject(function($controller){
        var scope = {
          $parent : {
              $scope : {},
              $location : {}
            }
        };
        var myComp = {
          comps : { 1 : {"state" : "IN USE",
                                      "os" : "Linux"},
                    2 : {"state" : "OPEN",
                                      "os" : "Windows"},
                    3 : {"state" : "IN REPAIR",
                                      "os" : "Windows"}
                  }
        };
        var mapCtrl = $controller('MapCtrl', {
          $scope : scope,
          computers: myComp
        });

        scope.computers[1].state.should.equal('IN USE');
      }));

      it('should update computers', inject(function($controller){
        var scope = {
          $parent : {
              $scope : {},
              $location : {}
            }
        };
        var myComp = {
          comps : { 1 : {"state" : "IN USE",
                                      "os" : "Linux"},
                    2 : {"state" : "OPEN",
                                      "os" : "Windows"},
                    3 : {"state" : "IN REPAIR",
                                      "os" : "Windows"}
                  },
          get : function(labName){
            myComp.comps = { 1 : {"state" : "OPEN",
                                      "os" : "Linux"},
                             2 : {"state" : "OPEN",
                                                  "os" : "Windows"},
                             3 : {"state" : "IN REPAIR",
                                                  "os" : "Windows"}
                             }
          }
        };
        var mapCtrl = $controller('MapCtrl', {
          $scope : scope,
          $state : {
            current : {
              controller : "MapCtrl"
            }
          },
          computers: myComp,
          layout: {
            layout : {
              lName : "EBU3B B240"
            }
          }
        });

        scope.intervalFunction();
        scope.computers[1].state.should.equal('OPEN');
      }));
    });

    describe('Controller: AboutUsCtrl', function(){
    
      it('should set people', inject(function($controller){
        var scope = {
          $parent : {
              $scope : {},
              $location : {}
            }
        };
        var aboutUsCtrl = $controller('AboutUsCtrl', {
          $scope : scope
        });
        scope.people.should.not.equal(null);
      }));
    });
  });
/****** END CONTROLLER TESTS *****/
});
