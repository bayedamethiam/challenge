import CareScale from './CareScale'
import '../styles/PlantItem.css'
import { createRequire } from 'module';



const path = require("path")
const fs = require('fs');
const { forEach } = require('lodash');

var axios = require('axios');

var restauData = []
const fileLocation1 = path.join(__dirname, 'src/datas', 'data' + '.json')
const fileLocation = path.join(__dirname, 'src/datas', 'classement' + '.json')
var participants






function handleClick(auteur) {
	alert(`Vous avez validé la capture de  ${auteur} il recoit 4 points`)
}




function CaptureItem({image, nom}) {
    const fileImage =path.join(image)
	return (
		<li className='lmj-plant-item' onClick={() => handleClick}>
			<span className='lmj-plant-item-price'>{nom}</span>
			<img className='lmj-plant-item-cover' src={image} alt={`${image} cover`} />
			
		</li>
	)
}

export default CaptureItem