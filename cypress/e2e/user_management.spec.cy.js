it('Deletes a user', () => {
    cy.intercept('POST', '/graphql', (req) => {
        if (req.body.query.includes('createUser')) {
            req.alias = 'createUserMutation';
        } else if (req.body.query.includes('deleteUser')) {
            req.alias = 'deleteUserMutation';
        } else if (req.body.query.includes('users')) {
            req.alias = 'listUsersQuery';
        }
    });

    cy.visit('/');

    //// cy intercept acts like a message queue
    // before reload is triggered we already have a 'listUsersQuery'
    // request which is intercepted, which is the {"data":{"users":[]}}
    const username1 = 'Jane Doe';
    const username2 = 'John Smith';
    const username3 = 'Ion Day';

    // cy reload to create additional messages in queue
    cy.reload()
    cy.reload()

    cy.get('#username').type(username1);
    cy.get('#add-user-form').submit();

    cy.wait('@createUserMutation').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response.body.data.createUser.name).to.equal(username1);
    });

    // this should return {"data":{"users":[{"id":"1682365642124","name":"Jane Doe"}]}}
    // but it returns the first message in the queue, which is {"data":{"users":[]}}
    cy.wait('@listUsersQuery').then(interception => {
        cy.log(JSON.stringify(interception.response.body))
    })

    cy.get('#username').type(username2);
    cy.get('#add-user-form').submit();

    cy.wait('@createUserMutation').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response.body.data.createUser.name).to.equal(username2);
    });

    // this should return {"data":{"users":[{"id":"1682365642124","name":"Jane Doe"},{"id":"1682365642405","name":"John Smith"}]}}
    // but it returns the second message in the queue, which is {"data":{"users":[{"id":"1682365642124","name":"Jane Doe"}]}}
    cy.wait('@listUsersQuery').then(interception => {
        cy.log(JSON.stringify(interception.response.body))
    })

    cy.get('#username').type(username3);
    cy.get('#add-user-form').submit();

    cy.wait('@createUserMutation').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response.body.data.createUser.name).to.equal(username3);
    });

    // this should return {"data":{"users":[{"id":"1682365642124","name":"Jane Doe"},{"id":"1682365642405","name":"John Smith"},{"id":"1682365642623","name":"Ion Day"}]}}
    // but it returns the second message in the queue, which is {"data":{"users":[{"id":"1682365642124","name":"Jane Doe"},{"id":"1682365642405","name":"John Smith"}]}}
    cy.wait('@listUsersQuery').then(interception => {
        cy.log(JSON.stringify(interception.response.body))
    })

    //this should fail as no request was triggered
    cy.wait('@listUsersQuery').then(interception => {
        cy.log(JSON.stringify(interception.response.body))
    })

    //this should fail as no request was triggered
    cy.wait('@listUsersQuery').then(interception => {
        cy.log(JSON.stringify(interception.response.body))
    })

    //this should fail as no request was triggered
    cy.wait('@listUsersQuery').then(interception => {
        cy.log(JSON.stringify(interception.response.body))
    })
});
