const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');
const fs = require('fs');
const path = require('path');

const usersJsonPath = path.join(__dirname, 'users.json');

const schema = buildSchema(`
    type User {
        id: ID!
        name: String!
    }

    type Query {
        users: [User!]!
    }

    type Mutation {
        createUser(name: String!): User!
        deleteUser(id: ID!): User!
    }
`);

const root = {
    users: () => {
        const users = JSON.parse(fs.readFileSync(usersJsonPath, 'utf-8'));
        return users;
    },
    createUser: ({name}) => {
        const users = JSON.parse(fs.readFileSync(usersJsonPath, 'utf-8'));
        const newUser = {id: Date.now().toString(), name};
        users.push(newUser);
        fs.writeFileSync(usersJsonPath, JSON.stringify(users));
        return newUser
    },
    deleteUser: ({id}) => {
        const users = JSON.parse(fs.readFileSync(usersJsonPath, 'utf-8'));
        const userIndex = users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            throw new Error('User not found');
        }
        const deletedUser = users.splice(userIndex, 1)[0];
        fs.writeFileSync(usersJsonPath, JSON.stringify(users));
        return deletedUser;
    },
};

const app = express();

app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));