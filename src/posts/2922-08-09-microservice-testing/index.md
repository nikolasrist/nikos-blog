---
date: 2022-08-09
title: Microservice testing series
description: This is an article series about the different parts of a common microservice testing strategy.
author: nikolas-rist
templateEngineOverride: njk,md
tags:
  - backend
  - nodejs
  - blog
---

## TestPyramid

The TestPyramid example by [Martin Fowler](https://martinfowler.com/bliki/TestPyramid.html), is a visual supportive tool to get an idea of the distribution of your amount of tests in the different levels of abstraction. It indicate to have much more low-level unit tests in contrast to high level BroadStackTests.

## TL;DR

The TestPyramid by [Martin Fowler](https://martinfowler.com/bliki/TestPyramid.html) differentiates between three levels.

 1. End-to-end tests, these are:
  a. more error prone as they can easily break by changes to the UI
  b. expensive to write
  c. exposed more often to non-determinism problems (or flakiness) (sometimes succeed sometimes fail)
 2. Layer in-between, [Subcutaneous Tests](https://martinfowler.com/bliki/SubcutaneousTest.html) (component tests) testing complex logic on an API layer and not the UI itself.
 3. Unit tests, the low level tests testing a single functionality (unit) of the service.

## BroadStackTests

[BroadStackTests](https://martinfowler.com/bliki/BroadStackTest.html) are introduced by Martin Fowler, and put together end-to-end (e2e) tests or so called full-stack tests. In the end all are very similar but have different names. BroadStack tests are high level (e2e) UI tests. These might be recorded using tools like *Selenium* or even worse, done by hand. They can be written in code using libraries or implement them on your own. Nowadays you can run them with Chrome Headless within your CI/CD pipeline. They are discussed a lot and from my point of view they are to expensive for a CI/CD pipeline. Expensive in terms of duration and implementation complexity.  

A deeper argumentation, why not to use e2e tests, you can find in this [google blog post](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html). As of today, the [testing library](https://testing-library.com/docs/), provides you a lot of possibilities to test different frontend frameworks in a user centric way. This library allows you to mimic the usage of your components by a user. This is still faster than e2e tests and well scoped around your component.  

## Component Tests  

Component tests are the next level of tests which are scoped to the service they test. They are easier to write, as you might use the direct API to call the service and test the service isolated instead of using a BoradStackTest via the UI.

More details about component tests can be found [here](https://martinfowler.com/bliki/ComponentTest.html) and in the slides of Toby Clemson [here](https://martinfowler.com/articles/microservice-testing/#testing-component-introduction)  

## Integration Tests  

Integration tests are the second smallest and scoped test level in the pyramid. They test a set of modules working together and therefore scope on a sub-system of the service. More information you can find in the [slides](https://martinfowler.com/articles/microservice-testing/#testing-integration-introduction) of Toby Clemson.  

## Unit Tests  

 Unit tests are the smallest piece of tests in the TestingPyramid. They are narrowed down on a single functionality and have the smallest scope. You differentiate between *Sociable unit testing* and *Solitary unit testing*. *Sociable* tests test the object through the interface and include dependencies. *Solitary* tests isolate the object and test the communication to dependencies, which are replaced by mocks. An detailed introduction about unit tests you can find again in Toby Clemson's [slide deck](https://martinfowler.com/articles/microservice-testing/#testing-unit-introduction).  

## Conclusion  

Now we know the general terms of different test types, which we will take a closer look at. The TestPyramid provides a visualisation, how to distribute your amount of tests. It does not help how to decide, which test is worth it and which not. In addition, this is a really difficult answer.

Throughout this series I will provide some examples and best practices we within my team during implementing a NodeJS backend service, but the field of testing is much broader and has a lot more topics to come up with, which can not be captured throughout this series. I'll try to provide additional resources for further reading.  
