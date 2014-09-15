angular.module('directory.services', ['ngResource'])

    .factory('Employees', function ($resource) {
        return $resource('http://127.0.0.1:5000/employees/:employeeId/:data');
    });