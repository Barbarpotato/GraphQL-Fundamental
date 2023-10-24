# Table Of Contents

[Basic Installation & Usage](#basic) <br>
[Type Relation](#type-relation)<br>
[Return all objects](#all-objects)<br>

# Introduction to GraphQL
GraphQL is a powerful query language for your API, and it provides a more efficient, powerful, and flexible alternative to the traditional REST API. In this document, we'll introduce you to the key concepts of GraphQL and how it works.

## What is GraphQL?
GraphQL is a query language for your API, and it's designed to request and deliver exactly the data that a client needs. Unlike REST, where the server determines what data is returned, GraphQL puts the control in the hands of the client. This allows for more efficient data retrieval, reduces over-fetching and under-fetching, and enables clients to request multiple resources in a single query.

## How Does GraphQL Work?

GraphQL is based on a strong schema that defines the types and operations available in your API. Clients can request data by specifying what they need, and the server responds with only the requested data in a structured format (typically JSON). The server resolves the query by matching it to the available types and fields in the schema.

# Setting Up GraphQL with Node.js, Express, and graphql-express

This README will guide you through the process of setting up a GraphQL server on the backend using Node.js, Express, and the graphql-express package. GraphQL is a powerful query language that allows you to request and deliver data with precision, and this setup will enable you to create a flexible API.

# Prerequisites

Before you get started, ensure you have the following prerequisites:

- Node.js installed on your machine.
- A basic understanding of JavaScript and Express.

<a name='basic'></a>

# Basic Installation & Usage

1. **Create a New Node.js Project**: If you don't already have a Node.js project, create a new directory for your project and run `npm init` to initialize a new Node.js project.

2. **Install Dependencies**: You'll need to install the required packages using npm. Run the following command to install Express, GraphQL, and graphql-express:

   ```bash
   npm install express graphql express-graphql
   ```

3. Create a Server File: Create a new JavaScript file (e.g., app.js) in your project directory.

4. Import Dependencies: In server.js, import the necessary packages and set up the Express app.
    ```js
    const express = require('express');
    const { graphqlHTTP } = require('express-graphql');
    const { buildSchema } = require('graphql');

    const app = express();
    ```
5. Create Schema Folder and create schema.js file. In Schema file there is some component that you need to understand:
    - Create GraphQL Object Type
        - `Object Type` is a fundamental building block used to define the structure of the data that can be queried from a GraphQL API. It represents a type of object that can be retrieved or manipulated through the API. Object Types play a crucial role in modeling the data and defining the shape of the response that clients can request. Below is the example of how to make Object Type of GraphQL:
        ```js
        const BookType = new GraphQLObjectType({
            name: 'book',
            fields: () => ({
                id: { type: GraphQLString },
                name: { type: GraphQLString },
                genre: { type: GraphQLString }
            })
        });
        ```
    - Create Entry Point to the GraphQL Schema
        - `Query` is an operation type in GraphQL used to read or retrieve data from the server. They are created using the RootQuery Object Type and include fields that can be accessed by clients. Below the example code:
        ```js
        const RootQuery = new GraphQLObjectType({
            name: 'RootQueryType',
            fields: {
                book: {
                    type: BookType,
                    args: { id: { type: GraphQLString } },
                    resolve(parent, args) {
                        // code to get data from db
                        return books.filter(object => object.id === args.id)[0]
                    }
                }
            }
        });
        ```
        This code is defining a RootQuery type in GraphQL, which serves as the entry point for querying data in the schema.
        1. `const RootQuery = new GraphQLObjectType({ ... })`: This line creates a new GraphQL Object Type called RootQuery. The RootQuery type is special in GraphQL, as it is the starting point for all read (query) operations. It defines the fields that clients can query from the root of the schema.
        2. `name`: 'RootQueryType': This sets the name for the RootQueryType. In this case, it's named "RootQueryType."
        3. `fields`: { ... }: Here, you define the available fields within the RootQuery. Each field represents a possible query that clients can make.
        4. `book: { ... }`: This defines a field called "book" within the RootQuery. Clients can use this field to query information about books.
        5. `type`: BookType: The type field specifies the data type that will be returned by the "book" query. In this case, it's set to the BookType, indicating that when a client queries "book," they will receive data structured according to the BookType.
        6. `args`: { id: { type: GraphQLString } }: The args field specifies the arguments that can be provided with the "book" query. In this case, there's one argument named "id," which is of type GraphQLString. It means that clients need to provide an "id" when querying for a book.
        7. `resolve(parent, args) { ... }`: The resolve function is where you specify how to fetch the actual data when a client makes a query for "book." The function takes two parameters:
            - `parent`: This parameter is rarely used in queries and typically represents the parent object when working with nested queries. In this case, it's not used.
            - `args`: This parameter contains the arguments provided by the client. In this code, it includes the "id" passed by the client.
            return books.filter(object => object.id === args.id)[0]: Within the resolve function, you see code to fetch the data. In this case, it's looking through an array called "books" to find a book with an "id" that matches the one provided by the client. The filter method is used to find the matching book, and [0] is added to return the first matching result. This result will be returned to the client in the shape of a BookType.
        8. `return books.filter(object => object.id === args.id)[0]`: Within the resolve function, you see code to fetch the data. In this case, it's looking through an array called "books" to find a book with an "id" that matches the one provided by the client. The filter method is used to find the matching book, and [0] is added to return the first matching result. This result will be returned to the client in the shape of a BookType.
    - Finally, the code exports a new GraphQLSchema instance with the RootQuery as the query root. This makes the book query available for use in your GraphQL API.
    ```js
    module.exports = new GraphQLSchema({
    query: RootQuery
    });
    ```

6. Set Up GraphQL Middleware to your app.js: Use the graphqlHTTP middleware to create a GraphQL endpoint for your Express app.
```js
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))
```
by using the `graphiql` property to your middleware, the backend service will provide the graphql development interface that can be access for demo and simulate accessing the different variant of our http request.

7. Start the Server: Start the Express server on a port of your choice.
```js
app.listen(4000, () => {
    console.log(`Now Listening on Post 4000`)
})
```
8. Testing Your Queries in GrapiQL: You can access the `/graphql` endpoint in your browser, and the interface will be like this:
![graphiql demonstration](/images/graphiql-example1.png)

<a name='type-relation'></a>

# Type Relations
In GraphQL, `type relations` refer to the relationships between different types in your schema. These relationships define how data is connected and how clients can query for related information. For this example we will be used the scenario about how the books connected to the authors. where logically the book have it own author.
```js
// we added new property named authorId, due to the demonstration of how type relations work!
const books = [
    { name: 'Name of thw Wind', genre: 'Fantasy', id: '1', authorId: '1' },
    { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
    { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
];

const BookType = new GraphQLObjectType({
    name: 'book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return authors.filter(object => object.id === parent.authorId)[0]
            }
        }
    })
});
```
- In the BookType, there is a field named "author," of type AuthorType. This field represents the relationship between a book and its author.
- The resolve function for the `author` field is responsible for fetching and returning the author information associated with a book. It uses the authorId field of the book to look up the corresponding author from the authors array by using the `parent` parameter.
- In this context, the `parent` parameter refers to the object currently being processed, which is the object that has the "author" field being fetched. In other words, parent is a representation of the BookType object that is currently being examined by GraphQL when executing the resolution for the `authors` field.
- Before `author` field is executed, the BookType object has some result. the result from BookType are return to the parent parameter in `author` field
    ![type relation](/images/type-relation.png)
    above the redline is where the data has been processed by the graphql. and the processed data will be return to the `parent` author field.

## List Type
So far we have already built the relationship between the book and who is the author from the book. Now we want to build the relationship between the author and the book. we want to know if some author are called trough the request, we want to know what books they are created. in other words we call it `one to many` relationship if we are on the relational database environment, which is one author can have many books they created. Below is the example of how to implement it in GraphQL:
```js
// we added additional object for the one to many relationship display purposes.
const books = [
    { name: 'Name of thw Wind', genre: 'Fantasy', id: '1', authorId: '1' },
    { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
    { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
    { name: 'The Hero Of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
    { name: 'The Colourof Magic', genre: 'Fantasy', id: '5', authorId: '3' },
    { name: 'The Loght Fantastic', genre: 'Fantasy', id: '6', authorId: '3' }
];

const authors = [
    { name: 'Patrick Bateman', age: 29, id: '1' },
    { name: 'Bruce Wayne', age: 33, id: '2' },
    { name: 'Peter Parker', age: 25, id: '3' }
]

const AuthorType = new GraphQLObjectType({
    name: 'author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        book: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books.filter(object => object.authorId === parent.id)
            }
        }
    })
});
```
- In above code, dont forget that we are going to return multiple object from the book fields, which we are need the `GraphQLList` imported from the `graphql` instance.
- we are returning the processed data from the authorType. This data will be processed again in resolve function book field.
- the result query if we success build this one to many relations:
    ![type-relation-lsit](/images/type-list.png)

<a name='all-objects'></a>

# All Objects
For some cases, we need to return all list of books, or all list of author that we want to the client. To do this we just added some field in the `RootQuery` of our Schema:
```js
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        ...,
        ...,
        books: {
            type: new GraphQLList(BookType),
            resolve(_parent, _args) {
                return books
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(_parent, _args) {
                return authors
            }
        }
    }
});
```
- The result output from the `graphiql` will be like this:
    ![result of returned all object](/images/all-objects.png)