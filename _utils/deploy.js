const ghpages = require('gh-pages');

console.log('Starting to deploy to GitHub Pages');

ghpages.publish(
  'public',
  {
    branch: 'gh-pages',
    repo: 'git@github.com:xkons/blog.git',
  },
  function (err) {
    if (err) {
      console.log('Error while deploying: ' + err);
    } else {
      console.log('Successfully deployed to https://www.xkons.de');
    }
  }
);
