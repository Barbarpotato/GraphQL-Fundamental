# Introduction to GraphQL
GraphQL is a powerful query language for your API, and it provides a more efficient, powerful, and flexible alternative to the traditional REST API. In this document, we'll introduce you to the key concepts of GraphQL and how it works.

## What is GraphQL?
GraphQL is a query language for your API, and it's designed to request and deliver exactly the data that a client needs. Unlike REST, where the server determines what data is returned, GraphQL puts the control in the hands of the client. This allows for more efficient data retrieval, reduces over-fetching and under-fetching, and enables clients to request multiple resources in a single query.

## How Does GraphQL Work?

GraphQL is based on a strong schema that defines the types and operations available in your API. Clients can request data by specifying what they need, and the server responds with only the requested data in a structured format (typically JSON). The server resolves the query by matching it to the available types and fields in the schema.

# Setting Up GraphQL with Node.js, Express, and graphql-express

This README will guide you through the process of setting up a GraphQL server on the backend using Node.js, Express, and the graphql-express package. GraphQL is a powerful query language that allows you to request and deliver data with precision, and this setup will enable you to create a flexible API.

## Prerequisites

Before you get started, ensure you have the following prerequisites:

- Node.js installed on your machine.
- A basic understanding of JavaScript and Express.

## Basic Installation & Usage

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
        1. const RootQuery = new GraphQLObjectType({ ... }): This line creates a new GraphQL Object Type called RootQuery. The RootQuery type is special in GraphQL, as it is the starting point for all read (query) operations. It defines the fields that clients can query from the root of the schema.
        2. name: 'RootQueryType': This sets the name for the RootQueryType. In this case, it's named "RootQueryType."
        3. fields: { ... }: Here, you define the available fields within the RootQuery. Each field represents a possible query that clients can make.
        4. book: { ... }: This defines a field called "book" within the RootQuery. Clients can use this field to query information about books.
        5. type: BookType: The type field specifies the data type that will be returned by the "book" query. In this case, it's set to the BookType, indicating that when a client queries "book," they will receive data structured according to the BookType.
        6. args: { id: { type: GraphQLString } }: The args field specifies the arguments that can be provided with the "book" query. In this case, there's one argument named "id," which is of type GraphQLString. It means that clients need to provide an "id" when querying for a book.
        7. resolve(parent, args) { ... }: The resolve function is where you specify how to fetch the actual data when a client makes a query for "book." The function takes two parameters:
            - parent: This parameter is rarely used in queries and typically represents the parent object when working with nested queries. In this case, it's not used.
            - args: This parameter contains the arguments provided by the client. In this code, it includes the "id" passed by the client.
            return books.filter(object => object.id === args.id)[0]: Within the resolve function, you see code to fetch the data. In this case, it's looking through an array called "books" to find a book with an "id" that matches the one provided by the client. The filter method is used to find the matching book, and [0] is added to return the first matching result. This result will be returned to the client in the shape of a BookType.
        8. return books.filter(object => object.id === args.id)[0]: Within the resolve function, you see code to fetch the data. In this case, it's looking through an array called "books" to find a book with an "id" that matches the one provided by the client. The filter method is used to find the matching book, and [0] is added to return the first matching result. This result will be returned to the client in the shape of a BookType.
    - Finally, the code exports a new GraphQLSchema instance with the RootQuery as the query root. This makes the book query available for use in your GraphQL API.
    ```js
    module.exports = new GraphQLSchema({
    query: RootQuery
    });
    ```
