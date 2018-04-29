import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import axios from 'axios';

let serverData = {
	port: '4001',
  url: {
    root: '/',
	  users: '/users',
    graphQL: '/graphql'
  }
};

let schema = buildSchema(`
	type User {
		id: String
		name: String
		email: String
		website: String
		address: Address
	}
	
	type Address {
		city: String
	}
	
	type Query {
    users: [User]
  }
`);

let users = {
  users: () => {
  	return axios.get('https://jsonplaceholder.typicode.com/users')
		  .then((res) => res.data);
  },
};

let app = express();
app.get(serverData.url.root, (req, res) => {
	res.send(`
	  <p>Homepage</p>
	  <a href="${serverData.url.graphQL}">GraphQL</a>
  `);
});

app.get(serverData.url.users, (req, res) => {
	res.send('USERS');
});

app.use(serverData.url.graphQL, graphqlHTTP({
  schema: schema,
  rootValue: users,
  graphiql: true
}));

app.get('*', (req, res) => {
   res.send('404!');
});

app.listen(serverData.port, () => {
    console.log(`> Server started! \n> http://localhost:${serverData.port + serverData.url.root}`);
});