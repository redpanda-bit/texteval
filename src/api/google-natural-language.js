// Imports the Google Cloud client library
const language = require("@google-cloud/language");
const usdaGetFood = require("./usda.js").default;

/**
 *
 * @param {String} text content to be sent to google cloud for identification of food items
 * @returns Object<{entities: Array<Entity>, classification: Classification}>
 *
 * @example
 *
 *      queryLangApi("The weather is nice to go out for some ramen today")
 */

const client = new language.LanguageServiceClient();

const getEntities = async (document) => {
  const [result] = await client.analyzeEntities({ document });
  return result;
};

const getClassification = async () => {
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
  return classification;
};

const queryLangApi = async function (text) {
  // Prepares a document, representing the provided text
  const document = {
    content: text,
    type: "PLAIN_TEXT",
  };
  const entities = await getEntities(document);

  const classification = await getClassification(document);

  const nutritionFactsProm = [];
  console.log("Categories:");
  classification.categories.forEach((category, i) => {
    console.log(`Name: ${category.name}, Confidence: ${category.confidence}`);
    // if a food item was mentioned query usda for nutrition facts of said food item
    if (category.name.toLowerCase().includes("food") && entities[i]) {
      nutritionFacts.push(usdaGetFood(entities[i].name));
    }
  });

  const nutritionFacts = await Promise.all(nutritionFactsProm);
  return { nutritionFacts, entities, classification };
};

module.exports = { default: queryLangApi };

// assert.deepEquals(queryLangApi("I want pizza"), iWantPizzaQueryRes);
