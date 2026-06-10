CREATE DATABASE pakistan_travel_guide;
USE pakistan_travel_guide;
CREATE TABLE users (
  user_id       INT AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  role          ENUM('user', 'admin') DEFAULT 'user'
);
CREATE TABLE destination (
  destination_id INT AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,
  slug           VARCHAR(100) NOT NULL UNIQUE,
  province       VARCHAR(80),
  description    TEXT,
  tagline        VARCHAR(255),
  hero_image     VARCHAR(255),
  population     VARCHAR(50),
  language       VARCHAR(100),
  best_season    VARCHAR(100)
);
INSERT INTO destination (name, slug, province, description, tagline, hero_image, population, language, best_season) VALUES
('Lahore',               'lahore',               'Punjab',                      'A city rich in Mughal history, vibrant food culture, and colorful traditions.',       'The Cultural Heart of Pakistan',         'assets/images/destinationImages/0lahore.jpg',          '14 Million',  'Punjabi, Urdu',          'October – February'),
('Islamabad',            'islamabad',            'Islamabad Capital Territory', 'A planned modern city surrounded by lush Margalla Hills.',                           'Pakistan\'s Modern Capital',             'assets/images/destinationImages/0islamabad.jpg',        '2.3 Million', 'Urdu, English',          'September – April'),
('Karachi',              'karachi',              'Sindh',                       'Pakistan\'s largest city and economic hub with vibrant coastal energy.',              'The City of Lights',                     'assets/images/destinationImages/0karachi.jpg',          '20 Million',  'Urdu, Sindhi',           'November – February'),
('Murree',               'murree',               'Punjab',                      'A beloved hill station famous for pine forests and cool mountain air.',               'Pakistan\'s Most Famous Hill Station',   'assets/images/destinationImages/0murree.jpg',           '230,000',     'Urdu, Punjabi',          'April – September'),
('Hunza',                'hunza',                'Gilgit-Baltistan',            'A breathtaking valley surrounded by towering peaks and ancient forts.',              'Heaven on Earth',                        'assets/images/destinationImages/0hunza.jpg',            '50,000',      'Burushaski',             'April – October'),
('Skardu',               'skardu',               'Gilgit-Baltistan',            'Gateway to some of the world\'s highest peaks and most stunning lakes.',             'Gateway to the World\'s Highest Peaks',  'assets/images/destinationImages/0skardu.jpg',           '65,000',      'Balti',                  'May – September'),
('Khewra Salt Mine',     'khewra-salt-mine',     'Punjab',                      'The world\'s second largest salt mine with illuminated salt chambers.',              'World\'s Second Largest Salt Mine',      'assets/images/destinationImages/0khewraSaltMine.jpg', 'N/A',         'Punjabi, Urdu',          'October – March'),
('Hingol National Park', 'hingol-national-park', 'Balochistan',                 'Pakistan\'s largest national park with dramatic coastal and geological landscapes.', 'Pakistan\'s Largest National Park',      'assets/images/destinationImages/0hingolNationalPark.jpg',           'N/A',         'Balochi, Urdu',          'October – March'),
('Swat',                 'swat',                 'Khyber Pakhtunkhwa',          'A lush mountain valley known as the Switzerland of Pakistan.',                       'The Switzerland of Pakistan',            'assets/images/destinationImages/0swat.jpg',             '2.3 Million', 'Pashto, Urdu',           'March – October'),
('Peshawar',             'peshawar',             'Khyber Pakhtunkhwa',          'One of South Asia\'s oldest cities with rich Pashtun culture and bazaars.',          'The City of Flowers',                    'assets/images/destinationImages/0pehsawar.jpg',         '2.4 Million', 'Pashto, Urdu',           'October – April'),
('Quetta',               'quetta',               'Balochistan',                 'A high-altitude city known for fresh fruits and Balochi culture.',                   'Fruit Garden of Pakistan',               'assets/images/destinationImages/0quetta.jpg',           '1.1 Million', 'Balochi, Pashto, Urdu',  'April – October'),
('Multan',               'multan',               'Punjab',                      'Ancient city of shrines, Sufi heritage, and vibrant handicrafts.',                   'City of Saints',                         'assets/images/destinationImages/0multan.jpg',           '2.0 Million', 'Punjabi, Urdu, Saraiki', 'October – March'),
('Gwadar',               'gwadar',               'Balochistan',                 'A rising port city on the Arabian Sea with stunning sunsets and seafood.',           'Gateway to the Arabian Sea',             'assets/images/destinationImages/0gawadar.jpg',           '140,000',     'Balochi, Urdu',          'October – March'),
('Fairy Meadows',        'fairy-meadows',        'Gilgit-Baltistan',            'A magical alpine meadow at the foot of Nanga Parbat.',                              'The Front Yard of Nanga Parbat',         'assets/images/destinationImages/0fairyMeadows.jpg',    'N/A',         'Shina, Urdu',            'May – September'),
('Bahawalpur',           'bahawalpur',           'Punjab',                      'A royal city with grand palaces, desert landscapes, and rich heritage.',             'Land of Palaces and Desert Beauty',      'assets/images/destinationImages/0bahawalpur.jpg',       '900,000',     'Saraiki, Urdu',          'October – March'),
('Malam Jabba',          'malam-jabba',          'Khyber Pakhtunkhwa',          'Pakistan\'s premier ski resort nestled in the Swat mountains.',                     'Pakistan\'s Premier Ski Resort',         'assets/images/destinationImages/0malamJabba.jpg',      'N/A',         'Pashto, Urdu',           'December – February'),
('Chitral',              'chitral',              'Khyber Pakhtunkhwa',          'A remote mountain district famous for the unique Kalash culture.',                  'Gateway to Kalash Valleys',              'assets/images/destinationImages/0chitral.jpg',          '320,000',     'Khowar, Urdu',           'April – October'),
('Kashmir',              'kashmir',              'Azad Jammu & Kashmir',        'Scenic valleys, sparkling lakes, and snow-capped peaks of Azad Kashmir.',           'Paradise on Earth',                      'assets/images/destinationImages/0kashmir.jpg',          '5.0 Million', 'Urdu, Pahari',           'March – October'),
('Neelum Valley',        'neelum-valley',        'Azad Jammu & Kashmir',        'A pristine river valley with waterfalls, meadows, and untouched beauty.',           'Jewel of Azad Kashmir',                  'assets/images/destinationImages/0neelum valley.jpg',    '180,000',     'Pahari, Urdu',           'April – October'),
('Deosai National Park', 'deosai-national-park', 'Gilgit-Baltistan',            'One of the world\'s highest plateaus, home to the Himalayan brown bear.',           'Land of Giants',                         'assets/images/destinationImages/0desoaiNationalPark.jpg',           'N/A',         'Balti, Urdu',            'June – September'),
('Kallar Kahar',         'kallar-kahar',         'Punjab',                      'A scenic lake resort town in the Salt Range, popular for road trips.',              'Scenic Lake Resort Town',                'assets/images/destinationImages/0kalarKahar.jpg',     '75,000',      'Punjabi, Urdu',          'October – March'),
('Mohenjo-daro',         'mohenjo-daro',         'Sindh',                       'The ruins of one of the world\'s earliest urban civilisations.',                    'The Ancient City of the Indus Valley',   'assets/images/destinationImages/0mohenjoDaro.jpg',     'N/A',         'Sindhi, Urdu',           'November – February'),
('Rohtas Fort',          'rohtas-fort',          'Punjab',                      'A UNESCO World Heritage 16th-century Mughal fortress in excellent condition.',       'UNESCO World Heritage Fortress',         'assets/images/destinationImages/0quetta.jpg',      'N/A',         'Punjabi, Urdu',          'October – March'),
('Kaghan Valley',  'kaghan-valley',  'Khyber Pakhtunkhwa',    'A stunning alpine valley dotted with glacial lakes, waterfalls, and high mountain passes.',  'Valley of Lakes and Mountains',           'assets/images/destinationImages/0kaghan.jpg',   'N/A',      'Hindko, Urdu',  'May – October'),
('Toli Pir',       'toli-pir',       'Azad Jammu & Kashmir',  'A scenic hilltop above Rawalakot offering panoramic views of lush valleys and meadows.',      'Scenic Hilltop of Rawalakot',             'assets/images/destinationImages/0toliPir.jpg',        'N/A',      'Pahari, Urdu',  'April – October'),
('Sheikhupura',    'sheikhupura',    'Punjab',                 'A historic Mughal-era city famous for Hiran Minar, ancient forts, and rich Punjab culture.',   'City of Historic Forts and Wildlife',     'assets/images/destinationImages/0sheikhupura.jpg',     '500,000+', 'Punjabi, Urdu', 'October – March'),
('Kumrat Valley',  'kumrat-valley',  'Khyber Pakhtunkhwa',    'A pristine valley of dense pine forests, rushing rivers, and untouched natural beauty.',      'Land of Forests and Rivers',             'assets/images/destinationImages/0kumrat.jpg',   'N/A',      'Pashto, Urdu',  'May – September');
CREATE TABLE mood (
  mood_id   INT AUTO_INCREMENT PRIMARY KEY,
  mood_name VARCHAR(100) NOT NULL
);
INSERT INTO mood (mood_name) VALUES
('Historical'),
('Cultural'),
('Foodie'),
('Family-Friendly'),
('Nature & Peace'),
('Adventurous'),
('Romantic');
CREATE TABLE food_categories (
  food_cat_id INT AUTO_INCREMENT PRIMARY KEY,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  label       VARCHAR(100) NOT NULL
);
INSERT INTO food_categories (slug, label) VALUES
('vegetarian', 'Vegetarian'),
('meat',       'Meat'),
('rice',       'Rice'),
('street-food','Street Food'),
('drinks',     'Drinks'),
('sweets',     'Sweets'),
('breakfast',  'Breakfast');
CREATE TABLE city_badges (
  badge_id       INT AUTO_INCREMENT PRIMARY KEY,
  destination_id INT NOT NULL,
  label          VARCHAR(100) NOT NULL,
  FOREIGN KEY (destination_id) REFERENCES destination(destination_id)
);
INSERT INTO city_badges (destination_id, label) VALUES 
(1,'Food Capital'),(1,'Mughal Heritage'),(1,'Cultural Hub'),(1,'Punjab'),
(2,'Capital City'),(2,'Modern Architecture'),(2,'Green City'),(2,'Scenic Views'),
(3,'Coastal City'),(3,'Economic Hub'),(3,'Food Paradise'),(3,'Nightlife'),
(4,'Hill Station'),(4,'Family Destination'),(4,'Snowfall'),(4,'Pine Forests'),
(5,'Mountain Paradise'),(5,'Adventure Destination'),(5,'Cherry Blossoms'),(5,'Karakoram Highway'),
(6,'Mountain Gateway'),(6,'Adventure Hub'),(6,'High Peaks'),(6,'Lakes & Valleys'),
(7,'Salt Wonder'),(7,'Historic Mine'),(7,'Family Attraction'),(7,'Geological Marvel'),
(8,'Largest National Park'),(8,'Coastal Wilderness'),(8,'Geological Wonders'),(8,'Adventure Destination'),
(9,'Mountain Valley'),(9,'Adventure Tourism'),(9,'Ski Destination'),(9,'Natural Beauty'),
(10,'Historic City'),(10,'Cultural Heritage'),(10,'Pashtun Culture'),(10,'Traditional Bazaars'),
(11,'Mountain City'),(11,'Fruit Capital'),(11,'Cultural Heritage'),(11,'Gateway to Balochistan'),
(12,'City of Saints'),(12,'Sufi Heritage'),(12,'Historic Landmarks'),(12,'Cultural Hub'),
(13,'Coastal Paradise'),(13,'Deep Sea Port'),(13,'Sunset Views'),(13,'Marine Tourism'),
(14,'Nanga Parbat Views'),(14,'Camping Destination'),(14,'Trekking Paradise'),(14,'Alpine Meadows'),
(15,'Royal Heritage'),(15,'Desert Tourism'),(15,'Historic Palaces'),(15,'Cultural Destination'),
(16,'Ski Resort'),(16,'Snow Adventure'),(16,'Mountain Tourism'),(16,'Family Destination'),
(17,'Cultural Diversity'),(17,'Kalash Valleys'),(17,'Mountain Region'),(17,'Heritage Tourism'),
(18,'Scenic Valleys'),(18,'Lakes & Rivers'),(18,'Mountain Beauty'),(18,'Romantic Destination'),
(19,'River Valley'),(19,'Waterfalls'),(19,'Green Landscapes'),(19,'Tourist Paradise'),
(20,'High Altitude Plateau'),(20,'Wildlife Sanctuary'),(20,'Snow Plains'),(20,'Adventure Destination'),
(21,'Lake Resort'),(21,'Road Trip Stop'),(21,'Bird Watching'),(21,'Scenic Views'),
(22,'UNESCO World Heritage'),(22,'Ancient Civilization'),(22,'Archaeological Site'),(22,'Historical Wonder'),
(23,'UNESCO World Heritage'),(23,'Mughal Military Architecture'),(23,'Historic Fortress'),(23,'Cultural Heritage Site'),
(24,'Alpine Valley'),(24,'Mountain Tourism'),(24,'Lakes & Waterfalls'),(24,'Family Destination'),
(25,'Hilltop Destination'),(25,'Panoramic Views'),(25,'Picnic Spot'),(25,'Nature Tourism'),
(26,'Historic City'),(26,'Mughal Heritage'),(26,'Punjab Culture'),
(27,'Pine Forests'),(27,'River Valley'),(27,'Camping Destination'),(27,'Adventure Tourism');
CREATE TABLE places (
  place_id       INT AUTO_INCREMENT PRIMARY KEY,
  destination_id INT NOT NULL,
  name           VARCHAR(150) NOT NULL,
  type           VARCHAR(100),
  image          VARCHAR(255),
  FOREIGN KEY (destination_id) REFERENCES destination(destination_id)
);
INSERT INTO places (destination_id, name, type,image) VALUES
(1,'Badshahi Mosque','Historic','assets/images/places/0badshahiMosque.jpg'),(1,'Lahore Fort','Heritage','assets/images/places/0lahoreFort.jpg'),(1,'Shalimar Gardens','Garden','assets/images/places/0shalimar.jpg'),(1,'Minar-e-Pakistan','Monument','assets/images/places/0minarePakistan.jpg'),(1,'Lahore Museum','Museum','assets/images/places/0lahoreMusuem.jpg'),(1,'Walled City','Cultural','assets/images/places/0walledCity.jpg'),
(2,'Faisal Mosque','Religious','assets/images/places/0faisalmosque.jpg'),(2,'Pakistan Monument','Monument','assets/images/places/0paksitanMonument.jpg'),(2,'Daman-e-Koh','Viewpoint','assets/images/places/0damanekoh.jpg'),(2,'Lok Virsa Museum','Museum','assets/images/places/0lokVirsa.jpg'),(2,'Saidpur Village','Cultural','assets/images/places/0saidpurVillage.jpg'),(2,'Margalla Hills','Nature','assets/images/places/0margalaHills.jpg'),
(3,'Clifton Beach','Beach','assets/images/places/0cliftonBeach.jpg'),(3,'Mohatta Palace','Museum','assets/images/places/0mohattaPalace.jpg'),(3,'Quaid-e-Azam Mausoleum','Monument',assets/images/places/0quaideazamMausoleum.jpg''),(3,'Frere Hall','Heritage','assets/images/places/0frereHall.jpg'),(3,'Pakistan Maritime Museum','Museum','assets/images/places/0PakistanMaritimeMuseum.jpg'),(3,'Burns Road Food Street','Food Street','assets/images/places/0burnsRoadFoodStreet.jpg'),
(4,'Mall Road','Shopping Street','assets/images/places/0mallRoad.jpg'),(4,'Kashmir Point','Viewpoint','assets/images/places/0kashmirPOint.jpg'),(4,'Pindi Point','Viewpoint','assets/images/places/0pindiPOint.jpg'),(4,'Patriata Chairlift','Adventure','assets/images/places/0patriataChairlift.jpg'),(4,'Murree Hills','Nature','assets/images/places/0murreHills.jpg'),(4,'Ayubia National Park','National Park','assets/images/places/0aybiaNationalPark.jpg'),
(5,'Baltit Fort','Heritage','assets/images/places/0baltitFort.jpg'),(5,'Altit Fort','Heritage','assets/images/places/0altitFort.jpg'),(5,'Attabad Lake','Lake','assets/images/places/0attabadLake.jpg'),(5,'Eagle\'s Nest','Viewpoint','assets/images/places/0eaglesNest.jpg'),(5,'Passu Cones','Mountain Landmark','assets/images/places/0passuCones.jpg'),(5,'Hussaini Suspension Bridge','Adventure','assets/images/places/0hussainiSuspensonBridge.jpg'),
(6,'Shangrila Resort','Resort','assets/images/places/0shangrilaResort.jpg'),(6,'Upper Kachura Lake','Lake','assets/images/places/0upperKachuraLAke.jpg'),(6,'Lower Kachura Lake','Lake','assets/images/places/0lowerKachuraLake.jpg'),(6,'Shigar Fort','Heritage','assets/images/places/0shigarFort.jpg'),(6,'Satpara Lake','Lake','assets/images/places/0satparaLake.jpg'),(6,'Deosai Access Point','Adventure','assets/images/places/0deosaiAccessPoint.jpg'),
(8,'Princess of Hope','Rock Formation','assets/images/places/0princessOfHope.jpg'),(8,'Hingol River','River','assets/images/places/0hingolRiver.jpg'),(8,'Buzzi Pass','Mountain Pass','assets/images/places/0buziPass.jpg'),(8,'Kund Malir Beach','Beach','assets/images/places/0kundMalirBeach.jpg'),(8,'Sphinx Formation','Rock Formation','assets/images/places/0SphinxFormation.jpg'),(8,'Hinglaj Mata Temple','Religious Site','assets/images/places/0hinglajMataTemple.jpg'),
(9,'Mingora','City','assets/images/places/0mingora.jpg'),(9,'Fizagat Park','Park','assets/images/places/0FizagatPark.jpg'),(9,'White Palace','Heritage','assets/images/places/0WhitePalace.jpg'),(9,'Malam Jabba','Ski Resort','assets/images/places/0MalamJabba.jpg'),(9,'Mahodand Lake','Lake','assets/images/places/0MahodandLake.jpg'),(9,'Bahrain','Tourist Town','assets/images/places/0Bahrain.jpg'),
(10,'Bala Hisar Fort','Fort','assets/images/places/0BalaHisarFort.jpg'),(10,'Qissa Khwani Bazaar','Market','assets/images/places/0QissaKhwaniBazaar.jpg'),(10,'Peshawar Museum','Museum','assets/images/places/0PeshawarMuseum.jpg'),(10,'Mahabat Khan Mosque','Religious','assets/images/places/0MahabatKhanMosque.jpg'),(10,'Sethi House','Heritage','assets/images/places/0SethiHouse.jpg'),(10,'Chowk Yadgar','Monument','assets/images/places/0ChowkYadgar.jpg'),
(11,'Hanna Lake','Lake'),(11,'Quetta Geological Museum','Museum'),(11,'Hazarganji National Park','National Park'),(11,'Askari Park','Park'),(11,'Ziarat Residency','Heritage'),(11,'Chiltan National Park','National Park'),
(12,'Shah Rukn-e-Alam Shrine','Religious'),(12,'Multan Fort','Fort'),(12,'Ghanta Ghar','Monument'),(12,'Hussain Agahi Bazaar','Market'),(12,'Bahauddin Zakariya Shrine','Religious'),(12,'Multan Museum','Museum'),
(13,'Hammerhead','Viewpoint'),(13,'Gwadar Beach','Beach'),(13,'Gwadar Port Viewpoint','Viewpoint'),(13,'Marine Drive','Coastal Road'),(13,'Sunset Park','Park'),(13,'Padi Zar Beach','Beach'),
(14,'Nanga Parbat Viewpoint','Viewpoint'),(14,'Reflection Lake','Lake'),(14,'Beyal Camp','Camping Site'),(14,'Raikot Glacier Trail','Hiking Trail'),(14,'Fairy Meadows Campsite','Campsite'),
(15,'Noor Mahal','Palace'),(15,'Darbar Mahal','Palace'),(15,'Lal Suhanra National Park','National Park'),(15,'Gulzar Mahal','Palace'),(15,'Bahawalpur Museum','Museum'),(15,'Cholistan Desert','Desert'),
(16,'Ski Resort','Adventure'),(16,'Chairlift','Attraction'),(16,'Zipline','Adventure'),(16,'Snow Point','Viewpoint'),(16,'Mountain View Deck','Viewpoint'),
(17,'Kalash Valley','Cultural'),(17,'Chitral Fort','Fort'),(17,'Shahi Mosque','Religious'),(17,'Tirich Mir Viewpoint','Mountain View'),(17,'Bumburet Valley','Valley'),(17,'Ayun Valley','Valley'),
(18,'Pir Chinasi','Viewpoint'),(18,'Red Fort Muzaffarabad','Fort'),(18,'Leepa Valley','Valley'),(18,'Rawalakot','City'),(18,'Banjosa Lake','Lake'),(18,'Jhelum Valley','Valley'),
(19,'Keran','Village'),(19,'Sharda','Historical Site'),(19,'Kel','Village'),(19,'Arang Kel','Meadow'),(19,'Ratti Gali Lake','Lake'),(19,'Kutton Waterfall','Waterfall'),
(20,'Sheosar Lake','Lake'),(20,'Bara Pani','River Crossing'),(20,'Kala Pani','River Crossing'),(20,'Wildlife Viewpoint','Viewpoint'),(20,'Deosai Plains','National Park'),
(21,'Kallar Kahar Lake','Lake'),(21,'Takht-e-Babri','Historic Monument'),(21,'Peacock Valley','Nature'),(21,'Katas Raj Temples','Religious Site'),(21,'View Point','Viewpoint'),
(22,'Great Bath','Archaeological Structure'),(22,'Granary','Archaeological Structure'),(22,'Assembly Hall','Archaeological Structure'),(22,'DK Area','Excavation Site'),(22,'Archaeological Museum','Museum'),
(23,'Sohail Gate','Fort Gate'),(23,'Shahi Mosque','Religious Structure'),(23,'Talaqi Gate','Fort Gate'),(23,'Haveli Man Singh','Historic Building'),(23,'Fort Walls','Fortification'),(23,'Main Courtyard','Open Courtyard'),
(24,'Lake Saif-ul-Malook','Lake'),(24,'Lulusar Lake','Lake'),(24,'Babusar Pass','Mountain Pass'),(24,'Kaghan Town','Tourist Town'),(24,'Noori Waterfall','Waterfall'),
(25,'Toli Pir Top','Viewpoint'),(25,'Rawalakot City View','Viewpoint'),(25,'Banjosa Lake','Lake'),(25,'Poonch Valley','Valley'),(25,'Khai Gala','Tourist Spot'),(25,'Toli Pir Meadows','Meadow'),
(26,'Hiran Minar','Historic Monument'),(26,'Sheikhupura Fort','Fort'),(26,'Khanpur Canal Area','Nature Spot'),(26,'Waris Shah Tomb (Jandiala Sher Khan)','Heritage Site'),
(27,'Panjkora River','River'),(27,'Kumrat Waterfall','Waterfall'),(27,'Jahaz Banda','Meadow'),(27,'Katora Lake','Alpine Lake'),(27,'Do Kala Chasma','Natural Spring'),(27,'Thall Village','Tourist Gateway'); 
CREATE TABLE restaurants (
  restaurant_id  INT AUTO_INCREMENT PRIMARY KEY,
  destination_id INT NOT NULL,
  name           VARCHAR(150) NOT NULL,
  cuisine        VARCHAR(100),
  price_range    VARCHAR(50),
  rating         DECIMAL(2,1),
  FOREIGN KEY (destination_id) REFERENCES destination(destination_id)
);
INSERT INTO restaurants (destination_id, name, cuisine, price_range, rating) VALUES
(1,'Monal','Pakistani, Continental, Chinese, Thai','PKR 3,000–7,000',4.3),(1,'Haveli Restaurant','Traditional','PKR 3,000–7,000',4.2),(1,'Spice Bazar','Pakistani','PKR 1,500–3,500',4.0),(1,'Cooco\'s Den','Pakistani','PKR 1,000–6,000',3.8),
(2,'The Carnivore','Steakhouse','PKR 3,000–8,000',4.4),(2,'Tuscany Courtyard','Italian','PKR 2,500–7,000',4.3),(2,'Des Pardes','Pakistani','PKR 1,500–4,500',4.2),(2,'Street 1 Cafe','Continental','PKR 1,500–4,000',4.2),
(3,'Kolachi','Pakistani, Seafood','PKR 2,000–6,000',4.4),(3,'BBQ Tonight','BBQ, Pakistani','PKR 1,500–4,500',4.3),(3,'Cafe Flo','French, Continental','PKR 3,000–8,000',4.2),(3,'Xander\'s','Continental, Cafe','PKR 1,500–4,500',4.3),
(4,'The Table','Continental','PKR 1,500–4,000',4.3),(4,'Asian Wok Murree','Chinese, Thai','PKR 1,200–3,500',4.2),(4,'Terrace Grill','BBQ, Pakistani','PKR 1,500–4,000',4.1),(4,'Thalli','Pakistani','PKR 1,000–3,000',4.2),(4,'Monal Murree','Pakistani, Continental','PKR 2,000–6,000',4.4),(4,'Fri Chicks','Fast Food','PKR 500–1,500',4.0),
(5,'Cafe De Hunza','Hunzai, Cafe','PKR 800–2,500',4.5),(5,'Rainbow Restaurant','Pakistani, Hunzai','PKR 800–2,000',4.3),(5,'Glacier Breeze Restaurant','Pakistani, Continental','PKR 1,200–3,500',4.2),(5,'Hidden Paradise Restaurant','Pakistani','PKR 800–2,500',4.1),
(6,'Dewanekhas Restaurant','Pakistani','PKR 1,000–3,000',4.3),(6,'Shahi Deewan','Pakistani, Balti','PKR 1,200–3,500',4.2),(6,'Khan Shinwari','BBQ, Pakistani','PKR 1,000–3,000',4.1),(6,'Indus Lodges Restaurant','Pakistani, Continental','PKR 1,500–4,000',4.2),
(7,'Salt Mine Restaurant','Pakistani','PKR 500–1,500',4.0),(7,'Khewra Family Restaurant','Pakistani','PKR 500–1,500',3.9),(7,'Salt View Restaurant','Pakistani, BBQ','PKR 800–2,000',4.1),(7,'Punjab Foods Khewra','Pakistani, Fast Food','PKR 400–1,200',3.8),
(8,'Kund Malir Restaurant','Pakistani, Seafood','PKR 800–2,500',4.1),(8,'Hingol Tourist Cafe','Pakistani','PKR 500–1,500',3.9),(8,'Coastal Breeze Restaurant','Seafood, Pakistani','PKR 1,000–3,000',4.0),(8,'Makran View Restaurant','Pakistani, BBQ','PKR 800–2,500',4.0),
(9,'Swat Serena Restaurant','Pakistani, Continental','PKR 2,000–5,000',4.5),(9,'Shinwari Tikka House','BBQ, Pakistani','PKR 1,000–3,000',4.3),(9,'White Palace Restaurant','Pakistani','PKR 1,500–4,000',4.2),(9,'Mingora Food Street','Pakistani, Fast Food','PKR 500–2,000',4.1),
(10,'Namak Mandi Restaurant','BBQ, Pakistani','PKR 1,000–3,500',4.5),(10,'Chief Burger Peshawar','Fast Food','PKR 500–1,500',4.2),(10,'Jalil Kabab House','BBQ, Pakistani','PKR 800–2,500',4.4),(10,'Shiraz Ronaq','Pakistani, Continental','PKR 1,500–4,000',4.2),
(11,'Usmania Restaurant','Pakistani','PKR 800–2,500',4.3),(11,'Lehri Sajji House','Balochi, Pakistani','PKR 1,000–3,000',4.5),(11,'Cafe China Quetta','Chinese','PKR 1,200–3,500',4.1),(11,'Al-Naz Biryani House','Pakistani','PKR 500–2,000',4.2),
(12,'London Courtyard','Continental, Pakistani','PKR 1,500–4,500',4.4),(12,'Shangrila Cuisine','Chinese, Pakistani','PKR 1,200–3,500',4.2),(12,'Chaaye Khana Multan','Cafe, Continental','PKR 800–2,500',4.3),(12,'Bundu Khan Multan','BBQ, Pakistani','PKR 1,000–3,500',4.2),
(13,'Sangar Restaurant','Seafood, Pakistani','PKR 1,000–3,500',4.3),(13,'Koh-e-Batil Restaurant','Pakistani, Seafood','PKR 1,000–3,000',4.2),(13,'Gwadar Marine Restaurant','Seafood','PKR 1,200–4,000',4.1),(13,'Al-Habib Restaurant','Pakistani','PKR 800–2,500',4.0),
(14,'Fairy Meadows Cafe','Pakistani','PKR 500–1,500',4.2),(14,'Beyal Camp Kitchen','Local, Pakistani','PKR 500–1,500',4.1),(14,'Nanga Parbat View Restaurant','Pakistani','PKR 800–2,000',4.3),(14,'Mountain Hut Cafe','Cafe, Pakistani','PKR 500–1,500',4.0),
(15,'The Grand Regency Restaurant','Pakistani, Continental','PKR 1,500–4,500',4.3),(15,'Salt\'n Pepper Bahawalpur','Pakistani','PKR 1,000–3,500',4.2),(15,'Lal Qila Restaurant','Pakistani, BBQ','PKR 1,200–4,000',4.1),(15,'Al-Madina Restaurant','Pakistani','PKR 800–2,500',4.0),
(16,'Malam Jabba Resort Restaurant','Continental, Pakistani','PKR 2,000–5,000',4.4),(16,'Alpine Restaurant','Pakistani','PKR 1,500–4,000',4.2),(16,'Snow View Cafe','Cafe, Snacks','PKR 1,000–3,000',4.1),(16,'Hilltop Diner','Pakistani','PKR 1,200–3,500',4.0),
(17,'Chitral Fort Restaurant','Pakistani','PKR 1,000–3,000',4.2),(17,'Kalash Valley Cafe','Local, Pakistani','PKR 800–2,500',4.3),(17,'Shahi Qila Restaurant','Pakistani','PKR 1,200–3,500',4.1),(17,'River View Restaurant','Pakistani','PKR 1,000–3,000',4.0),
(18,'Banjosa Lake Restaurant','Pakistani','PKR 1,000–3,000',4.2),(18,'Pearl Continental Muzaffarabad Restaurant','Continental, Pakistani','PKR 2,000–5,000',4.4),(18,'Neelum View Restaurant','Pakistani','PKR 1,200–3,500',4.3),(18,'Valley Taste Cafe','Cafe, Pakistani','PKR 800–2,500',4.1),
(19,'Neelum River Restaurant','Pakistani','PKR 1,000–3,000',4.3),(19,'Keran View Restaurant','Pakistani','PKR 800–2,500',4.2),(19,'Sharda Resort Restaurant','Pakistani','PKR 1,200–3,500',4.1),(19,'Kutton Falls Cafe','Cafe, Pakistani','PKR 800–2,000',4.0),
(20,'Deosai Camp Restaurant','Pakistani','PKR 1,000–2,500',4.2),(20,'Sheosar Lake Cafe','Snacks, Pakistani','PKR 800–2,000',4.1),(20,'Bara Pani Rest Stop','Pakistani','PKR 500–1,500',4.0),(20,'Deosai Viewpoint Cafe','Cafe','PKR 800–2,000',4.1),
(21,'Kallar Kahar Lake View Restaurant','Pakistani','PKR 1,000–3,000',4.2),(21,'Salt Range Diner','Pakistani','PKR 800–2,500',4.1),(21,'Peacock Valley Restaurant','Pakistani','PKR 800–2,000',4.0),(21,'Highway Rest Stop Cafe','Fast Food','PKR 500–1,500',3.9),
(22,'Mohenjo Daro Cafe','Pakistani','PKR 800–2,000',4.0),(22,'Indus Heritage Restaurant','Pakistani','PKR 1,000–2,500',4.1),(22,'Larkana Food Point','Pakistani','PKR 500–1,500',3.9),(22,'Sindh Highway Diner','Pakistani','PKR 800–2,000',4.0),
(23,'Rohtas Fort Cafe','Pakistani','PKR 800–2,000',4.1),(23,'Jhelum Highway Restaurant','Pakistani','PKR 800–2,500',4.0),(23,'Dina Food Point','Pakistani','PKR 500–1,500',3.9),(23,'Fort View Diner','Pakistani','PKR 800–2,000',4.0),
(24,'PTDC Motel Restaurant Naran','Pakistani','PKR 1,000–3,000',4.2),(24,'Punjab Tikka House Naran','BBQ, Pakistani','PKR 800–2,500',4.1),(24,'Moon Restaurant Naran','Pakistani, Continental','PKR 1,000–3,000',4.0),(24,'Hotel One Naran Restaurant','Pakistani','PKR 1,200–3,500',4.1),
(25,'Toli Pir View Restaurant','Pakistani','PKR 800–2,500',4.1),(25,'Banjosa Lake Restaurant','Pakistani','PKR 1,000–3,000',4.2),(25,'Rawalakot Food Point','Pakistani','PKR 500–2,000',4.0),
(26,'Shahnawaz Restaurant','BBQ, Pakistani','PKR 2,000–4,500',4.1),(26,'Pizza Crust Sheikhupura','Fast Food','PKR 800–2,500',4.0),(26,'Pind Restaurant','Pakistani','PKR 2,000–3,000',4.0),
(27,'Kumrat River View Restaurant','Pakistani','PKR 800–2,500',4.1),(27,'Jahaz Banda Camp Kitchen','Local, Pakistani','PKR 500–1,500',4.0),(27,'Kumrat Tourist Cafe','Pakistani','PKR 600–2,000',4.0);
CREATE TABLE reviews (
  review_id      INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT NOT NULL,
  destination_id INT NOT NULL,
  stars          INT CHECK (stars BETWEEN 1 AND 5),
  review_text    TEXT,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (destination_id) REFERENCES destination(destination_id)
);
CREATE TABLE favourites (
  favourite_id   INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT NOT NULL,
  destination_id INT NOT NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_fav (user_id, destination_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (destination_id) REFERENCES destination(destination_id)
);
CREATE TABLE destination_mood (
  destination_id INT NOT NULL,
  mood_id        INT NOT NULL,
  PRIMARY KEY (destination_id, mood_id),
  FOREIGN KEY (destination_id) REFERENCES destination(destination_id),
  FOREIGN KEY (mood_id) REFERENCES mood(mood_id)
);
INSERT INTO destination_mood (destination_id, mood_id) VALUES
(1,1),(1,2),(1,3),(1,4),
(2,5),(2,2),(2,4), 
(3,3),(3,2),(3,4),
(4,5),(4,4),(4,6),
(5,5),(5,6),(5,2), 
(6,5),(6,6),   
(7,1),(7,6),(7,2), 
(8,6),(8,5), 
(9,5),(9,6),(9,4),  
(10,1),(10,2),(10,3),
(11,2),(11,5),(11,3), 
(12,1),(12,2),(12,3),
(13,5),(13,6),(13,2),
(14,5),(14,6),  
(15,1),(15,2),(15,5),
(16,6),(16,5),(16,4), 
(17,2),(17,5),(17,6),
(18,5),(18,7),(18,2), 
(19,5),(19,6),(19,4),
(20,5),(20,6), 
(21,5),(21,4),(21,2), 
(22,1),(22,2),  
(23,1),(23,2),(23,6),(24,5),(24,6),(24,4),
(25,5),(25,7),(25,4), 
(26,1),(26,2),(26,4),
(27,5),(27,6);   
 CREATE TABLE food_items (
  food_id     INT AUTO_INCREMENT PRIMARY KEY,
  food_cat_id INT NOT NULL,
  name        VARCHAR(150) NOT NULL,
  description TEXT,
  image       VARCHAR(255),
  FOREIGN KEY (food_cat_id) REFERENCES food_categories(food_cat_id)
);
INSERT INTO food_items (food_cat_id, name, description,image) VALUES
(1, 'Aloo Palak','Soft potatoes cooked with fresh spinach in a spiced onion and tomato gravy. Simple, healthy, and full of flavor.' 'assets/images/food/0alooPalak.jpg'),(1, 'Matar Pulao','Fragrant basmati rice cooked with whole spices like cinnamon, cloves, bay leaves and sweet green peas.',  'assets/images/food/0matarPulao.jpg'),(1, 'Daal Chawal','The ultimate Pakistani comfort food. A spiced split lentil curry served over steaming hot basmati rice.',   'assets/images/food/0daalChawal.jpg'),(1, 'Sarson Ka Saag','A deeply flavorful winter specialty made from mustard greens and spinach, often served with butter alongside Makki di Roti.',   'assets/images/food/0saag.jpg'),
(2, 'Karahi Gosht','Mutton or beef cooked in a wok with tomatoes, ginger, and green chilies. A Pakistani restaurant classic.',   'assets/images/food/0karahiGosht.jpg'),(2, 'Nihari','Slow-cooked beef shank in a rich, spiced stew. Traditionally eaten at breakfast but loved at any time.',  'assets/images/food/0nihari.jpg'),(2, 'Seekh Kebab','Minced meat mixed with spices and grilled on skewers over charcoal. Juicy and smoky with every bite.',  'assets/images/food/0seekhKabab.jpg'),(2, 'Paya','Beef or goat trotters cooked for hours in a thick, hearty broth. A beloved winter dish full of collagen.',  'assets/images/food/0paye.jpg'),
(3, 'Biryani','Fragrant basmati rice layered with spiced meat, caramelized onions, and saffron. Pakistan most celebrated rice dish.',  'assets/images/food/0biryani.jpg'),(3, 'Pulao','Whole spices and meat broth give this rice a deep, subtle flavor. Lighter than biryani but just as satisfying.',  'assets/images/food/0pulao.jpg'),(3, 'Matar Pulao','Fluffy rice cooked with green peas and whole spices. A simple, everyday comfort food loved across Pakistan.',  'assets/images/food/0matarPulao.jpg'),(3, 'Zarda','A vibrantly colored yellow or orange sweet rice dish, garnished with green cardamom, pistachios and almonds.',  'assets/images/food/0zarda.jpg'),
(4, 'Gol Gappay','Crispy hollow puris filled with spicy tamarind water and mashed chickpeas. The ultimate Pakistani street snack.',  'assets/images/food/0golGappay.jpg'),(4, 'Samosa','Crispy triangular pastry stuffed with spiced potatoes or minced meat. Always best fresh and hot from the fryer.',  'assets/images/food/0samosa.jpg'),(4, 'Chaat','A tangy, sweet, and spicy mix of chickpeas, potatoes, yogurt, and chutneys. One bite and you are hooked.',  'assets/images/food/0chaat.jpg'),(4, 'Dahi Bhalla','Cloud-soft lentil dumpling bathed in chilled yogurt and awakened by a vibrant dance of sweet, tangy, and fiery chutneys.',  'assets/images/food/0dahiBhallay.jpg'),
(5, 'Lassi','Thick yogurt blended with water and either sugar or salt. Lahori lassi is famously creamy and served in big glasses.',  'assets/images/food/0lassi.jpg'),(5, 'Rooh Afza Sharbat','A sweet rose and herb syrup mixed with cold water or milk. A staple of Ramadan iftari tables across Pakistan.', 'assets/images/food/0roohAfza.jpg'),(5, 'Sugarcane Juice','Freshly crushed sugarcane juice served with a pinch of salt and lemon. Refreshing and naturally sweet on hot days.',  'assets/images/food/0sugarcainJuice.jpg'),(5, 'Chai','Strong black tea boiled with milk, sugar, and cardamom. Drunk morning, evening, and every chai break in between.',  'assets/images/food/0chai.jpg'),
(6, 'Gulab Jamun','Soft milk-solid dumplings soaked in rose-flavored sugar syrup. Served warm and melt-in-your-mouth soft.',  'assets/images/food/0gulabJamun.jpg'),(6, 'Kheer','Rice pudding slowly simmered in milk with sugar and cardamom, topped with pistachios. A traditional celebration dessert.',  'assets/images/food/0kheer.jpg'),(6, 'Jalebi','Crispy spirals of batter fried and dipped in warm sugar syrup. Bright orange, sticky, and absolutely irresistible.',  'assets/images/food/0jalebi.jpg'),(6, 'Barfi','Dense milk-based sweet cut into diamond shapes, often flavored with pistachio or rose. A popular mithai shop staple.','assets/images/food/0barfi.jpg'),
(7, 'Halwa Puri','Deep-fried puffy bread served with sweet semolina halwa and spiced chickpeas. The undisputed king of Pakistani breakfasts.',  'assets/images/food/0hlawaPuri.jpg'),(7, 'Nihari','Slow-cooked beef shank in a rich, spiced stew. Traditionally eaten at breakfast but loved at any time.',  'assets/images/food/0nihari.jpg'),(7, 'Naan Chanay','Beloved traditional Pakistani breakfast. Features soft naan paired with a rich, spiced chickpea curry.',  'assets/images/food/0naanChanay.jpg'),(7, 'Siri Paye','A traditional dish of slow-cooked goat or cow trotters and heads in a thick, flavorful gravy.',  'assets/images/food/0paye.jpg');
SHOW TABLES;
 
