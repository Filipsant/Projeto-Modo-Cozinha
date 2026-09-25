/** Os corredores do mercado, na ordem em que costumam aparecer numa loja. */
export const AISLES = [
  'produce',
  'butcher',
  'seafood',
  'dairy',
  'bakery',
  'grains',
  'canned',
  'spices',
  'pantry',
  'drinks',
  'other',
] as const

export type Aisle = (typeof AISLES)[number]

// A ordem das regras decide os empates: "chicken stock" é enlatado antes de ser
// frango, "black pepper" é tempero antes de ser pimentão, "egg noodles" é massa
// antes de ser ovo, "peanut butter" é despensa antes de ser manteiga.
const RULES: [Aisle, RegExp][] = [
  [
    'canned',
    /\b(stock|broth|bouillon|tinned|canned|chopped tomato|tomato puree|tomato paste|tomato sauce|passata|ketchup|soy sauce|fish sauce|oyster sauce|worcestershire|hoisin|sriracha|hot ?sauce|bbq sauce|vinegar|mustard(?! seed)|mayonnaise|coconut milk|coconut cream|kidney beans|black beans|butter beans|cannellini|baked beans|chickpeas|sweetcorn|curry paste|tamarind paste|pesto|peanut butter|jam|olives|capers|tahini|condensed milk|evaporated milk|salsa)/,
  ],
  [
    'butcher',
    /\b(beef|pork|lamb|mutton|goat|veal|chicken|turkey|duck|bacon|ham|sausages?|chorizo|mince|steak|ribs|brisket|pancetta|prosciutto|salami|pepperoni|meatballs|liver|oxtail|gammon|venison|rabbit)\b/,
  ],
  [
    'seafood',
    /\b(salmon|cod|tuna|prawns?|shrimps?|fish|squid|mussels|clams|crab|lobster|haddock|mackerel|sardines|anchov\w*|scallops|octopus|monkfish|tilapia|sea bass|trout|kippers?|herring|smoked haddock)\b/,
  ],
  [
    'pantry',
    /\b(oil|sugar|honey|syrup|treacle|molasses|baking powder|bicarbonate|baking soda|yeast|cornstarch|cornflour|corn flour|vanilla|cocoa|chocolate|gelatine|almonds?|walnuts?|peanuts?|cashews?|pistachios?|hazelnuts?|pecans?|pine nuts|raisins|sultanas|desiccated coconut|dried fruit|sesame seeds?|custard powder|food colouring|marzipan|lard|shortening|suet|goose fat|biscuits|marshmallows)\b/,
  ],
  [
    'spices',
    // "Pepper" sozinho, nas receitas da API, é pimenta-do-reino
    /^pepper$|\b(salt|black pepper|white pepper|peppercorns?|cumin|paprika|cinnamon|turmeric|chill?i powder|chill?i flakes|garam masala|curry powder|oregano|bay leaf|bay leaves|cardamom|nutmeg|cloves|allspice|saffron|star anise|fennel seeds?|mustard seeds?|coriander seeds?|cayenne|sumac|za'atar|harissa|five spice|seasoning|fenugreek|mixed spice|mixed herbs|italian herbs|asafoetida|marjoram|caraway|poppy seeds|ground \w+|dried \w+|powder)\b/,
  ],
  [
    'bakery',
    /\b(bread|baguette|pitta?|naan|tortillas?|buns?|rolls?|breadcrumbs|crackers|brioche|ciabatta|croissants?|bagels?|muffins?|english muffins|wraps?|flatbread)\b/,
  ],
  [
    'grains',
    /\b(rice|pasta|spaghetti|penne|noodles|lasagne|macaroni|fusilli|tagliatelle|linguine|farfalle|rigatoni|couscous|quinoa|bulgur|oats|lentils|flour|polenta|semolina|barley|cornmeal|vermicelli|orzo|ditalini|gnocchi|split peas|fettuccine|buckwheat|tapioca)\b/,
  ],
  [
    'dairy',
    /\b(milk|butter|cream|cheese|cheddar|parmesan|mozzarella|feta|ricotta|mascarpone|yogh?urt|creme fraiche|crème fraîche|eggs?|egg yolks?|egg whites?|ghee|paneer|halloumi|gruy[eè]re|pastry|filo|custard|brie|stilton|gouda|pecorino|quark|parmigiano|reggiano|grana padano|emmental|manchego|burrata|gorgonzola|camembert)\b/,
  ],
  [
    'drinks',
    /\b(wine|beer|sherry|brandy|rum|vodka|whiske?y|cider|sake|mirin|port|coffee|tea|stout|ale|gin|tequila|liqueur|madeira|marsala|cola)\b/,
  ],
  [
    'produce',
    /\b(onions?|garlic|tomato(es)?|potato(es)?|carrots?|celery|peppers?|chill?ies|chill?i|lettuce|spinach|cabbage|kale|broccoli|cauliflower|courgettes?|zucchini|aubergines?|eggplants?|egg plants|mushrooms?|leeks?|shallots?|scallions?|spring onions?|cucumber|avocados?|lemons?|limes?|oranges?|apples?|bananas?|berries|strawberr\w+|raspberr\w+|blueberr\w+|blackberr\w+|mango|pineapple|pears?|peach(es)?|grapes|ginger|parsley|coriander|cilantro|basil|mint|thyme|rosemary|dill|sage|chives|tarragon|herbs|beetroot|pumpkin|squash|sweet potato(es)?|corn|peas|green beans|beans?|asparagus|radish(es)?|fennel|okra|plantain|yam|cassava|lemongrass|bean sprouts|watercress|rocket|salad|fruit|coconut|dates|figs|cherries|rhubarb|kiwi|pomegranate|melon|apricots?|plums?|jalapeno|red onions?|swede|turnips?|parsnips?|artichokes?|bok choy|pak choi|spring greens|sprouts|tofu|scotch bonnet|challots|galangal|horseradish|celeriac)\b/,
  ],
]

/** O corredor do mercado onde se acha o ingrediente, pelo nome em inglês da API. */
export function aisleOf(ingredientName: string): Aisle {
  const name = ingredientName.trim().toLowerCase()

  return RULES.find(([, pattern]) => pattern.test(name))?.[0] ?? 'other'
}

/** Água da torneira não vai para a lista de compras. */
export function isShoppable(ingredientName: string): boolean {
  return !/^(?:(?:cold|hot|boiling|warm|iced) )?water$|^ice(?: cubes)?$/i.test(
    ingredientName.trim(),
  )
}
