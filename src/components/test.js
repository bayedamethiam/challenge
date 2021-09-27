


const path = require("path")
const fs = require('fs');
const { forEach } = require('lodash');

var axios = require('axios');
const fileLocation1 = path.join(__dirname, '../datas', 'data' + '.json')
const fileLocation = path.join(__dirname, '../datas', 'classement' + '.json')
var participants




// recuperation des rooms
function rooms() {
    var config = {
        method: 'get',
        url: 'https://webexapis.com/v1/rooms',
        headers: {
            'Authorization': 'Bearer MDA1MjU5ZmQtOWNmZC00YmM3LTg3NDgtNzUwMDkyZWQ1OWYyMGRlOTBlZGUtNjFm_PF84_3ffd11dc-c24b-4250-af55-705e550fd2f6'
        }
    };

    axios(config)
        .then(function (response) {

            JSON.stringify(response.data);
            rooms = response.data.items


            //pour chaque room recuperer les messages 
            rooms.forEach(room => {


                var request = require('request');
                var options = {
                    'method': 'GET',
                    'url': "https://webexapis.com/v1/messages?roomId=" + room.id,
                    'headers': {
                        'Authorization': 'Bearer MDA1MjU5ZmQtOWNmZC00YmM3LTg3NDgtNzUwMDkyZWQ1OWYyMGRlOTBlZGUtNjFm_PF84_3ffd11dc-c24b-4250-af55-705e550fd2f6'
                    }
                };
                request(options, function (error, response) {
                    if (error) throw new Error(error);
                    images = response.body

                    var images = []
                    JSON.parse(response.body).items.forEach(image => {
                        if (new Set(Object.keys(image)).has('files')) {
                            images.push(image)
                        }
                    })



                    // telechargement des images
                    images.forEach(image => {
                        var i = 0
                        image.files.forEach(e => {
                            ajout_photo(e, image.id + i.toString())

                            var data = {
                                "nom": room.title,
                                "room": room.id,
                                'image': "src/assets/img"+image.id + i.toString() + ".PNG",
                                "statu": 'non validé'
                            }
                            add_participant(data)
                        })


                    })


                });
            })


            console.log(response.data.items)

        })
        .catch(function (error) {
            console.log(error);
        });



}


//telechargement d'une nouvelles photo

function ajout_photo(lien, id) {

    var axios = require('axios');

    var config = {
        method: 'get',
        url: lien,
        responseType: 'stream',
        headers: {
            'Authorization': 'Bearer MDA1MjU5ZmQtOWNmZC00YmM3LTg3NDgtNzUwMDkyZWQ1OWYyMGRlOTBlZGUtNjFm_PF84_3ffd11dc-c24b-4250-af55-705e550fd2f6'
        }
    };

    const root = path.resolve(__dirname, 'src/assets/img', id + ".PNG")
    const writer = fs.createWriteStream(root)

    axios(config)
        .then(function (response) {

            response.data.pipe(writer)

            return new Promise((resolve, reject) => {
                writer.on('finish', resolve)
                writer.on('error', reject)
            })

            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });


}


//ajout d'un nouveau participant
function add_participant(data1) {
    fs.readFile(fileLocation1, async (err, data) => {
        if (err) throw err;
        participants = JSON.parse(data);

        participants.push(data1)
        let dataStringified = JSON.stringify(participants);
        fs.writeFileSync('src/datas/data.json', dataStringified);
    })

}



// recuperation des messages contenant des images
function images_message(lien) {

    var request = require('request');
    var options = {
        'method': 'GET',
        'url': lien,
        'headers': {
            'Authorization': 'Bearer MDA1MjU5ZmQtOWNmZC00YmM3LTg3NDgtNzUwMDkyZWQ1OWYyMGRlOTBlZGUtNjFm_PF84_3ffd11dc-c24b-4250-af55-705e550fd2f6'
        }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        var e = response.body

        var retour = []
        JSON.parse(e).items.forEach(element => {
            if (new Set(Object.keys(element)).has('files')) {
                retour.push(element)
            }
        })
        console.log(retour);
        return retour

    });

}


function set_valide(lien) {
    fs.readFile(fileLocation1, async (err, data) => {
        if (err) throw err;
        participants = JSON.parse(data);

        const e = participants.find(element => element.image == lien)
        participants[participants.indexOf(e)].statu = 'validé'
        console.log(participants[participants.indexOf(e)])

        let dataStringified = JSON.stringify(participants);
        fs.writeFileSync('src/datas/data.json', dataStringified);
        ajout_point(4, e.room)

    })

}
function set_refus(lien) {
    fs.readFile(fileLocation1, async (err, data) => {
        if (err) throw err;
        participants = JSON.parse(data);

        const e = participants.find(element => element.image == lien)
        participants[participants.indexOf(e)].statu = 'rejeté'
        console.log(participants[participants.indexOf(e)])
        let dataStringified = JSON.stringify(participants);
        fs.writeFileSync('src/datas/data.json', dataStringified);

    })

}


function ajout_point(nombre, room) {
    fs.readFile(fileLocation, async (err, data) => {
        if (err) throw err;
        participants = JSON.parse(data);

        const roomexist = (element) => element.room == room;

        if (participants.findIndex(roomexist) != -1) {
            const e = participants.find(element => element.room == room)
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



