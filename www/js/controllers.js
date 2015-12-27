angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $window, $http, $state, $rootScope, Session, User, $ionicSlideBoxDelegate) {
  if ($window.localStorage.token) {
    $state.go('tab.home', {}, {reload: true})
  } else {
    $state.go('forms', {}, {reload: true})
  }
  $scope.currentUser = Boolean($window.localStorage.token)
  // Form data for the login modal
  $scope.logout = function() {
    $window.localStorage.token = ''
    $scope.currentUser = Boolean($window.localStorage.token)
    $http.defaults.headers.common['Authorization'] = ''
    console.log($window.localStorage.token)
    $rootScope.loginErr = ''
    $rootScope.signupErr = ''
    $state.go('forms', {}, {reload: true})
  }

})

.controller('FormsCtrl', function($scope, $http, $state, $rootScope, $window, $stateParams, Session, User, Chats, Photo, Api) {
  $scope.chats = Chats.all()
  $scope.chat = Chats.get($stateParams.id)
  $scope.loginData = {email: "gsp@gmail.com", password: "191954"}
  $scope.signupData = {name:'gsp'}
  $rootScope.loginErr = ''
  $rootScope.signupErr = ''
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    var sess = new Session($scope.loginData)
    sess.$save(function(data) {
      console.log(data.token)
      if (data.token) {
        $window.localStorage.token = data.token
        $scope.currentUser = Boolean($window.localStorage.token)
        $http.defaults.headers.common['Authorization'] = "Token token=" + data.token
        console.log($window.localStorage.token)
        $state.go('tab.home', {}, {reload: true})
      } else {
        console.log(data.err)
        $rootScope.loginErr = data.err
      }
    })
  }

  $scope.doSignup = function() {
    $scope.signupData.avatar = document.getElementById("avatar").src
    var user = new User($scope.signupData)
    user.$save(function(data) {
      console.log(data.token) // console.log(err);
      if (data.token) {
        $window.localStorage.token = data.token
        $scope.currentUser = Boolean($window.localStorage.token)
        $http.defaults.headers.common['Authorization'] = "Token token=" + data.token
        console.log($window.localStorage.token)
        // $scope.closeForms()
        $state.go('tab.home', {}, {reload: true})
      } else {
        // $scope.modal.show()
        console.log(data.err)
        $rootScope.signupErr = data.err
        // $scope.showForms()
      }
    })
  }

  $scope.photos = []; $scope.page = 0; $scope.lastId = 0; $scope.limit = 5; $scope.dataLength = $scope.limit
  $scope.loadMore = function() {
      Photo.query({page: $scope.page, lastId: $scope.lastId})
      .$promise.then(function(data) {
        // console.log(JSON.stringify(data))
        $scope.photos = $scope.photos.concat(data)
        $scope.page += 1
        $scope.$broadcast('scroll.infiniteScrollComplete')
      })
  }

})

.controller('HomeCtrl', function($scope, $http, $state, $rootScope, $window, $resource, Chats, Post, Photo, Api) {
  $scope.chats = Chats.all()
  var Par = $resource($rootScope.baseUrl + '/api/partners/:id')
  $scope.photos = []; $scope.page = 0; $scope.lastId = 0; $scope.limit = 5; $scope.dataLength = $scope.limit
  $scope.loadMore = function() {
    if ($scope.dataLength == $scope.limit){
      Par.get({id:0, page: $scope.page, lastId: $scope.lastId})
      .$promise.then(function(data) {
        console.log(JSON.stringify(data))
        $scope.dataLength = data.photos.length
        $scope.photos = $scope.photos.concat(data.photos)
        if ($scope.page == 0){$scope.s_askers = data.s_askers; $scope.s_targets = data.s_targets;
           $scope.partners = data.partners; $scope.user = data.user}
        if (data.photos.length == $scope.limit) {$scope.lastId = data.photos[$scope.limit-1].id}
        $scope.page += 1
        $scope.$broadcast('scroll.infiniteScrollComplete')
      })
      // $scope.$broadcast('scroll.infiniteScrollComplete')
    }
  }
  $scope.loadMore()
})

.controller('UphotoCtrl', function($scope, $http, $state, $rootScope, Qiniu, Post, Photo, Api) {
  $scope.temfile = ""
  $scope.temfile = function(f) {
    $scope.temfile = f
    console.log($scope.temfile)
    // console.log($scope.temfile.$ngfName)
  }
  $scope.upPhoto = function() {
    Qiniu.ngFileUp($scope.temfile).then(function (resp) {
      console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data.key + JSON.stringify(resp.data));
      // http://7xj5ck.com1.z0.glb.clouddn.com/2015-11-28T06%3A11%3A25.113Z
      var ph = new Photo({key: resp.data.key})
      ph.$save(function(data) {
          $state.go('tab.home', null, {reload: true})
          // console.log(data.suc)
      })
    }, function (resp) {
      console.log('Error status: ' + resp.status);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    })
  }
})

.controller('UserIdCtrl', function($scope, $stateParams, $http, $state, $rootScope, $window, Post, Comment, User, Follow, Chats, Api) {
  // $scope.user = User.get({id: $stateParams.uId})
  $scope.chat = Chats.get($stateParams.id)

})

.controller('ChangeCtrl', function($scope, $http, $rootScope, $state, $window, $resource, Chats, Post, Photo, Api) {
  $scope.photos = []; $scope.page = 0; $scope.lastId = 0; $scope.limit = 5; $scope.dataLength = $scope.limit
  $scope.loadMore = function() {
      Photo.query({page: $scope.page, lastId: $scope.lastId})
      .$promise.then(function(data) {
        console.log(JSON.stringify(data))
        $scope.photos = $scope.photos.concat(data)
        $scope.page += 1
        $scope.$broadcast('scroll.infiniteScrollComplete')
      })
  }
})

.controller('StrangersIdCtrl', function($scope, $http, $rootScope, $stateParams, $state, $window, $resource, Chats, Post, Photo, Api) {
  var Str = $resource($rootScope.baseUrl + '/api/strangers/:id')
  $scope.s_asker_q = true
  Str.get({id: $stateParams.id}).$promise.then(function(data) {
    console.log(JSON.stringify(data))
    $scope.photos = data.photos
    $scope.user = data.user
    $scope.s_asker_q = data.s_asker_q
    $scope.s_target_q = data.s_target_q
    $scope.partner_q = data.partner_q
    data.user.password_digest == $window.localStorage.token? ($scope.isCurrentUser = true):($scope.isCurrentUser = false)
  })
  var Asker = $resource($rootScope.baseUrl + '/api/asker/:id')
  $scope.ask = function() {
    var ak = new Asker({id:$stateParams.id})
    ak.$save(function(data) {
      $scope.s_asker_q = !$scope.s_asker_q
    })
  }
  var Agree = $resource($rootScope.baseUrl + '/api/agree/:id')
  $scope.agree = function() {
    var ag = new Agree({id:$stateParams.id})
    ag.$save(function(data) {
      $scope.partner_q = !$scope.partner_q
    })
  }
})

.controller('PartnersIdCtrl', function($scope, $http, $state, $rootScope, $stateParams, $window, $resource, Chats, Post, Photo, Api) {
  var Par = $resource($rootScope.baseUrl + '/api/partners/:id')
  $scope.photos = []; $scope.page = 0; $scope.lastId = 0; $scope.limit = 5; $scope.dataLength = $scope.limit
  $scope.loadMore = function() {
    if ($scope.dataLength == $scope.limit){
      Par.get({id:$stateParams.id, page: $scope.page, lastId: $scope.lastId})
      .$promise.then(function(data) {
        console.log(JSON.stringify(data))
        $scope.dataLength = data.photos.length
        $scope.photos = $scope.photos.concat(data.photos)
        if ($scope.page == 0){$scope.user = data.user}
        if (data.photos.length == $scope.limit) {$scope.lastId = data.photos[$scope.limit-1].id}
        $scope.page += 1
        $scope.$broadcast('scroll.infiniteScrollComplete')
      })
      // $scope.$broadcast('scroll.infiniteScrollComplete')
    }
  }
  $scope.loadMore()
  $scope.partner_q = true
  var Unagree = $resource($rootScope.baseUrl + '/api/unagree/:id')
  $scope.unagree = function() {
    var unag = new Unagree({id:$stateParams.id})
    unag.$save(function(data) {
      $scope.partner_q = !$scope.partner_q
    })
  }
})

.controller('MessageCtrl', function($scope, $http, $rootScope,$cordovaCamera,$cordovaCapture, $cordovaImagePicker,$resource,$cordovaInAppBrowser) {

})

.controller('AccountCtrl', function($scope,$http,$cordovaCamera,$cordovaCapture) {

})
