export default () => ({
    
    signin:(email, password) => {
        return new Promise((resolve, reject)=> {
            setTimeout(()=> {
                let json = {
                    error:'',
                    token:'123'
                };

                resolve(json);
            }, 1000)
        });
    },

    signup:(name, email, password) => {
        return new Promise((resolve, reject)=> {
            setTimeout(()=> {
                let json = {
                    error:'',
                };

                if(email == 'erro@hotmail.com') {
                    json.error = 'E-mail já existe!';
                } else {
                    json.token = '123'
                }
                
                resolve(json);
            }, 1000)
        });
    },

    getRequestPrice:(distance) => {
        return new Promise((resolve, reject)=> {
            setTimeout(()=> {
                let json = {
                    error:'',
                };

                json.price = distance * 7;
                
                resolve(json);
            }, 1000)
        });
    },

    findDriver:(options) => {
        return new Promise((resolve, reject)=> {
            setTimeout(()=> {
                let json = {
                    error:'',
                };

                json.driver = {
                    name:'Max',
                    avatar:'https://static.wikia.nocookie.net/villains/images/d/de/Maxson.jpg/revision/latest?cb=20190709125528',
                    stars:4,
                    carName:'Honda Civic',
                    carColor:'Branco',
                    carPlate:'AAA-2222'
                }
                
                resolve(json);
            }, 3000)
        });
    }
})