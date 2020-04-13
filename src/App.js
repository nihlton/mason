import React from 'react';
import Mason from '@gregarcher/masonry'

import './App.css';

function App() {
  const hipsum = 'Shabby chic cloud bread in 8-bit non ramps snackwave vice poke lomo blog readymade brooklyn man bun. '
  const columnConfig = {
    "small": {
      "query": "(max-width: 720px)",
      "columns": 2
    },
    "medium": {
      "query": "(min-width: calc(720px + 1px)) and (max-width: calc(1023px - 1px) )",
      "columns": 3
    },
    "large": {
      "query": "(min-width: 1023px)",
      "columns": 4
    }
  }
  
  const randomEntries = new Array(60).fill('.').map(() => {
    const height = parseInt(Math.random() * 600) + 50
    return <div className='random-entry'>
      <div className='entry-content'>
        <img src={`http://placeimg.com/300/${height}/any`} alt='place kitten'/>
        <p>{hipsum.slice(0, height / 10)}</p>
      </div>
    </div>
  })
  
  return (
    <div className="App">
      <Mason columns={columnConfig}>{randomEntries}</Mason>
    </div>
  );
}

export default App;
