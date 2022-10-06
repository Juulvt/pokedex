import React, {Component, useState, useEffect, useRef} from 'react'
import './App.css';
import 'charts.css';
import axios from 'axios'
import Pokedex from './components/Pokedex'
import Evolution from './components/Evolution'
import { v4 as uuidv4 } from 'uuid';



const apiPokemon = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/pokemon/'
})

const apiSpecies = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/pokemon-species/'
})

const apiTypes = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/type/'
})

const apiEvolution = axios.create({
  baseURL: ''
})

const apiEvolutionSpecies = axios.create({
  baseURL: ''
})



function App() {
  const [isLoading, setLoading] = useState(true);
  const [pokemon, setPokemon] = useState();
  const [species, setSpecies] = useState();
  const [types, setTypes] = useState();
  const [evolutions, setEvolutions] = useState();
  const [evolutionChain, setEvolutionChain] = useState([])
  const pokemonNameRef = useRef();
  let loadAmount = 0;

  useEffect(() => {
    loadAmount += 1;

    if (loadAmount === 1) {
    console.log("Step 1");
    setEvolutionChain([]);
    getSpecies("eevee");
    getPokemon("eevee");
    }
  }, [])

  useEffect(() => {
  }, [pokemon])
 
  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

  async function getPokemon(name) {
    try {
    await apiPokemon.get(name + "/")
        .then(res => {
          console.log("pokemon:")
          console.log(res.data)
          setPokemon({pokemon: res.data});
          console.log("type:")
          console.log(res.data.types[0].type.name)
          getTypes(res.data.types[0].type.name);
          document.title = res.data.name;
        });
      } catch(err) {
          console.log(err)
        }
  }

  async function getTypes(name) {
    console.log(name)
    console.log("type")
    try {
    await apiTypes.get(name + "/")
        .then(res => {
          console.log("type: ")
          console.log(res.data)
          setTypes({types: res.data});
          setLoading(false);
        });
      } catch(err) {
          console.log(err)
        }
  }

  async function getSpecies(name) {
    console.log(name)
    console.log("Step 2");
    try {
    await apiSpecies.get(name + "/")
        .then(res => {
          console.log("Step 3 | species: ")
          console.log(res.data)
          setSpecies({species: res.data});
          console.log("url is: " + res.data.evolution_chain.url)
          getEvolutionChain(res.data.evolution_chain.url, res.data.name)
        });
      } catch(err) {
          console.log(err)
        }
  }

  async function getEvolution(url) {
    console.log(url)
    console.log("Step 5")
    try {
      await apiEvolutionSpecies.get(url)
        .then(res => {
          console.log("Step 6 | evolutionSpecies: ")
          console.log(res.data)
          setEvolutionChain(prevEvolution => {
            return [...prevEvolution, { id: uuidv4(), evolution: [res.data]}]
          })
          url = res.data.evolution_chain.url
          apiEvolution.get(url)
            .then(res => {
              console.log("Step 7 | you are here")
              let evolvesTo = res.data.chain.evolves_to;
              while (evolvesTo.length !== 0) {
                let evolutionArray = [];
                for(let a = 0; a < evolvesTo.length; a++){
                  apiEvolutionSpecies.get(evolvesTo[a].species.url)
                  .then(res => {
                    evolutionArray.push(res.data)
                  })
                }
                setEvolutionChain(prevEvolution => {
                  return [...prevEvolution, { id: uuidv4(), evolution: evolutionArray}]
                })
                evolvesTo = evolvesTo[0].evolves_to;
              }
          })
        })
    } catch(err) {
      console.log(err)
    }
  }

  async function getEvolutionChain(url, name) {
    //Step 1 get default
    //step 2 save evolution data for default
    //step 3 for each evolution get evolution data (get evolutionurl from speciesurl)
    try {
      await apiEvolution.get(url)
        .then(res => {
          let evolutionDefault = res.data.chain.species.url
          console.log("Step 4 | evolution:")
          console.log(evolutionDefault)
          console.log(res.data)
          setEvolutions({evolutions: res.data})
          console.log("name is : " + res.data.chain.species.name)
          getEvolution(evolutionDefault)
        })
    } catch(err) {
      console.log(err)
    }
  }

  async function updatePokemon() {
    const name = pokemonNameRef.current.value;
    await setEvolutionChain([]);
    await getSpecies(name);
    await getPokemon(name);
    pokemonNameRef.current.value = null
  }

    return (
      <div className="App">
        <header className="App-header container">
          <form action="#" onSubmit={updatePokemon}>
            <input
              ref={pokemonNameRef} 
              type="text"
              className="pokemon-input"
              placeholder="Enter Pokemon name..."
              />
          </form>
          <a
            className="App-logo"
            href="/"
            target="_blank"
            rel="noopener noreferrer"
          >
          </a>
          
        </header>
        <Pokedex pokemon={pokemon} evolutionChain={evolutionChain} evolutions={evolutions} types={types} species={species}/>
      </div>
    );
  }

export default App;
