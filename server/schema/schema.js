const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLList, GraphQLSchema } = graphql;

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

const BookType = new GraphQLObjectType({
    name: 'book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, _args) {
                return authors.filter(object => object.id === parent.authorId)[0]
            }
        }
    })
});

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

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(_parent, args) {
                return books.filter(object => object.id === args.id)[0]
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(_parent, args) {
                return authors.filter(object => object.id === args.id)[0]
            }
        },
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

module.exports = new GraphQLSchema({
    query: RootQuery
});