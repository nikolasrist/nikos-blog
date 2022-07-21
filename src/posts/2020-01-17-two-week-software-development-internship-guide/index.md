---
date: 2020-01-17
title: "How to structure a two week internship for software development"
description: "I came up with this plan of a two week software development internship for 16 year old school student Sidney, who I volunteered to teach the ways of a software developer. Since a lot of coworkers and parents asked me how I structured it, I summarize it here."
tags:
  - blog
---

I came up with this plan of a two week software development internship for 16 year old school student Sidney, who I volunteered to teach the ways of a software developer. Since a lot of coworkers and parents asked me how I structured it, I summarize it here.

You can find the project that Sidney built in these two weeks here:
* Source code: https://github.com/SidneyK1/pong
* Game: https://sidneyk1.github.io/pong/

It's his own take on the game Pong, but with a stronger tennis theme, since he plays tennis competitively.
You can control the paddles via keyboard or touch input and choose between singleplayer mode against an "AI" or multiplayer against your friends. There's even a special item which increases the ball speed for a short amount of time.

I'm quite proud of what he achieved in this short amount of time without having any prior programming experience.

## Day 1 to Day 4
Get to know the intern (age, hobbies, potential job interests).

Explain how you ended up working as a software developer and remember to answer questions at any time.

Explain why coding is "cool".

> Let's say an alien came, and you're like, "Okay, what's the importance of code?".
I'd say, "Well, you know, we live on this sort of physical earth, and about 50 years ago, a small group of people started building another planet. But it wasn't physical, a virtual planet.
Look around the street. You see all the people walking down the street with their head bent down and staring at their phone? They're actually in that other world. That's what code is. It's the building blocks of that other world.
>
— Quote from the episode "Coding" on the "Explained" series on Netflix

> Today, coders shape literally billions of people's lives.
How they work, shop, eat, date, and chill.
What are you doing right now? You're watching me in a Netflix web browser.
So Netflix itself is code, and it's being run in a web browser that is code,
which is being run on a computer that was designed using code.
It's turtles all the way down, right? Great code is like being the architect of a museum that millions of people think of and go and walk around and use every day.
I think there's nothing like writing code, because it feels like pure creation.
You have an idea for how something should work, and then you try to sit down in front of a computer and make that a reality.
>
— Another one, same episode

Use your own words too of course ;-)

Get to know the basic concepts of programming by letting the intern do the hour of code https://hourofcode.com/
  * Some of them are available in english and german and the most popular ones even feature videos with programmers explaining each challenge.
  * Direct link to the different hour of code projects. Finishing one is enough, they are very similar. https://hourofcode.com/de/learn

Figure out together if learning programming by developing games or by developing websites is preferred. This mostly depends if the personal project should be a website or a game and should affect which codeacademy courses the intern should do.

If during the internship you happen to have some meetings that the intern can join, take them along.
  * Make sure to tell them about the "concept of two legs": Once they feel that they really can't follow the meeting anymore, they can leave silently any time to continue learning by themselves.

Create an account at https://codeacademy.com, no trial needed, and let the intern do the following courses (order matters!):
  1. https://www.codecademy.com/learn/welcome-to-codecademy
  2. https://www.codecademy.com/learn/learn-html (not all parts available in free account, optional if the main project will be a game built with Phaser)
  3. https://www.codecademy.com/learn/learn-how-to-code
  4. https://www.codecademy.com/learn/learn-phaser (It's not necessary to finish this one completely, as it's quite long. Consider stopping around [here](https://www.codecademy.com/courses/learn-phaser/lessons/learn-phaser-animations-and-tweens/exercises/sprite-sheets?action=resume_content_item))

Finally decide on what the final project should be, start making notes, draw some UI stuff, write texts...

This project should be related to some passion of the intern, so that they actually care about it. If their hobbies include photography for example, it might be fun to build a personal portfolio website, like [Lukas Meier did](https://github.com/DerMeier/portfolio-website) during his internship.

## Day 5 - 10 Building the project
Setup their computer for building some software, while trying to explain most of the stuff that's happening in a simple manner.
  * Install VSCode, node and git
  * Create a directory for their project, including an `index.html`, `index.js` and `assets` directory.
  * Explain git https://rogerdudler.github.io/git-guide/index.html
  * Initialize a git repository in their project directory and make the initial commit.
  * Let the intern create their own GitHub Account.
    * Create a new repository with an appropriate name for the project.
    * Add the https repository url as remote origin in the local repository.
    * Push your local master branch.
    * Enable GitHub Pages hosting in the repository settings.
  * Create a `.gitignore` file with the following contents:
    ```
    dist
    node_modules
    package-lock.json
    ```
  * Create a `package.json` file with the following contents (Please update the name and homepage value):
    ```json
    {
      "name": "<INSERT PROJECT NAME>",
      "version": "0.0.1",
      "homepage": "http://<GITHUB-USERNAME>.github.io/<REPOSITORY-NAME>",
      "scripts": {
        "build": "webpack --mode production",
        "start": "webpack --mode development && webpack-dev-server",
        "clean": "rm -rf dist node_modules package-lock.json",
        "predeploy": "npm run build",
        "deploy": "gh-pages -d dist"
      },
      "dependencies": {},
      "devDependencies": {
        "copy-webpack-plugin": "^5.1.1",
        "gh-pages": "^2.2.0",
        "html-webpack-plugin": "^3.2.0",
        "webpack": "^4.40.2",
        "webpack-cli": "^3.3.9",
        "webpack-dev-server": "^3.8.1"
      }
    }
    ```
  * Create a `webpack.config.js` file with the following contents:
    ```javascript
    const path = require('path');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const CopyWebpackPlugin = require('copy-webpack-plugin');
    
    module.exports = {
      entry: './index.js',
      output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: 'index.html'
        }),
        new CopyWebpackPlugin([
          {from:'assets', to:'assets'} 
        ]), 
      ]
    };
    ```
  * Run `npm install`
  * Run `npm run deploy`
  * Change the branch in the GitHub Pages settings to the newly created `gh-pages` one.
  * Run `npm run start` to start the local development server

Look for online tutorials (blogs or YouTube) that might fit the project requirements of your intern. This way they can start building their project independently and come to you for questions.

If for example your intern wants to create their own Pong game, let them first follow a YouTube tutorial like [this](https://www.youtube.com/watch?v=4dHlbXigtss&list=PL9iYZZWgVwse7tvjCHtlM_MZmUb31lSOl). Once they're done, help them restructure the code as needed, so that they can start implementing their own ideas.

Teach them some simple principles and practices for writing good code like DRY (Don't repeat yourself). Keep the Single Responsibility Principle on function level, you don't necessarily want to get too deep into OOP in the scope of two weeks, this will already improve the code quality a lot.
  
Here's another cool Phaser project that I built with a coworker to teach kids/teenagers programming:
https://github.com/BastiTee/noodlejump-stackblitz/

Have fun :-)