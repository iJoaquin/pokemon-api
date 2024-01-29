const Seccion_General = document.querySelector(".seccion_general");
const ID_Nombre_Pokemon = document.getElementById("id_pokemon");
const boton_anterior = document.getElementById("anterior");
const boton_siguiente = document.getElementById("siguiente");

let pokemons = [];
let pagina_actual = 1;
const limite = 20;

async function obtenerPokemon() {
    let offset = (pagina_actual - 1) * limite;

    /*let api = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0";*/

    //Cuando se hace el primer consumo offset sera 20 y sucesivamente
    let api = `https://pokeapi.co/api/v2/pokemon?limit=${limite}&offset=${offset}`;

    try {
        const response = await fetch(api);
        const { results } = await response.json();
         /*console.log(results)*/

        pokemons = results;
        console.log(pokemons)

        Seccion_General.innerHTML = "";

        for (let i = 0; i < pokemons.length; i++) {
            pokemonHTML(pokemons[i]);
        }

    } catch (error) {
        console.error(error);
    }
}

obtenerPokemon();

async function pokemonHTML(pokemon) {
    const { name, url, types, stats, weight, height, base_experience, abilities } = pokemon;

    try {
        const nombre = document.createElement("h1");
        nombre.textContent = name;

        const response = await fetch(url);
        const data = await response.json();
        console.log(data)

        const sprites = data.sprites;
        /*console.log(sprites)*/

        const imagen = document.createElement("img");
        imagen.src = sprites.front_default;

        const tipo = document.createElement("p");
        tipo.textContent = `Type: ${data.types.map(elemento => elemento.type.name).join(", ")}`;

        const estadisticas = document.createElement("p");
        estadisticas.textContent = `Stats: ${data.stats.map(elemento => `${elemento.stat.name}: ${elemento.base_stat}`).join(", ")}`;

        const peso = document.createElement("p");
        peso.textContent = `Weight: ${data.weight} hectograms`;

        const altura = document.createElement("p");
        altura.textContent = `Height: ${data.height}cm`;

        const base_exp = document.createElement("p");
        base_exp.textContent = `Base experience amount: ${data.base_experience}`;

        const habilidades = document.createElement("p");
        habilidades.textContent = `Skills: ${data.abilities.map(elemento => elemento.ability.name).join(", ")}`;

        const div_pokemon = document.createElement("div");
        div_pokemon.classList.add("div_pokemon");
        div_pokemon.appendChild(nombre);
        div_pokemon.appendChild(imagen);
        div_pokemon.appendChild(tipo);
        div_pokemon.appendChild(estadisticas);
        div_pokemon.appendChild(peso);
        div_pokemon.appendChild(altura);
        div_pokemon.appendChild(base_exp);
        div_pokemon.appendChild(habilidades);

        Seccion_General.appendChild(div_pokemon);

        nombre.classList.add("nombre");
        imagen.classList.add("imagen");
        tipo.classList.add("tipos");
        estadisticas.classList.add("estadisticas");
        peso.classList.add("peso");
        altura.classList.add("altura");
        base_exp.classList.add("base_exp");
        habilidades.classList.add("habilidades");

    } catch (error) {
        console.error(error);
    }
}

ID_Nombre_Pokemon.addEventListener("input", filtrarNombre);

function filtrarNombre() {
    Seccion_General.innerHTML = "";

    const nombre_buscado = ID_Nombre_Pokemon.value.toLowerCase();

    for (let i = 0; i < pokemons.length; i++) {
        const { name } = pokemons[i];

        if (name.includes(nombre_buscado)) {
            pokemonHTML(pokemons[i]);
        }
    }
}

function ordenarNombre() {
    const copia_pokemons = [...pokemons]

    copia_pokemons.sort((a, b) => a.name.localeCompare(b.name));

    Seccion_General.innerHTML = "";

    copia_pokemons.forEach(pokemon => {
        pokemonHTML(pokemon);
    });
}

boton_anterior.addEventListener("click", obtenerPokemonAnterior);
boton_siguiente.addEventListener("click", obtenerPokemonSiguiente);

function obtenerPokemonAnterior() {
    if (pagina_actual > 1) {
        pagina_actual--;
        obtenerPokemon();
    }
}

function obtenerPokemonSiguiente() {
    pagina_actual++;
    obtenerPokemon();
}

async function filtrarPorTipo(tipo) {
    Seccion_General.innerHTML = "";

    try {

        if (tipo === "") {
            for (let i = 0; i < pokemons.length; i++) {
                pokemonHTML(pokemons[i]);
            }

        } else {
            const response = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
            const data = await response.json();

            const nombres_pokemonTipo = data.pokemon.map(elemento => elemento.pokemon.name);

            //Crear nuevo array
            const pokemons_filtrados = pokemons.filter(pokemon => nombres_pokemonTipo.includes(pokemon.name));

            for (let i = 0; i < pokemons_filtrados.length; i++) {
                pokemonHTML(pokemons_filtrados[i]);
            }
        }
        
    } catch (error) {
        console.error(error);
    }
}

/*async function filtrarPorTipo() {
    Seccion_General.innerHTML = "";

    const tipo_seleccionado = document.getElementById("tipo_pokemon").value.toLowerCase();

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${tipo_seleccionado}`);
        const data = await response.json();

        // Obtén los nombres de los Pokémon del tipo seleccionado
        const nombresPokemonTipo = data.pokemon.map(p => p.pokemon.name);

        // Filtra los Pokémon originales por el tipo seleccionado
        const pokemonsFiltrados = pokemons.filter(pokemon => nombresPokemonTipo.includes(pokemon.name));

        for (let i = 0; i < pokemonsFiltrados.length; i++) {
            pokemonHTML(pokemonsFiltrados[i]);
        }
    } catch (error) {
        console.error(error);
    }
}*/