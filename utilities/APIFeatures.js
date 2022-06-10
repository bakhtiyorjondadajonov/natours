class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //FILTERING
    const queryObject = { ...this.queryString };
    const excludedFields = ['page', 'limit', 'fields', 'sort'];
    excludedFields.forEach((el) => delete queryObject[el]);
    //ADVANCED FILTERING
    //getting data that's duration is greater than 5
    // we use MongoDB aggreations $gte,$lte,$lt,$gt
    // but req.query gives us gte or lte without $ symbol so we need to add this symbol at the beginning of them,let's do it.
    let queryStr = JSON.stringify(queryObject);
    queryStr = JSON.parse(
      queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (matched) => `$${matched}`)
    );
    this.query = this.query.find(queryStr);
    return this;
  }

  sorting() {
    //ADVANCED FILTERING SORTING
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }
    return this;
  }

  fieldsLimitation() {
    //ADVANCED FILTERING FIELDS
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    return this;
  }

  paginate() {
    // ADVANCED FILTERING PAGINATION AND LIMITATION
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 10;
    const skip = (page - 1) * limit;
    this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
