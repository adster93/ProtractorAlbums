require('../helper');
var db = require('../../config/database');
var albumCollection = db.get('albums');
var userCollection = db.get('users');
var http = require('http'),
    server;

var blink = {
    genre: 'Rock',
    artist: 'Blink 182',
    album: 'Dude Ranch'
}

before(function() {
    server = http.createServer(require('../../app'));
    server.listen(5000);
    browser.baseUrl = 'http://localhost:' + server.address().port;
    albumCollection.insert(blink, function(err, album) {});
    userCollection.insert({username: 'billy bob', password: 'jones'}, function(err, user) {});
});

beforeEach(function() {
    return browser.ignoreSynchronization = true;
});

after(function() {
    albumCollection.remove({}, function(err, album) {});
    userCollection.remove({}, function(err, user) {});
    server.close();
});

describe('Given I visit /', function() {
    it('should display the title', function() {
        browser.get('/')
        element(by.tagName('h1')).getText().then(function(text) {
            expect(text).to.equal('OMG Albums!')
        })
    })
    it('should display the link', function() {
        browser.get('/')
        element(by.tagName('a')).getText().then(function(text) {
            expect(text).to.equal('Let me see the RIGHT NOW!')
        })
    })
    it('should redirect to /albums when link is clicked', function() {
        browser.get('/')
        element(by.tagName('a')).click()
        browser.getCurrentUrl().then(function(url) {
            expect(url).to.equal('http://localhost:5000/albums')
        })
    })
    it('should have a signup link', function() {
        browser.get('/')
        idExpression('signup', 'Sign Up')
    })
    it('should contain a ', function() {
        browser.get('/')
        element(by.id('signup')).click()
        browser.getCurrentUrl().then(function(url) {
            expect(url).to.equal('http://localhost:5000/signup')
        })
    })
})

describe('Given I vist /albums', function() {
    it('should display the title', function() {
        browser.get('/albums')
        element(by.tagName('h1')).getText().then(function(text) {
            expect(text).to.equal('Albums')
        })
    })
    it('should display a table with three headings', function() {
        browser.get('/albums')
        element(by.css('.header')).getText().then(function(text) {
            expect(text).to.equal('Genre Artist Album')
        })
    })
    it('displays all albums in the DB', function() {
        browser.get('/albums')
        element(by.css('.albumRow')).getText().then(function(text) {
            expect(text).to.equal('Rock Blink 182 Dude Ranch')
        })
    })
    it('displays the all albums link', function() {
        browser.get('/albums')
        element(by.tagName('a')).getText().then(function(text) {
            expect(text).to.equal('New Album')
        })
    })
    it('should redirect to /albums/new when link is clicked', function() {
        browser.get('/albums')
        element(by.tagName('a')).click()
        browser.getCurrentUrl().then(function(url) {
            expect(url).to.equal('http://localhost:5000/albums/new')
        })
    })
    it('should redirect you to the /albums/id when link is clicked', function() {
        browser.get('/albums')
        element(by.id('Dude Ranch')).click()
        browser.getCurrentUrl().then(function(url) {
            expect(url).to.equal('http://localhost:5000/albums/Dude%20Ranch')
        })
    })
})

describe('Give I visit /albums/new', function() {
    it('should display create album title', function() {
        browser.get('/albums/new')
        element(by.tagName('h4')).getText().then(function(text) {
            expect(text).to.equal('Create Album')
        })
    })
    it('should display a form', function() {
        browser.get('/albums/new')
        expect(element(by.tagName('form')).isDisplayed()).to.be.True
    })
    it('should display an input for Album and Artist', function() {
        browser.get('/albums/new')
        expect(element(by.css('#albumInput')).isDisplayed()).to.be.True
        expect(element(by.css('#artistInput')).isDisplayed()).to.be.True
    })
    it('should display an input for Album and Artist', function() {
        browser.get('/albums/new')
        var genre = element(by.id('genreSelect'))
        genre.getAttribute('value').then(function(value) {
            expect(value).to.equal('')
        })
    })
    it('should display a rating value', function() {
        browser.get('/albums/new')
        var rating = element(by.css('.rating'))
        rating.getAttribute('value').then(function(value) {
            expect(value).to.equal('1')
        })
    })
    it('should display off', function() {
        browser.get('/albums/new')
        var explicit = element(by.id('explicit'))
        explicit.isSelected().then(function(check) {
            expect(check).to.equal(true)
        })
    })
    it('should redirect to /albums when cancel is clicked', function() {
        browser.get('/albums/new')
        element(by.id('cancel')).click()
        browser.getCurrentUrl().then(function(url) {
            expect(url).to.equal('http://localhost:5000/albums')
        })
    })
})

describe('when new form is submitted', function() {
    it('should redirect to /albums', function() {
        browser.get('/albums/new')
        element(by.id('submit')).click()
        browser.getCurrentUrl().then(function(url) {
            expect(url).to.equal('http://localhost:5000/albums')
        })
    })
    it('should display info in /albums table', function() {
        browser.get('/albums/new')

        element(by.id('artistInput')).sendKeys("Nas")
        element(by.id('albumInput')).sendKeys("illuminati")
        element(by.id('submit')).click()
        element(by.id('illuminati')).getText().then(function(text) {
            expect(text).to.equal('illuminati')
        })
    })
})

describe('when I visit /albums/:albumName', function() {
    it('should display the album header and album name', function() {
        browser.get('/albums/Dude%20Ranch')
        element(by.tagName('h1')).getText().then(function(text) {
            expect(text).to.equal('Showing Album: Dude Ranch')
        })
    })
    it('should display the album header and album name', function() {
        browser.get('/albums/Dude%20Ranch')
        element(by.id('showArtist')).getText().then(function(text) {
            expect(text).to.equal('Artist: Blink 182')
        })
    })
    it('should display the album header and album name', function() {
        browser.get('/albums/Dude%20Ranch')
        element(by.id('showGenre')).getText().then(function(text) {
            expect(text).to.equal('Genre: Rock')
        })
    })
    it('should take me to /ablums/:albumName/edit when I click edit', function() {
        browser.get('/albums/Dude%20Ranch')
        element(by.id('editButton')).click()
        browser.getCurrentUrl().then(function(url) {
            expect(url).to.equal('http://localhost:5000/albums/Dude%20Ranch/edit')
        })
    })
    describe('when a user clicks delete', function() {
        it('should redirect me to /albums', function() {
            browser.get('/albums/Dude%20Ranch')
            element(by.id('submitDelete')).click()
            browser.getCurrentUrl().then(function(url) {
                expect(url).to.equal('http://localhost:5000/albums')
            })
        })
    })
})

describe('When I visit /albums/:albumName/edit', function() {
    it('should display the edit album header', function() {
        browser.get('/albums/Dude%20Ranch/edit')
        tagNameExpression('h4', 'Edit Album')
    })
    it('should display unedited values when page renders', function() {
        browser.get('/albums/Dude%20Ranch/edit')

        getAttribute('artistEdit', 'Blink 182')
        getAttribute('albumEdit', 'Dude Ranch')
        getAttribute('genreEdit', 'Rock')
    })
    it('can change the value', function() {
        browser.get('/albums/Dude%20Ranch/edit')
        element(by.id('artistEdit')).clear()
        element(by.id('artistEdit')).sendKeys('Backstreet')
        element(by.id('submitEdit')).click()
        idExpression('Backstreet', 'Backstreet')
    })
})

describe('When I visit /users/signup', function (){
  it('should display Sign-Up in a h1 header', function(){
    browser.get('/signup');
    tagNameExpression('h1', 'Sign-Up');
  });
  it('can change the value', function() {
      browser.get('/signup');
      element(by.id('username')).sendKeys('billy bob');
      element(by.id('password')).sendKeys('jones');
      getAttribute('password', 'jones')
      getAttribute('username', 'billy bob')
  });
});

describe('When I visit /users/login', function() {
    it('should display the login header', function() {
        browser.get('/users/login');
        tagNameExpression('h1', 'Login')
    });
    it('should display the username', function(){
      browser.get('/users/login')
      element(by.id('username')).sendKeys('billy bob');
      element(by.id('password')).sendKeys('jones');
      element(by.id('submit')).click()
      tagNameExpression('h2', 'Hello billy bob')
    })
    it('should not display username', function(){
      browser.get('/users/login')
      element(by.id('username')).sendKeys('billy bob');
      element(by.id('password')).sendKeys('jones');
      element(by.id('submit')).click()
      browser.get('/albums')
      element(by.id('logout')).click()
      tagNameExpression('h2', 'Hello')
    })
});

function tagNameExpression(tag, string) {
    element(by.tagName(tag)).getText().then(function(text) {
        expect(text).to.equal(string)
    })
}

function idExpression(tag, string) {
    element(by.id(tag)).getText().then(function(text) {
        expect(text).to.equal(string)
    })
}

function getAttribute(id, string) {
    element(by.id(id)).getAttribute('value').then(function(value) {
        expect(value).to.equal(string)
    })
}
