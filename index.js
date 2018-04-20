import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';

let serverData = {
    port: '4000',
    url: {
        root: '/',
        graphQL: '/graphql'
    }
};

let schema = buildSchema(`
    type Query {
        hello: String
    }
`);

let root = {
    hello: () => 'Hello World!'
};

let app = express();
app.get(serverData.url.root, (req, res) => {
    res.send(`
        <p>Homepage</p>
        <a href="${serverData.url.graphQL}">GraphQL</a>
    `);
});

app.use(serverData.url.graphQL, graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(serverData.port, () => {
    console.log(`> Server started! \n> http://localhost:${serverData.port + serverData.url.root}`);
});