import React, { Component } from 'react';
import Mason from './components/Mason'
import './App.css';

class App extends Component {
	
	constructor (props) {
		super(props)
		
		let hipsum = `Lorem ipsum dolor amet banjo helvetica bitters forage. Gluten-free shaman listicle put a bird on it, craft beer PBR&B neutra meditation health goth typewriter XOXO. Portland chillwave offal intelligentsia artisan pok pok 3 wolf moon VHS shabby chic tousled church-key ethical craft beer. Craft beer raw denim tumblr celiac viral pop-up tbh single-origin coffee chillwave etsy tousled. Stumptown man braid biodiesel blog poke. Thundercats williamsburg narwhal, portland DIY +1 selfies yr. Prism subway tile put a bird on it, 3 wolf moon knausgaard XOXO tousled fashion axe. Actually skateboard edison bulb marfa hoodie vice fanny pack waistcoat selfies church-key enamel pin snackwave locavore. Activated charcoal sartorial intelligentsia man bun`
		this.state = {
			items: (new Array(30)).fill(0).map(i => hipsum.substr(0, 50 + (Math.random() * (hipsum.length - 51)) ))
		}
	}
	
	

	render() {
		const items = this.state.items
		
		return (
			<div className='App'>
				<Mason columns='2'>
					{items.map((item, index) => <div key={index} className='my-item' ><div>{item}</div></div>)}
				</Mason>
				<Mason columns='3'>
					{items.map((item, index) => <div key={index} className='my-item' ><div>{item}</div></div>)}
				</Mason>
				<Mason columns='4'>
					{items.map((item, index) => <div key={index} className='my-item' ><div>{item}</div></div>)}
				</Mason>
				<Mason columns='5'>
					{items.map((item, index) => <div key={index} className='my-item' ><div>{item}</div></div>)}
				</Mason>
			</div>
		)
	}
}

export default App;
