/**
 * Generates data for the database
 */
const fs = require('fs');
const path = require('path');
const User = require("../models/userModel");
const Event = require("../models/eventModel");
const EventFeedback = require("../models/eventFeedbackModel");
const DateFeedback = require("../models/dateFeedbackModel");
const Date = require("../models/dateModel");
const City = require("../models/cityModel");
const Category = require("../models/categoryModel");
const Activity = require("../models/activityModel");
const CatAct = require("../data/matchingBase.json");
const { Router } = require("express");
const router = Router();

async function clearDatabase() {
  await clearCollection(User);
  await clearCollection(Event);
  await clearCollection(EventFeedback);
  await clearCollection(DateFeedback);
  await clearCollection(Date);
  await clearCollection(City);
  await clearCollection(Category);
  await clearCollection(Activity);
}

function clearCollection(Model) {
  return Model.deleteMany({})
    .then((result) => {
      console.log("cleared ");
    })
    .catch((err) => {
      console.log(err);
    });
}

function generateDatabase(events_num, users_num) {
  return clearDatabase()
    .then(async () => {
      console.log("Generating Categories and Activities");
      await generateCatAct();
      console.log("Generating City");
      await generateCities();
      console.log("Generating participants");
      await generateNRandomUsers(users_num, false); // Participants
      console.log("Generating Organizers");
      await generateNRandomUsers(2, true); // Organizers
      console.log("Generating Dummies");
      await User.create(await generateDummyParticipant());
      await User.create(await generateDummyOrganizer());

      console.log("Generating Events");
      await generateNRandomEvents(events_num);

      const events = await Event.find({});
      for (const event of events) {
        const r = Math.round(Math.random())
        const men = await User.aggregate([
          { $match: { gender: "male", isOrganizer: false } },
          { $sample: { size: 9+r } },
        ]);
        const r2 = Math.round(Math.random())
        const women = await User.aggregate([
          { $match: { gender: "female", isOrganizer: false } },
          { $sample: { size: 9+r2 } },
        ]);
        // Assuming event's participants field is an array of user IDs
        for (const woman of women) {
          await addUserToEvent(woman._id, event._id);
          (await event).currentParticipants++;
        }
        for (const man of men) {
          (await event).participants.push(man);
          (await man).events.push(event);
          (await event).currentParticipants++;
        }
        await (await event).save();
        //console.log("Event updated successfully with participants.");
      }
      console.log("Match making...")
        await generateMatches()
      console.log("Done.")
    })
    .catch((err) => console.log(err))
    .then(async () => {
    });
}

async function generateDemo() {
  try {
    const de = Event();

    const organizer = await generateDemoOrganizer()
    await organizer.save();
    console.log("DemoOrganizer", organizer)
    const participant =  await generateDemoParticipant();
    await participant.save();
    de.startDate = getRandomDateInRange(0,0);
    de.imagePath = getRandomVenuePicture();
    de.organizer = organizer;
    de.hasEnded = false;
    de.floorPlan = "";
    de.round = 1;
    de.location = "Uppsala domkyrka";
    de.city = await getRandomCity();
    de.description = "This is an event created for the demonstration of this website.";
    de.totalParticipants = 20;
    de.currentParticipants = 0;
    const event = await Event.create(de);
    //organizer.events.push(event);
    await User.updateOne(
        {_id:organizer._id},
        {$push: {events:event}}
        );
    // await User.updateOne(
    //     {_id:participant._id},
    //     {$push: {events:event}}
    // );
    const men = await User.aggregate([
      {$match: {gender: "male", isOrganizer: false}},
      {$sample: {size: 9}},
    ]);

    const women = await User.aggregate([
      {$match: {gender: "female", isOrganizer: false}},
      {$sample: {size: 10}},
    ]);

    men.forEach(man => {
      event.participants.push(man._id); // Again, assuming pushing IDs
      man.events.push(event._id);
      event.currentParticipants++;
    });

    women.forEach(woman => {
      event.participants.push(woman._id);
      woman.events.push(event._id); // Assuming you want to push event ID
      event.currentParticipants++;
    });

    await event.save(); // Now we're directly calling save() on the document
    console.log("Demo event generation complete");
  } catch (error) {
    console.error("Error generating demo event:", error);
  }
}

/********************************************************************/
async function addUserToEvent(userId, eventId) {
  try {
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);
    if (!user || !event) {
      throw new Error('User or Event not found');
    }
    if (!user.events.includes(eventId)) {
      user.events.push(eventId);
      await user.save();
    }
    if (!event.participants.includes(userId)) {
      event.participants.push(userId);
      await event.save();
    }
    console.log('User added to event successfully');
  } catch (error) {
    console.error('Error adding user to event:', error);
  }
}
async function generateDemoOrganizer() {
  const newDummy = await generateRandomUser(false);
  newDummy.isOrganizer = true;
  newDummy.email = "organizer@demo.com";
  newDummy.password = "1234";
  newDummy.firstname = "Cay"
  newDummy.lastname = "Horstman"
  newDummy.gender = "male"
  return newDummy;
}
async function generateDemoParticipant() {
  const newDummy = await generateRandomUser(false);
  newDummy.email = "participant@demo.com";
  newDummy.firstname = "Michael"
  newDummy.lastname = "Dubois"
  newDummy.password = "1234";
  newDummy.gender = "male"
  return newDummy;
}
async function generateDummyParticipant() {
  const newDummy = await generateRandomUser(false);
  newDummy.email = "p@p.p";
  newDummy.password = "1234";
  return newDummy;
}
async function generateDummyOrganizer() {
  const newDummy = await generateRandomUser(true);
  newDummy.email = "o@o.o";
  newDummy.password = "1234";
  return newDummy;
}

async function generateRandomUser(isOrganizer) {
  const newUser = User();
  newUser.gender = getRandomGender();
  newUser.isOrganizer = isOrganizer;
  newUser.imagePath = getRandomProfilePicture(newUser.gender)
    // newUser.gender === "male"
    //   ? "MaleProfilePlaceholder.png"
    //   : "FemaleProfilePlaceholder.png";
  newUser.password = 1234;
  const random_city_name = cities.at(Math.random() * cities.length);
  const aCity = await City.findOne({ name: random_city_name });
  //console.log("City", aCity._id);
  newUser.city = aCity._id;
  newUser.firstname = getRandomFirstName(newUser.gender);
  newUser.lastname = getRandomLastName();
  newUser.age = getRandomAge();
  newUser.email =
    newUser.firstname +
    newUser.age +
    "@" +
    newUser.firstname +
    newUser.lastname +
    ".com";
  newUser.description = getRandomDescription();
  await Activity.find({}).then((activities) => {
    for (const activity of activities) {
      newUser.activityData.push({
        activity: activity._id,
        points: Math.floor(Math.random() * 6),
      });
    }
  });
  return newUser;
}

async function generateRandomEvent() {
  const newEvent = Event();
  const randomDate = getRandomDateInRange(14, 14);
  const currentDate = new global.Date()
  newEvent.startDate = randomDate;
  newEvent.imagePath = getRandomVenuePicture();
  newEvent.location = getRandomVenue();
  const city = await getRandomCity();
  //console.log("CITY", city)
  newEvent.city = city._id;
  newEvent.address = getRandomAddress();
  newEvent.hasEnded = randomDate < currentDate;
  newEvent.description = getRandomVenueDescription();
  const organizer = await User.findOne({email:"o@o.o"});
  // console.log("Organ",organizer)
  newEvent.organizer = organizer._id;
  return newEvent;
}

async function generateNRandomEvents(N) {
  const promises = [];

  for (let i = 0; i < N; i++) {
    const promise = (async () => {
      try {
        const newEvent = await generateRandomEvent();
        const ev = await Event.create(newEvent);
        const city = await City.findById(ev.city._id).populate("events");
        city.events.push(ev);
        await city.save();
      } catch (error) {
        console.error('Error generating or saving an event:', error);
        throw error;
      }
    })();
    promises.push(promise);
  }

  return Promise.all(promises);
}


/********************************************************************/
function generateCities() {
  const promises = [];
  cities.forEach((city) => {
    promises.push(City.create({ name: city }));
  });
  return Promise.all(promises);
}
async function generateCatAct() {
  for (const cat of CatAct) {
    const newCat = new Category();
    newCat.name = cat["name"];
    try {
      const createdCategory = await Category.create(newCat);
      //console.log(cat["name"]);
      for (const actName of cat["activities"]) {
        const newAct = new Activity();
        newAct.name = actName;
        newAct.category = createdCategory;
        const createdActivity = await Activity.create(newAct);
        //console.log(createdActivity.name);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
}

async function generateNRandomUsers(N, isOrganizer) {
  const promises = [];
  for (let i = 0; i < N; i++) {
    const newUserPromise = generateRandomUser(isOrganizer).then((newUser) => {
      return User.create(newUser);
    });
    promises.push(newUserPromise);
  }
  return Promise.all(promises);
}

//
function getRandomFromList(list) {
  return list[Math.floor(Math.random() * list.length)];
}
function getRandomFirstName(gender) {
  let names = gender === "male" ? maleNames : femaleNames;
  return getRandomFromList(names);
}
function getRandomLastName() {
  return getRandomFromList(lastNames);
}
function getRandomAge() {
  return Math.floor(Math.random() * 70) + 18;
}
function getRandomGender() {
  let genders = ["male", "female"];
  return getRandomFromList(genders);
}
function getRandomDescription() {
  let lines = Math.floor(Math.random() * 4) + 2;
  let description = "";
  for (let i = 0; i < lines; i++) {
    description += getRandomFromList(descriptions) + " \n";
  }
  return description;
}
function getRandomVenueDescription() {
  let lines = Math.floor(Math.random() * 4) + 2;
  let description = "";
  for (let i = 0; i < lines; i++) {
    description += getRandomFromList(venueDescriptions) + " \n";
  }
  return description;
}
function getRandomVenue() {
  return getRandomFromList(venues);
}
function getRandomAddress() {
  return getRandomFromList(streetAddresses);
}
function getRandomCity() {
  const city = getRandomFromList(cities);
  return  City.findOne({ name: city });
}

// function getRandomDate() {
//   return new global.Date(
//     new global.Date().getTime() +
//       Math.random() +
//       Math.floor(Math.random() * 70) +
//       18
//   );
// }
const savingDocuments = new Map();

async function generateMatches() {
  const users = await User.find({isOrganizer: false});
  for (const user of users) {
    const matches = [];
    for (let j = 0; j < Math.floor(Math.random() * 10); j++) {
      const match = getRandomFromList(users);
      if (match._id.toString() === user._id.toString() ||user.sharedContacts.includes(match)) continue; // Skip if it's the same user
      matches.push(match);
    }
    const matchPromises = matches.map(match => matchUsers(user, match));
    await Promise.all(matchPromises);
    await saveDocument(user);
  }
}

async function matchUsers(a, b) {
  a.sharedContacts.push(b);
  b.sharedContacts.push(a);
  await saveDocument(b);
}

async function saveDocument(doc) {
  const docId = doc._id.toString();
  if (savingDocuments.has(docId)) {
    await savingDocuments.get(docId); // Wait for the previous save to finish
  }
  const savePromise = doc.save();
  savingDocuments.set(docId, savePromise);
  try {
    await savePromise; // Wait for the current save to finish
  } finally {
    savingDocuments.delete(docId); // Remove from the map once the save is complete
  }
}
function getRandomVenuePicture(gender){
  let files = null;
  const directoryPath = path.join(__dirname, '../public/venues');
  try {
    // Read directory synchronously
    files = fs.readdirSync(directoryPath);

    return "venues/" + getRandomFromList(files);
  } catch (err) {
    console.log('Unable to scan directory: ' + err);
  }
}
function getRandomProfilePicture(gender){
  const prefix = gender === "male" ? "XMale" : "XFemale"
  let files = null;
  const directoryPath = path.join(__dirname, '../public');
  try {
    // Read directory synchronously
    files = fs.readdirSync(directoryPath);

    const genderBased = files.filter(filename => filename.startsWith(prefix))
    return getRandomFromList(genderBased);
  } catch (err) {
    console.log('Unable to scan directory: ' + err);
  }
}
function getRandomDateInRange(daysInThePast, daysInTheFuture) {
  const currentDate = new global.Date();
  const oneYearAgo = new global.Date(currentDate.setDate(currentDate.getDate() - daysInThePast));
  const threeDaysInFuture = new global.Date(new global.Date().setDate(new global.Date().getDate() + daysInTheFuture));

  const startTimestamp = oneYearAgo.getTime();
  const endTimestamp = threeDaysInFuture.getTime();
  const randomTimestamp = startTimestamp + Math.random() * (endTimestamp - startTimestamp);

  // Create a new Date object from randomTimestamp before calling setHours
  const randomDate = new global.Date(randomTimestamp);
  const randomHour = Math.floor(Math.random() * (21 - 16 + 1)) + 16;
  randomDate.setHours(randomHour, 0, 0, 0);

  // Make sure to return the new global.Date object, not the model Date
  return randomDate;
}

const femaleNames = [
  "Emma",
  "Olivia",
  "Ava",
  "Isabella",
  "Sophia",
  "Mia",
  "Charlotte",
  "Amelia",
  "Harper",
  "Evelyn",
  "Abigail",
  "Emily",
  "Elizabeth",
  "Mila",
  "Ella",
  "Avery",
  "Sofia",
  "Camila",
  "Aria",
  "Scarlett",
  "Victoria",
  "Madison",
  "Luna",
  "Grace",
  "Chloe",
  "Penelope",
  "Layla",
  "Riley",
  "Zoey",
  "Nora",
  "Lily",
  "Eleanor",
  "Hannah",
  "Lillian",
  "Addison",
  "Aubrey",
  "Ellie",
  "Stella",
  "Natalie",
  "Zoe",
  "Leah",
  "Hazel",
  "Violet",
  "Aurora",
  "Savannah",
  "Audrey",
  "Brooklyn",
  "Bella",
  "Claire",
  "Skylar",
  "Lucy",
  "Paisley",
  "Everly",
  "Anna",
  "Caroline",
  "Nova",
  "Genesis",
  "Emilia",
  "Kennedy",
  "Samantha",
  "Maya",
  "Willow",
  "Kinsley",
  "Naomi",
  "Aaliyah",
  "Elena",
  "Sarah",
  "Ariana",
  "Allison",
  "Gabriella",
  "Alice",
  "Madelyn",
  "Cora",
  "Ruby",
  "Eva",
  "Serenity",
  "Autumn",
  "Adeline",
  "Hailey",
  "Gianna",
  "Valentina",
  "Isla",
  "Eliana",
  "Quinn",
  "Nevaeh",
  "Ivy",
  "Sadie",
  "Piper",
  "Lydia",
  "Alexa",
  "Josephine",
  "Emery",
  "Julia",
  "Delilah",
  "Arianna",
  "Vivian",
  "Kaylee",
  "Sophie",
  "Brielle",
  "Madeline",
];
const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
  "Green",
  "Adams",
  "Nelson",
  "Baker",
  "Hall",
  "Rivera",
  "Campbell",
  "Mitchell",
  "Carter",
  "Roberts",
  "Gomez",
  "Phillips",
  "Evans",
  "Turner",
  "Diaz",
  "Parker",
  "Cruz",
  "Edwards",
  "Collins",
  "Reyes",
  "Stewart",
  "Morris",
  "Morales",
  "Murphy",
  "Cook",
  "Rogers",
  "Gutierrez",
  "Ortiz",
  "Morgan",
  "Cooper",
  "Peterson",
  "Bailey",
  "Reed",
  "Kelly",
  "Howard",
  "Ramos",
  "Kim",
  "Cox",
  "Ward",
  "Richardson",
  "Watson",
  "Brooks",
  "Chavez",
  "Wood",
  "James",
  "Bennet",
  "Gray",
  "Mendoza",
  "Ruiz",
  "Hughes",
  "Price",
  "Alvarez",
  "Castillo",
  "Sanders",
  "Patel",
  "Myers",
  "Long",
  "Ross",
  "Foster",
  "Jimenez",
];
const maleNames = [
  "Liam",
  "Noah",
  "William",
  "James",
  "Oliver",
  "Benjamin",
  "Elijah",
  "Lucas",
  "Mason",
  "Logan",
  "Alexander",
  "Ethan",
  "Jacob",
  "Michael",
  "Daniel",
  "Henry",
  "Jackson",
  "Sebastian",
  "Aiden",
  "Matthew",
  "Samuel",
  "David",
  "Joseph",
  "Carter",
  "Owen",
  "Wyatt",
  "John",
  "Jack",
  "Luke",
  "Jayden",
  "Dylan",
  "Grayson",
  "Levi",
  "Isaac",
  "Gabriel",
  "Julian",
  "Mateo",
  "Anthony",
  "Jaxon",
  "Lincoln",
  "Joshua",
  "Christopher",
  "Andrew",
  "Theodore",
  "Caleb",
  "Ryan",
  "Asher",
  "Nathan",
  "Thomas",
  "Leo",
  "Isaiah",
  "Charles",
  "Josiah",
  "Hudson",
  "Christian",
  "Hunter",
  "Connor",
  "Eli",
  "Ezra",
  "Aaron",
  "Landon",
  "Adrian",
  "Jonathan",
  "Nolan",
  "Jeremiah",
  "Easton",
  "Elias",
  "Colton",
  "Cameron",
  "Carson",
  "Robert",
  "Angel",
  "Maverick",
  "Nicholas",
  "Dominic",
  "Jaxson",
  "Greyson",
  "Adam",
  "Ian",
  "Austin",
  "Santiago",
  "Jordan",
  "Cooper",
  "Brayden",
  "Roman",
  "Evan",
  "Ezekiel",
  "Xavier",
  "Jose",
  "Jace",
  "Jameson",
  "Leonardo",
  "Bryson",
  "Axel",
  "Everett",
  "Parker",
  "Kayden",
  "Miles",
  "Sawyer",
  "Jason",
];
const descriptions = [
  "I have a great sense of humor and love making people laugh.",
  "I'm deeply passionate about music and play several instruments.",
  "I enjoy spending time outdoors, especially hiking in the mountains.",
  "I'm an avid reader and can often be found with a book in hand.",
  "I have a creative soul and express myself through painting and drawing.",
  "I'm a tech enthusiast and love keeping up with the latest gadgets.",
  "I have a knack for cooking and enjoy experimenting with new recipes.",
  "I'm a fitness enthusiast and prioritize staying in shape.",
  "I cherish spending quality time with my family and friends.",
  "I have a strong work ethic and am dedicated to my career.",
  "I'm an animal lover and volunteer at the local animal shelter.",
  "I have a keen interest in history and enjoy visiting museums.",
  "I'm a natural leader and often take charge in group settings.",
  "I have a green thumb and love gardening and caring for plants.",
  "I'm a sports fan and never miss a game of my favorite team.",
  "I enjoy traveling and exploring new cultures and cuisines.",
  "I have a talent for languages and speak several fluently.",
  "I'm a movie buff and enjoy critiquing films with friends.",
  "I have a calm demeanor and am skilled at resolving conflicts.",
  "I cherish moments of solitude and reflection to recharge.",
  "I'm a social butterfly and love meeting new people.",
  "I have an adventurous spirit and am always up for a challenge.",
  "I'm deeply committed to personal growth and lifelong learning.",
  "I have a compassionate heart and strive to help those in need.",
  "I'm a meticulous planner and enjoy organizing events.",
  "I have a strong sense of justice and advocate for equality.",
  "I'm a history buff and can spend hours discussing ancient civilizations.",
  "I have a vibrant imagination and love writing stories.",
  "I'm a coffee aficionado and enjoy exploring local coffee shops.",
  "I have a competitive streak and enjoy playing sports.",
  "I'm environmentally conscious and make efforts to live sustainably.",
  "I have a zest for life and try to find joy in the small things.",
  "I'm a dedicated student and am passionate about my field of study.",
  "I have a soft spot for poetry and enjoy composing my own verses.",
  "I'm a music lover and enjoy attending live concerts.",
  "I have a strong connection to nature and find peace in the wilderness.",
  "I'm an entrepreneur at heart and am working on my own startup.",
  "I have a flair for fashion and enjoy keeping up with trends.",
  "I'm a photography enthusiast and love capturing moments.",
  "I have a philosophical mind and enjoy deep conversations.",
  "I'm a thrill-seeker and love extreme sports and adventures.",
  "I have a meticulous eye for detail and appreciate fine art.",
  "I'm a homebody who enjoys cozy nights in with a good movie.",
  "I have a robust sense of loyalty and value trust above all.",
  "I'm a dreamer with big aspirations and the determination to achieve them.",
  // Continue with more descriptions as needed
];
const venues = [
  "LoveBuzz Café",
  "HeartStrings Bistro",
  "Cupid’s Corner Bar",
  "MatchMaker Rooftop",
  "Flirtini Lounge",
  "Amour Alley",
  "SparkConnection Club",
  "DateNite Garden",
  "Affinity Hall",
  "Romance Retreat",
  "Encounter Emporium",
  "Blissful Bites Eatery",
  "Harmony Hub",
  "Serenade Cellar",
  "PassionPit Gaming Zone",
  "Intimate Intentions Inn",
  "Charisma Cabin",
  "Fascination Station",
  "Enchantment Estate",
  "Flare Affair Venue",
  "Unity Plaza",
  "Temptation Terrace",
  "Mingle Mansion",
  "SwoonMoon Pavilion",
  "Bonding Bench Park",
  "Desire Den",
  "Entice Space",
  "Cherish Chapel",
  "AdoreShore Beach",
  "Allure Arena",
  "CozyCupid Café",
  "DreamDate Dock",
  "VowView Valley",
  "WhisperWillow Woods",
  "Muse Meadow",
  "HugHaven Hotel",
  "WinkWell Waterfront",
  "Pulse Point Plaza",
  "Sizzle Suite",
  "CrushCrest Cliff",
  "GazeGarden Greenhouse",
  "EmbraceSpace Studio",
  "HeartHaven Hall",
  "GlimmerGlen Gallery",
  "SparkleSphere SkyBar",
  "Affection Section",
  "DateDock Diner",
  "BlissBarn Brewery",
  "SweetMeet Street",
  "MatchMeadow Marina",
  "CharmCrest Castle",
  "FlirtField Farm",
  "AmourAcre Arboretum",
  "Romance Ranch",
  "SnuggleStable Saloon",
  "TrystTrove Theatre",
  "Enamor Estate",
  "PairPark Pavilion",
  "KissKove Kiosk",
  "WooWood Workshop",
  "DateDream Dome",
  "Heartfelt Harbor",
  "FlingFountain Forum",
  "SparkSpot Stadium",
  "BlendBreeze Beach Club",
  "UnityUnderground Urbanspace",
  "VibeVilla Vineyard",
  "Encounter Enclave",
  "MingleMeadow Museum",
  "LoveLair Loft",
  "SweetScape Studio",
  "ConnectCove Camp",
  "BlissBridge Boat",
  "FlirtFleet Fleet",
  "Cupid’s Canvas",
  "MatchMoonlight Motel",
  "Serendipity Street",
  "DateDew Deck",
  "AmourArt ArtHouse",
  "CharmChateau Chalet",
  "FondFiesta Fairground",
  "GleamGrove Garden",
  "SparkleShore Shoreline",
  "EmbraceEmbassy Embassy",
  "HeartHarbor Café",
  "Rendezvous Ridge",
  "LoveNest Lounge",
  "FlirtFlame Fireplace",
  "BondBungalow Bungalow",
  "MuseMarina Marina",
  "HeartHike Hideout",
  "SweetSpire Spire",
  "KissKaleidoscope",
  "PairPier Pier",
  "MingleMansion Mansion",
  "FlirtFalls Waterfall",
  "CharmCascade Café",
  "SparkSprings Springs",
  "DateDale Dale",
  "AmourAtrium Atrium",
];
const streetAddresses = [
  "101 Cupid's Arrow Lane",
  "202 Serenade Circle",
  "303 Harmony Heights",
  "404 Bliss Boulevard",
  "505 Whimsy Way",
  "606 Serendipity Street",
  "707 Enchantment Avenue",
  "808 Twilight Terrace",
  "909 Mystic Meadow Drive",
  "1010 Starlight Strand",
  "1111 Amour Alley",
  "1212 Romance Road",
  "1313 Dreamer's Drive",
  "1414 Whispering Willow Way",
  "1515 Celestial Cove",
  "1616 Azure Sky Street",
  "1717 Eternal Embrace End",
  "1818 Wishing Well Way",
  "1919 Moonbeam Mews",
  "2020 Solstice Square",
  "2121 Lavender Lane",
  "2222 Evergreen Esplanade",
  "2323 Halcyon Hill",
  "2424 Golden Gate Grove",
  "2525 Lovers' Leap Lane",
  "2626 Perennial Path",
  "2727 Jubilee Junction",
  "2828 Unity Upland",
  "2929 Blissful Beach Boulevard",
  "3030 Cascade Court",
  "3131 Heartfelt Highway",
  "3232 Tranquil Trail",
  "3333 Radiant Rise",
  "3434 Elysium Estate",
  "3535 Mirage Meadow",
  "3636 Oasis Orchard",
  "3737 Eden End",
  "3838 Aurora Avenue",
  "3939 Charming Chase",
  "4040 Destiny Drive",
  "4141 Serenity Street",
  "4242 Peaceful Passage",
  "4343 Reverie Ridge",
  "4444 Mystic Moon Road",
  "4545 Infinity Isle",
  "4646 Harmony Harbor",
  "4747 Felicity Farm",
  "4848 Joyful Journey",
  "4949 Echoing Elegance Avenue",
  "5050 Twilight Trail",
  "5151 Visionary Vale",
  "5252 Utopia Union",
  "5353 Cosmos Court",
  "5454 Dreamcatcher Drive",
  "5555 Unity Lane",
  "5656 Wishful Way",
  "5757 Celestial Circle",
  "5858 Fable Field",
  "5959 Gleaming Glen",
  "6060 Illuminated Isle",
  "6161 Nostalgia Nook",
  "6262 Memory Meadow",
  "6363 Legacy Lane",
  "6464 Prospect Park",
  "6565 Heritage Harbor",
  "6666 Epoch Esplanade",
  "6767 Timeless Terrace",
  "6868 Chronicle Cove",
  "6969 Legend Lane",
  "7070 Mythic Meadow",
  "7171 Paragon Path",
  "7272 Saga Street",
  "7373 Odyssey Orchard",
  "7474 Epic Estate",
  "7575 Tale Trail",
  "7676 Fable Falls",
  "7777 Lore Lane",
  "7878 Mythos Meadow",
  "7979 Narrative Niche",
  "8080 Allegory Alley",
  "8181 Ballad Boulevard",
  "8282 Chronicle Court",
  "8383 Saga Square",
  "8484 Storybook Strand",
  "8585 Yarn Yard",
  "8686 Tale Terrace",
  "8787 Legend Loop",
  "8888 Epic End",
  "8989 Fable Forge",
  "9090 Mythic March",
  "9191 Parable Place",
  "9292 Allegory Avenue",
  "9393 Lore Lane",
  "9494 Saga Street",
  "9595 Tale Terrace",
  "9696 Narrative Nook",
  "9797 Odyssey Outlook",
  "9898 Epic Esplanade",
  "9999 Legend Landing",
  "100100 Fable Field",
];
const cities = [
  "Cordoba", // Argentina
  "Sydney", // Australia
  "Graz", // Austria
  "Antwerp", // Belgium
  "São Paulo", // Brazil
  "Toronto", // Canada
  "Shanghai", // China
  "Alexandria", // Egypt
  "Marseille", // France
  "Munich", // Germany
  "Thessaloniki", // Greece
  "Budapest", // Hungary
  "Mumbai", // India
  "Surabaya", // Indonesia
  "Cork", // Ireland
  "Osaka", // Japan
  "Almaty", // Kazakhstan
  "Busan", // South Korea
  "Monterrey", // Mexico
  "Casablanca", // Morocco
  "Auckland", // New Zealand
  "Lagos", // Nigeria
  "Karachi", // Pakistan
  "Cusco", // Peru
  "Saint Petersburg", // Russia
  "Cape Town", // South Africa
  "Barcelona", // Spain
  "Gothenburg", // Sweden
  "Istanbul", // Turkey
  "Dubai", // United Arab Emirates
  "Los Angeles", // United States
  "Montevideo", // Uruguay
];
const venueDescriptions = [
  "Nestled in the heart of the city, this chic venue offers an intimate setting for memorable encounters.",
  "Boasting panoramic views, the rooftop bar provides the perfect backdrop for a night of romance and discovery.",
  "Surrounded by lush greenery, our garden oasis is a serene retreat for those seeking a tranquil dating experience.",
  "With its modern decor and vibrant ambiance, our lounge is the city's go-to spot for lively and engaging speed dating events.",
  "Historic charm meets contemporary elegance in this stunningly restored mansion, offering a unique setting for love to bloom.",
  "Experience the magic of the waterfront as our pier-side venue sets the stage for a romantic evening under the stars.",
  "Our cozy café offers a warm and inviting atmosphere, ideal for meaningful conversations and connections.",
  "Step into a world of sophistication at our wine bar, where fine wines and intimate seating create the perfect dating environment.",
  "Our art gallery provides a cultured backdrop for those who wish to spark connections amidst inspiring works of art.",
  "Immerse yourself in the enchanting ambiance of our bookshop, where literary lovers gather to find romance among the stacks.",
  "Our spacious ballroom, with its elegant decor and grandeur, is the ideal venue for a night of dancing and matchmaking.",
  "Tucked away in a quaint alley, our speakeasy offers a mysterious and alluring setting for secret rendezvous and romantic whispers.",
  "Let the rustic charm of our barn venue set the scene for a laid-back, yet romantic speed dating experience.",
  "Our beachfront property offers a relaxed and breezy setting for love to take flight with the sound of waves as your soundtrack.",
  "Dine and date in our fine dining restaurant, where gourmet meals and exquisite settings elevate the speed dating experience.",
  "Discover love in the fast lane at our racing track venue, where adrenaline meets romance for thrill-seeking singles.",
  "Our boutique hotel's lobby, with its luxurious furnishings and sophisticated atmosphere, provides a plush setting for mingling and meeting.",
  "Indulge in the exotic ambiance of our tiki bar, where tropical drinks and vibrant decor make every encounter feel like a vacation.",
  "Set sail on love's journey with our yacht club venue, where nautical charm and open seas create the ultimate dating adventure.",
  "Find romance in the urban jungle at our rooftop garden, where greenery and city lights blend to form a breathtaking dating oasis.",
];

Object.freeze(maleNames);
Object.freeze(femaleNames);
Object.freeze(lastNames);
Object.freeze(descriptions);
Object.freeze(venues);
Object.freeze(streetAddresses);
Object.freeze(cities);
Object.freeze(venueDescriptions);

module.exports.generateRandomUser = generateRandomUser;
module.exports.generateRandomEvent = generateRandomEvent;
module.exports.generateNRandomUsers = generateNRandomUsers;
module.exports.generateNRandomEvents = generateNRandomEvents;
module.exports.getRandomProfilePicture = getRandomProfilePicture;

module.exports.clearCollection = clearCollection;
module.exports.generateDatabase = generateDatabase;
module.exports.generateDemo = generateDemo;
