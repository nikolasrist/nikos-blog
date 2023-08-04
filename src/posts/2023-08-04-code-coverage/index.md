---
date: 2023-08-04
title: How Code Coverage can be useful
description: Brief discussion about how to use code coverage to achieve more reliable services.
author: nikolas-rist
templateEngineOverride: njk,md
tags:
  - blog
---

Code coverage is a critical aspect of software development that presumably determines the effectiveness of detecting faults and errors in a program. It measures the degree to which the source code of a program is tested by a set of test cases. The higher the code coverage, the more effective the testing is believed to be at identifying defects in the software.

As a programmer, it is essential to have a good understanding of code coverage and how it works. This knowledge helps you to write better tests, identify potential bugs, and improve the overall quality of your code. This blog post provides my opinion on how to make code coverage a powerful tool rather than a burden.

# TL;DR

You might come to the point, where 100% code coverage is not useful and provides only overhead and feels like a burden. Be wise in choosing what to test, and test this with 100% coverage.

## Definition

Let’s take the definition from [Wikipedia](https://en.wikipedia.org/wiki/Code_coverage) as a common ground to talk about code coverage.

The main aspects of code coverage are: 

* Function coverage
    * Which function is called within my tests?
* Statement coverage
    * Are all statements executed during my tests?
* Edge coverage
    * Are all edges in the logical flow covered by my tests?
* Condition coverage
    * Are all boolean operations evaluated for both cases `true` and `false`?

You can find additional explanations and more details, especially about the difference between `Code Coverage` and `Test Coverage` in this blog post: https://saucelabs.com/resources/blog/code-coverage-vs-test-coverage

## 100% code coverage for the sake of it

What do I mean by “100% code coverage for the sake of it”? Some people think 100% code coverage will bring them into the heaven of bug-free software. Unfortunately, this is not true, and from my perspective, 100% code coverage has a considerable disadvantage, as I experienced myself in past projects. In multiple projects, we decided to have 100% code coverage, and if we do not reach it, the CI/CD pipeline will fail. You will come across an example in the following, maybe you already remember similar experiences?

Originally, it was really nice to see 100% for all existing code parts. As we reached a level of complexity in the project, it became really difficult to test every piece of the code base, and it felt even stupid at some point. Let me give you an example of when I had these feelings: We added one additional parameter to our DAO function, and I had to update 70 unit tests all over the place using the mocked DAO. In the end, the change introduced a regression that was not detected by all the unit tests.

With a growing code base, spending more and more time writing and adapting many test cases for simple code changes just to hit every piece of code and achieve 100% code coverage started to be the wrong approach for us. Therefore, we changed our approach and started to identify key areas of our code base that had to reach 100% code coverage. Non-essential areas, like once-touched code in application configuration or setup files, have been removed from our coverage testing. This does not mean that we did not have tests for all these files.

As already brought up above, one good example has been our DAOs, which went insane, writing unit tests for DAO files because we just tested implementation and not functionality, as everything has been mocked. This resulted in a lot of work when we had to change something and did not protect us from bugs. After our pivotal decision, we deleted all unit tests and started to write proper component tests, testing our DAOs with a real database. With this setup, we test functionality and not implementation, which reduces the number of tests we have to maintain or adapt and improves our code quality.

Additionally, we started to write a few integration tests, testing the whole service in total from an API perspective, including the connection to the database.

This gave us the proper confidence to release in a continuous pipeline but kept us fast in developing because we did not need to write or adjust many unit tests for every line of code. 

## Choose important areas and reach 100%

It is the better way to identify critical areas of your application and reach 100% code coverage in these areas. The rest of the application should be tested via component or even some integration tests to have a stable release pipeline.

What makes parts of your application critical? 

The following questions can help identify important parts of your application: 

1. Is the code part of the business logic, or just glue code?
2. Does the code change often as it is part of the business logic, or is it written once and stays for a long time?
3. Can I test functionality with my unit tests, or do I only test the implementation? (DAO example)

## Conclusion

100% code coverage in the whole application can quickly slow you down, without any further benefits or safety, while implementing new functionality or refactoring existing code. Instead, you should continuously analyse your code base, and identify the important parts of your business logic being part of code coverage analysis. 

Drive for 100% coverage in these areas and rely on a proper testing strategy, including the testing pyramid, by haven many unit tests, many component tests, and some integration tests, testing the entire application at once. 

This allows you fast development cycles, where you are still failing fast in the significant, and often changed areas. It is important to understand, that deciding for parts not having 100% code coverage is not equal to having 0% code coverage in these areas!