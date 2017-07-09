const request = require('request')
const fs = require('fs');
const parseLH = require('parse-link-header');
const spawn = require('child_process').spawnSync;

var argv = require('minimist')(process.argv.slice(2));

var org = argv['org'];
var user = argv['user'];
var token = argv['token'];
var save = argv['save'];
var assignment = argv['assignment'];

const credentials = 'credentials.json';

if (fs.existsSync(credentials)) {
  var savedAuth = JSON.parse(fs.readFileSync(credentials));
  org = savedAuth['org'];
  user = savedAuth['user'];
  token = savedAuth['token'];
}

if (save) {
  fs.writeFileSync(credentials,
    JSON.stringify({'org': org, 'user': user, 'token': token}))
}

var options = {
  url: 'https://api.github.com/orgs/' + org + '/repos',
  headers: {
    'User-Agent': user,
    'per-page': 100
  }
}

request(options, doResponse([])).auth(user, token, true);

function doResponse(repos) {
  return function(err, res, body) {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    if (res.statusCode == 404) {
      console.log("Could not find organization");
      process.exit(1);
    }
    var newRepos = JSON.parse(body);
    var allRepos = repos.concat(newRepos);
    if (res.headers['link']) {
      var links = parseLH(res.headers['link']);
      if (links['next']) {
        options['url'] = links['next']['url'];
        request(options, doResponse(allRepos)).auth(user, token, true);
      } else {
        cloneAssignments(allRepos);
        process.exit(0);
      }
    } else {
      cloneAssignments(allRepos);
    }
  }
}

function cloneAssignments(repos) {
  var assignmentRepos = repos.filter((repo) => {
    return repo['name'].startsWith(assignment);
  });
  var assignmentDir = __dirname + '/' + assignment;
  if (!fs.existsSync(assignmentDir))
    fs.mkdirSync(assignmentDir);
  process.chdir(assignmentDir);
  for (var a of assignmentRepos) {
    console.log("Cloning " + a['ssh_url']);
    var git = spawn('git', ['clone', a['ssh_url']]);
  }
}
