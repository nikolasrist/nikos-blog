---
date: 2024-04-04
title: PostgreSQL Index Creation
description: When to build indexes concurrently or and when not.
author: nikolas-rist
templateEngineOverride: njk,md
tags:
  - blog
  - culture
---

# PostgreSQL Index Creation

This blog provides a short review of index creation in PostgreSQL.

The [CREATE INDEX](https://www.postgresql.org/docs/current/sql-createindex.html) documentation is the best starting point to understand how index creation works. Nevertheless, I tried to point out the most important information in this blog post. Therefore, I will not write down all possible parameters, as they can be looked up in the documentation easily.

## Index Types

PostgreSQL provides the following types: `B-tree`, `hash`, `GiST`, `SP-GiST`, `GIN`, and `BRIN`

The default index is `B-tree` and for most default use cases a very good choice. When you should use another index is not part of this post.

## Concurrent option

Essential is the decision to build the index concurrently or not. But, to decide you need to know the differences of a non-concurrent and a concurrent build. Here we go:

The default `CREATE INDEX` command builds the index non-concurrently. This means the table will be locked for `write`operations, whereas `read` operations are still possible. For a production system, this means that your application is unable to persist any data until the index build is finished. `CREATE INDEX CONCURRENTLY` in contrast, builds the index in a concurrent way, so `write` operations are still allowed, but at a cost.

### How it works in detail

`CREATE INDEX` locks the table and can build the index with one table scan. It will not be interrupted or have to wait for any other operation, as long as there is no transaction running that collides with the `ExclusiveLock` acquired by `CREATE INDEX`.

![index_creation](/assets/img/index_creation.png)

`CREATE INDEX CONCURRENTLY` works differently; within a first transaction, the index itself is created and marked as `invalid`. After this, the build process needs two more transactions and table scans. Before it can start the second phase, it has to wait for any transaction potentially updating data. The third phase might be the most expensive one, as this transaction has to wait for any other transaction to finish, which contains a `snapshot`. Even after this, the index is only usable as soon as any transaction finishes, which predates the start of the index build.

It is important to know, that if a concurrent index creation fails, the `invalid` index stays and will be updated already. So take care of removing `invalid` indexes or ensure to finally create them.

![concurrent_index](/assets/img/concurrent_index.png)

### Decision factors

With this said, it heavily depends on your use case if you build the index concurrently or not. You need to take the following aspects into account to decide:

1. Table size
2. Complexity of the index itself (single column vs. expression)
3. Main purpose of the table (read or write heavy)
4. How complex is your database and how easy is it to clean up broken state?
5. Does the index creation block your release?

For the last topic my current team and I have to decide which index creation we use. We are managing our database schemas with Liquibase migrations, including the index creations. This we do, as we have several instances of our services owning an own database. This is subject to change in the future, but as of today we have to take this into consideration. Therefore, the index creation is part of our release pipeline and long running index builds block following release until they are done.

Additionally, to the situation of a blocked release pipeline, we have schema separation for our tenants, which makes the clean-up not easier. This is one of the downsides of the schema separation, but it would exceed the scope of this post to discuss, when to do schema separation and when have column based separation of tenants. Nevertheless, we ran into situations where the concurrent index creation failed and we manually had to clean the state of multiple schemas before we could trigger a new release.


## Summary

Concurrent index creation can be really slow. Therefore, it might be worth having a shorter time frame for being blocked with `write` operations and building the index non-concurrently. If you have a huge table that has a lot of `write` operations, you might accept the long-running index built while still being able to keep your system running. If you have a table with mostly `read` operations and occasional updates, you probably should go with the non-concurrent index build.


