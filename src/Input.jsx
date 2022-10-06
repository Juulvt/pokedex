import React from 'react'
import { useRef } from 'react'

function Input({getPokemon}) {
    const pokemonNameRef = useRef()

    function handleChangePokemon() {
        const name = pokemonNameRef.current.value
        getPokemon(name);
      }
    
  return (
    <form action="#" onSubmit={handleChangePokemon}>
          <input
            ref={pokemonNameRef} 
            type="text"
            className="todo-input"
            placeholder="What do you need to do?"
            />
        </form>
  )
} export default Input;
