const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = { 

    //buscando e listando 
    async index(request, response){
        const devs = await Dev.find();
        return response.json(devs);
    },

    //cadastro de dev
    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;
        
        //procurando no banco se existe algum usuário com mesmo nome
        let dev = await Dev.findOne({ github_username });

        if(!dev){
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
        
            const { name = login, avatar_url, bio } = apiResponse.data;
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            })
        }
        
    
        return response.json(dev);
    }
};