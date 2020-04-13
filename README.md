# React Stone Mason
Responsive masonry layout engine for react.

live demo: https://nihlton.github.io/mason/

## Installation

`npm install react-stone-mason`

or

`yarn add react-stone-mason`

## Usage

```js
const columnConfig = {
	[break point]: {
		query: '[CSS media query]',
		columns: [number of columns],
	},
	... 
}
<Mason columns={columnConfig}>{ children }</Mason>

```
* **break point** - any name, for readability.

* **CSS media query** - (optional) a media query string.  see: [Window.matchMedia()](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)

  - if a query isn't provided, the column value will be treated as the default/fallback value.

* **columns** - number of columns to divide child elements into.

**Notes:**

* its best to not style direct children of the Mason component, as it could interfer with positioning.  Wrap your elements in a plain div.
* The Mason component will apply some styling to the child components, specifically:
  - box-sizing
  - display
  - vertical-align
  - width

#### Basic Example
```js
import React from 'react';
import Mason from 'react-stone-mason'

function App() {

  return (
    <div className="App">
      <Mason columns={ default: { columns: 3 } }>{ [children] }</Mason>
    </div>
  );
}

export default App;
```


#### Responsive Example
```js
import React from 'react';
import Mason from 'react-stone-mason'

function App() {

  const columnConfig = {
    small: {
      query: '(max-width: 720px)',
      columns: 2
    },
    medium: {
      query: '(min-width: calc(721px)) and (max-width: calc(1022px) )',
      columns: 3
    },
    large: {
      query: '(min-width: 1023px)',
      columns: 4
    }
  }
  
  
  return (
    <div className="App">
      <Mason columns={columnConfig}>{ [children] }</Mason>
    </div>
  );
}

export default App;
```