let randomUsers = null;
let filteredUsers = null;

let menUsers = 0;
let womenUsers = 0;

let ageSum = 0;
let ageAverage = 0;

let filterTitle = null;
let filterContent = null;

let statsTitle = null;
let statsContent = null;

let inputText = null;
let buttonSearch = null;

window.addEventListener('load', () => {
    filterTitle = document.querySelector('.filter-title');
    filterContent = document.querySelector('.filter-content');

    statsTitle = document.querySelector('.statistics-title');
    statsContent = document.querySelector('.statistics-content');

    inputText = document.querySelector('input[type="text"]');
    inputText.addEventListener('keyup', handleInputText);

    buttonSearch = document.querySelector('input[type="button"]');
    buttonSearch.addEventListener('click', handleButtonPressed);

    fetchRandomUsers();
});

async function fetchRandomUsers() {
    const response = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
    const json = await response.json();

    randomUsers = json.results.map((randomUser) => {
        
        return {
            name: {
                first: randomUser.name.first,
                last: randomUser.name.last,
            },
            gender: randomUser.gender,
            age: randomUser.dob.age,
            picture: randomUser.picture,
        };
    });
}

function handleInputText(keyboardEvent) {
    if (keyboardEvent.code === 'Enter') {

        if (inputText.value.length === 0) {
            return;
        }

        showFilteredUsers();
        showStatistics();
    }
}

function showFilteredUsers() {
    const filterText = inputText.value.toLowerCase();

    filteredUsers = randomUsers.filter((randomUser) => (randomUser.name.first.toLowerCase().includes(filterText) || 
        randomUser.name.last.toLowerCase().includes(filterText))
    );

    filterTitle.textContent = `${filteredUsers.length} usuário(s) encontrado(s)`;

    let htmlFilteredUsers = '<div>';

    filteredUsers.forEach((user) => {
        const {name, age, picture} = user;
        const fullName = name.first + ' ' + name.last;

        const htmlUser = `
            <div class="user">
                <div>
                    <img class="profile-photo" src="${picture.thumbnail}" alt="${fullName}" />
                </div>
                <div>
                    <p>${fullName + ', ' + age + ' anos'}</p>
                </div>
            </div>
        `;

        htmlFilteredUsers += htmlUser;
    });

    htmlFilteredUsers += '</div>';
    filterContent.innerHTML = htmlFilteredUsers;
}

function showStatistics() {

    if (filteredUsers.length === 0) {
        statsTitle.textContent = 'Nada a ser exibido';
        statsContent.innerHTML = '';
        return;
    }
    
    statsTitle.textContent = 'Estatísticas';

    menUsers = filteredUsers.filter((user) => user.gender === 'male').length;
    womenUsers = filteredUsers.filter((user) => user.gender === 'female').length;

    ageSum = filteredUsers.reduce((previous, current) => previous + current.age, 0);
    ageAverage = (ageSum / filteredUsers.length).toFixed(2);

    const htmlStats = `
        <div>
            <p>Total de homens: ${menUsers}</p>
            <p>Total de mulheres: ${womenUsers}</p>
            <p>Somatório das idades: ${ageSum}</p>
            <p>Média das idades: ${ageAverage}</p>
        </div>
    `;

    statsContent.innerHTML = htmlStats;
}

function handleButtonPressed(mouseEvent) {

    if (inputText.value.length === 0) {
        return;
    }

    showFilteredUsers();
    showStatistics();
}
