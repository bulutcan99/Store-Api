const Product = require('../models/product');

const getALLStatic = async (req,res) => { // This function is for static searching.
    const products = await Product.find({price:{ $gt: 30 }}).sort('price').select('name price'); // This makes easier to find the products feature we want.
    res.status(200).json({products, nbHits: products.length});  //nbHits is the number of products found
}                                                               //select('-name price') means that we want to exclude the name and price from the result with reversing order.

const getALL = async (req, res) => { // This function is dynamic searching.
    const { featured, company, name, sort, fields, numericFilters } = req.query; // The req.query object contains the query parameters sent during the HTTP request.
    const queryObject = {}; //It filters the queryObject object using a series of conditional statements on the query parameters, which are key-value pairs defined at the end of the URL with a ? character.
  
    if (featured) {
      queryObject.featured = featured === 'true' ? true : false;
    }
    if (company) {
      queryObject.company = company;
    }
    if (name) {
      queryObject.name = { $regex: name, $options: 'i' }; //Regex means regular expression. It is a pattern that is used to match character combinations in strings. 
    }                                 // Options: 'i' means that the search is case insensitive.
    if (numericFilters) { //If numericFilters is defined, it converts the parameter to an object that can be used to filter products by numeric values.
      const operatorMap = {
        '>': '$gt',
        '>=': '$gte',
        '=': '$eq',
        '<': '$lt',
        '<=': '$lte',
      };
      const regEx = /\b(<|>|>=|=|<|<=)\b/g;  // This regular expression is a pattern for capturing certain numeric filters in text (for example, "price>100").
      let filters = numericFilters.replace(
        regEx,
        (match) => `-${operatorMap[match]}-`
      );
      const options = ['price', 'rating'];
      filters = filters.split(',').forEach((item) => {
        const [field, operator, value] = item.split('-');
        if (options.includes(field)) {
          queryObject[field] = { [operator]: Number(value) };
        }
      });
    }
  
    let result = Product.find(queryObject);
    // sort
    if (sort) {
      const sortList = sort.split(',').join(' ');
      result = result.sort(sortList);
    } else {
      result = result.sort('createdAt');
    }
  
    if (fields) {
      const fieldsList = fields.split(',').join(' ');
      result = result.select(fieldsList);
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
  
    result = result.skip(skip).limit(limit);
    // 23
    // 4 7 7 7 2
  
    const products = await result;
    res.status(200).json({ products, nbHits: products.length });
  };

module.exports = {
    getALLStatic, getALL
};