angular.module('starter.services', [])

.factory('User', function($resource, $rootScope) {
  return $resource($rootScope.baseUrl + '/api/users/:id');
})

.factory('Follow', function($resource, $rootScope) {
  return $resource($rootScope.baseUrl + '/api/follow/:id');
})

.factory('Post', function($resource, $rootScope) {
  return $resource($rootScope.baseUrl + '/api/posts/:id');
})

.factory('Comment', function($resource, $rootScope) {
  return $resource($rootScope.baseUrl + '/api/comments/:id');
})

.factory('Session', function($resource, $rootScope) {
  return $resource($rootScope.baseUrl + '/api/session/:id');
})
.factory('Photo', function($resource, $rootScope) {
  return $resource($rootScope.baseUrl + '/api/photos/:id');
})

.factory('Qiniu', function($window, $http ,Upload) {
  return {
    ngFileUp: function(f) {
      return Upload.upload({
        url: "http://upload.qiniu.com",
        data: {file: f, key: new Date(), token: $window.localStorage.qiniuToken}
      })
    }
  }
})

.factory('Api', function($resource, $rootScope) {
  return {
    User: function() {
      return $resource($rootScope.baseUrl + '/api/users/:id')
    },
    Post: function() {
      return $resource($rootScope.baseUrl + '/api/posts/:id')
    },
    Comment: function() {
      return $resource($rootScope.baseUrl + '/api/comments/:id')
    },
    Session: function() {
      return $resource($rootScope.baseUrl + '/api/session/:id')
    },
    Follow: function() {
      return $resource($rootScope.baseUrl + '/api/follow/:id')
    }
  }
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array
  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    email: 'BenSparrow@gmail.com',
    content: 'You on your way?',
    photo: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  },{
    id: 1,
    name: 'Ben Sparrow',
    email: 'BenSparrow@gmail.com',
    content: 'You on your way?',
    photo: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  },{
    id: 2,
    name: 'Ben Sparrow',
    email: 'BenSparrow@gmail.com',
    content: 'You on your way?',
    photo: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  },{
    id: 3,
    name: 'Ben Sparrow',
    email: 'BenSparrow@gmail.com',
    content: 'You on your way?',
    photo: 'http://7xj5ck.com1.z0.glb.clouddn.com/2015-11-01T08%3A06%3A44.599Z'
  },{
    id: 4,
    name: 'Ben Sparrow',
    email: 'BenSparrow@gmail.com',
    content: 'You on your way?',
    photo: 'http://7xj5ck.com1.z0.glb.clouddn.com/2015-11-01T08%3A06%3A44.599Z'
  },{
    id: 5,
    name: 'Ben Sparrow',
    email: 'BenSparrow@gmail.com',
    content: 'You on your way?',
    photo: 'http://7xj5ck.com1.z0.glb.clouddn.com/2015-11-01T08%3A06%3A44.599Z'
  },{
    id: 6,
    name: 'Ben Sparrow',
    email: 'BenSparrow@gmail.com',
    content: 'You on your way?',
    photo: 'http://7xj5ck.com1.z0.glb.clouddn.com/2015-11-01T08%3A06%3A44.599Z'
  },{
    id: 7,
    name: 'Ben Sparrow',
    email: 'BenSparrow@gmail.com',
    content: 'You on your way?',
    photo: 'http://7xj5ck.com1.z0.glb.clouddn.com/2015-11-01T08%3A06%3A44.599Z'
  },{
    id: 8,
    name: 'Ben Sparrow',
    email: 'BenSparrow@gmail.com',
    content: 'You on your way?',
    photo: 'http://7xj5ck.com1.z0.glb.clouddn.com/2015-11-01T08%3A06%3A44.599Z'
  },{
    id: 9,
    name: 'Ben Sparrow',
    email: 'BenSparrow@gmail.com',
    content: 'You on your way?',
    photo: 'http://7xj5ck.com1.z0.glb.clouddn.com/2015-11-01T08%3A06%3A44.599Z'
  },{
    id: 10,
    name: 'Ben Sparrow',
    email: 'BenSparrow@gmail.com',
    content: 'You on your way?',
    photo: 'http://7xj5ck.com1.z0.glb.clouddn.com/2015-11-01T08%3A06%3A44.599Z'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  }
})
