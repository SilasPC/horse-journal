
const tomHest = () => ({
    navn: 'Ny hest',
    foedt: new Date(),
    hoejde: 150,
    id: '',
    koen: 'Hoppe',
    smed: [],
    vacine: [],
    medicin: []
})

const heste = [{
    navn: 'Marlon B OX',
    foedt: new Date('1/1/2003'),
    hoejde: 157,
    id: '208336OX1105432',
    koen: 'Vallak',
    smed: [],
    vaccine: [{
        type: 'Herpes',
        dato: new Date('2/26/2021')
    }],
    medicin: []
}]

const app = angular.module('app', ['ngRoute'])
app.config(function($routeProvider) {
    $routeProvider
        .when('/hest/:idx', {
            templateUrl: './hest.html',
            controller: 'hest'
        })
        .when('/vaccines', {
            templateUrl: './vaccine.html',
            controller: 'vaccines'
        })
        .otherwise({
            templateUrl: './oversigt.html'
        })
})

app.controller('ctrl', function($scope) {
    Object.assign($scope, {
        heste,
        nyHest,
    })
})

app.controller('hest', function($scope, $routeParams) {
    $scope.hest = $scope.$parent.heste[$routeParams.idx]
    $scope.deleteHorse = deleteHorse
})

app.controller('vaccines', function($scope) {
})

function deleteHorse() {
    let idx = this.$parent.heste.indexOf(this.hest)
    this.$parent.heste.splice(idx, 1)
    location.hash = ''
}

function nyHest() {
    let h = tomHest()
    this.heste.push(h)
    this.heste.sort(cmp)
    location.hash = '#!hest/'+this.heste.indexOf(h)
}

function cmp(a,b) {
    return a < b ? -1 : ( a == b ? 0 : 1)
}
