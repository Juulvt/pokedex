import React from 'react'

export default function Pokedex({pokemon, evolutionChain, species, types, evolutions}) {


  return (
    <div className="container column pokedex">
      <div className="row basic-info">
        <div className="pokemon-image">
          <img alt="pokemon" src={pokemon.pokemon.sprites.other['official-artwork'].front_default}/>
          <span>#{pokemon.pokemon.id}</span>
        </div>
        <div className="details">
          <div className="row">
            <div className="item">
              <h3>Height</h3>
              <div className="value">{pokemon.pokemon.height}"</div>
            </div>
            <div className="item">
              <h3>Category</h3>
                {species.species.genera.map(gen => {
                  if (gen.language.name === "en") {
                    return <div key={gen.genus.split("Pokémon")[0]} className="value">{gen.genus.split("Pokémon")[0]}</div>
                  } else {
                    return null
                  }
                })}
            </div>
          </div>
          <div className="row">
            <div className="item">
              <h3>Weight</h3>
              <div className="value">{pokemon.pokemon.weight} lbs</div>
            </div>
            <div className="item">
              <h3>Base Exp</h3>
              <div className="value">{pokemon.pokemon.base_experience}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="row detailed-info">
        <div className="column pokedex-header">
          <div className="pokemon-intro">
            <h2 key={pokemon.pokemon.id}>{pokemon.pokemon.name}</h2>
            <div className="types flex-box">
            {pokemon.pokemon.types.map(type => { 
                return (
                <div key={type.type.name} className={"badge background-color-" + type.type.name}>{type.type.name}</div>
                )})}
            </div>
            <h3 className="pokemon-entry">Pokedex Entry</h3>
            <p>{species.species.flavor_text_entries[2].flavor_text}</p>
          </div>
          <div className="gender">
            <span> M </span>
            <span> W </span>
          </div>
        </div>
        <div className="column">
          <div className="item">
            <h3>Abilities</h3>
            <div className="flex-box">
              {pokemon.pokemon.abilities.map(abil => {
                if (abil.is_hidden !== true) {
                  return <div key={abil.ability.name} className="value">{abil.ability.name}</div>
                } else {
                  return null
                }
              })}
            </div>
          </div>
          <div className="item">
            <h3>Weaknesses</h3>
            <div className="flex-box">
              {types.types.damage_relations.double_damage_from.map(weakness => {
                return (
                <div key={weakness.name} className={"value border-" + weakness.name}>{weakness.name}</div>
              )})}
            </div>
          </div>
        </div>
        <div className="stats">
          <h3>Stats</h3>
          <div className="graph">
            <table id="column-example-20" className="charts-css column show-labels datasets-spacing-5">
              <thead>
                <tr>
                  <th scope="col"> Year </th> 
                  <th scope="col"> Progress </th>
                </tr>
              </thead> 
              <tbody>
                {pokemon.pokemon.stats.map(stat => { 
                return (<tr key={stat.stat.name}>
                  <th scope="row"> {stat.stat.name} </th> 
                  <td className={"td-" + stat.stat.name} style={{['--size']: (stat.base_stat / 100) }}><div><h4>{stat.base_stat}</h4></div></td>
                </tr> 
                )})}
              </tbody>
            </table>
          </div>
        </div>
        <div className="evolutions-container">
          <h3>Evolutions</h3>
          <div className="evolutions-flexbox">
            {evolutionChain.map((evolution, i) => {
              
              if (i + 1 === evolutionChain.length) {
                // Last one.
                return(
                  <a key={evolution} href="/" target="blank" className="evolution">
                  {evolution.evolution.map(evo => {
                    return (
                      <div key={evo.id}>
                        <img alt="pokemon" src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + evo.id + ".png"}/>
                        <span>#{evo.id}</span>
                      </div>
                    )
                  })}
                  </a>
                )
              } else {
                // Not last one.
                return(
                  <a key={evolution} href="/" target="blank" className="evolution">
                  {evolution.evolution.map(evo => {
                    return (
                      <div key={evo.id}>
                      <img alt="pokemon" src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + evo.id + ".png"}/>
                      <span>#{evo.id}</span>
                      </div>
                    )
                  })}
                  </a>
                )
              }
              
            })}
          </div>
          
        </div>
      </div>
    </div>
  )
}
