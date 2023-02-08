const usdaGetFood = (foodName) => {
  fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodName}&pageSize=2&api_key=D4ym8MjLbF3Mki1ahIt6Boqd3mZcojbVaG6gwpYK`,
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
       }`)
      })
      )  
    })
}

module.exports = { default: usdaGetFood };
