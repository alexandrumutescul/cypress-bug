async function fetchGraphQL(query) {
    const response = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
    });
    return await response.json();
}

async function listUsers() {
    const query = '{ users { id, name } }';
    const { data } = await fetchGraphQL(query);
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    data.users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user.name;
        li.addEventListener('click', () => deleteUser(user.id));
        userList.appendChild(li);
    });
}

async function addUser(name) {
    const mutation = `mutation { createUser(name: "${name}") { id, name } }`;
    await fetchGraphQL(mutation);
    listUsers();
}

async function deleteUser(id) {
    const mutation = `mutation { deleteUser(id: "${id}") { id, name } }`;
    await fetchGraphQL(mutation);
    listUsers();
}

document.getElementById('add-user-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    addUser(username);
    event.target.reset();
});

listUsers();
