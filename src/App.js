import React from 'react';
import Mason from '@gregarcher/masonry'

import './App.css';

function App() {
  const hipsum = `Taxidermy proident hoodie brooklyn PBR&B godard succulents actually. Vice exercitation banh mi kombucha sed squid. Aliqua mumblecore raw denim pitchfork, intelligentsia in blog tote bag glossier normcore vice sartorial narwhal dolore echo park. Irony heirloom do, subway tile XOXO gluten-free magna. Normcore pok pok seitan hella roof party iceland humblebrag disrupt lumbersexual flexitarian mumblecore fingerstache helvetica. Yr laboris iceland, wayfarers proident hell of kitsch tilde palo santo dreamcatcher cupidatat gastropub ea. Tbh sriracha crucifix jianbing semiotics typewriter in et migas tacos.`
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
    const textStart = parseInt(Math.random() * 400)
    const height = parseInt(Math.random() * 400) + 100
    const text = hipsum.slice(textStart, textStart + (height / 5))
    return <div className='random-entry'>
      <div className='entry-content'>
        <img src={`https://picsum.photos/300/${height}`} alt='place kitten'/>
        <p>{text}</p>
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
