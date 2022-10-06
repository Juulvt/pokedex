import React from 'react'

export default function Evolution({evolutionChain}) {
  return (
    evolutionChain.map(evo => {
        return evo.evolution.id
    })
  )
}
