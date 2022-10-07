import React, {Component, useState, useEffect, useRef} from 'react'
import './App.css';
import 'charts.css';
import axios from 'axios'
import Pokedex from './components/Pokedex'
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

const api = axios.create({
  baseURL: ''
})



function App() {
  const [isLoading, setLoading] = useState(true);
  const [pokemon, setPokemon] = useState();
  const [species, setSpecies] = useState();
  const [types, setTypes] = useState();
  const [evolutionChain, setEvolutionChain] = useState([])
  const pokemonNameRef = useRef();
  let loadAmount = 0;

  useEffect(() => {
    loadAmount += 1

    //make sure to run the code only once
    if (loadAmount === 1) {
    //make sure the state is empty
    setEvolutionChain([]);
    //run function to set states for pokemon data
    updatePokemonData("133", true);
    }
  }, [])

  useEffect(() => {
  }, [pokemon])
 
  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

  async function updatePokemonData(value,useId) {
    //get and set pokemon data
    let data = await getPokemon(value, useId)
    setPokemon({pokemon: data})
    //update page title to pokemon name
    document.title = data.name;

    //get and set pokemon type data using url from getPokemon
    data = await getTypes(data.types[0].type.url, false)
    setTypes({types: data})

    //get and set species data
    data = await getSpecies(value, useId)
    setSpecies({species: data})

    //reset evolution_chain data
    let awaitClear = await setEvolutionChain([])

    //get evolution_chain data
    let evolutionData = await getEvolutionChain(data.evolution_chain.url);

    //set default pokemon
    data = await getSpecies(evolutionData.chain.species.url, false)
    setEvolutionChain(prevEvolution => {
      return [...prevEvolution, { id: uuidv4(), evolution: [data]}]
    })

    //set main evolution chain
    let evolvesTo = evolutionData.chain.evolves_to;
    //get data evolutions per chain part
    while (evolvesTo.length !== 0) {
      //reset evolutions per chain part        
      let evolutionArray = [];

      //get every evolution in chain part
      for(let a = 0; a < evolvesTo.length; a++){
        data =  await getSpecies(evolvesTo[a].species.url)
        evolutionArray.push(data)
      }        
      //set data evolutions per chain part
      setEvolutionChain(prevEvolution => {
        return [...prevEvolution, { id: uuidv4(), evolution: evolutionArray}]
      })
       evolvesTo = evolvesTo[0].evolves_to
    }

    //setLoading to false
    setLoading(false)

  }

  async function getPokemon(value, useID) {
    let data

    //check if value is id or url
    if(useID === true) {
      try {
      //get data from api
      data = await apiPokemon.get(value + "/")
        .then(res => {
          return res.data
        })
      } catch(err) {
        console.log(err)
      }
    } else {
      try {
        //get data from api
        data = await api.get(value)
          .then(res => {
            return res.data
          })
      } catch(err) {
        console.log(err)
      }
    }
    return data
  }

  async function getTypes(value, useID) {
    let data
    if(useID === true) {
      try {
        //get data from api
      data = await apiTypes.get(value + "/")
        .then(res => {
          return res.data
        })
      } catch(err) {
        console.log(err)
      }
    } else {
      try {
        //get data from api
        data = await api.get(value)
          .then(res => {
            return res.data
          })
      } catch(err) {
        console.log(err)
      }
    }
    return data
  }

  async function getSpecies(value, useID) {
    let data
    if(useID === true) {
      try {
      //get data from api
      data = await apiSpecies.get(value + "/")
        .then(res => {
          return res.data
        })
      } catch(err) {
        console.log(err)
      }
    } else {
      try {
        //get data from api
        data = await api.get(value)
          .then(res => {
            return res.data
          })
      } catch(err) {
        console.log(err)
      }
    }
    return data
  }

  async function getEvolutionChain(value, useID) {
    let data
    if(useID === true) {
      try {
      //get data from api
      data = await apiSpecies.get(value + "/")
        .then(res => {
          return res.data
        })
      } catch(err) {
        console.log(err)
      }
    } else {
      try {
        //get data from api
        data = await api.get(value)
          .then(res => {
            return res.data
          })
      } catch(err) {
        console.log(err)
      }
    }
    return data
  }

  async function getPokemonID(name) {
    //get id of pokemon by name/id
    let id = getPokemon(name, true)
    return id
  }

  async function handleUpdatePokemon() {
    //get value in input
    const name = pokemonNameRef.current.value
    //get id of pokemon from api
    let data = await getPokemonID(name)
    //run update function
    await updatePokemonData(data.id, true)
    pokemonNameRef.current.value = null
  }

    return (
      <div className="App">
        <header className="App-header container">
          <form action="#" onSubmit={handleUpdatePokemon}>
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
        <Pokedex pokemon={pokemon} evolutionChain={evolutionChain} types={types} species={species}/>
      </div>
    );
  }

export default App;
