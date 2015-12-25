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

.controller('FormsCtrl', function($scope, $http, $state, $rootScope, $window, $stateParams, Session, User, Chats, Api) {
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
      // console.log(err);
      if (data.token) {
        $window.localStorage.token = data.token
        $scope.currentUser = Boolean($window.localStorage.token)
        $http.defaults.headers.common['Authorization'] = "Token token=" + data.token
        console.log($window.localStorage.token)
        // $scope.closeForms()
        $state.go('tab.home', {}, {reload: true})
      } else {
        console.log(data.err)
        $rootScope.loginErr = data.err
        // $scope.showForms()
      }
    })

  }

  $scope.doSignup = function() {
    var user = new User($scope.signupData)
    user.$save(function(data) {
      console.log(data.token)
      // console.log(err);
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
           $scope.partners = data.partners}
        if (data.photos.length == $scope.limit) {$scope.lastId = data.photos[$scope.limit-1].id}
        $scope.page += 1
        $scope.$broadcast('scroll.infiniteScrollComplete')
      })
      // $scope.$broadcast('scroll.infiniteScrollComplete')
    }
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
})

.controller('WriteCtrl', function($scope, $http, $state, $rootScope, Qiniu, Post, Photo, Api) {
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
    // if ($scope.dataLength == $scope.limit){
      Photo.query({page: $scope.page, lastId: $scope.lastId})
      .$promise.then(function(data) {
        console.log(JSON.stringify(data))
        // $scope.dataLength = data.length
        $scope.photos = $scope.photos.concat(data)
        $scope.page += 1
        // if (data.length == $scope.limit) {$scope.lastId = data[$scope.limit-1].id}
        $scope.$broadcast('scroll.infiniteScrollComplete')
      })
    // }
  }

})

.controller('StrangersIdCtrl', function($scope, $http, $rootScope, $stateParams, $state, $window, $resource, Chats, Post, Photo, Api) {
  var Str = $resource($rootScope.baseUrl + '/api/strangers/:id')
  Str.get({id: $stateParams.id}).$promise.then(function(data) {
    console.log(JSON.stringify(data))
    $scope.photos = data.photos
    $scope.user = data.user
    $scope.s_asker_q = data.s_asker_q
    $scope.s_target_q = data.s_target_q
    $scope.partner_q = data.partner_q
    // user: user, s_asker_q:user.s_asker?(@api_user), s_target_q:user.s_target?(@api_user), partner_q:user.partner?(@api_user)
  })
})

.controller('MessageCtrl', function($scope, $http, $rootScope,$cordovaCamera,$cordovaCapture, $cordovaImagePicker,$resource,$cordovaInAppBrowser) {

  // var Token = $resource('http://localhost:3000/uptoken')
  var Po = $resource('http://localhost:3000/sina/test')
  $resource('http://localhost:3000/uptoken').get().$promise.then(function(data) {
    console.log(data.uptoken)
    console.log(JSON.stringify(data))
  })
})

.controller('AccountCtrl', function($scope,$http,$cordovaCamera,$cordovaCapture) {
  $scope.settings = {
    enableFriends: true
  }

})

// $scope.posts = []
// $scope.page = 0
// $scope.lastId = 0
// $scope.limit = 5
// $scope.dataLength = $scope.limit
// $scope.loadMore = function() {
//   if ($scope.dataLength == $scope.limit){
//     // $scope.page += 1
//     Post.query({page: $scope.page, lastId: $scope.lastId})
//     .$promise.then(function(data) {
//       console.log(JSON.stringify(data))
//       $scope.dataLength = data.length
//       $scope.posts = $scope.posts.concat(data)
//       //Stop the ion-refresher from spinning
//       $scope.page += 1
//       if (data.length == $scope.limit) {$scope.lastId = data[$scope.limit-1].id}
//       $scope.$broadcast('scroll.infiniteScrollComplete')
//     })
//     // $scope.$broadcast('scroll.infiniteScrollComplete')
//   }
// }
//
// $scope.doRefresh = function() {
//   // $state.go('tab.home', null, {reload: true})
//   // $window.location.reload(true)
//   $state.go($state.current, {}, {reload: true})
//   $scope.$broadcast('scroll.refreshComplete')
// }

// $scope.posts = []
// $scope.isCurrentUser = true
// $scope.page = 0
// $scope.lastId = 0
// $scope.limit = 5
// $scope.dataLength = $scope.limit
// $scope.loadMore = function() {
//   if ($scope.dataLength == $scope.limit) {
//     // $scope.page++
//     User.get({id: $stateParams.id, page: $scope.page, lastId: $scope.lastId})
//     .$promise.then(function(data) {
//       console.log(JSON.stringify(data))
//       $scope.dataLength = data.posts.length
//       if (  $scope.page == 0){
//         $scope.user = data.user
//         $scope.foing = data.foing
//         if ($window.localStorage.token == data.user.password_digest) {
//           $scope.isCurrentUser = true
//         } else {
//           $scope.isCurrentUser = false
//         }
//       }
//       $scope.posts = $scope.posts.concat(data.posts)
//       if (data.posts.length == $scope.limit) {$scope.lastId = data.posts[$scope.limit-1].id}
//       $scope.page += 1
//       //Stop the ion-refresher from spinning
//       $scope.$broadcast('scroll.infiniteScrollComplete')
//     })
//   }
// }
//
// $scope.follow = function() {
//   var fo = new Follow({id: $stateParams.id})
//   fo.$save(function(data) {
//     console.log(JSON.stringify(data))
//     $scope.foing = !$scope.foing
//   })
// }
//
// $scope.unfollow = function() {
//   Follow.get({id: $stateParams.id})
//   .$promise.then(function(data) {
//     console.log(JSON.stringify(data))
//     $scope.foing = !$scope.foing
//   })
// }
