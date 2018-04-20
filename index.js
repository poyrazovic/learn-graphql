import { graphql, buildSchema } from 'graphql';

let schema = buildSchema(`
    type Query {
        hello: String
    }
`);

let root = {
    hello: () => 'Hello World!'
};

graphql(schema, '{ hello }', root).then(res => {
    console.log(res);
});