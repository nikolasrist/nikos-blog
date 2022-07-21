---
date: 2022-06-22
title: "Web Component-based Micro Frontends with Angular: from zero to production"
description: A complete video guide on how to ship micro frontends using Angular elements based on a solution we've implemented at LeanIX.
layout: layouts/post-with-youtube
tags:
  - blog
---

In 1 hour and 42 minutes you can learn how to implement the same web component-based micro frontend architecture that we've been using to ship micro frontends in production for nearly two years at LeanIX:

<lite-youtube videoid="ee17YczpCpU" videotitle="Web Component-based Micro Frontends with Angular"></lite-youtube>


This is the largest video project on a technical topic that I've produced so far and it was a lot of fun.

Together with <a href="https://traveling-coderman.net/" target="_blank">Fabian Böller</a>, the main author of the implementation for micro frontends using web components with Angular elements at LeanIX, we share:
- Migrating a sub-route of an Angular application from a lazy loaded route to a micro frontend in a web component.
- Deploying and integrating the shell application and the micro frontend on Netlify.
- Building a new top level route inside the micro frontend.
- And many more things to know about shipping micro frontends with Angular in production.

By adopting micro frontends at LeanIX, we enabled a very high level of autonomy to our cross-functional teams, as they can ship their frontend and backend independently from those of other teams. No more blocked release pipelines due to failing tests in the frontend monolith.
This is also known as vertical team ownership. You can read more about it on <a href="https://micro-frontends.org/" target="_blank">micro-frontends.org</a>.

During the recording we made commits for each major step of the micro frontend migration. You can find the source code and the exact commits from the Video on GitHub: <a href="https://github.com/fboeller/microfrontends-with-angular/commits/recording">microfrontends-with-angular project on GitHub</a>

Thanks to <a href="https://twitter.com/ManfredSteyer" target="_blank">Manfred Steyer</a> for building and mainting the <a href="https://github.com/manfredsteyer/ngx-build-plus" target="_blank">ngx-build-plus</a> npm package.
It makes it easy to combine the build output of an Angular application into a single JavaScript file, which is essential for including them as web-components.