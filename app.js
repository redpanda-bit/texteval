// Imports the Google Cloud client library
const language = require("@google-cloud/language");
/**
 * 
 * @param {String} text content to be sent to google cloud for identification of food items
 * @returns Object<{entities: Array<Entity>, classification: Classification}>
 * 
 * @example
 * 
 *      queryLangApi("The weather is nice to go out for some ramen today")
 */
const queryLangApi = async function (text) {
 // Creates a client
 const client = new language.LanguageServiceClient();

 // Prepares a document, representing the provided text
 const document = {
  content: text,
  type: "PLAIN_TEXT",
 };

 // Detects entities in the document
 const [result] = await client.analyzeEntities({ document });

 const entities = result.entities;

 console.log("Natural language result: ", result);
 console.log("Entities:");
 entities.forEach((entity) => {

  console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);
  if (entity.metadata && entity.metadata.wikipedia_url) {
   console.log(` - Wikipedia URL: ${entity.metadata.wikipedia_url}`);
  }
 });
 // Prepares a document, representing the provided text

 const classificationModelOptions = {
  v2Model: {
   contentCategoriesVersion: "V2",
  },
 };

 // Classifies text in the document
 const [classification] = await client.classifyText({
  document,
  classificationModelOptions,
 });

 console.log("Categories:");
 classification.categories.forEach((category, i) => {
  console.log(`Name: ${category.name}, Confidence: ${category.confidence}`);
  // if a food item was mentioned query usda for nutrition facts of said food item
  if (category.name.toLowerCase().includes("food") && entities[i]) {
   fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?query=${entities[i].name}&pageSize=2&api_key=D4ym8MjLbF3Mki1ahIt6Boqd3mZcojbVaG6gwpYK`,
   )
    .then((r) => r.json())
    .then((r) => {

     console.log(
      // log only the first four nutrients from usda; calories, fat, protein, and carbohydrate
      r.foods[0].foodNutrients.slice(0, 4).forEach((n) => {
       console.log(`    
       ${n.nutrientName.toUpperCase()}
            ${n.value}${n.unitName} - ${
        n.derivationDescription || "per serving size"
       }
       `);
      }),
     );
    });
  }
 });

 return { entities, classification };
};

module.exports = { default: queryLangApi };

// assert.deepEquals(queryLangApi("I want pizza"), iWantPizzaQueryRes);
