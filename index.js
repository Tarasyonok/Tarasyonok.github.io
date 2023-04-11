let express = require(`express`);
let app = express();
let port = 3000;

app.listen(port, function () {
    console.log(`Сервер запущен по такому адресу: http://localhost:${port}`);
});

app.use(express.static(`public`));

let hbs = require(`hbs`);
app.set(`views`, `views`);
app.set(`view engine`, `hbs`);

app.use(express.urlencoded({ extended: true }));

let { faker } = require(`@faker-js/faker`);

app.get(`/`, function (req, res) {
    res.render(`index`);
});

let plants = [];
let plants_names = [`peashooter`, `sunflower`, `cherry bomb`, `wall-nut`, `potato mine`, `snow pea`, `chomper`, `repeater`, `puff-shroom`, `sun-shroom`, `fume-shroom`,];

for (let i = 0; i < plants_names.length; i++) {
    plants.push({
        id: i + 1,
        img: `${plants_names[i]}.png`,// faker.image.nature(1000, 1000, true),
        name: plants_names[i],
        description: faker.lorem.lines()
    });
}

app.get(`/plants`, function (req, res) {
    let id = req.query.id - 1;
    if (!plants[id]) {
        id = 0
    }
    res.render(`plants`, {
        plants: plants,
        img: plants[id].img,
        name: plants[id].name,
        description: plants[id].description,

    });
});

let zombies = [];
let zombies_names = [`zombie`, `flag zombie`, `conehead zombie`, `pole vaulting zombie`, `buckethead zombie`, `newspaper zombie`, `screen door zombie`, `football zombie`,];

for (let i = 0; i < zombies_names.length; i++) {
    zombies.push({
        id: i + 1,
        img: `${zombies_names[i]}.png`,// faker.image.nature(1000, 1000, true),
        name: zombies_names[i],
        description: faker.lorem.lines()
    });
}

app.get(`/zombies`, function (req, res) {
    let id = req.query.id - 1;
    if (!zombies[id]) {
        id = 0
    }
    res.render(`zombies`, {
        zombies: zombies,
        img: zombies[id].img,
        name: zombies[id].name,
        description: zombies[id].description,
    });
});

app.get(`/admin`, function (req, res) {
    let show = req.query.show;
    if (!show || show != `zombies`) {
        psel = `selected`;
        zsel = ``;
        plantsDNone = ``;
        zombiesDNone = `d-none`;
    } else {
        psel = ``;
        zsel = `selected`;
        plantsDNone = `d-none`;
        zombiesDNone = ``;
    }

    res.render(`admin`, {
        psel: psel,
        zsel: zsel,
        plantsDNone: plantsDNone,
        zombiesDNone: zombiesDNone,
        plants: plants,
        zombies: zombies
    });
});

app.get(`/admin/change/plants`, function (req, res) {
    let id = req.query.id;
    if (!id || id >= plants.length) {
        id = 1;
    }
    id--;
    res.render(`change`, {
        pOrZ: `plants`,
        id: id,
        name: plants[id].name,
        description: plants[id].description
    });
});

app.get(`/admin/change/zombies`, function (req, res) {
    let id = req.query.id;
    if (!id || id >= zombies.length) {
        id = 1;
    }
    id--;
    res.render(`change`, {
        pOrZ: `zombies`,
        id: id,
        name: zombies[id].name,
        description: zombies[id].description
    });
});


app.post(`/admin/save_changes/plants`, function (req, res) {
    let id = req.body.id;
    if (id && id < plants.length || id == 0) {
        plants[id].name = req.body.name;
        plants[id].description = req.body.description;
    }
    res.redirect(`/admin?show=plants`);
});

app.post(`/admin/save_changes/zombies`, function (req, res) {
    let id = req.body.id;
    if (id && id < zombies.length || id == 0) {
        zombies[id].name = req.body.name;
        zombies[id].description = req.body.description;
    }
    res.redirect(`/admin?show=zombies`);
});


app.get(`/admin/new/plants`, function (req, res) {
    res.render(`new`, {
        pOrZ: `plants`
    });
});

app.get(`/admin/new/zombies`, function (req, res) {
    res.render(`new`, {
        pOrZ: `zombies`,
    });
});

app.post(`/admin/create_new/plants`, function (req, res) {
    plants.push(
        {
            id: plants.length + 1,
            img: `unknown.png`,
            name: req.body.name,
            description: req.body.description,
        }
    );
    res.redirect(`/admin?show=plants`);
});

app.post(`/admin/create_new/zombies`, function (req, res) {
    zombies.push(
        {
            id: zombies.length + 1,
            img: `unknown.png`,
            name: req.body.name,
            description: req.body.description,
        }
    );
    res.redirect(`/admin?show=zombies`);
});
