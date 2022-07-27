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

This blog posts tackle a small but important detail in the Knex.js `QueryBuilder` interface. Misused, it can provide race conditions and unexpected behavior while communicating with the database.

## The issue

Given the following DAO:

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

Let's walk through the differences of both functions? The first returns a `Promise` object, and the query is executed against the database. The second function instead returns a `QueryBuilder` object, even though, the typing states, it returns a `Promise<number>`. In this case, the query is not executed directly.

You might argue, why is the compiler not complaining, as the typing is obviously wrong, and why does it have different behavior?

### The typing

The compiler is not complaining because of the [Promise/A+](https://promisesaplus.com/#requirements) definition. This definition states, that an `Object` is a `Promise` as long as a `then` method is implemented. Checking the typing or [documentation](http://knexjs.org/guide/interfaces.html#promises) of the `QueryBuilder` interface, you can see that it defines a `then` method. Therefore, it is treated as `Promise` during type checks.

This misleading typing can result in race conditions or unexpected state within your application, as if you mix this up within your DAOs, your queries will not be executed in the order you might think. Once the query is executed after calling the method and for the second it depends on usage in your application. But why?

### The different behavior

You must know that, Knex.js only _executes_ the query, by calling the `then` method and turns the `QueryBuilder` object into a `Promise`, by doing real network I/O to execute the query on the database and retrieve the data.

Let's take a closer look at the functions and understand, where the different behavior comes from. The first function uses `await` in front of the `QueryBuilder` creation, which implicitly calls the `then` method of the following `Promise` or object. Therefore, it is handy, that the `QueryBuilder` implements the same interface as `Promise` because you just can use `await` or `then` directly on the `QueryBuilder` and retrieve a Promise with the result or error. The second function just returns the created `QueryBuilder` object, which does not result in any query execution while calling the function itself.

Assume the following usage (might not be a real usage, but it helps to make it aware).

```typescript
  const doSomething = async () => {
    //...
    fooDAO.insert(client, {id: 'fooId', name: 'HelloWorld'});
    // do other stuff
    fooDAO.delete('fooId');
    //...
  }
```

In this example usage, the developer just calls the DAO functions to add the item, but is not interested to wait for the result. Then some stuff is going on and at some point the delete function is called to remove the item again, but it is not waited for that. This usage of a "correct" typed DAO (at least the compiler is not complaining) would result in a broken state because the item would never be deleted, as the `then` method of the returned `QueryBuilder` is never called.

## The correct typing

Let's write the DAO with the correct typing, which indicates the differences of the two functions directly:

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

This improved typing now really indicates the developer, what she retrieves from the DAO function. In the first case you get a `QueryBuilder` and in the second a `Promise` which resolves in data.
It might help to prevent issues like described above, but is still not a nice interface and usage for the DAO, isn't it?

Let's transform the DAO to have a nice interface and user experience.

## The better way

This section is named "The better way" on purpose because I do not want to state it is the right and one and only way, but I would argue it is the better than returning a `QueryBuilder` within DAO functions.
As you might already think, the recommendation is, to always return a real `Promise` and not `QueryBuilder` objects.

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
DAOs should always return data and encapsulate the database queries, and not leak them to the outside. This makes the interface much more simple and easy to understand or use.

## Conclusion

Typescript helps a lot in preventing you from introducing bugs, but it is not the silver bullet for everything. There might be other libraries or functions having similar typing in place, therefore always understand the libraries you use.
For Knex.js, be aware of the typing issue with the `QueryBuilder` and `Promise` object, to prevent unexpected behavior. Nevertheless, it is the better way to implement DAOs in a way encapsulating the queries and only return data within a _Promise_.
