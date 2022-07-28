---
date: 2022-07-27
title: Knex.js promise resolution decoded
description: This article explains some details on the Knex.js QueryBuilder interface and their impacts.
author: nikolas-rist
templateEngineOverride: njk,md
tags:
  - backend
  - nodejs
  - blog
---

This blog post tackles a small but important detail in the Knex.js `QueryBuilder` interface. Misused, it can cause race conditions and unexpected behavior while communicating with the database.

## The issue

Let's try to understand the issue with help of the following example DAO:

```typescript
export const fooDAO = {
  delete: (pg: Knex, itemId: string): Promise<number> => {
    return await pg.table<Foo>('foo').del().where('id', itemId);
  },

  insert: async (pg: Knex, item: FooUpdate): Promise<Foo[]> => {
    return pg.table<Foo>('foo').insert(item).returning('*');
  }
};
```

Let's walk through the differences between both functions. The first function `delete` returns a `Promise` object, and the query is executed against the database. The second function `insert` returns a `QueryBuilder` object instead, even though, the typing states, it returns a `Promise<Foo[]>`. In this case, the query is not executed directly. We will take a closer look later, why this is the case.

You might argue, why is the compiler not complaining as the typing is obviously wrong, and why does it have different behavior?

### The typing

The compiler is not complaining because of the [Promise/A+](https://promisesaplus.com/#requirements) definition. This definition states, that an _Object_ is a `Promise` as long as a `then(onFulfilled, onRejected)` method is implemented. Checking the typing or [documentation](http://knexjs.org/guide/interfaces.html#promises) of the `QueryBuilder` interface, you can see that it defines a `then` method. Therefore, it is treated as `Promise` during type checks.

This misleading typing can result in race conditions or unexpected state within your application. If you mix this up within your DAOs, your queries will not be executed in the order you might think. For some functions, the query is executed while calling the DAO function itself and for the others it depends on usage in your application.

But why is this the case? Let's walk through the difference of both implementations together.

### The different behavior

You must know that, Knex.js only _executes_ the query to the database, by calling the `then` method and turns the `QueryBuilder` object into a `Promise` accordingly.

Let's take a closer look at the functions and understand, where the different behavior comes from. The first function uses `await` with the _QueryBuilder_ creation, which implicitly calls the `then` method of the following _Promise_ or object. Therefore, it is handy, that the _QueryBuilder_ implements the same interface as _Promise_ because you just can use `await` or `then` directly on the _QueryBuilder_ and retrieve a Promise with the result or error. The second function just returns the created _QueryBuilder_ object, which does not result in any query execution while calling the function itself.

Assume the following usage (might not be a real usage, but it helps to get the point).

```typescript
  const doSomething = async () => {
    //...
    fooDAO.insert(client, {id: 'fooId', name: 'HelloWorld'});
    // do other stuff
    fooDAO.delete('fooId');
    //...
  }
```

In this example usage, the developer just calls the DAO functions to add the item, but is doing it asynchronously and does not await the result. Then something is going on and at some point the delete function is called to remove the item. Here again, no await is used nor the `.then()` method is called. This usage of the “correct” typed DAO (at least the compiler is not complaining) would result in a broken state. The item would never be deleted, as the `then` method of the returned `QueryBuilder` is never called.

## The correct typing

Let's re-write the DAO with correct typing, which indicates the different return types for both functions correctly.

```typescript
export const fooDAO = {
  delete: (pg: Knex, itemId: string): Promise<number> => {
    return await pg.table<Foo>('foo').del().where('id', itemId);
  },

  insert: async (pg: Knex, item: FooUpdate): QueryBuilder<Foo[]> => {
    return pg.table<Foo>('foo').insert(item).returning('*');
  }
};
```

This improved typing for the `insert` function now indicates clearly that a `QueryBuilder` is returned and not a `Promise`. It might help to prevent issues like described above, but is not a nice interface and usage for the DAO, is it?

Let's transform the DAO to have a pleasant interface and user experience.

## The better way

This section is named “The better way” on purpose because I want to avoid stating it is the right and only way.  I would argue it is the better one, than returning a `QueryBuilder` from DAO functions.
As you already can imagine, the recommendation is, to always return a real _Promises_ and not `QueryBuilder` objects.

```typescript
export const fooDAO = {
  delete: (pg: Knex, itemId: string): Promise<number> => {
    return await pg.table<Foo>('foo').del().where('id', itemId);
  },

  insert: async (pg: Knex, item: FooUpdate): Promise<Foo[]> => {
    return await pg.table<Foo>('foo').insert(item).returning('*');
  }
};
```

This fixed DAO always ensures, that the queries are really being executed on function call and return a `Promise` which can be handled properly.
DAOs should always return data and encapsulate the database queries, and not leak them to the outside. This makes the interface much simpler and easy to use.

## Conclusion

Typescript helps a lot in preventing you from introducing bugs, but it is not the silver bullet for everything. There might be other libraries or functions having similar typing in place, therefore always understand the libraries you use.
For Knex.js, be aware of the typing issue with the `QueryBuilder` and `Promise` object, to prevent unexpected behavior. Nevertheless, it is the better way to implement DAOs in a way encapsulating the queries and only return data within a `Promise`.
