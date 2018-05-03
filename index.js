import express from 'express';
import graphqlHTTP from 'express-graphql';
import { graphql, buildSchema } from 'graphql';
import axios from 'axios';

let serverData = {
	port: '4001',
  url: {
    root: '/',
	  users: '/users',
    graphQL: '/graphql',
	  usersAPI: '/api/users',
  }
};

let schema = buildSchema(`
	type Address {
		city: String
	}
	
	type User {
		id: String
		name: String
		email: String
		website: String
		address: Address
	}
	
	type Query {
    user: [User]
  }
`);

const data = {
  user: () => {
  	return axios.get('https://jsonplaceholder.typicode.com/users')
		  .then((resp) => resp.data);
  }
};

let app = express();
app.get(serverData.url.root, (req, res) => {
	res.send(`
	  <p>Homepage</p>
	  <a href="${serverData.url.users}">Users</a>
	  <a href="${serverData.url.graphQL}">GraphQL</a>
  `);
});

app.get(serverData.url.users, (req, res) => {
	graphql(schema, '{ user {name, email, website} }', data).then((response) => {
		let resData = response.data;
		let view = '';
		resData.user.map(item => {
			view += `
				<h5>${item.name}</h5>
				<p>${item.email}</p>
				<small>${item.website}</small>
			`;
		});
		res.send(view);
	});
});

app.get(serverData.url.usersAPI, (req, res) => {
	graphql(schema, '{ user { id, name, email, website, address { city } } }', data).then((response) => {
		res.send(response.data);
	});
});

app.use(serverData.url.graphQL, graphqlHTTP({
  schema: schema,
  rootValue: data,
  graphiql: true
}));

app.get('*', (req, res) => {
   res.send('404!');
});

app.listen(serverData.port, () => {
	console.log(`
	> Server started!
	> http://localhost:${serverData.port + serverData.url.root}
	
	> Data Schema: http://localhost:${serverData.port + serverData.url.graphQL}`);
});