import { useState } from 'react'
import CaptureItem from './CaptureItem'
import Categories from './Categories'
import '../styles/ShoppingList.css'
import participants from "../datas/data.json"
import {captures} from "../datas/Captures"


const path = require("path")
const fs = require('fs');


var axios = require('axios');


const fileLocation1 = path.join(__dirname, 'src/datas', 'data' + '.json')
const fileLocation = path.join(__dirname, 'src/datas', 'classement' + '.json')










//fonction de validation des images
function set_valide(lien) {
    fs.readFile(fileLocation1, async (err, data) => {
        if (err) throw err;
        var participants = JSON.parse(data);

        const e = participants.find(element => element.image === lien)
        participants[participants.indexOf(e)].statu = 'validé'
        console.log(participants[participants.indexOf(e)])

        let dataStringified = JSON.stringify(participants);
        fs.writeFileSync('src/datas/data.json', dataStringified);
        ajout_point(4, e.room)

    })

}

//fonction de rejet des images

function set_refus(lien) {
    fs.readFile(fileLocation1, async (err, data) => {

        if (err) throw err;
        
        var participants = JSON.parse(data);

        const e = participants.find(element => element.image == lien)
        participants[participants.indexOf(e)].statu = 'rejeté'
        console.log(participants[participants.indexOf(e)])
        let dataStringified = JSON.stringify(participants);
        fs.writeFileSync('src/datas/data.json', dataStringified);

    })

}



//fonction d'ajout de points aux candidats
function ajout_point(nombre, room) {
    fs.readFile(fileLocation, async (err, data) => {
        if (err) throw err;
       var participants = JSON.parse(data);

        const roomexist = (element) => element.room === room;

        if (participants.findIndex(roomexist) !== -1) {
            const e = participants.find(element => element.room === room)
            participants[participants.indexOf(e)].points = participants[participants.indexOf(e)].points + nombre
            let dataStringified = JSON.stringify(participants);
            fs.writeFileSync('src/datas/classement.json', dataStringified);
            console.log(participants[participants.indexOf(e)])
        }
        else {



            var config = {
                method: 'get',
                url: 'https://webexapis.com/v1/rooms/Y2lzY29zcGFyazovL3VzL1JPT00vZjRhZWY0ODAtMWMwYS0xMWVjLWJlYzQtZjUxM2EzMzY5MDMw',
                headers: {
                    'Authorization': 'Bearer MDA1MjU5ZmQtOWNmZC00YmM3LTg3NDgtNzUwMDkyZWQ1OWYyMGRlOTBlZGUtNjFm_PF84_3ffd11dc-c24b-4250-af55-705e550fd2f6'
                }
            };

            axios(config)
                .then(function (response) {
                    data =
                    {
                        "room": room,
                        "nom": JSON.stringify(response.data.title).toString().replace('\"',"").replace('\"',""),
                        "points": nombre
                    }

                    participants.push(data)
                    let dataStringified = JSON.stringify(participants);
                    fs.writeFileSync('src/datas/classement.json', dataStringified);
                    console.log(data)
                })
                .catch(function (error) {
                    console.log(error);
                });



        }



    })
}



function CaptureList() {
	const [activeCategory, setActiveCategory] = useState('')
	const categories = ['validé','non validé','rejeté']
    

   

	return (
		<div className='lmj-shopping-list'>
			<Categories
				categories={categories}
				setActiveCategory={setActiveCategory}
				activeCategory={activeCategory}
			/>

			<ul className='lmj-plant-list'>
				{data.map(({ image, nom,statu }) =>
					!activeCategory || activeCategory === statu ? (
						<div key={image}>
							<CaptureItem
								image={image}
								nom={nom}
							/>
							<button onClick={() => set_valide(image)}>Aprouvée</button>
							
							<button onClick={() => set_refus(image)}>Rejetée</button>
						</div>
					) : null
				)}
			</ul>
		</div>
	)
}

export default CaptureList
