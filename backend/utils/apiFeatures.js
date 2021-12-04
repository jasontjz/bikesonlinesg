class APIFeatures {
  constructor(query, queryStr) {
    //this.query is product.find() (passed in from productcontroller)
    this.query = query;
    //this.queryStr is req.query (passed in from productcontroller))
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            //case insensitive
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    // console.log(this);
    return this;
  }

  //filter function
  filter() {
    const queryCopy = { ...this.queryStr };
    console.log(queryCopy);
    // Removing fields from the query
    const removeFields = ["keyword", "limit", "page"];
    removeFields.forEach((el) => delete queryCopy[el]);

    this.query = this.query.find(queryCopy);
    return this;
  }

  //pagination function
  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
