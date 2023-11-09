//require database and category model
require('../model/database')
const Category = require('../model/Category');
const Blog = require('../model/Blog');

/* 
* GET /
* homePage
*/
exports.homePage = async(req, res) => {
    try{
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Blog.find({}).sort({_id: -1}).limit(limitNumber);
        const indian = await Blog.find({'category': 'India'}).limit(limitNumber);
        const italian = await Blog.find({'category': 'Italy'}).limit(limitNumber);
        const japanese = await Blog.find({'category': 'Japan'}).limit(limitNumber);

        const travelBlogs = { latest, indian, italian, japanese };

        res.render('index', {title: 'Travelling Blog - Home', categories, travelBlogs});
    }
    catch(error){
        res.status(500).send({message: error.message || "Error Occured"});
    }
}


/* 
* GET /categories
* Categories
*/
exports.exploreCategories = async(req, res) => {
    try{
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories', {title: 'travel Blog - Categories', categories});
    }
    catch(error){
        res.status(500).send({message: error.message || "Error Occured"});
    }
}


/* 
* GET /categories/:id
* Categories By Id
*/
exports.exploreCategoriesById = async(req, res) => {
    try{
        let categoryId = req.params.id;
        const limitNumber = 20;
        const categoryById = await Blog.find({ 'category': categoryId }).limit(limitNumber);
        res.render('categories', {title: 'Travel Blog - Categories', categoryById});
    }
    catch(error){
        res.status(500).send({message: error.message || "Error Occured"});
    }
}


/* 
* POST /search
* Search
*/
exports.searchBlog = async(req, res) => {

    try {
        let searchTerm = req.body.searchTerm;
        let blog = await Blog.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
        res.render('search', {title: 'Travel Blog - Search', blog});
    } catch (error) {    
    }
}

/* 
* GET /explore-latest
* explore latest
*/
exports.exploreLatest = async(req, res) => {
    try{
        const limitNumber = 20;
        const blog = await Blog.find({}).sort({ _id: -1 }).limit(limitNumber);
        res.render('explore-latest', {title: 'Travel Blog - Explore Latest', blog});
    }
    catch(error){
        res.status(500).send({message: error.message || "Error Occured"});
    }
}


/* 
* GET /explore-random
* explore random
*/
exports.exploreRandom = async(req, res) => {
    try{
        const count = await Blog.find().countDocuments();
        const random = Math.floor(Math.random() * count);
        let blog = await Blog.findOne().skip(random).exec();
        res.render('explore-random', {title: 'Travel Blog - Explore Latest', blog});
    }
    catch(error){
        res.status(500).send({message: error.message || "Error Occured"});
    }
}






/* 
* GET /blod/:id
* Blog
*/
exports.exploreBlog = async(req, res) => {
    try{
        let blogId = req.params.id;
        const clickedBlog = await Blog.findById(blogId);
        res.render('blog', {title: 'Travel Blog - Blog', clickedBlog});
    }
    catch(error){
        res.status(500).send({message: error.message || "Error Occured"});
    }
}



/* 
* GET /submit-blog
* Submit page
*/
exports.submitBlog = async(req, res) => {
    const infoErrorObj = req.flash('infoError');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-blog', {title: 'Travel Blog - Submit Blog', infoErrorObj, infoSubmitObj});
}


/* 
* Post /submit-blog
* Submit page
*/
exports.submitBlogOnPost = async(req, res) => {

    try {

        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if(!req.files || Object.keys(req.files).length === 0){
            console.log('No files were uploaded.');
        }
        else{
            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;

            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath, function(err){
                if(err) return res.status(500).send(err);
            })
        }

        const newBlog = new Blog({
            name: req.body.name,
            email: req.body.email,
            description: req.body.description,
            category: req.body.category,
            favouritefood: req.body.regionalFoods,
            image: newImageName
        })

        await newBlog.save();

        
        req.flash('infoSubmit', 'Blog has been added');
        res.redirect('/submit-blog');
    } catch (error) {
        req.flash('infoError', error);
        res.redirect('/submit-blog');
    }

    
}



// async function deleteRecipe(){
//     try {
//         await Blog.deleteMany({
//             [

//             ]
//         })
//     } catch (error) {
//         console.log(err);
//     }
// }

// deleteRecipe();





//adding some dummy data to Catagpry collection

// async function insertDummyCategoryData(){

//     try{
//         await Category.insertMany([
//             {
//                 "name": "India",
//                 "image": "india.jpg"
//             },
//             {
//                 "name": "Italy",
//                 "image": "italy1.jpg"
//             },
//             {
//                 "name": "Japan",
//                 "image": "japan1.jpg"
//             },
//             {
//                 "name": "Peru",
//                 "image": "peru.jpg"
//             },
//             {
//                 "name": "Australia",
//                 "image": "australia1.jpg"
//             },
//             {
//                 "name": "Iceland",
//                 "image": "iceland.jpg"
//             },
//             {
//                 "name": "Morocco",
//                 "image": "morocco.jpg"
//             }
//         ]);
//     }
//     catch(error){
//         console.log('err' + error);
//     }
// }

// //calling the above function
// insertDummyCategoryData();



//adding some dummy data to blog collection

// async function insertDummyBlogData(){

//     try{
//         await Blog.insertMany([
//             {
//                 "name": "Varanasi, Uttar Pradesh",
//                 "email": "anubhav@gmail.com",
//                 "description": "Varanasi, also known as Kashi, is a city that encapsulates the essence of spirituality and devotion. As you wander through the ancient streets, you'll witness the interplay of life and death along the ghats, where pilgrims come to cleanse their sins in the sacred waters of the Ganges. The city is dotted with numerous temples, including the revered Kashi Vishwanath Temple, dedicated to Lord Shiva. Varanasi is also famous for its mesmerizing Ganga Aarti ceremony, a captivating ritual of light and prayer performed at the Dashashwamedh Ghat every evening. When it comes to food, the city's cuisine is a reflection of its rich cultural heritage",
//                 "category": "India",
//                 "favouritefood": [
//                     'Banarasi Paan ',
//                     'Malaiyo',
//                     'Baati Chokha'
//                 ],
//                 "image": "varanasi.jpg"
//             },
//             {
//                 "name": "Agra, Uttar Pradesh",
//                 "email": "priya@gmail.com",
//                 "description": "Agra, a city steeped in history, is synonymous with the eternal symbol of love, the Taj Mahal. The awe-inspiring marble mausoleum is a testament to the timeless beauty and architectural brilliance of the Mughal era. Explore the grandeur of Agra Fort, where emperors ruled and palaces flourished. The city also offers a glimpse into the rich heritage of Mughlai cuisine.",
//                 "category": "India",
//                 "favouritefood": [
//                     'Mughlai Biryani',
//                     'Seekh Kebabs',
//                     'Petha'
//                 ] ,
//                 "image": "agra.jpg"
//             },
//             {
//                 "name": "Delhi, National Capital Territory",
//                 "email": "shalini@gmail.com",
//                 "description": "Delhi, a bustling metropolis, is a melting pot of diverse cultures and histories. Immerse yourself in the heritage of the city by visiting the majestic Red Fort, Qutub Minar, and Humayun's Tomb. Discover the vibrant markets of Chandni Chowk, where aromatic spices, colorful textiles, and tempting street food beckon. Delhi's culinary scene is a fusion of flavors, with street food being a highlight. ",
//                 "category": "India",
//                 "favouritefood": [
//                     'Parathas',
//                     'Golgappas',
//                     'Butter Chicken'
//                 ],
//                 "image": "delhi.jpg"
//             },
//             {
//                 "name": "Mathura, Uttar Pradesh",
//                 "email": "shalini@gmail.com",
//                 "description": "Mathura, the birthplace of Lord Krishna, holds a special place in Hindu mythology and draws devotees from far and wide. The city's temples, including the Krishna Janmasthan Temple and Dwarkadhish Temple, exude an air of divinity. Mathura is known for its vibrant festivities during Krishna Janmashtami, when the town comes alive with joyous celebrations.",
//                 "category": "India",
//                 "favouritefood": [
//                     'Mathura Peda',
//                     'Rabdi',
//                     'Kachoris'
//                 ] ,
//                 "image": "mathura.jpg"
//             },
//             {
//                 "name": "Vrindavan, Uttar Pradesh",
//                 "email": "aarti@gmail.com",
//                 "description": "Vrindavan, a town steeped in mythological tales and divine love, resonates with the enchanting childhood memories of Lord Krishna. The town is dotted with ornate temples, each reflecting the rich spiritual heritage. Pay your respects at the Banke Bihari Temple and immerse yourself in the melodious chants and devotional fervor.",
//                 "category": "India",
//                 "favouritefood": [
//                     'Chappan Bhog',
//                     'Aloo Puri',
//                     'Malpua'
//                 ],
//                 "image": "vrindavan.jpg"
//             },
//             {
//                 "name": "Tokyo",
//                 "email": "herohitu@gmail.com",
//                 "description": "Tokyo, the vibrant capital of Japan, is a captivating city that offers an extraordinary blend of ancient traditions and futuristic innovation. As one of the most populous cities in the world, Tokyo buzzes with energy, offering an array of captivating experiences for every traveler. Immerse yourself in the bustling streets of Shibuya, where neon lights, trendy fashion boutiques, and iconic landmarks like the Shibuya Crossing create an electric atmosphere. Explore the historic district of Asakusa, where you can visit the awe-inspiring Senso-ji Temple, Japan's oldest Buddhist temple, and wander through Nakamise Shopping Street, filled with traditional souvenirs and street food.",
//                 "category": "Japan",
//                 "favouritefood": [
//                     'World-class Sushi',
//                     'Sashimi',
//                     'Ramen',
//                     'Crispy Tempura',
//                     'Mochi'
//                 ],
//                 "image": "tokyo.jpg"
//             },
//             {
//                 "name": "Kyoto",
//                 "email": "herohito@gmail.com",
//                 "description": "Kyoto, the cultural and historical gem of Japan, beckons travelers with its timeless beauty and enchanting traditions. With its abundance of well-preserved temples, serene gardens, and traditional wooden machiya houses, Kyoto offers a glimpse into Japan's rich cultural heritage. Begin your exploration at the iconic Kinkaku-ji, the Golden Pavilion, with its shimmering reflection on the tranquil pond. Visit the Fushimi Inari Shrine, famous for its thousands of vermilion torii gates leading up the sacred Mount Inari. Wander through the Arashiyama Bamboo Grove, where towering bamboo stalks create an ethereal atmosphere.",
//                 "category": "Japan",
//                 "favouritefood": [
//                     'Kaiseki',
//                     'Matcha Tea',
//                     'Tofu Dishes'
//                 ],
//                 "image": "kyoto.jpg"
//             },
//             {
//                 "name": "Osaka",
//                 "email": "naruhito@gmail.com",
//                 "description": "Osaka is also home to several historical landmarks that offer glimpses into its storied past. Explore Osaka Castle, an impressive fortress surrounded by expansive moats and beautiful gardens. Step back in time in the nostalgic district of Shinsekai, where the vibrant atmosphere harkens back to the early 20th century. For a panoramic view of the city, head to the Umeda Sky Building and take in the breathtaking vistas from its observatory.",
//                 "category": "Japan",
//                 "favouritefood": [
//                     'Takoyaki (octopus balls)',
//                     'Crispy Kushikatsu',
//                     'Savory Okonomiyaki',
//                     'Kitsune Udon'
//                 ],
//                 "image": "osaka.jpg"
//             },
//             {
//                 "name": "Hiroshima",
//                 "email": "naruhito@gmail.com",
//                 "description": "Hiroshima, a city with a poignant history and a remarkable spirit of resilience, offers a deeply moving experience and a testament to the enduring power of peace. Start your journey at the Hiroshima Peace Memorial Park, a solemn and reflective space dedicated to the victims of the atomic bombing during World War II. Visit the Hiroshima Peace Memorial Museum to gain a deeper understanding of the tragedy and the city's subsequent journey towards peace and reconciliation.",
//                 "category": "Japan",
//                 "favouritefood": [
//                     'Okonomiyaki',
//                     'Oysters',
//                     'Tsukemen'
//                 ],
//                 "image": "hiroshima.jpg"
//             },
//             {
//                 "name": "Nara",
//                 "email": "sakuramachi@gmail.com",
//                 "description": "Nara, a city steeped in ancient history and natural beauty, is a captivating destination that offers a serene and contemplative escape from the bustling cities of Japan. Step into Nara Park, where friendly deer roam freely, creating a magical atmosphere that enchants visitors. Admire the awe-inspiring Todai-ji Temple, home to the Great Buddha statue, one of the largest bronze statues in the world. Explore the tranquil beauty of Kasuga Taisha Shrine, famous for its stone lanterns that lead the way through a lush forest.",
//                 "category": "Japan",
//                 "favouritefood": [
//                     'Mochi',
//                     'Rice Cakes',
//                     'Kakinoha Sushi'
//                 ],
//                 "image": "nara.jpg"
//             },
//             {
//                 "name": "Rome",
//                 "email": "salvador@gmail.com",
//                 "description": "Rome, the eternal city, is a mesmerizing destination that seamlessly blends ancient history with modern allure. As the capital of Italy, Rome boasts iconic landmarks and treasures at every turn. Marvel at the grandeur of the Colosseum, where gladiators once battled, and visit the ancient ruins of the Roman Forum to immerse yourself in the city's rich history. Discover the Vatican City, home to St. Peter's Basilica and the Sistine Chapel, adorned with magnificent frescoes by Michelangelo.",
//                 "category": "Italy",
//                 "favouritefood": [
//                     'Italian pasta',
//                     'Roman thin-crust pizza',
//                     'Delicious Gelato'
//                 ],
//                 "image": "rome.jpg"
//             },
//             {
//                 "name": "Florence",
//                 "email": "salvador@gmail.com",
//                 "description": "Florence, the birthplace of the Renaissance, is a city of artistic splendor and architectural marvels. Wander through the historic center and marvel at the iconic Duomo, with its breathtaking dome designed by Brunelleschi. Admire the magnificent Uffizi Gallery, housing masterpieces by Botticelli, Michelangelo, and da Vinci, among others. Explore the picturesque Ponte Vecchio, a medieval bridge lined with jewelry shops, and take a stroll through the lush Boboli Gardens.",
//                 "category": "Italy",
//                 "favouritefood": [
//                     'Bistecca alla fiorentina',
//                     'Ribollita',
//                     'Gelaterias'
//                 ],
//                 "image": "florence.jpg"
//             },
//             {
//                 "name": "Venice",
//                 "email": "salvador@gmail.com",
//                 "description": "Venice, a city of enchantment built on a network of canals, is a unique and romantic destination. Explore the iconic St. Mark's Square, with its magnificent basilica and soaring bell tower. Take a gondola ride along the narrow canals, gliding under picturesque bridges and past charming Venetian palaces. Discover the art treasures of the Peggy Guggenheim Collection or immerse yourself in Venetian history at the Doge's Palace.",
//                 "category": "Italy",
//                 "favouritefood": [
//                     'Cicchetti',
//                     'Sarde in saor',
//                     'Fritto misto'
//                 ],
//                 "image": "venice.jpg"
//             },
//             {
//                 "name": "Amalfi Coast",
//                 "email": "salvador@gmail.com",
//                 "description": "The Amalfi Coast, a stunning stretch of coastline in southern Italy, is a picturesque paradise of cliffs, azure waters, and charming cliffside towns. Explore the colorful town of Positano, with its pastel-colored houses cascading down the hillsides, or visit the historic town of Amalfi, with its magnificent cathedral and vibrant piazza. Marvel at the breathtaking views from the terraced gardens of Ravello or take a boat ride to the enchanting Isle of Capri.",
//                 "category": "Italy",
//                 "favouritefood": [
//                     'Grilled Octopus',
//                     'Spaghetti alle vongole',
//                     'Limoncello'
//                 ],
//                 "image": "amalfiCoast.jpg"
//             },
//             {
//                 "name": "Tuscany",
//                 "email": "salvador@gmail.com",
//                 "description": "Tuscany, a region synonymous with beauty and charm, is a destination that captivates with its rolling hills, vineyards, and historic towns. Visit the Renaissance city of Siena, known for its stunning cathedral and the famous Palio horse race held in its central square. Explore the medieval hilltop town of San Gimignano, famous for its well-preserved towers and Vernaccia wine. Discover the cultural treasures of Pisa, including the iconic Leaning Tower, and immerse yourself in the art and history of Florence.",
//                 "category": "Italy",
//                 "favouritefood": [
//                     'Bistecca alla fiorentina',
//                     'Pappa al pomodoro',
//                     'Ribollita'
//                 ],
//                 "image": "tuscany.jpg"
//             },
//             {
//                 "name": "Lima",
//                 "email": "lisa@gmail.com",
//                 "description": "Lima, the vibrant capital of Peru, is a city that combines rich history, contemporary culture, and culinary delights. Explore the historic center of Lima, a UNESCO World Heritage site, and marvel at its colonial architecture, including the magnificent Plaza Mayor and the ornate Baroque-style Cathedral. Visit the Larco Museum, home to an extensive collection of pre-Columbian art and artifacts, providing insights into Peru's ancient civilizations.",
//                 "category": "Peru",
//                 "favouritefood": [
//                     'Ceviche',
//                     'Lomo saltado',
//                     'Anticuchos'
//                 ],
//                 "image": "lima.jpg"
//             },
//             {
//                 "name": "Cusco",
//                 "email": "lisa@gmail.com",
//                 "description": "Cusco, the gateway to the ancient Inca civilization, is a captivating city nestled in the Andes Mountains. Explore the historic center, where Inca stone walls blend with colonial architecture. Visit the iconic Qorikancha, the Temple of the Sun, once adorned with gold and considered the most important temple in the Inca Empire. Immerse yourself in the mesmerizing ruins of Sacsayhuaman, an Inca fortress overlooking the city.",
//                 "category": "Peru",
//                 "favouritefood": [
//                     'roasted cuy',
//                     'Pachamanca',
//                     'Mate de coca'
//                 ],
//                 "image": "cusco.jpg"
//             },
//             {
//                 "name": "Reykjavik",
//                 "email": "lisa@gmail.com",
//                 "description": "Reykjavik, the vibrant capital of Iceland, is a city that effortlessly blends modern culture with the country's rugged natural beauty. Explore the colorful buildings and charming streets of the city center, and visit the iconic Hallgrimskirkja, a striking Lutheran church offering panoramic views of the city. Discover the lively atmosphere of the Reykjavik Harbor, where you can indulge in fresh seafood, explore local boutiques, or embark on a whale-watching tour.",
//                 "category": "Iceland",
//                 "favouritefood": [
//                     'Icelandic lamb',
//                     'Icelandic hot dogs',
//                     'Icelandic seafood'
//                 ],
//                 "image": "Reykjavik.jpg"
//             },
//             {
//                 "name": "The Golden Circle",
//                 "email": "lisa@gmail.com",
//                 "description": "he Golden Circle is a popular tourist route that showcases some of Iceland's most spectacular natural wonders. Start your journey at Thingvellir National Park, a UNESCO World Heritage site known for its stunning landscapes and historical significance as the site of the world's oldest parliament. Witness the powerful beauty of Gullfoss, a majestic waterfall cascading into a dramatic canyon. Explore the geothermal area of Geysir, where you can witness the erupting Strokkur geyser shooting boiling water into the sky.",
//                 "category": "Iceland",
//                 "favouritefood": [
//                     'Skyr',
//                     'Rúgbrauð',
//                     'Hákarl'
//                 ],
//                 "image": "goldencircle.jpg"
//             },
//             {
//                 "name": "Sydney",
//                 "email": "lisa@gmail.com",
//                 "description": "Sydney, the bustling metropolis and capital of New South Wales, is a vibrant city with iconic landmarks and a lively cultural scene. Marvel at the architectural masterpiece of the Sydney Opera House, set against the backdrop of Sydney Harbour. Take a stroll along the world-famous Bondi Beach, known for its golden sand and vibrant surf culture. Explore The Rocks, a historic neighborhood with cobblestone streets, quaint shops, and charming pubs.",
//                 "category": "Australia",
//                 "favouritefood": [
//                     'Meat pies',
//                     'Fish',
//                     'Chips',
//                     'Laminron'
//                 ],
//                 "image": "sydney.jpg"
//             },
//             {
//                 "name": "Melbourne",
//                 "email": "lisa@gmail.com",
//                 "description": "Melbourne, the cultural capital of Australia, is known for its thriving arts scene, diverse cuisine, and Victorian-era architecture. Discover the vibrant street art in the laneways of the city center, explore the trendy boutiques and cafes of Fitzroy, and visit the iconic Queen Victoria Market for a true sensory experience. Immerse yourself in Melbourne's coffee culture and indulge in the city's renowned food scene, offering a mix of international cuisines and fusion dishes.",
//                 "category": "Australia",
//                 "favouritefood": [
//                     'Lamb Roast',
//                     'Gozleme',
//                     'Capricciosa pizza'
//                 ],
//                 "image": "melbourne.jpg"
//             },
//             {
//                 "name": "Marrakech",
//                 "email": "lisa@gmail.com",
//                 "description": "Marrakech, the vibrant city in Morocco's interior, is a feast for the senses. Explore the bustling souks of the medina, where you can immerse yourself in a maze of narrow alleys filled with vibrant colors, exotic scents, and a variety of crafts. Visit the iconic Djemaa el-Fna square, a UNESCO World Heritage site, which comes alive with snake charmers, musicians, storytellers, and food stalls as the sun sets. Discover architectural wonders like the Bahia Palace and the Koutoubia Mosque.",
//                 "category": "Morocco",
//                 "favouritefood": [
//                     'Pastilla',
//                     'Mint tea',
//                     'Tagine'
//                 ],
//                 "image": "marrakech.jpg"
//             },
//             {
//                 "name": "Fes",
//                 "email": "lisa@gmail.com",
//                 "description": "Fes, the medieval city that showcases Morocco's rich history and cultural heritage, is a UNESCO World Heritage site. Explore the winding streets of the Fes el-Bali (Old Medina) and discover the world's oldest university, the University of Al Quaraouiyine. Visit the tanneries, where leather is still produced using traditional methods. Marvel at the intricate architecture of the Bou Inania Madrasa and the grandeur of the Karaouine Mosque.",
//                 "category": "Morocco",
//                 "favouritefood": [
//                     'Chicken Pastilla',
//                     'Tagines',
//                     'Robust Harira Soup'
//                 ],
//                 "image": "fes.jpg"
//             }
//         ]);
//     }
//     catch(error){
//         console.log('err' + error);
//     }
// }

// //calling the above function
// insertDummyBlogData();